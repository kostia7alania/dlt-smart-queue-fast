package http

import (
	"testing"

	"github.com/danielgtaylor/huma/v2/humatest"
	"github.com/starter/api/internal/service"
)

func TestDLTSlotsRejectsMalformedCurrentDate(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/work-types/111093/slots?currentDate=not-a-date")
	if resp.Code != 400 {
		t.Fatalf("expected 400 for malformed currentDate, got %d", resp.Code)
	}
}

func TestDLTSlotsRejectsMissingCurrentDate(t *testing.T) {
	_, api := humatest.New(t)
	svc := service.NewAIService("http://127.0.0.1:0", "")
	RegisterRoutes(api, svc)

	resp := api.Get("/v1/dlt/work-types/111093/slots")
	if resp.Code != 400 {
		t.Fatalf("expected 400 for missing currentDate, got %d", resp.Code)
	}
}
