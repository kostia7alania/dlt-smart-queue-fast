package service

import (
	"context"
	"encoding/json"

	"github.com/starter/api/internal/dto"
)

const (
	mapStatusAvailable  = "available"
	mapStatusFull       = "full"
	mapStatusNoSlots    = "no_slots"
	mapStatusNotOffered = "not_offered"
	mapStatusUnknown    = "unknown"
)

// DLTMapAvailability summarizes stored snapshots only. It never calls the DLT
// upstream: an absent or corrupt per-office slot payload stays explicitly
// unknown so opening the map cannot create an unbounded refresh fan-out.
func (s *AIService) DLTMapAvailability(ctx context.Context, groupID int, keyword, currentDate string) ([]dto.DLTMapAvailabilityResult, error) {
	if s.store == nil {
		return nil, ErrPersistenceUnavailable
	}

	snapshots, err := s.store.LatestMapAvailabilitySnapshots(ctx, groupID, keyword)
	if err != nil {
		return nil, err
	}

	results := make([]dto.DLTMapAvailabilityResult, 0, len(snapshots))
	for _, snapshot := range snapshots {
		result := dto.DLTMapAvailabilityResult{
			SiteID:              snapshot.SiteID,
			Status:              mapStatusUnknown,
			WorkType:            snapshot.WorkType,
			WorkTypesFetchedAt:  snapshot.WorkTypesFetchedAt,
			SlotsFetchedAt:      snapshot.SlotsFetchedAt,
			SnapshotCurrentDate: snapshot.SnapshotCurrentDate,
		}

		if snapshot.WorkType == nil {
			result.Status = mapStatusNotOffered
			results = append(results, result)
			continue
		}
		if len(snapshot.SlotPayload) == 0 {
			results = append(results, result)
			continue
		}

		var storedDays []dto.DLTSlotDay
		if err := json.Unmarshal(snapshot.SlotPayload, &storedDays); err != nil {
			results = append(results, result)
			continue
		}
		upcomingDays := make([]dto.DLTSlotDay, 0, len(storedDays))
		for _, day := range storedDays {
			if day.Date >= currentDate {
				upcomingDays = append(upcomingDays, day)
			}
		}
		summarizeMapAvailability(&result, upcomingDays)
		results = append(results, result)
	}
	return results, nil
}

func summarizeMapAvailability(result *dto.DLTMapAvailabilityResult, days []dto.DLTSlotDay) {
	result.TotalDays = len(days)
	for _, day := range days {
		if day.Message == dltFullMarker {
			continue
		}
		result.AvailableDays++
		if result.FirstAvailable == nil || day.Date < result.FirstAvailable.Date {
			result.FirstAvailable = &dto.DLTCompareDay{
				Date:    day.Date,
				Message: day.Message,
				Color:   day.Color,
			}
		}
	}

	switch {
	case result.AvailableDays > 0:
		result.Status = mapStatusAvailable
	case result.TotalDays > 0:
		result.Status = mapStatusFull
	default:
		result.Status = mapStatusNoSlots
	}
}
