package service

import (
	"context"
	"encoding/json"
	"time"

	"github.com/starter/api/internal/dto"
)

// dltFullMarker is the upstream "full" day message, preserved exactly
// (constitution principle IV). A day is available iff its message differs.
const dltFullMarker = "เต็ม"

const (
	// compareSnapshotTTL is the reuse window: snapshots at most this old are
	// served from PostgreSQL without touching the upstream at all.
	compareSnapshotTTL = 10 * time.Minute
	// comparePause separates consecutive offices that hit the live upstream.
	comparePause = 300 * time.Millisecond
)

// DLTCompare fetches availability for up to a handful of offices sequentially
// and summarizes each into a comparison row. Politeness rules (bounded batch,
// snapshot reuse, live-failure circuit) are documented in
// specs/009-availability-comparison/spec.md; the batch size cap is enforced by
// the handler.
func (s *AIService) DLTCompare(ctx context.Context, siteIDs []int, groupID int, keyword, currentDate string) []dto.DLTCompareOfficeResult {
	results := make([]dto.DLTCompareOfficeResult, 0, len(siteIDs))
	// Once one live call fails, the remaining offices go snapshot-only so a
	// single upstream outage never turns into a chain of sequential timeouts.
	liveDown := false

	for i, siteID := range siteIDs {
		if ctx.Err() != nil {
			return results
		}
		if i > 0 && !liveDown {
			select {
			case <-ctx.Done():
				return results
			case <-time.After(s.comparePause()):
			}
		}
		result, usedLive := s.compareOffice(ctx, siteID, groupID, keyword, currentDate, liveDown)
		if ctx.Err() != nil {
			return results
		}
		if usedLive && result.Error != "" {
			liveDown = true
		}
		results = append(results, result)
	}
	return results
}

func (s *AIService) comparePause() time.Duration {
	if s.pause != 0 {
		return s.pause
	}
	return comparePause
}

// compareOffice resolves one office's work type and slot days, preferring
// fresh snapshots, then live (unless snapshotOnly), then stale snapshots.
// usedLive reports whether the office actually called the upstream.
func (s *AIService) compareOffice(ctx context.Context, siteID, groupID int, keyword, currentDate string, snapshotOnly bool) (result dto.DLTCompareOfficeResult, usedLive bool) {
	result = dto.DLTCompareOfficeResult{SiteID: siteID}

	workTypes, workTypesLive, err := s.compareWorkTypes(ctx, siteID, groupID, keyword, snapshotOnly)
	usedLive = workTypesLive
	if err != nil {
		result.Error = "work types unavailable: " + err.Error()
		return result, usedLive
	}
	if len(workTypes) == 0 {
		// A successful lookup with zero work types is honest data, not an error.
		return result, usedLive
	}
	// Same choice the calendar page makes: the first returned work type.
	workType := workTypes[0]
	result.WorkType = &workType

	days, source, fetchedAt, slotsLive, err := s.compareSlots(ctx, workType.WorkID, currentDate, snapshotOnly)
	usedLive = usedLive || slotsLive
	if err != nil {
		result.Error = "slots unavailable: " + err.Error()
		return result, usedLive
	}

	result.Source = source
	if source == "snapshot" {
		result.FetchedAt = &fetchedAt
	}
	summarize(&result, days)
	return result, usedLive
}

func (s *AIService) compareWorkTypes(ctx context.Context, siteID, groupID int, keyword string, snapshotOnly bool) (workTypes []dto.DLTWorkType, usedLive bool, err error) {
	if s.store != nil {
		stored, fetchedAt, storeErr := s.store.LatestWorkTypes(ctx, siteID, groupID, keyword)
		if storeErr == nil && (snapshotOnly || time.Since(fetchedAt) <= compareSnapshotTTL) {
			return stored, false, nil
		}
		if snapshotOnly {
			return nil, false, storeErr
		}
	}
	if snapshotOnly {
		return nil, false, ErrPersistenceUnavailable
	}

	workTypes, liveErr := s.DLTWorkTypes(ctx, siteID, groupID, keyword)
	if liveErr == nil {
		return workTypes, true, nil
	}
	if ctx.Err() != nil {
		return nil, true, ctx.Err()
	}
	if s.store != nil {
		if stored, _, storeErr := s.store.LatestWorkTypes(ctx, siteID, groupID, keyword); storeErr == nil {
			return stored, true, nil
		}
	}
	return nil, true, liveErr
}

func (s *AIService) compareSlots(ctx context.Context, workTypeID int, currentDate string, snapshotOnly bool) (days []dto.DLTSlotDay, source string, fetchedAt time.Time, usedLive bool, err error) {
	if s.store != nil {
		payload, _, storedAt, storeErr := s.store.LatestSlotSnapshot(ctx, workTypeID, currentDate)
		if storeErr == nil && (snapshotOnly || time.Since(storedAt) <= compareSnapshotTTL) {
			if decodeErr := json.Unmarshal(payload, &days); decodeErr == nil {
				return days, "snapshot", storedAt, false, nil
			}
		}
		if snapshotOnly {
			if storeErr == nil {
				storeErr = ErrPersistenceUnavailable
			}
			return nil, "", time.Time{}, false, storeErr
		}
	}
	if snapshotOnly {
		return nil, "", time.Time{}, false, ErrPersistenceUnavailable
	}

	days, liveErr := s.DLTSlots(ctx, workTypeID, currentDate)
	if liveErr == nil {
		return days, "live", time.Time{}, true, nil
	}
	if ctx.Err() != nil {
		return nil, "", time.Time{}, true, ctx.Err()
	}
	if s.store != nil {
		payload, _, storedAt, storeErr := s.store.LatestSlotSnapshot(ctx, workTypeID, currentDate)
		if storeErr == nil {
			if decodeErr := json.Unmarshal(payload, &days); decodeErr == nil {
				return days, "snapshot", storedAt, true, nil
			}
		}
	}
	return nil, "", time.Time{}, true, liveErr
}

// summarize computes the comparison numbers from upstream slot days. Upstream
// dates are YYYY-MM-DD, so string comparison orders them correctly.
func summarize(result *dto.DLTCompareOfficeResult, days []dto.DLTSlotDay) {
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
}
