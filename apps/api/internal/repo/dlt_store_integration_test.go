package repo

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/starter/api/internal/dto"
	"github.com/starter/api/migrations"
)

func TestPGStoreListSnapshotsPreserveEmptyResults(t *testing.T) {
	databaseURL := os.Getenv("TEST_DATABASE_URL")
	if databaseURL == "" {
		t.Skip("TEST_DATABASE_URL is not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	admin, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		t.Fatalf("connect to test database: %v", err)
	}
	t.Cleanup(admin.Close)

	schema := fmt.Sprintf("test_list_snapshots_%d", time.Now().UnixNano())
	identifier := pgx.Identifier{schema}.Sanitize()
	if _, err := admin.Exec(ctx, "CREATE SCHEMA "+identifier); err != nil {
		t.Fatalf("create test schema: %v", err)
	}
	t.Cleanup(func() {
		cleanupCtx, cleanupCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cleanupCancel()
		if _, err := admin.Exec(cleanupCtx, "DROP SCHEMA "+identifier+" CASCADE"); err != nil {
			t.Errorf("drop test schema: %v", err)
		}
	})

	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		t.Fatalf("parse test database URL: %v", err)
	}
	config.ConnConfig.RuntimeParams["search_path"] = schema
	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		t.Fatalf("connect to isolated test schema: %v", err)
	}
	t.Cleanup(pool.Close)

	if err := Migrate(ctx, pool, migrations.Files); err != nil {
		t.Fatalf("apply migrations: %v", err)
	}

	store := NewPGStore(pool)
	firstFetch := time.Date(2026, 7, 10, 1, 0, 0, 0, time.UTC)
	emptyFetch := firstFetch.Add(time.Minute)

	if err := store.UpsertOffices(ctx, []dto.DLTOffice{{
		AppOpen: 1,
		SiteID:  47,
		Name:    "Chiangmai Provincial Land Transport Office",
	}}, firstFetch); err != nil {
		t.Fatalf("store non-empty offices: %v", err)
	}
	if err := store.UpsertOffices(ctx, []dto.DLTOffice{}, emptyFetch); err != nil {
		t.Fatalf("store empty offices: %v", err)
	}
	offices, fetchedAt, err := store.LatestOffices(ctx)
	if err != nil {
		t.Fatalf("read empty offices snapshot: %v", err)
	}
	if offices == nil || len(offices) != 0 || !fetchedAt.Equal(emptyFetch) {
		t.Fatalf("expected stored empty offices at %s, got offices=%+v fetchedAt=%s", emptyFetch, offices, fetchedAt)
	}

	lookup := struct {
		siteID  int
		groupID int
		keyword string
	}{siteID: 47, groupID: 4, keyword: " NEW THAI"}
	if err := store.UpsertWorkTypes(ctx, lookup.siteID, lookup.groupID, lookup.keyword, []dto.DLTWorkType{{
		Name:      "ชาวต่างชาติ: NEW THAI DRIVING LICENCE",
		WorkID:    111093,
		Status:    1,
		DateStart: "2022-05-04T00:00:00.000Z",
	}}, firstFetch); err != nil {
		t.Fatalf("store non-empty work types: %v", err)
	}
	if err := store.UpsertWorkTypes(ctx, lookup.siteID, lookup.groupID, lookup.keyword, []dto.DLTWorkType{}, emptyFetch); err != nil {
		t.Fatalf("store empty work types: %v", err)
	}
	workTypes, fetchedAt, err := store.LatestWorkTypes(ctx, lookup.siteID, lookup.groupID, lookup.keyword)
	if err != nil {
		t.Fatalf("read empty work-types snapshot: %v", err)
	}
	if workTypes == nil || len(workTypes) != 0 || !fetchedAt.Equal(emptyFetch) {
		t.Fatalf("expected stored empty work types at %s, got workTypes=%+v fetchedAt=%s", emptyFetch, workTypes, fetchedAt)
	}

	var typedOfficeCount, typedWorkTypeCount int
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM dlt_offices`).Scan(&typedOfficeCount); err != nil {
		t.Fatalf("count typed offices: %v", err)
	}
	if err := pool.QueryRow(ctx, `SELECT count(*) FROM dlt_work_types`).Scan(&typedWorkTypeCount); err != nil {
		t.Fatalf("count typed work types: %v", err)
	}
	if typedOfficeCount != 1 || typedWorkTypeCount != 1 {
		t.Fatalf("expected typed projections to remain queryable, got offices=%d workTypes=%d", typedOfficeCount, typedWorkTypeCount)
	}
}
