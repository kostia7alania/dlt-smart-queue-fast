package service

import (
	"github.com/starter/api/internal/dto"
)

// slotSummary is shared by every stored/live availability projection so the
// exact upstream full marker and earliest-day rule cannot drift.
type slotSummary struct {
	TotalDays      int
	AvailableDays  int
	FirstAvailable *dto.DLTCompareDay
}

func summarizeSlotDays(days []dto.DLTSlotDay) slotSummary {
	summary := slotSummary{TotalDays: len(days)}
	for _, day := range days {
		if day.Message == dltFullMarker {
			continue
		}
		summary.AvailableDays++
		if summary.FirstAvailable == nil || day.Date < summary.FirstAvailable.Date {
			summary.FirstAvailable = &dto.DLTCompareDay{
				Date:    day.Date,
				Message: day.Message,
				Color:   day.Color,
			}
		}
	}
	return summary
}
