package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humachi"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/config"
	myhttp "github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/http"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/repo"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/service"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/migrations"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load configuration: %v", err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if err := run(ctx, cfg); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func run(ctx context.Context, cfg *config.Config) error {
	store, err := newStore(cfg)
	if err != nil {
		return err
	}
	if store != nil {
		defer store.Close()
	}

	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(corsMiddleware(cfg.CORSAllowedOrigins))

	apiConfig := huma.DefaultConfig("DLT Smart Queue API", "1.0.0")
	api := humachi.New(router, apiConfig)
	svc := service.NewAIServiceWithConcurrency(
		cfg.DLTAPIBaseURL,
		cfg.DLTWorkFilterToken,
		cfg.DLTMaxConcurrency,
	)
	if store != nil {
		svc.SetStore(store)
	}
	myhttp.RegisterRoutes(api, svc)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       20 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	errs := make(chan error, 1)
	go func() {
		log.Printf("server starting on %s", server.Addr)
		errs <- server.ListenAndServe()
	}()

	select {
	case err := <-errs:
		if errors.Is(err, http.ErrServerClosed) {
			return nil
		}
		return err
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("graceful shutdown: %w", err)
		}
		err := <-errs
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return err
		}
		return nil
	}
}

// newStore connects to PostgreSQL and applies migrations. Local development
// can fall back to live-only mode; production sets DATABASE_REQUIRED=true.
func newStore(cfg *config.Config) (*repo.PGStore, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	poolConfig, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err == nil {
		poolConfig.MaxConns = cfg.DBMaxConns
	}
	var pool *pgxpool.Pool
	if err == nil {
		pool, err = pgxpool.NewWithConfig(ctx, poolConfig)
	}
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
		if cfg.DatabaseRequired {
			return nil, fmt.Errorf("required persistence unavailable: %w", err)
		}
		log.Printf("WARN: persistence disabled (live-only mode): %v", err)
		return nil, nil
	}

	log.Printf("persistence enabled: migrations applied")
	return repo.NewPGStore(pool), nil
}
