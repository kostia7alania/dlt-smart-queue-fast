package service

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
	"time"

	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/repo"
)

// fakeStore captures writes and can be forced to fail them.
type fakeStore struct {
	mu          sync.Mutex
	failWrites  bool
	offices     []dto.DLTOffice
	slotPayload []byte
	fetches     []repo.FetchRecord
}

func (f *fakeStore) UpsertOffices(ctx context.Context, offices []dto.DLTOffice, fetchedAt time.Time) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.failWrites {
		return errors.New("db down")
	}
	f.offices = offices
	return nil
}

func (f *fakeStore) UpsertWorkTypes(ctx context.Context, siteID, groupID int, keyword string, workTypes []dto.DLTWorkType, fetchedAt time.Time) error {
	if f.failWrites {
		return errors.New("db down")
	}
	return nil
}

func (f *fakeStore) InsertSlotSnapshot(ctx context.Context, workTypeID int, currentDate string, payload []byte, fetchedAt time.Time) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.failWrites {
		return errors.New("db down")
	}
	f.slotPayload = payload
	return nil
}

func (f *fakeStore) RecordFetch(ctx context.Context, rec repo.FetchRecord) error {
	f.mu.Lock()
	defer f.mu.Unlock()
	f.fetches = append(f.fetches, rec)
	return nil
}

func (f *fakeStore) LatestOffices(ctx context.Context) ([]dto.DLTOffice, time.Time, error) {
	return nil, time.Time{}, repo.ErrNotFound
}

func (f *fakeStore) LatestWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	return nil, time.Time{}, repo.ErrNotFound
}

func (f *fakeStore) LatestSlotSnapshot(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error) {
	return nil, "", time.Time{}, repo.ErrNotFound
}

func (f *fakeStore) RecentFetches(ctx context.Context, limit int) ([]repo.FetchRecord, error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	return f.fetches, nil
}

func newOfficesUpstream(t *testing.T) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`[{"app_open":1,"sit_id":47,"sit_name":"Chiangmai Provincial Land Transport Office"}]`))
	}))
}

func TestDLTOfficesSurvivesFailingStore(t *testing.T) {
	server := newOfficesUpstream(t)
	defer server.Close()

	store := &fakeStore{failWrites: true}
	svc := NewAIService(server.URL, "")
	svc.SetStore(store)

	offices, err := svc.DLTOffices(context.Background())
	if err != nil {
		t.Fatalf("DLTOffices returned error despite failing store: %v", err)
	}
	if len(offices) != 1 || offices[0].SiteID != 47 {
		t.Fatalf("unexpected offices: %+v", offices)
	}
	if len(store.fetches) != 1 || !store.fetches[0].OK || store.fetches[0].Kind != "offices" {
		t.Fatalf("expected one successful offices fetch record, got %+v", store.fetches)
	}
}

func TestDLTOfficesWritesThrough(t *testing.T) {
	server := newOfficesUpstream(t)
	defer server.Close()

	store := &fakeStore{}
	svc := NewAIService(server.URL, "")
	svc.SetStore(store)

	if _, err := svc.DLTOffices(context.Background()); err != nil {
		t.Fatalf("DLTOffices returned error: %v", err)
	}
	if len(store.offices) != 1 || store.offices[0].Name != "Chiangmai Provincial Land Transport Office" {
		t.Fatalf("expected offices written through, got %+v", store.offices)
	}
}

func TestDLTSlotsPersistsRawPayload(t *testing.T) {
	payload := `[{"date":"2026-07-08","message":"เต็ม","color":"#FF0000","siteopen":[{"round":"08:00 - 08:30 น.","count":"เต็ม","MaxCount":2}]}]`
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(payload))
	}))
	defer server.Close()

	store := &fakeStore{}
	svc := NewAIService(server.URL, "")
	svc.SetStore(store)

	if _, err := svc.DLTSlots(context.Background(), 111093, "2026-07-07"); err != nil {
		t.Fatalf("DLTSlots returned error: %v", err)
	}
	if string(store.slotPayload) != payload {
		t.Fatalf("expected raw payload stored byte-identical.\nwant: %s\ngot:  %s", payload, store.slotPayload)
	}
}

func TestFailedFetchIsRecorded(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadGateway)
	}))
	defer server.Close()

	store := &fakeStore{}
	svc := NewAIService(server.URL, "")
	svc.SetStore(store)

	if _, err := svc.DLTVehicles(context.Background()); err == nil {
		t.Fatal("expected upstream error, got nil")
	}
	if len(store.fetches) != 1 || store.fetches[0].OK || store.fetches[0].ErrorText == "" {
		t.Fatalf("expected one failed vehicles fetch record with error text, got %+v", store.fetches)
	}
}

func TestSnapshotsWithoutStoreReturnSentinel(t *testing.T) {
	svc := NewAIService("http://127.0.0.1:0", "")

	if _, _, err := svc.DLTSnapshotOffices(context.Background()); !errors.Is(err, ErrPersistenceUnavailable) {
		t.Fatalf("expected ErrPersistenceUnavailable, got %v", err)
	}
	if _, err := svc.DLTFetches(context.Background(), 10); !errors.Is(err, ErrPersistenceUnavailable) {
		t.Fatalf("expected ErrPersistenceUnavailable, got %v", err)
	}
}
