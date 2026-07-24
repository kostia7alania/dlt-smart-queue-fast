package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/dto"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/repo"
)

// ErrPersistenceUnavailable is returned by snapshot reads when the API runs
// without a database (live-only mode).
var ErrPersistenceUnavailable = errors.New("persistence unavailable")

// Store is the persistence boundary used by the DLT flow. All writes are
// best-effort side effects of live fetches; reads back snapshot endpoints.
type Store interface {
	Ping(ctx context.Context) error
	UpsertOffices(ctx context.Context, offices []dto.DLTOffice, fetchedAt time.Time) error
	UpsertWorkTypes(ctx context.Context, siteID, groupID int, keyword string, workTypes []dto.DLTWorkType, fetchedAt time.Time) error
	InsertSlotSnapshot(ctx context.Context, workTypeID int, currentDate string, payload []byte, fetchedAt time.Time) error
	RecordFetch(ctx context.Context, rec repo.FetchRecord) error
	LatestOffices(ctx context.Context) ([]dto.DLTOffice, time.Time, error)
	LatestWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error)
	LatestSlotSnapshot(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error)
	SlotSnapshots(ctx context.Context, workTypeID, limit int) ([]repo.SlotSnapshotRecord, error)
	LatestMapAvailabilitySnapshots(ctx context.Context, groupID int, keyword string) ([]repo.MapAvailabilitySnapshot, error)
	RecentFetches(ctx context.Context, limit int) ([]repo.FetchRecord, error)
}

type AIService struct {
	dlt   *DLTClient
	store Store
	// pause overrides the compare politeness delay; zero means the default.
	// Tests set it to a negligible value to stay fast.
	pause time.Duration
}

func NewAIService(dltAPIBaseURL, dltWorkFilterToken string) *AIService {
	return NewAIServiceWithConcurrency(dltAPIBaseURL, dltWorkFilterToken, 4)
}

func NewAIServiceWithConcurrency(dltAPIBaseURL, dltWorkFilterToken string, maxConcurrency int) *AIService {
	return &AIService{
		dlt: NewDLTClientWithConcurrency(dltAPIBaseURL, dltWorkFilterToken, nil, maxConcurrency),
	}
}

// SetStore enables persistence. A nil store keeps the service in live-only mode.
func (s *AIService) SetStore(store Store) {
	s.store = store
}

// Ready verifies that production persistence is configured and reachable.
func (s *AIService) Ready(ctx context.Context) error {
	if s.store == nil {
		return ErrPersistenceUnavailable
	}
	if err := s.store.Ping(ctx); err != nil {
		return fmt.Errorf("%w: %v", ErrPersistenceUnavailable, err)
	}
	return nil
}

func (s *AIService) DLTOffices(ctx context.Context) ([]dto.DLTOffice, error) {
	start := time.Now()
	offices, err := s.dlt.GetOffices(ctx)
	s.recordFetch(ctx, "offices", nil, err, start)
	if err != nil {
		return nil, err
	}
	s.persist(ctx, "offices", func(ctx context.Context) error {
		return s.store.UpsertOffices(ctx, offices, time.Now().UTC())
	})
	return offices, nil
}

func (s *AIService) DLTWorkAvailability(ctx context.Context, siteID int) ([]dto.DLTWorkAvailability, error) {
	start := time.Now()
	availability, err := s.dlt.CheckEmptyWork(ctx, siteID)
	s.recordFetch(ctx, "work-availability", map[string]any{"sit_id": siteID}, err, start)
	return availability, err
}

func (s *AIService) DLTVehicles(ctx context.Context) ([]dto.DLTVehicleType, error) {
	start := time.Now()
	vehicles, err := s.dlt.GetVehicles(ctx)
	s.recordFetch(ctx, "vehicles", nil, err, start)
	return vehicles, err
}

func (s *AIService) DLTWorkTypes(ctx context.Context, siteID int, groupID int, keyword string) ([]dto.DLTWorkType, error) {
	start := time.Now()
	workTypes, err := s.dlt.WorkFilter(ctx, siteID, groupID, keyword)
	s.recordFetch(ctx, "work-types", map[string]any{"sit_id": siteID, "group_id": groupID, "kw": keyword}, err, start)
	if err != nil {
		return nil, err
	}
	s.persist(ctx, "work-types", func(ctx context.Context) error {
		return s.store.UpsertWorkTypes(ctx, siteID, groupID, keyword, workTypes, time.Now().UTC())
	})
	return workTypes, nil
}

func (s *AIService) DLTHolidays(ctx context.Context, workTypeID int) ([]dto.DLTHoliday, error) {
	start := time.Now()
	holidays, err := s.dlt.GetHolidays(ctx, workTypeID)
	s.recordFetch(ctx, "holidays", map[string]any{"tyw_id": workTypeID}, err, start)
	return holidays, err
}

func (s *AIService) DLTSlots(ctx context.Context, workTypeID int, currentDate string) ([]dto.DLTSlotDay, error) {
	start := time.Now()
	slots, raw, err := s.dlt.GetSlots(ctx, workTypeID, currentDate)
	s.recordFetch(ctx, "slots", map[string]any{"tyw_id": workTypeID, "currentDate": currentDate}, err, start)
	if err != nil {
		return nil, err
	}
	s.persist(ctx, "slots", func(ctx context.Context) error {
		return s.store.InsertSlotSnapshot(ctx, workTypeID, currentDate, raw, time.Now().UTC())
	})
	return slots, nil
}

func (s *AIService) DLTSnapshotOffices(ctx context.Context) ([]dto.DLTOffice, time.Time, error) {
	if s.store == nil {
		return nil, time.Time{}, ErrPersistenceUnavailable
	}
	return s.store.LatestOffices(ctx)
}

func (s *AIService) DLTSnapshotWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	if s.store == nil {
		return nil, time.Time{}, ErrPersistenceUnavailable
	}
	return s.store.LatestWorkTypes(ctx, siteID, groupID, keyword)
}

func (s *AIService) DLTSnapshotSlots(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error) {
	if s.store == nil {
		return nil, "", time.Time{}, ErrPersistenceUnavailable
	}
	return s.store.LatestSlotSnapshot(ctx, workTypeID, currentDate)
}

func (s *AIService) DLTFetches(ctx context.Context, limit int) ([]repo.FetchRecord, error) {
	if s.store == nil {
		return nil, ErrPersistenceUnavailable
	}
	return s.store.RecentFetches(ctx, limit)
}

// storeCtx detaches best-effort persistence from the request lifecycle so a
// cancelled or timed-out request still gets its fetch attempt recorded.
func storeCtx(ctx context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.WithoutCancel(ctx), 3*time.Second)
}

// recordFetch logs an upstream fetch attempt. It never fails the caller.
func (s *AIService) recordFetch(ctx context.Context, kind string, params map[string]any, fetchErr error, start time.Time) {
	if s.store == nil {
		return
	}
	if params == nil {
		params = map[string]any{}
	}
	rec := repo.FetchRecord{
		Kind:       kind,
		Params:     params,
		OK:         fetchErr == nil,
		DurationMS: time.Since(start).Milliseconds(),
		FetchedAt:  time.Now().UTC(),
	}
	if fetchErr != nil {
		rec.ErrorText = fetchErr.Error()
	}

	recordCtx, cancel := storeCtx(ctx)
	defer cancel()
	if err := s.store.RecordFetch(recordCtx, rec); err != nil {
		log.Printf("WARN: record %s fetch: %v", kind, err)
	}
}

// persist runs a best-effort write; failures are logged, never returned.
func (s *AIService) persist(ctx context.Context, kind string, fn func(ctx context.Context) error) {
	if s.store == nil {
		return
	}
	persistCtx, cancel := storeCtx(ctx)
	defer cancel()
	if err := fn(persistCtx); err != nil {
		log.Printf("WARN: persist %s: %v", kind, err)
	}
}

type DLTClient struct {
	baseURL         string
	workFilterToken string
	httpClient      *http.Client
	capacity        chan struct{}
}

func NewDLTClient(baseURL, workFilterToken string, httpClient *http.Client) *DLTClient {
	return NewDLTClientWithConcurrency(baseURL, workFilterToken, httpClient, 4)
}

func NewDLTClientWithConcurrency(baseURL, workFilterToken string, httpClient *http.Client, maxConcurrency int) *DLTClient {
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 15 * time.Second}
	}
	if maxConcurrency <= 0 {
		maxConcurrency = 1
	}

	return &DLTClient{
		baseURL:         strings.TrimRight(baseURL, "/"),
		workFilterToken: workFilterToken,
		httpClient:      httpClient,
		capacity:        make(chan struct{}, maxConcurrency),
	}
}

func (c *DLTClient) GetOffices(ctx context.Context) ([]dto.DLTOffice, error) {
	var out []dto.DLTOffice
	err := c.getJSON(ctx, "/dlt-api1/getSite/2", nil, &out)
	return out, err
}

func (c *DLTClient) CheckEmptyWork(ctx context.Context, siteID int) ([]dto.DLTWorkAvailability, error) {
	var out []dto.DLTWorkAvailability
	err := c.postJSON(ctx, "/dlt-api1/checkEmptyWork", map[string]int{"sit_id": siteID}, &out)
	return out, err
}

func (c *DLTClient) GetVehicles(ctx context.Context) ([]dto.DLTVehicleType, error) {
	var out []dto.DLTVehicleType
	params := url.Values{}
	params.Set("language", "2")
	params.Set("ve_type", "1")
	err := c.getJSON(ctx, "/dlt-api1/getVehicle", params, &out)
	return out, err
}

func (c *DLTClient) WorkFilter(ctx context.Context, siteID int, groupID int, keyword string) ([]dto.DLTWorkType, error) {
	var out []dto.DLTWorkType
	body := map[string]any{
		"username": c.workFilterToken,
		"sit_id":   siteID,
		"group_id": groupID,
		"kw":       keyword,
	}
	err := c.postJSON(ctx, "/dlt-api1/workfilter", body, &out)
	return out, err
}

func (c *DLTClient) GetHolidays(ctx context.Context, workTypeID int) ([]dto.DLTHoliday, error) {
	var out []dto.DLTHoliday
	params := url.Values{}
	params.Set("tyw_id", fmt.Sprintf("%d", workTypeID))
	err := c.getJSON(ctx, "/dlt-api3/holiday", params, &out)
	return out, err
}

// GetSlots returns the decoded slot days and the raw upstream payload so the
// caller can persist the response exactly as received.
func (c *DLTClient) GetSlots(ctx context.Context, workTypeID int, currentDate string) ([]dto.DLTSlotDay, json.RawMessage, error) {
	var raw json.RawMessage
	params := url.Values{}
	params.Set("tyw_id", fmt.Sprintf("%d", workTypeID))
	params.Set("currentDate", currentDate)
	if err := c.getJSON(ctx, "/dlt-api3/siteroundopen", params, &raw); err != nil {
		return nil, nil, err
	}

	var out []dto.DLTSlotDay
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, nil, fmt.Errorf("decode DLT response: %w", err)
	}
	return out, raw, nil
}

func (c *DLTClient) getJSON(ctx context.Context, path string, params url.Values, out any) error {
	endpoint, err := c.url(path)
	if err != nil {
		return err
	}
	if len(params) > 0 {
		endpoint.RawQuery = params.Encode()
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return fmt.Errorf("build DLT request: %w", err)
	}

	return c.doJSON(req, out)
}

func (c *DLTClient) postJSON(ctx context.Context, path string, body any, out any) error {
	endpoint, err := c.url(path)
	if err != nil {
		return err
	}

	payload, err := json.Marshal(body)
	if err != nil {
		return fmt.Errorf("encode DLT request body: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint.String(), bytes.NewReader(payload))
	if err != nil {
		return fmt.Errorf("build DLT request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	return c.doJSON(req, out)
}

func (c *DLTClient) doJSON(req *http.Request, out any) error {
	select {
	case c.capacity <- struct{}{}:
		defer func() { <-c.capacity }()
	case <-req.Context().Done():
		return req.Context().Err()
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			return err
		}
		return fmt.Errorf("call DLT upstream: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("DLT upstream returned status %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(out); err != nil {
		return fmt.Errorf("decode DLT response: %w", err)
	}

	return nil
}

func (c *DLTClient) url(path string) (*url.URL, error) {
	if c.baseURL == "" {
		return nil, errors.New("DLT API base URL is empty")
	}

	parsed, err := url.Parse(c.baseURL + path)
	if err != nil {
		return nil, fmt.Errorf("parse DLT API URL: %w", err)
	}

	return parsed, nil
}
