package repo

import (
	"context"
	"fmt"
	"os"
	"strings"
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
	oldSlotsAt := firstFetch.Add(10 * time.Second)
	latestSlotsAt := firstFetch.Add(20 * time.Second)
	if err := store.InsertSlotSnapshot(ctx, 111093, "2026-07-18", []byte(`[{"date":"2026-07-20","message":"เต็ม","color":"#FF0000","siteopen":[]}]`), oldSlotsAt); err != nil {
		t.Fatalf("store old slot snapshot: %v", err)
	}
	if err := store.InsertSlotSnapshot(ctx, 111093, "2026-07-19", []byte(`[{"date":"2026-07-21","message":"Seat left 4","color":"#00FF00","siteopen":[]}]`), latestSlotsAt); err != nil {
		t.Fatalf("store latest slot snapshot: %v", err)
	}
	mapSnapshots, err := store.LatestMapAvailabilitySnapshots(ctx, lookup.groupID, lookup.keyword)
	if err != nil {
		t.Fatalf("read map availability snapshots: %v", err)
	}
	if len(mapSnapshots) != 1 || mapSnapshots[0].SiteID != lookup.siteID || mapSnapshots[0].WorkType == nil ||
		mapSnapshots[0].WorkType.WorkID != 111093 || mapSnapshots[0].SnapshotCurrentDate != "2026-07-19" ||
		mapSnapshots[0].SlotsFetchedAt == nil || !mapSnapshots[0].SlotsFetchedAt.Equal(latestSlotsAt) ||
		!strings.Contains(string(mapSnapshots[0].SlotPayload), "Seat left 4") {
		t.Fatalf("expected latest joined map snapshot, got %+v", mapSnapshots)
	}

	tiedSlotsAt := latestSlotsAt.Add(time.Minute)
	if err := store.InsertSlotSnapshot(ctx, 111093, "2026-07-20", []byte(`[{"date":"2026-07-22","message":"Seat left 3","color":"#00AA00","siteopen":[]}]`), tiedSlotsAt); err != nil {
		t.Fatalf("store first tied slot snapshot: %v", err)
	}
	if err := store.InsertSlotSnapshot(ctx, 111093, "2026-07-21", []byte(`[{"date":"2026-07-23","message":"Seat left 2","color":"#009900","siteopen":[]}]`), tiedSlotsAt); err != nil {
		t.Fatalf("store second tied slot snapshot: %v", err)
	}
	if err := store.InsertSlotSnapshot(ctx, 222222, "2026-07-21", []byte(`[]`), tiedSlotsAt.Add(time.Minute)); err != nil {
		t.Fatalf("store other work type snapshot: %v", err)
	}
	history, err := store.SlotSnapshots(ctx, 111093, 2)
	if err != nil {
		t.Fatalf("read slot history: %v", err)
	}
	if len(history) != 2 || history[0].WorkTypeID != 111093 ||
		history[0].CurrentDate != "2026-07-21" ||
		history[1].CurrentDate != "2026-07-20" ||
		!strings.Contains(string(history[0].Payload), "Seat left 2") {
		t.Fatalf("expected deterministic newest-first limited history, got %+v", history)
	}
	emptyHistory, err := store.SlotSnapshots(ctx, 999999, 20)
	if err != nil {
		t.Fatalf("read empty slot history: %v", err)
	}
	if emptyHistory == nil || len(emptyHistory) != 0 {
		t.Fatalf("expected non-nil empty isolated history, got %#v", emptyHistory)
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
	mapSnapshots, err = store.LatestMapAvailabilitySnapshots(ctx, lookup.groupID, lookup.keyword)
	if err != nil {
		t.Fatalf("read map snapshot after empty work types: %v", err)
	}
	if len(mapSnapshots) != 1 || mapSnapshots[0].WorkType != nil || len(mapSnapshots[0].SlotPayload) != 0 {
		t.Fatalf("empty work-type collection must hide stale projection slots, got %+v", mapSnapshots)
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
