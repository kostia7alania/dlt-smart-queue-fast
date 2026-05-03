package service

import (
	"context"
	"fmt"

	"github.com/starter/api/internal/model"
	"github.com/starter/api/internal/repo"
)

type AIService struct {
	runRepo *repo.RunRepo
}

func NewAIService() *AIService {
	return &AIService{
		runRepo: repo.NewRunRepo(),
	}
}

func (s *AIService) PlanAgent(ctx context.Context, goal string) ([]string, error) {
	// Mock AI logic
	return []string{
		fmt.Sprintf("Analyze goal: %s", goal),
		"Generate initial structure",
		"Review and refine",
	}, nil
}

func (s *AIService) AnalyzeIdea(ctx context.Context, text string) (summary string, score int, tags []string, err error) {
	// Mock AI logic
	summary = fmt.Sprintf("Idea analysis: %s", text)
	score = 85
	tags = []string{"innovative", "software"}
	return
}

func (s *AIService) GetRun(ctx context.Context, id string) (*model.Run, error) {
	return s.runRepo.GetRun(ctx, id)
}
