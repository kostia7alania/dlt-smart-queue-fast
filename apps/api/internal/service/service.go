package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/model"
	"github.com/starter/api/internal/repo"
)

type AIService struct {
	runRepo *repo.RunRepo
	dlt     *DLTClient
}

func NewAIService(dltAPIBaseURL, dltWorkFilterToken string) *AIService {
	return &AIService{
		runRepo: repo.NewRunRepo(),
		dlt:     NewDLTClient(dltAPIBaseURL, dltWorkFilterToken, nil),
	}
}

func (s *AIService) PlanAgent(ctx context.Context, goal string) ([]string, error) {
	// Mock AI logic
	return []string{
		fmt.Sprintf("Analyze goal: %s", goal),
		"Generate initial structure",
		"Review and refine",
	}, nil
}

func (s *AIService) AnalyzeIdea(ctx context.Context, text string) (summary string, score int, tags []string, err error) {
	// Mock AI logic
	summary = fmt.Sprintf("Idea analysis: %s", text)
	score = 85
	tags = []string{"innovative", "software"}
	return
}

func (s *AIService) GetRun(ctx context.Context, id string) (*model.Run, error) {
	return s.runRepo.GetRun(ctx, id)
}

func (s *AIService) DLTOffices(ctx context.Context) ([]dto.DLTOffice, error) {
	return s.dlt.GetOffices(ctx)
}

func (s *AIService) DLTWorkAvailability(ctx context.Context, siteID int) ([]dto.DLTWorkAvailability, error) {
	return s.dlt.CheckEmptyWork(ctx, siteID)
}

func (s *AIService) DLTVehicles(ctx context.Context) ([]dto.DLTVehicleType, error) {
	return s.dlt.GetVehicles(ctx)
}

func (s *AIService) DLTWorkTypes(ctx context.Context, siteID int, groupID int, keyword string) ([]dto.DLTWorkType, error) {
	return s.dlt.WorkFilter(ctx, siteID, groupID, keyword)
}

func (s *AIService) DLTHolidays(ctx context.Context, workTypeID int) ([]dto.DLTHoliday, error) {
	return s.dlt.GetHolidays(ctx, workTypeID)
}

func (s *AIService) DLTSlots(ctx context.Context, workTypeID int, currentDate string) ([]dto.DLTSlotDay, error) {
	return s.dlt.GetSlots(ctx, workTypeID, currentDate)
}

type DLTClient struct {
	baseURL         string
	workFilterToken string
	httpClient      *http.Client
}

func NewDLTClient(baseURL, workFilterToken string, httpClient *http.Client) *DLTClient {
	if httpClient == nil {
		httpClient = &http.Client{Timeout: 15 * time.Second}
	}

	return &DLTClient{
		baseURL:         strings.TrimRight(baseURL, "/"),
		workFilterToken: workFilterToken,
		httpClient:      httpClient,
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

func (c *DLTClient) GetSlots(ctx context.Context, workTypeID int, currentDate string) ([]dto.DLTSlotDay, error) {
	var out []dto.DLTSlotDay
	params := url.Values{}
	params.Set("tyw_id", fmt.Sprintf("%d", workTypeID))
	params.Set("currentDate", currentDate)
	err := c.getJSON(ctx, "/dlt-api3/siteroundopen", params, &out)
	return out, err
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
	resp, err := c.httpClient.Do(req)
	if err != nil {
		if errors.Is(err, context.Canceled) || errors.Is(err, context.DeadlineExceeded) {
			return err
		}
		return fmt.Errorf("call DLT upstream: %w", err)
	}
	defer resp.Body.Close()

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
