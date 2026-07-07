package dto

import "time"

type PlanRequest struct {
	Body struct {
		Goal string `json:"goal" doc:"The goal to plan for"`
	}
}

type PlanResponse struct {
	Body struct {
		Steps []string `json:"steps" doc:"List of planned steps"`
	}
}

type AnalyzeRequest struct {
	Body struct {
		Text string `json:"text" doc:"The idea to analyze"`
	}
}

type AnalyzeResponse struct {
	Body struct {
		Summary string   `json:"summary"`
		Score   int      `json:"score"`
		Tags    []string `json:"tags"`
	}
}

type RunRequest struct {
	ID string `path:"id" doc:"Run ID"`
}

type RunResponse struct {
	Body struct {
		ID         string `json:"id"`
		Status     string `json:"status"`
		ResultJSON string `json:"result_json"`
		CreatedAt  string `json:"created_at"`
	}
}

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
