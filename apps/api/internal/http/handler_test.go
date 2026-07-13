package http

import (
	"context"
	"encoding/json"
	"strings"
	"testing"
	"time"

	"github.com/danielgtaylor/huma/v2/humatest"
	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/repo"
	"github.com/starter/api/internal/service"
)

// snapshotStore serves canned snapshot data for handler tests.
type snapshotStore struct {
	empty      bool
	validEmpty bool
}

func (s *snapshotStore) UpsertOffices(ctx context.Context, offices []dto.DLTOffice, fetchedAt time.Time) error {
	return nil
}

func (s *snapshotStore) UpsertWorkTypes(ctx context.Context, siteID, groupID int, keyword string, workTypes []dto.DLTWorkType, fetchedAt time.Time) error {
	return nil
}

func (s *snapshotStore) InsertSlotSnapshot(ctx context.Context, workTypeID int, currentDate string, payload []byte, fetchedAt time.Time) error {
	return nil
}

func (s *snapshotStore) RecordFetch(ctx context.Context, rec repo.FetchRecord) error {
	return nil
}

func (s *snapshotStore) LatestOffices(ctx context.Context) ([]dto.DLTOffice, time.Time, error) {
	if s.empty {
		return nil, time.Time{}, repo.ErrNotFound
	}
	if s.validEmpty {
		return []dto.DLTOffice{}, time.Date(2026, 7, 10, 3, 0, 0, 0, time.UTC), nil
	}
	return []dto.DLTOffice{{AppOpen: 1, SiteID: 47, Name: "Chiangmai Provincial Land Transport Office"}},
		time.Date(2026, 7, 7, 3, 0, 0, 0, time.UTC), nil
}

func (s *snapshotStore) LatestWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	if s.empty {
		return nil, time.Time{}, repo.ErrNotFound
	}
	if s.validEmpty {
		return []dto.DLTWorkType{}, time.Date(2026, 7, 10, 3, 0, 0, 0, time.UTC), nil
	}
	return []dto.DLTWorkType{{Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", WorkID: 111093, Status: 1, DateStart: "2022-05-04T00:00:00.000Z"}},
		time.Date(2026, 7, 7, 3, 0, 0, 0, time.UTC), nil
}

func (s *snapshotStore) LatestSlotSnapshot(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error) {
	if s.empty {
		return nil, "", time.Time{}, repo.ErrNotFound
	}
	payload := `[{"date":"2026-07-08","message":"เต็ม","color":"#FF0000","siteopen":[{"round":"08:00 - 08:30 น.","count":"เต็ม","MaxCount":2}]}]`
	return json.RawMessage(payload), "2026-07-07", time.Date(2026, 7, 7, 3, 0, 0, 0, time.UTC), nil
}

func (s *snapshotStore) RecentFetches(ctx context.Context, limit int) ([]repo.FetchRecord, error) {
	return []repo.FetchRecord{{
		Kind:       "offices",
		Params:     map[string]any{},
		OK:         true,
		DurationMS: 120,
		FetchedAt:  time.Date(2026, 7, 7, 3, 0, 0, 0, time.UTC),
	}}, nil
}

func TestDLTSlotsRejectsMalformedCurrentDate(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/work-types/111093/slots?currentDate=not-a-date")
	if resp.Code != 400 {
		t.Fatalf("expected 400 for malformed currentDate, got %d", resp.Code)
	}
}

func TestDLTSlotsRejectsMissingCurrentDate(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/work-types/111093/slots")
	if resp.Code != 400 {
		t.Fatalf("expected 400 for missing currentDate, got %d", resp.Code)
	}
}

func TestSnapshotEndpointsWithoutStoreReturn503(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	RegisterRoutes(api, svc)

	for _, path := range []string{
		"/v1/dlt/snapshots/offices",
		"/v1/dlt/snapshots/work-types",
		"/v1/dlt/snapshots/slots?workTypeId=111093",
		"/v1/dlt/fetches",
	} {
		resp := api.Get(path)
		if resp.Code != 503 {
			t.Fatalf("%s: expected 503 without store, got %d", path, resp.Code)
		}
	}
}

func TestSnapshotEndpointsReturn404WhenEmpty(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&snapshotStore{empty: true})
	RegisterRoutes(api, svc)

	for _, path := range []string{
		"/v1/dlt/snapshots/offices",
		"/v1/dlt/snapshots/work-types",
		"/v1/dlt/snapshots/slots?workTypeId=111093",
	} {
		resp := api.Get(path)
		if resp.Code != 404 {
			t.Fatalf("%s: expected 404 when nothing stored, got %d", path, resp.Code)
		}
	}
}

func TestListSnapshotEndpointsReturnStoredEmptyResults(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&snapshotStore{validEmpty: true})
	RegisterRoutes(api, svc)

	tests := []struct {
		path  string
		field string
	}{
		{path: "/v1/dlt/snapshots/offices", field: "offices"},
		{
			path:  "/v1/dlt/snapshots/work-types?siteId=47&groupId=4&keyword=%20NEW%20THAI",
			field: "work_types",
		},
	}

	for _, tt := range tests {
		resp := api.Get(tt.path)
		if resp.Code != 200 {
			t.Fatalf("%s: expected 200 for a stored empty result, got %d: %s", tt.path, resp.Code, resp.Body.String())
		}
		var body map[string]any
		if err := json.Unmarshal(resp.Body.Bytes(), &body); err != nil {
			t.Fatalf("%s: decode response: %v", tt.path, err)
		}
		items, ok := body[tt.field].([]any)
		if !ok || len(items) != 0 {
			t.Fatalf("%s: expected %s to be an empty array, got %#v", tt.path, tt.field, body[tt.field])
		}
		if _, ok := body["fetched_at"].(string); !ok {
			t.Fatalf("%s: expected fetched_at string, got %#v", tt.path, body["fetched_at"])
		}
	}
}

func TestSlotsSnapshotPreservesThaiStrings(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&snapshotStore{})
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/snapshots/slots?workTypeId=111093")
	if resp.Code != 200 {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	body := resp.Body.String()
	if !strings.Contains(body, "เต็ม") {
		t.Fatalf("expected preserved Thai status in snapshot response, got %s", body)
	}
	if !strings.Contains(body, `"current_date":"2026-07-07"`) || !strings.Contains(body, `"fetched_at"`) {
		t.Fatalf("expected snapshot metadata in response, got %s", body)
	}
}

func TestSlotsSnapshotRejectsInvalidParams(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&snapshotStore{})
	RegisterRoutes(api, svc)

	if resp := api.Get("/v1/dlt/snapshots/slots"); resp.Code != 400 {
		t.Fatalf("expected 400 for missing workTypeId, got %d", resp.Code)
	}
	if resp := api.Get("/v1/dlt/snapshots/slots?workTypeId=111093&currentDate=nope"); resp.Code != 400 {
		t.Fatalf("expected 400 for malformed currentDate, got %d", resp.Code)
	}
}

func TestFetchesEndpointReturnsRecords(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&snapshotStore{})
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/fetches?limit=5")
	if resp.Code != 200 {
		t.Fatalf("expected 200, got %d: %s", resp.Code, resp.Body.String())
	}
	var records []dto.DLTFetchRecord
	if err := json.Unmarshal(resp.Body.Bytes(), &records); err != nil {
		t.Fatalf("decode fetches response: %v", err)
	}
	if len(records) != 1 || records[0].Kind != "offices" || !records[0].OK {
		t.Fatalf("unexpected fetch records: %+v", records)
	}
}
