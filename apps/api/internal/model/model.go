package model

import "time"

type Run struct {
	ID         string    `json:"id"`
	Status     string    `json:"status"`
	ResultJSON string    `json:"result_json"`
	CreatedAt  time.Time `json:"created_at"`
}
