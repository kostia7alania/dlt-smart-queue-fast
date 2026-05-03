package http

import (
	"context"

	"github.com/danielgtaylor/huma/v2"
	"github.com/starter/api/internal/dto"
	"github.com/starter/api/internal/service"
)

func RegisterRoutes(api huma.API, svc *service.AIService) {
	huma.Register(api, huma.Operation{
		OperationID: "healthz",
		Method:      "GET",
		Path:        "/healthz",
		Summary:     "Health Check",
	}, func(ctx context.Context, input *struct{}) (*struct{ Body struct{ Status string `json:"status"` } }, error) {
		resp := &struct{ Body struct{ Status string `json:"status"` } }{}
		resp.Body.Status = "ok"
		return resp, nil
	})

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
