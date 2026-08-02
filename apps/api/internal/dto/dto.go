package dto

import "time"

type DLTOffice struct {
	AppOpen int    `json:"app_open"`
	SiteID  int    `json:"sit_id"`
	Name    string `json:"sit_name"`
}

type DLTWorkFilter struct {
	Keyword string `json:"kw"`
	GotWork bool   `json:"gotwork"`
}

type DLTWorkAvailability struct {
	GroupID int             `json:"tyg_id"`
	GotWork bool            `json:"gotwork"`
	Filter  []DLTWorkFilter `json:"filter,omitempty"`
}

type DLTVehicleType struct {
	VehicleID int    `json:"ve_id"`
	Name      string `json:"ve_name"`
}

type DLTWorkType struct {
	Name      string `json:"tyw_name"`
	WorkID    int    `json:"tyw_id"`
	Status    int    `json:"tyw_status"`
	DateStart string `json:"tyw_datestart"`
}

type DLTHoliday struct {
	Date string `json:"hol_date"`
}

type DLTSlotRound struct {
	Round    string `json:"round"`
	Count    any    `json:"count"`
	MaxCount int    `json:"MaxCount"`
}

type DLTSlotDay struct {
	Date     string         `json:"date"`
	Message  string         `json:"message"`
	Color    string         `json:"color"`
	SiteOpen []DLTSlotRound `json:"siteopen"`
}

type DLTOfficesResponse struct {
	Body []DLTOffice
}

type DLTWorkAvailabilityRequest struct {
	SiteID int `path:"siteId"`
}

type DLTWorkAvailabilityResponse struct {
	Body []DLTWorkAvailability
}

type DLTVehiclesResponse struct {
	Body []DLTVehicleType
}

type DLTWorkTypesRequest struct {
	SiteID  int    `query:"siteId"`
	GroupID int    `query:"groupId"`
	Keyword string `query:"keyword"`
}

type DLTWorkTypesResponse struct {
	Body []DLTWorkType
}

type DLTHolidaysRequest struct {
	WorkTypeID int `path:"workTypeId"`
}

type DLTHolidaysResponse struct {
	Body []DLTHoliday
}

type DLTSlotsRequest struct {
	WorkTypeID  int    `path:"workTypeId"`
	CurrentDate string `query:"currentDate"`
}

type DLTSlotsResponse struct {
	Body []DLTSlotDay
}

type DLTOfficesSnapshotResponse struct {
	Body struct {
		FetchedAt time.Time   `json:"fetched_at" doc:"When the stored data was last fetched from upstream"`
		Offices   []DLTOffice `json:"offices"`
	}
}

type DLTWorkTypesSnapshotRequest struct {
	SiteID  int    `query:"siteId" doc:"Optional filter by lookup site ID"`
	GroupID int    `query:"groupId" doc:"Optional filter by lookup group ID"`
	Keyword string `query:"keyword" doc:"Optional filter by lookup keyword (exact, including leading spaces)"`
}

type DLTWorkTypesSnapshotResponse struct {
	Body struct {
		FetchedAt time.Time     `json:"fetched_at" doc:"When the stored data was last fetched from upstream"`
		WorkTypes []DLTWorkType `json:"work_types"`
	}
}

type DLTSlotsSnapshotRequest struct {
	WorkTypeID  int    `query:"workTypeId" doc:"Work type the snapshot belongs to"`
	CurrentDate string `query:"currentDate" doc:"Optional currentDate param the snapshot was fetched with"`
}

type DLTSlotsSnapshotResponse struct {
	Body struct {
		FetchedAt   time.Time    `json:"fetched_at" doc:"When the snapshot was fetched from upstream"`
		CurrentDate string       `json:"current_date" doc:"currentDate param used for the stored fetch"`
		Data        []DLTSlotDay `json:"data" doc:"Slot days exactly as fetched from upstream"`
	}
}

type DLTSlotHistoryRequest struct {
	WorkTypeID int `query:"workTypeId" doc:"Work type whose stored slot observations should be summarized"`
	Limit      int `query:"limit" doc:"Maximum observations to return (default 20, max 100)"`
}

type DLTSlotHistoryEntry struct {
	ObservationID  int64          `json:"observation_id" doc:"Stable stored observation identifier"`
	FetchedAt      time.Time      `json:"fetched_at" doc:"When this observation was fetched from upstream"`
	CurrentDate    string         `json:"current_date" doc:"currentDate parameter used for this observation"`
	Status         string         `json:"status" doc:"Stored availability state: available, full, or no_slots"`
	Comparison     string         `json:"comparison" doc:"Comparison with the next older loaded observation: no_baseline, unchanged, changed, or not_comparable"`
	PreviousStatus string         `json:"previous_status,omitempty" doc:"Older summarized status when comparison is changed"`
	TotalDays      int            `json:"total_days"`
	AvailableDays  int            `json:"available_days"`
	FirstAvailable *DLTCompareDay `json:"first_available,omitempty" doc:"Earliest day whose exact upstream message is not the full marker"`
}

type DLTSlotHistoryResponse struct {
	Body struct {
		WorkTypeID int                   `json:"work_type_id"`
		Snapshots  []DLTSlotHistoryEntry `json:"snapshots"`
	}
}

type DLTCompareRequest struct {
	SiteIDs     string `query:"siteIds" doc:"Comma-separated office sit_id list, 1-8 entries"`
	Keyword     string `query:"keyword" doc:"Work option keyword, exact upstream string including leading space"`
	GroupID     int    `query:"groupId" doc:"Work group ID (default 4)"`
	CurrentDate string `query:"currentDate" doc:"Slot lookup date YYYY-MM-DD (default: server today)"`
}

// DLTCompareDay is one upstream slot day reduced to the fields the comparison
// needs; message and color pass through exactly as upstream returned them.
type DLTCompareDay struct {
	Date    string `json:"date"`
	Message string `json:"message"`
	Color   string `json:"color"`
}

type DLTCompareOfficeResult struct {
	SiteID         int            `json:"sit_id"`
	WorkType       *DLTWorkType   `json:"work_type,omitempty" doc:"Resolved work type; absent when none matched or lookup failed"`
	Source         string         `json:"source,omitempty" doc:"Where slot data came from: live or snapshot"`
	FetchedAt      *time.Time     `json:"fetched_at,omitempty" doc:"When snapshot slot data was originally fetched"`
	TotalDays      int            `json:"total_days"`
	AvailableDays  int            `json:"available_days"`
	FirstAvailable *DLTCompareDay `json:"first_available,omitempty" doc:"Earliest day whose upstream message is not the full marker"`
	Error          string         `json:"error,omitempty" doc:"Set when neither live nor stored data was usable"`
}

type DLTCompareResponse struct {
	Body struct {
		Keyword     string                   `json:"keyword"`
		GroupID     int                      `json:"group_id"`
		CurrentDate string                   `json:"current_date"`
		Results     []DLTCompareOfficeResult `json:"results" doc:"One entry per requested office, in request order"`
	}
}

type DLTMapAvailabilityRequest struct {
	Keyword     string `query:"keyword" doc:"Work option keyword, exact upstream string including leading space"`
	GroupID     int    `query:"groupId" doc:"Work group ID (default 4)"`
	CurrentDate string `query:"currentDate" doc:"Ignore stored slot days before this YYYY-MM-DD date (default: server today)"`
}

type DLTMapAvailabilityResult struct {
	SiteID              int            `json:"sit_id"`
	Status              string         `json:"status" doc:"Last-known status: available, full, no_slots, not_offered, or unknown"`
	WorkType            *DLTWorkType   `json:"work_type,omitempty"`
	WorkTypesFetchedAt  time.Time      `json:"work_types_fetched_at"`
	SlotsFetchedAt      *time.Time     `json:"slots_fetched_at,omitempty"`
	SnapshotCurrentDate string         `json:"snapshot_current_date,omitempty"`
	TotalDays           int            `json:"total_days" doc:"Stored days on or after current_date"`
	AvailableDays       int            `json:"available_days"`
	FirstAvailable      *DLTCompareDay `json:"first_available,omitempty"`
}

type DLTMapAvailabilityResponse struct {
	Body struct {
		Keyword     string                     `json:"keyword"`
		GroupID     int                        `json:"group_id"`
		CurrentDate string                     `json:"current_date"`
		Results     []DLTMapAvailabilityResult `json:"results" doc:"Stored office lookups only; absent offices are unknown"`
	}
}

type DLTFetchRecord struct {
	Kind       string         `json:"kind"`
	Params     map[string]any `json:"params"`
	OK         bool           `json:"ok"`
	Error      string         `json:"error,omitempty"`
	DurationMS int64          `json:"duration_ms"`
	FetchedAt  time.Time      `json:"fetched_at"`
}

type DLTFetchesRequest struct {
	Limit int `query:"limit" doc:"Max entries to return (default 20, max 100)"`
}

type DLTFetchesResponse struct {
	Body []DLTFetchRecord
}
