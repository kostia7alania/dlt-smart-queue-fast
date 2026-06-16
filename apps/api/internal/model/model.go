package model

import "time"

type Run struct {
	ID         string    `json:"id"`
	Status     string    `json:"status"`
	ResultJSON string    `json:"result_json"`
	CreatedAt  time.Time `json:"created_at"`
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
