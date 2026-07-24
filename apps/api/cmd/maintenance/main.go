package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/config"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/internal/repo"
	"github.com/kostia7alania/dlt-smart-queue-fast/apps/api/migrations"
)

type retentionConfig struct {
	slotDays  int
	fetchDays int
}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load configuration: %v", err)
	}
	retention, err := loadRetention()
	if err != nil {
		log.Fatalf("load retention configuration: %v", err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	if err := run(ctx, cfg, retention, time.Now().UTC()); err != nil {
		log.Fatalf("maintenance failed: %v", err)
	}
}

func loadRetention() (retentionConfig, error) {
	slotDays, err := positiveDays("SLOT_SNAPSHOT_RETENTION_DAYS", 365)
	if err != nil {
		return retentionConfig{}, err
	}
	fetchDays, err := positiveDays("FETCH_LOG_RETENTION_DAYS", 30)
	if err != nil {
		return retentionConfig{}, err
	}
	return retentionConfig{slotDays: slotDays, fetchDays: fetchDays}, nil
}

func positiveDays(name string, fallback int) (int, error) {
	raw := os.Getenv(name)
	if raw == "" {
		return fallback, nil
	}
	value, err := strconv.Atoi(raw)
	if err != nil || value <= 0 {
		return 0, fmt.Errorf("%s must be a positive integer", name)
	}
	return value, nil
}

func run(ctx context.Context, cfg *config.Config, retention retentionConfig, now time.Time) error {
	poolConfig, err := pgxpool.ParseConfig(cfg.DatabaseURL)
	if err != nil {
		return fmt.Errorf("parse DATABASE_URL: %w", err)
	}
	poolConfig.MaxConns = cfg.DBMaxConns
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return fmt.Errorf("connect to PostgreSQL: %w", err)
	}
	defer pool.Close()
	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("ping PostgreSQL: %w", err)
	}
	if err := repo.Migrate(ctx, pool, migrations.Files); err != nil {
		return fmt.Errorf("migrate PostgreSQL: %w", err)
	}

	result, err := repo.NewPGStore(pool).PruneOperationalData(
		ctx,
		now.AddDate(0, 0, -retention.slotDays),
		now.AddDate(0, 0, -retention.fetchDays),
	)
	if err != nil {
		return err
	}
	log.Printf("maintenance complete: pruned %d slot snapshots and %d fetch records", result.SlotSnapshots, result.Fetches)
	return nil
}
