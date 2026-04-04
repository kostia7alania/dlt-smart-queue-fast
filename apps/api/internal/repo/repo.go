package repo

import (
	"context"
	"time"

	"github.com/starter/api/internal/model"
)

type RunRepo struct {
	// Placeholder for DB connection
}

func NewRunRepo() *RunRepo {
	return &RunRepo{}
}

func (r *RunRepo) GetRun(ctx context.Context, id string) (*model.Run, error) {
	// Mock DB retrieval
	return &model.Run{
		ID:         id,
		Status:     "completed",
		ResultJSON: `{"status": "ok"}`,
		CreatedAt:  time.Now(),
	}, nil
}
