package dto

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
