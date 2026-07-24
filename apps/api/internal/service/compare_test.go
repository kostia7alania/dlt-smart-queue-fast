package service

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/dto"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/repo"
)

// compareStore extends fakeStore with configurable snapshot reads keyed the
// way the compare flow looks them up.
type compareStore struct {
	fakeStore
	snapMu        sync.Mutex
	workTypesBy   map[int][]dto.DLTWorkType
	workTypesAt   time.Time
	slotPayloadBy map[int]string
	slotsAt       time.Time
}

func (c *compareStore) LatestWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	c.snapMu.Lock()
	defer c.snapMu.Unlock()
	workTypes, ok := c.workTypesBy[siteID]
	if !ok {
		return nil, time.Time{}, repo.ErrNotFound
	}
	return workTypes, c.workTypesAt, nil
}

func (c *compareStore) LatestSlotSnapshot(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error) {
	c.snapMu.Lock()
	defer c.snapMu.Unlock()
	payload, ok := c.slotPayloadBy[workTypeID]
	if !ok {
		return nil, "", time.Time{}, repo.ErrNotFound
	}
	return json.RawMessage(payload), currentDate, c.slotsAt, nil
}

// compareUpstream is a fake DLT API that counts calls per endpoint and can be
// switched to fail everything.
type compareUpstream struct {
	mu         sync.Mutex
	fail       bool
	attempts   int
	workfilter int
	slots      int
	server     *httptest.Server
}

func newCompareUpstream(t *testing.T) *compareUpstream {
	t.Helper()
	u := &compareUpstream{}
	u.server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u.mu.Lock()
		defer u.mu.Unlock()
		u.attempts++
		if u.fail {
			w.WriteHeader(http.StatusBadGateway)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		switch {
		case strings.Contains(r.URL.Path, "workfilter"):
			u.workfilter++
			_, _ = w.Write([]byte(`[{"tyw_name":"ชาวต่างชาติ: NEW THAI DRIVING LICENCE","tyw_id":111093,"tyw_status":1,"tyw_datestart":"2022-05-04T00:00:00.000Z"}]`))
		case strings.Contains(r.URL.Path, "siteroundopen"):
			u.slots++
			_, _ = w.Write([]byte(compareSlotDays))
		default:
			_, _ = w.Write([]byte(`[]`))
		}
	}))
	t.Cleanup(u.server.Close)
	return u
}

func (u *compareUpstream) counts() (workfilter, slots int) {
	u.mu.Lock()
	defer u.mu.Unlock()
	return u.workfilter, u.slots
}

func (u *compareUpstream) setFail(fail bool) {
	u.mu.Lock()
	defer u.mu.Unlock()
	u.fail = fail
}

const compareSlotDays = `[
	{"date":"2026-07-22","message":"เต็ม","color":"#FF0000","siteopen":[]},
	{"date":"2026-07-21","message":"ว่าง","color":"#00FF00","siteopen":[]},
	{"date":"2026-07-20","message":"เต็ม","color":"#FF0000","siteopen":[]},
	{"date":"2026-07-24","message":"Seat left 4","color":"#FFA500","siteopen":[]}
]`

func newCompareService(upstream *compareUpstream, store Store) *AIService {
	svc := NewAIService(upstream.server.URL, "token")
	if store != nil {
		svc.SetStore(store)
	}
	svc.pause = time.Nanosecond
	return svc
}

func TestDLTCompareSummarizesLiveDays(t *testing.T) {
	upstream := newCompareUpstream(t)
	svc := newCompareService(upstream, &compareStore{})

	results := svc.DLTCompare(context.Background(), []int{47}, 4, " NEW THAI", "2026-07-19")
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %+v", results)
	}
	r := results[0]
	if r.Error != "" {
		t.Fatalf("unexpected error: %s", r.Error)
	}
	if r.Source != "live" || r.FetchedAt != nil {
		t.Fatalf("expected live source without fetchedAt, got %+v", r)
	}
	if r.WorkType == nil || r.WorkType.WorkID != 111093 {
		t.Fatalf("expected resolved work type, got %+v", r.WorkType)
	}
	if r.TotalDays != 4 || r.AvailableDays != 2 {
		t.Fatalf("expected 4 total / 2 available, got %+v", r)
	}
	if r.FirstAvailable == nil || r.FirstAvailable.Date != "2026-07-21" ||
		r.FirstAvailable.Message != "ว่าง" || r.FirstAvailable.Color != "#00FF00" {
		t.Fatalf("expected first available 2026-07-21 with upstream strings, got %+v", r.FirstAvailable)
	}
}

func TestDLTCompareReusesFreshSnapshotsWithoutUpstreamCalls(t *testing.T) {
	upstream := newCompareUpstream(t)
	store := &compareStore{
		workTypesBy: map[int][]dto.DLTWorkType{
			47: {{Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", WorkID: 111093, Status: 1}},
		},
		workTypesAt:   time.Now().Add(-time.Minute),
		slotPayloadBy: map[int]string{111093: compareSlotDays},
		slotsAt:       time.Now().Add(-2 * time.Minute),
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{47}, 4, " NEW THAI", "2026-07-19")
	if workfilter, slots := upstream.counts(); workfilter != 0 || slots != 0 {
		t.Fatalf("expected zero upstream calls, got workfilter=%d slots=%d", workfilter, slots)
	}
	r := results[0]
	if r.Error != "" || r.Source != "snapshot" || r.FetchedAt == nil {
		t.Fatalf("expected snapshot-sourced result with freshness, got %+v", r)
	}
	if r.AvailableDays != 2 || r.FirstAvailable == nil || r.FirstAvailable.Date != "2026-07-21" {
		t.Fatalf("snapshot summary wrong: %+v", r)
	}
}

func TestDLTCompareStaleSnapshotGoesLive(t *testing.T) {
	upstream := newCompareUpstream(t)
	store := &compareStore{
		workTypesBy: map[int][]dto.DLTWorkType{
			47: {{Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", WorkID: 111093, Status: 1}},
		},
		workTypesAt:   time.Now().Add(-time.Hour),
		slotPayloadBy: map[int]string{111093: compareSlotDays},
		slotsAt:       time.Now().Add(-time.Hour),
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{47}, 4, " NEW THAI", "2026-07-19")
	if workfilter, slots := upstream.counts(); workfilter != 1 || slots != 1 {
		t.Fatalf("expected live refresh past the TTL, got workfilter=%d slots=%d", workfilter, slots)
	}
	if results[0].Source != "live" {
		t.Fatalf("expected live source, got %+v", results[0])
	}
}

func TestDLTCompareLiveFailureFallsBackToStaleSnapshot(t *testing.T) {
	upstream := newCompareUpstream(t)
	upstream.setFail(true)
	store := &compareStore{
		workTypesBy: map[int][]dto.DLTWorkType{
			47: {{Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", WorkID: 111093, Status: 1}},
		},
		workTypesAt:   time.Now().Add(-time.Hour),
		slotPayloadBy: map[int]string{111093: compareSlotDays},
		slotsAt:       time.Now().Add(-time.Hour),
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{47}, 4, " NEW THAI", "2026-07-19")
	r := results[0]
	if r.Error != "" || r.Source != "snapshot" || r.FetchedAt == nil {
		t.Fatalf("expected stale-snapshot fallback, got %+v", r)
	}
}

func TestDLTCompareCircuitSkipsUpstreamAfterFirstLiveFailure(t *testing.T) {
	upstream := newCompareUpstream(t)
	upstream.setFail(true)
	store := &compareStore{
		// Office 99 has no snapshots at all -> hard error. Office 47 has stale
		// snapshots that the snapshot-only circuit path must serve.
		workTypesBy: map[int][]dto.DLTWorkType{
			47: {{Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", WorkID: 111093, Status: 1}},
		},
		workTypesAt:   time.Now().Add(-time.Hour),
		slotPayloadBy: map[int]string{111093: compareSlotDays},
		slotsAt:       time.Now().Add(-time.Hour),
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{99, 47}, 4, " NEW THAI", "2026-07-19")
	if results[0].Error == "" {
		t.Fatalf("expected office 99 to fail, got %+v", results[0])
	}
	if results[1].Error != "" || results[1].Source != "snapshot" {
		t.Fatalf("expected office 47 served snapshot-only, got %+v", results[1])
	}
	// Only office 99's failed workfilter may reach the upstream; office 47 must
	// not attempt any live call once the circuit is open.
	upstream.mu.Lock()
	attempts := upstream.attempts
	upstream.mu.Unlock()
	if attempts != 1 {
		t.Fatalf("expected exactly 1 upstream attempt (office 99 workfilter), got %d", attempts)
	}
}

func TestDLTCompareIsolatesPerOfficeFailures(t *testing.T) {
	upstream := newCompareUpstream(t)
	store := &compareStore{
		// Only office 47 resolves work types via fresh snapshot; office 99 has
		// nothing stored and the live workfilter succeeds for it too, so both
		// rows resolve — then office 99's slots snapshot decode keeps working.
		workTypesBy:   map[int][]dto.DLTWorkType{},
		slotPayloadBy: map[int]string{},
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{99, 47}, 4, " NEW THAI", "2026-07-19")
	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %+v", results)
	}
	for _, r := range results {
		if r.Error != "" || r.AvailableDays != 2 {
			t.Fatalf("expected both offices to resolve live, got %+v", r)
		}
	}
}

func TestDLTCompareEmptyWorkTypesIsHonestNotError(t *testing.T) {
	upstream := newCompareUpstream(t)
	store := &compareStore{
		workTypesBy: map[int][]dto.DLTWorkType{47: {}},
		workTypesAt: time.Now(),
	}
	svc := newCompareService(upstream, store)

	results := svc.DLTCompare(context.Background(), []int{47}, 4, " NEW THAI", "2026-07-19")
	r := results[0]
	if r.Error != "" || r.WorkType != nil || r.TotalDays != 0 || r.FirstAvailable != nil {
		t.Fatalf("expected empty-but-successful row, got %+v", r)
	}
	if workfilter, slots := upstream.counts(); workfilter != 0 || slots != 0 {
		t.Fatalf("expected no upstream calls for fresh empty snapshot, got workfilter=%d slots=%d", workfilter, slots)
	}
}

func TestDLTCompareWithoutStoreStaysLiveOnly(t *testing.T) {
	upstream := newCompareUpstream(t)
	svc := newCompareService(upstream, nil)

	results := svc.DLTCompare(context.Background(), []int{47, 48}, 4, " NEW THAI", "2026-07-19")
	if len(results) != 2 {
		t.Fatalf("expected 2 results, got %+v", results)
	}
	for _, r := range results {
		if r.Error != "" || r.Source != "live" || r.AvailableDays != 2 {
			t.Fatalf("expected live-only success, got %+v", r)
		}
	}
	if workfilter, slots := upstream.counts(); workfilter != 2 || slots != 2 {
		t.Fatalf("expected 2+2 upstream calls, got workfilter=%d slots=%d", workfilter, slots)
	}
}

func TestDLTComparePreCanceledContextStartsNoWork(t *testing.T) {
	upstream := newCompareUpstream(t)
	svc := newCompareService(upstream, nil)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	results := svc.DLTCompare(ctx, []int{47, 48}, 4, " NEW THAI", "2026-07-19")

	if len(results) != 0 {
		t.Fatalf("expected no results after cancellation, got %+v", results)
	}
	upstream.mu.Lock()
	attempts := upstream.attempts
	upstream.mu.Unlock()
	if attempts != 0 {
		t.Fatalf("expected zero upstream attempts after cancellation, got %d", attempts)
	}
}
