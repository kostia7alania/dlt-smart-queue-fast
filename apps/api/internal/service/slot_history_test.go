package service

import (
	"context"
	"encoding/json"
	"errors"
	"strings"
	"testing"
	"time"

	"github.com/starter/api/internal/repo"
)

func TestDLTSlotHistorySummarizesStoredObservations(t *testing.T) {
	fetchedAt := time.Date(2026, 7, 23, 3, 0, 0, 0, time.UTC)
	store := &fakeStore{slotHistory: []repo.SlotSnapshotRecord{
		{
			WorkTypeID:  111093,
			CurrentDate: "2026-07-23",
			Payload: json.RawMessage(`[
				{"date":"2026-07-25","message":"เต็ม","color":"#FF0000","siteopen":[]},
				{"date":"2026-07-24","message":"Seat left 4","color":"#00FF00","siteopen":[]},
				{"date":"2026-07-26","message":"Seat left 2","color":"#00AA00","siteopen":[]}
			]`),
			FetchedAt: fetchedAt,
		},
		{
			WorkTypeID:  111093,
			CurrentDate: "2026-07-22",
			Payload:     json.RawMessage(`[{"date":"2026-07-24","message":"เต็ม","color":"#FF0000","siteopen":[]}]`),
			FetchedAt:   fetchedAt.Add(-time.Hour),
		},
		{
			WorkTypeID:  111093,
			CurrentDate: "2026-07-21",
			Payload:     json.RawMessage(`[]`),
			FetchedAt:   fetchedAt.Add(-2 * time.Hour),
		},
	}}
	svc := NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(store)

	history, err := svc.DLTSlotHistory(context.Background(), 111093, 20)
	if err != nil {
		t.Fatalf("DLTSlotHistory returned error: %v", err)
	}
	if len(history) != 3 {
		t.Fatalf("expected three observations, got %+v", history)
	}
	if history[0].Status != slotHistoryStatusAvailable ||
		history[0].TotalDays != 3 || history[0].AvailableDays != 2 ||
		history[0].FirstAvailable == nil ||
		history[0].FirstAvailable.Date != "2026-07-24" ||
		history[0].FirstAvailable.Message != "Seat left 4" {
		t.Fatalf("unexpected available summary: %+v", history[0])
	}
	if history[1].Status != slotHistoryStatusFull || history[1].FirstAvailable != nil {
		t.Fatalf("unexpected full summary: %+v", history[1])
	}
	if history[2].Status != slotHistoryStatusNoSlots || history[2].TotalDays != 0 {
		t.Fatalf("unexpected no-slots summary: %+v", history[2])
	}
}

func TestDLTSlotHistoryRejectsMalformedStoredPayload(t *testing.T) {
	store := &fakeStore{slotHistory: []repo.SlotSnapshotRecord{{
		WorkTypeID:  111093,
		CurrentDate: "2026-07-23",
		Payload:     json.RawMessage(`not-json`),
		FetchedAt:   time.Date(2026, 7, 23, 3, 0, 0, 0, time.UTC),
	}}}
	svc := NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(store)

	_, err := svc.DLTSlotHistory(context.Background(), 111093, 20)
	if !errors.Is(err, ErrInvalidStoredSlotSnapshot) ||
		!strings.Contains(err.Error(), "fetched at 2026-07-23T03:00:00Z") {
		t.Fatalf("expected explicit decode error, got %v", err)
	}
}

func TestDLTSlotHistoryPropagatesStoreError(t *testing.T) {
	storeErr := errors.New("query failed")
	svc := NewAIService("http://127.0.0.1:0", "")
	svc.SetStore(&fakeStore{slotHistoryErr: storeErr})

	if _, err := svc.DLTSlotHistory(context.Background(), 111093, 20); !errors.Is(err, storeErr) {
		t.Fatalf("expected store error, got %v", err)
	}
}
