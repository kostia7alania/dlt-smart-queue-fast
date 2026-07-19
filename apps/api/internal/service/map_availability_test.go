package service

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/repo"
)

func TestDLTMapAvailabilitySummarizesStoredStatuses(t *testing.T) {
	fetchedAt := time.Date(2026, 7, 19, 3, 0, 0, 0, time.UTC)
	workType := dto.DLTWorkType{WorkID: 111093, Name: "ชาวต่างชาติ: NEW THAI DRIVING LICENCE", Status: 1}
	store := &fakeStore{mapSnapshots: []repo.MapAvailabilitySnapshot{
		{
			SiteID:             1,
			WorkType:           &workType,
			WorkTypesFetchedAt: fetchedAt,
			SlotPayload: json.RawMessage(`[
				{"date":"2026-07-18","message":"Seat left past","color":"#000000","siteopen":[]},
				{"date":"2026-07-20","message":"เต็ม","color":"#FF0000","siteopen":[]},
				{"date":"2026-07-22","message":"Seat left 4","color":"#00FF00","siteopen":[]},
				{"date":"2026-07-21","message":"Available","color":"#00AA00","siteopen":[]}
			]`),
			SlotsFetchedAt: &fetchedAt,
		},
		{
			SiteID:             2,
			WorkType:           &workType,
			WorkTypesFetchedAt: fetchedAt,
			SlotPayload: json.RawMessage(`[
				{"date":"2026-07-20","message":"เต็ม","color":"#FF0000","siteopen":[]}
			]`),
			SlotsFetchedAt: &fetchedAt,
		},
		{
			SiteID:             3,
			WorkType:           &workType,
			WorkTypesFetchedAt: fetchedAt,
			SlotPayload: json.RawMessage(`[
				{"date":"2026-07-18","message":"Available","color":"#00FF00","siteopen":[]}
			]`),
			SlotsFetchedAt: &fetchedAt,
		},
		{SiteID: 4, WorkTypesFetchedAt: fetchedAt},
		{SiteID: 5, WorkType: &workType, WorkTypesFetchedAt: fetchedAt},
		{
			SiteID:             6,
			WorkType:           &workType,
			WorkTypesFetchedAt: fetchedAt,
			SlotPayload:        json.RawMessage(`not-json`),
			SlotsFetchedAt:     &fetchedAt,
		},
	}}
	svc := NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(store)

	results, err := svc.DLTMapAvailability(context.Background(), 4, " NEW THAI", "2026-07-19")
	if err != nil {
		t.Fatalf("DLTMapAvailability returned error: %v", err)
	}
	if len(results) != 6 {
		t.Fatalf("expected 6 results, got %+v", results)
	}

	statuses := []string{
		mapStatusAvailable,
		mapStatusFull,
		mapStatusNoSlots,
		mapStatusNotOffered,
		mapStatusUnknown,
		mapStatusUnknown,
	}
	for index, status := range statuses {
		if results[index].Status != status {
			t.Fatalf("office %d: expected %s, got %+v", results[index].SiteID, status, results[index])
		}
	}
	available := results[0]
	if available.TotalDays != 3 || available.AvailableDays != 2 {
		t.Fatalf("past day must be excluded, got %+v", available)
	}
	if available.FirstAvailable == nil || available.FirstAvailable.Date != "2026-07-21" ||
		available.FirstAvailable.Message != "Available" || available.FirstAvailable.Color != "#00AA00" {
		t.Fatalf("unexpected first available day: %+v", available.FirstAvailable)
	}
}

func TestDLTMapAvailabilityPropagatesStoreError(t *testing.T) {
	wantErr := repo.ErrNotFound
	svc := NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&fakeStore{mapSnapshotsErr: wantErr})

	if _, err := svc.DLTMapAvailability(context.Background(), 4, " NEW THAI", "2026-07-19"); err != wantErr {
		t.Fatalf("expected store error %v, got %v", wantErr, err)
	}
}
