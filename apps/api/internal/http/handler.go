package http

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/repo"
	"github.com/starter/api/internal/service"
)

func RegisterRoutes(api huma.API, svc *service.AIService) {
	registerSystemRoutes(api)
	registerStarterRoutes(api, svc)
	registerDLTRoutes(api, svc)
}

func registerSystemRoutes(api huma.API) {
	huma.Register(api, huma.Operation{
		OperationID: "healthz",
		Method:      "GET",
		Path:        "/healthz",
		Summary:     "Health Check",
	}, func(ctx context.Context, input *struct{}) (*struct {
		Body struct {
			Status string `json:"status"`
		}
	}, error) {
		resp := &struct {
			Body struct {
				Status string `json:"status"`
			}
		}{}
		resp.Body.Status = "ok"
		return resp, nil
	})
}

func registerStarterRoutes(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "plan-agent",
		Method:      "POST",
		Path:        "/v1/agent/plan",
		Summary:     "Generate a plan",
	}, func(ctx context.Context, input *dto.PlanRequest) (*dto.PlanResponse, error) {
		steps, err := svc.PlanAgent(ctx, input.Body.Goal)
		if err != nil {
			return nil, err
		}
		resp := &dto.PlanResponse{}
		resp.Body.Steps = steps
		return resp, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "analyze-idea",
		Method:      "POST",
		Path:        "/v1/ideas/analyze",
		Summary:     "Analyze an idea",
	}, func(ctx context.Context, input *dto.AnalyzeRequest) (*dto.AnalyzeResponse, error) {
		summary, score, tags, err := svc.AnalyzeIdea(ctx, input.Body.Text)
		if err != nil {
			return nil, err
		}
		resp := &dto.AnalyzeResponse{}
		resp.Body.Summary = summary
		resp.Body.Score = score
		resp.Body.Tags = tags
		return resp, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "get-run",
		Method:      "GET",
		Path:        "/v1/runs/{id}",
		Summary:     "Get run status",
	}, func(ctx context.Context, input *dto.RunRequest) (*dto.RunResponse, error) {
		run, err := svc.GetRun(ctx, input.ID)
		if err != nil {
			return nil, err
		}
		resp := &dto.RunResponse{}
		resp.Body.ID = run.ID
		resp.Body.Status = run.Status
		resp.Body.ResultJSON = run.ResultJSON
		resp.Body.CreatedAt = run.CreatedAt.String()
		return resp, nil
	})
}

func registerDLTRoutes(api huma.API, svc *service.AIService) {
	registerDLTOfficesRoute(api, svc)
	registerDLTWorkAvailabilityRoute(api, svc)
	registerDLTVehiclesRoute(api, svc)
	registerDLTWorkTypesRoute(api, svc)
	registerDLTHolidaysRoute(api, svc)
	registerDLTSlotsRoute(api, svc)
	registerDLTSnapshotRoutes(api, svc)
	registerDLTFetchesRoute(api, svc)
}

// mapStoreErr converts store errors into HTTP errors for snapshot reads:
// missing data is 404, everything else (no store, connection lost, query
// failure) means persistence is effectively unavailable — 503.
func mapStoreErr(err error) error {
	if errors.Is(err, repo.ErrNotFound) {
		return huma.Error404NotFound("no snapshot stored yet; run the matching live lookup first", err)
	}
	if errors.Is(err, service.ErrPersistenceUnavailable) {
		return huma.Error503ServiceUnavailable("persistence unavailable; start PostgreSQL and restart the API", err)
	}
	return huma.Error503ServiceUnavailable("persistence unavailable", err)
}

func registerDLTOfficesRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-offices",
		Method:      "GET",
		Path:        "/v1/dlt/offices",
		Summary:     "List DLT offices",
	}, func(ctx context.Context, input *struct{}) (*dto.DLTOfficesResponse, error) {
		offices, err := svc.DLTOffices(ctx)
		if err != nil {
			return nil, err
		}
		return &dto.DLTOfficesResponse{Body: offices}, nil
	})
}

func registerDLTWorkAvailabilityRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-work-availability",
		Method:      "GET",
		Path:        "/v1/dlt/offices/{siteId}/work-availability",
		Summary:     "Get DLT work availability by office",
	}, func(ctx context.Context, input *dto.DLTWorkAvailabilityRequest) (*dto.DLTWorkAvailabilityResponse, error) {
		availability, err := svc.DLTWorkAvailability(ctx, input.SiteID)
		if err != nil {
			return nil, err
		}
		return &dto.DLTWorkAvailabilityResponse{Body: availability}, nil
	})
}

func registerDLTVehiclesRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-vehicles",
		Method:      "GET",
		Path:        "/v1/dlt/vehicles",
		Summary:     "List DLT vehicle types",
	}, func(ctx context.Context, input *struct{}) (*dto.DLTVehiclesResponse, error) {
		vehicles, err := svc.DLTVehicles(ctx)
		if err != nil {
			return nil, err
		}
		return &dto.DLTVehiclesResponse{Body: vehicles}, nil
	})
}

func registerDLTWorkTypesRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-work-types",
		Method:      "GET",
		Path:        "/v1/dlt/work-types",
		Summary:     "List DLT work types",
	}, func(ctx context.Context, input *dto.DLTWorkTypesRequest) (*dto.DLTWorkTypesResponse, error) {
		if input.SiteID <= 0 {
			return nil, huma.Error400BadRequest("siteId must be greater than zero", errors.New("invalid siteId"))
		}
		if input.GroupID <= 0 {
			return nil, huma.Error400BadRequest("groupId must be greater than zero", errors.New("invalid groupId"))
		}
		if input.Keyword == "" {
			return nil, huma.Error400BadRequest("keyword is required", errors.New("missing keyword"))
		}

		workTypes, err := svc.DLTWorkTypes(ctx, input.SiteID, input.GroupID, input.Keyword)
		if err != nil {
			return nil, err
		}
		return &dto.DLTWorkTypesResponse{Body: workTypes}, nil
	})
}

func registerDLTHolidaysRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-holidays",
		Method:      "GET",
		Path:        "/v1/dlt/work-types/{workTypeId}/holidays",
		Summary:     "List DLT holidays by work type",
	}, func(ctx context.Context, input *dto.DLTHolidaysRequest) (*dto.DLTHolidaysResponse, error) {
		if input.WorkTypeID <= 0 {
			return nil, huma.Error400BadRequest("workTypeId must be greater than zero", errors.New("invalid workTypeId"))
		}

		holidays, err := svc.DLTHolidays(ctx, input.WorkTypeID)
		if err != nil {
			return nil, err
		}
		return &dto.DLTHolidaysResponse{Body: holidays}, nil
	})
}

func registerDLTSnapshotRoutes(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-snapshot-offices",
		Method:      "GET",
		Path:        "/v1/dlt/snapshots/offices",
		Summary:     "Last stored DLT offices with freshness",
	}, func(ctx context.Context, input *struct{}) (*dto.DLTOfficesSnapshotResponse, error) {
		offices, fetchedAt, err := svc.DLTSnapshotOffices(ctx)
		if err != nil {
			return nil, mapStoreErr(err)
		}
		resp := &dto.DLTOfficesSnapshotResponse{}
		resp.Body.FetchedAt = fetchedAt
		resp.Body.Offices = offices
		return resp, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "dlt-snapshot-work-types",
		Method:      "GET",
		Path:        "/v1/dlt/snapshots/work-types",
		Summary:     "Last stored DLT work types with freshness",
	}, func(ctx context.Context, input *dto.DLTWorkTypesSnapshotRequest) (*dto.DLTWorkTypesSnapshotResponse, error) {
		workTypes, fetchedAt, err := svc.DLTSnapshotWorkTypes(ctx, input.SiteID, input.GroupID, input.Keyword)
		if err != nil {
			return nil, mapStoreErr(err)
		}
		resp := &dto.DLTWorkTypesSnapshotResponse{}
		resp.Body.FetchedAt = fetchedAt
		resp.Body.WorkTypes = workTypes
		return resp, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "dlt-snapshot-slots",
		Method:      "GET",
		Path:        "/v1/dlt/snapshots/slots",
		Summary:     "Latest stored DLT slot snapshot for a work type",
	}, func(ctx context.Context, input *dto.DLTSlotsSnapshotRequest) (*dto.DLTSlotsSnapshotResponse, error) {
		if input.WorkTypeID <= 0 {
			return nil, huma.Error400BadRequest("workTypeId must be greater than zero", errors.New("invalid workTypeId"))
		}
		if input.CurrentDate != "" {
			if _, err := time.Parse("2006-01-02", input.CurrentDate); err != nil {
				return nil, huma.Error400BadRequest("currentDate must use YYYY-MM-DD format", err)
			}
		}

		payload, currentDate, fetchedAt, err := svc.DLTSnapshotSlots(ctx, input.WorkTypeID, input.CurrentDate)
		if err != nil {
			return nil, mapStoreErr(err)
		}
		resp := &dto.DLTSlotsSnapshotResponse{}
		resp.Body.FetchedAt = fetchedAt
		resp.Body.CurrentDate = currentDate
		if err := json.Unmarshal(payload, &resp.Body.Data); err != nil {
			return nil, huma.Error500InternalServerError("decode stored slot snapshot", err)
		}
		return resp, nil
	})
}

func registerDLTFetchesRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-fetches",
		Method:      "GET",
		Path:        "/v1/dlt/fetches",
		Summary:     "Recent upstream fetch metadata, newest first",
	}, func(ctx context.Context, input *dto.DLTFetchesRequest) (*dto.DLTFetchesResponse, error) {
		limit := input.Limit
		if limit <= 0 {
			limit = 20
		}
		if limit > 100 {
			limit = 100
		}

		fetches, err := svc.DLTFetches(ctx, limit)
		if err != nil {
			return nil, mapStoreErr(err)
		}
		records := make([]dto.DLTFetchRecord, 0, len(fetches))
		for _, rec := range fetches {
			records = append(records, dto.DLTFetchRecord{
				Kind:       rec.Kind,
				Params:     rec.Params,
				OK:         rec.OK,
				Error:      rec.ErrorText,
				DurationMS: rec.DurationMS,
				FetchedAt:  rec.FetchedAt,
			})
		}
		return &dto.DLTFetchesResponse{Body: records}, nil
	})
}

func registerDLTSlotsRoute(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "dlt-list-slots",
		Method:      "GET",
		Path:        "/v1/dlt/work-types/{workTypeId}/slots",
		Summary:     "List DLT slot availability by work type",
	}, func(ctx context.Context, input *dto.DLTSlotsRequest) (*dto.DLTSlotsResponse, error) {
		if input.WorkTypeID <= 0 {
			return nil, huma.Error400BadRequest("workTypeId must be greater than zero", errors.New("invalid workTypeId"))
		}
		if input.CurrentDate == "" {
			return nil, huma.Error400BadRequest("currentDate is required", errors.New("missing currentDate"))
		}
		if _, err := time.Parse("2006-01-02", input.CurrentDate); err != nil {
			return nil, huma.Error400BadRequest("currentDate must use YYYY-MM-DD format", err)
		}

		slots, err := svc.DLTSlots(ctx, input.WorkTypeID, input.CurrentDate)
		if err != nil {
			return nil, err
		}
		return &dto.DLTSlotsResponse{Body: slots}, nil
	})
}
