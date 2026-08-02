package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/dto"
)

var ErrInvalidStoredSlotSnapshot = errors.New("invalid stored slot snapshot")

const (
	slotHistoryStatusAvailable = "available"
	slotHistoryStatusFull      = "full"
	slotHistoryStatusNoSlots   = "no_slots"

	slotHistoryComparisonNoBaseline    = "no_baseline"
	slotHistoryComparisonUnchanged     = "unchanged"
	slotHistoryComparisonChanged       = "changed"
	slotHistoryComparisonNotComparable = "not_comparable"
)

// DLTSlotHistory summarizes stored observations only. It never calls the DLT
// upstream and fails explicitly if a stored payload cannot be decoded.
func (s *AIService) DLTSlotHistory(ctx context.Context, workTypeID, limit int) ([]dto.DLTSlotHistoryEntry, error) {
	if s.store == nil {
		return nil, ErrPersistenceUnavailable
	}

	snapshots, err := s.store.SlotSnapshots(ctx, workTypeID, limit)
	if err != nil {
		return nil, err
	}

	history := make([]dto.DLTSlotHistoryEntry, 0, len(snapshots))
	for _, snapshot := range snapshots {
		var days []dto.DLTSlotDay
		if err := json.Unmarshal(snapshot.Payload, &days); err != nil {
			return nil, fmt.Errorf(
				"%w fetched at %s: %v",
				ErrInvalidStoredSlotSnapshot,
				snapshot.FetchedAt.Format("2006-01-02T15:04:05Z07:00"),
				err,
			)
		}

		summary := summarizeSlotDays(days)
		entry := dto.DLTSlotHistoryEntry{
			ObservationID:  snapshot.ID,
			FetchedAt:      snapshot.FetchedAt,
			CurrentDate:    snapshot.CurrentDate,
			Status:         slotHistoryStatusNoSlots,
			TotalDays:      summary.TotalDays,
			AvailableDays:  summary.AvailableDays,
			FirstAvailable: summary.FirstAvailable,
		}
		switch {
		case summary.AvailableDays > 0:
			entry.Status = slotHistoryStatusAvailable
		case summary.TotalDays > 0:
			entry.Status = slotHistoryStatusFull
		}
		history = append(history, entry)
	}

	for index := range history {
		if index == len(history)-1 {
			history[index].Comparison = slotHistoryComparisonNoBaseline
			continue
		}

		older := history[index+1]
		if history[index].CurrentDate != older.CurrentDate {
			history[index].Comparison = slotHistoryComparisonNotComparable
			continue
		}
		if history[index].Status == older.Status {
			history[index].Comparison = slotHistoryComparisonUnchanged
			continue
		}

		history[index].Comparison = slotHistoryComparisonChanged
		history[index].PreviousStatus = older.Status
	}
	return history, nil
}
