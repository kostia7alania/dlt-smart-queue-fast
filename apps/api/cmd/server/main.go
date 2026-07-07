package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/starter/api/internal/config"
	myhttp "github.com/starter/api/internal/http"
	"github.com/starter/api/internal/repo"
	"github.com/starter/api/internal/service"
	"github.com/starter/api/migrations"
)

func main() {
	cfg := config.Load()

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)

	// Provide CORS middleware for local dev
	router.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	apiConfig := huma.DefaultConfig("AI Starter API", "1.0.0")
	api := humachi.New(router, apiConfig)

	svc := service.NewAIService(cfg.DLTAPIBaseURL, cfg.DLTWorkFilterToken)

	if store := newStore(cfg.DatabaseURL); store != nil {
		svc.SetStore(store)
	}

	myhttp.RegisterRoutes(api, svc)

	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server starting on %s...", addr)
	log.Printf("OpenAPI docs available at http://localhost%s/docs", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}

// newStore connects to PostgreSQL and applies migrations. On any failure it
// returns nil so the API keeps serving live upstream data without persistence.
func newStore(databaseURL string) *repo.PGStore {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, databaseURL)
	if err == nil {
		err = pool.Ping(ctx)
	}
	if err == nil {
		err = repo.Migrate(ctx, pool, migrations.Files)
	}
	if err != nil {
		if pool != nil {
			pool.Close()
		}
		log.Printf("WARN: persistence disabled (live-only mode): %v", err)
		return nil
	}

	log.Printf("Persistence enabled: migrations applied")
	return repo.NewPGStore(pool)
}
