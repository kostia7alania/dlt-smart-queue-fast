package repo

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/starter/api/internal/dto"
)

// ErrNotFound is returned by snapshot reads when nothing is stored yet.
var ErrNotFound = errors.New("not found")

// FetchRecord is one row of the upstream fetch log.
type FetchRecord struct {
	Kind       string
	Params     map[string]any
	OK         bool
	ErrorText  string
	DurationMS int64
	FetchedAt  time.Time
}

// MapAvailabilitySnapshot joins one complete work-type lookup with the latest
// stored slots for its first work type. A nil WorkType is an authoritative
// successful empty lookup; a nil SlotPayload means no slots were stored yet.
type MapAvailabilitySnapshot struct {
	SiteID              int
	WorkType            *dto.DLTWorkType
	WorkTypesFetchedAt  time.Time
	SlotPayload         json.RawMessage
	SnapshotCurrentDate string
	SlotsFetchedAt      *time.Time
}

// PGStore persists DLT data in PostgreSQL using plain SQL.
type PGStore struct {
	pool *pgxpool.Pool
}

func NewPGStore(pool *pgxpool.Pool) *PGStore {
	return &PGStore{pool: pool}
}

func (s *PGStore) UpsertOffices(ctx context.Context, offices []dto.DLTOffice, fetchedAt time.Time) error {
	payload, err := json.Marshal(offices)
	if err != nil {
		return fmt.Errorf("encode offices snapshot: %w", err)
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin offices upsert: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	for _, office := range offices {
		_, err := tx.Exec(ctx, `INSERT INTO dlt_offices (sit_id, sit_name, app_open, fetched_at)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (sit_id) DO UPDATE SET
				sit_name = EXCLUDED.sit_name,
				app_open = EXCLUDED.app_open,
				fetched_at = EXCLUDED.fetched_at`,
			office.SiteID, office.Name, office.AppOpen, fetchedAt)
		if err != nil {
			return fmt.Errorf("upsert office %d: %w", office.SiteID, err)
		}
	}
	_, err = tx.Exec(ctx, `INSERT INTO dlt_offices_snapshot (singleton, payload, fetched_at)
		VALUES (TRUE, $1, $2)
		ON CONFLICT (singleton) DO UPDATE SET
			payload = EXCLUDED.payload,
			fetched_at = EXCLUDED.fetched_at`,
		string(payload), fetchedAt)
	if err != nil {
		return fmt.Errorf("store offices snapshot: %w", err)
	}
	return tx.Commit(ctx)
}

func (s *PGStore) UpsertWorkTypes(ctx context.Context, siteID, groupID int, keyword string, workTypes []dto.DLTWorkType, fetchedAt time.Time) error {
	payload, err := json.Marshal(workTypes)
	if err != nil {
		return fmt.Errorf("encode work types snapshot: %w", err)
	}

	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin work types upsert: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	for _, workType := range workTypes {
		_, err := tx.Exec(ctx, `INSERT INTO dlt_work_types
			(tyw_id, site_id, group_id, keyword, tyw_name, tyw_status, tyw_datestart, fetched_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			ON CONFLICT (tyw_id) DO UPDATE SET
				site_id = EXCLUDED.site_id,
				group_id = EXCLUDED.group_id,
				keyword = EXCLUDED.keyword,
				tyw_name = EXCLUDED.tyw_name,
				tyw_status = EXCLUDED.tyw_status,
				tyw_datestart = EXCLUDED.tyw_datestart,
				fetched_at = EXCLUDED.fetched_at`,
			workType.WorkID, siteID, groupID, keyword,
			workType.Name, workType.Status, workType.DateStart, fetchedAt)
		if err != nil {
			return fmt.Errorf("upsert work type %d: %w", workType.WorkID, err)
		}
	}
	_, err = tx.Exec(ctx, `INSERT INTO dlt_work_type_snapshots
		(site_id, group_id, keyword, payload, fetched_at)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (site_id, group_id, keyword) DO UPDATE SET
			payload = EXCLUDED.payload,
			fetched_at = EXCLUDED.fetched_at`,
		siteID, groupID, keyword, string(payload), fetchedAt)
	if err != nil {
		return fmt.Errorf("store work types snapshot: %w", err)
	}
	return tx.Commit(ctx)
}

func (s *PGStore) InsertSlotSnapshot(ctx context.Context, workTypeID int, currentDate string, payload []byte, fetchedAt time.Time) error {
	_, err := s.pool.Exec(ctx, `INSERT INTO dlt_slot_snapshots
		(tyw_id, current_date_param, payload, fetched_at)
		VALUES ($1, $2, $3, $4)`,
		workTypeID, currentDate, string(payload), fetchedAt)
	if err != nil {
		return fmt.Errorf("insert slot snapshot for %d: %w", workTypeID, err)
	}
	return nil
}

func (s *PGStore) RecordFetch(ctx context.Context, rec FetchRecord) error {
	params := rec.Params
	if params == nil {
		params = map[string]any{}
	}
	encoded, err := json.Marshal(params)
	if err != nil {
		return fmt.Errorf("encode fetch params: %w", err)
	}

	var errorText *string
	if rec.ErrorText != "" {
		errorText = &rec.ErrorText
	}
	_, err = s.pool.Exec(ctx, `INSERT INTO dlt_fetches
		(kind, params, ok, error_text, duration_ms, fetched_at)
		VALUES ($1, $2, $3, $4, $5, $6)`,
		rec.Kind, string(encoded), rec.OK, errorText, rec.DurationMS, rec.FetchedAt)
	if err != nil {
		return fmt.Errorf("record fetch %q: %w", rec.Kind, err)
	}
	return nil
}

func (s *PGStore) LatestOffices(ctx context.Context) ([]dto.DLTOffice, time.Time, error) {
	var payload string
	var fetchedAt time.Time
	err := s.pool.QueryRow(ctx,
		`SELECT payload::text, fetched_at FROM dlt_offices_snapshot WHERE singleton = TRUE`).
		Scan(&payload, &fetchedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		// Databases upgraded from the pre-007 schema may have typed rows but no
		// complete list snapshot until the next successful live fetch.
		return s.latestOfficesProjection(ctx)
	}
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("query offices snapshot: %w", err)
	}

	var offices []dto.DLTOffice
	if err := json.Unmarshal([]byte(payload), &offices); err != nil {
		return nil, time.Time{}, fmt.Errorf("decode offices snapshot: %w", err)
	}
	return offices, fetchedAt, nil
}

func (s *PGStore) latestOfficesProjection(ctx context.Context) ([]dto.DLTOffice, time.Time, error) {
	rows, err := s.pool.Query(ctx,
		`SELECT sit_id, sit_name, app_open, fetched_at FROM dlt_offices ORDER BY sit_id`)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("query offices: %w", err)
	}
	defer rows.Close()

	var offices []dto.DLTOffice
	var latest time.Time
	for rows.Next() {
		var office dto.DLTOffice
		var fetchedAt time.Time
		if err := rows.Scan(&office.SiteID, &office.Name, &office.AppOpen, &fetchedAt); err != nil {
			return nil, time.Time{}, fmt.Errorf("scan office: %w", err)
		}
		if fetchedAt.After(latest) {
			latest = fetchedAt
		}
		offices = append(offices, office)
	}
	if err := rows.Err(); err != nil {
		return nil, time.Time{}, fmt.Errorf("iterate offices: %w", err)
	}
	if len(offices) == 0 {
		return nil, time.Time{}, fmt.Errorf("no offices stored: %w", ErrNotFound)
	}
	return offices, latest, nil
}

func (s *PGStore) LatestWorkTypes(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	var payload string
	var fetchedAt time.Time
	err := s.pool.QueryRow(ctx, `SELECT payload::text, fetched_at
		FROM dlt_work_type_snapshots
		WHERE ($1 = 0 OR site_id = $1)
		  AND ($2 = 0 OR group_id = $2)
		  AND ($3 = '' OR keyword = $3)
		ORDER BY fetched_at DESC
		LIMIT 1`,
		siteID, groupID, keyword).Scan(&payload, &fetchedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		// Preserve legacy typed snapshots across an in-place schema upgrade.
		return s.latestWorkTypesProjection(ctx, siteID, groupID, keyword)
	}
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("query work types snapshot: %w", err)
	}

	var workTypes []dto.DLTWorkType
	if err := json.Unmarshal([]byte(payload), &workTypes); err != nil {
		return nil, time.Time{}, fmt.Errorf("decode work types snapshot: %w", err)
	}
	return workTypes, fetchedAt, nil
}

func (s *PGStore) latestWorkTypesProjection(ctx context.Context, siteID, groupID int, keyword string) ([]dto.DLTWorkType, time.Time, error) {
	rows, err := s.pool.Query(ctx, `SELECT tyw_id, tyw_name, tyw_status, tyw_datestart, fetched_at
		FROM dlt_work_types
		WHERE ($1 = 0 OR site_id = $1)
		  AND ($2 = 0 OR group_id = $2)
		  AND ($3 = '' OR keyword = $3)
		ORDER BY tyw_id`,
		siteID, groupID, keyword)
	if err != nil {
		return nil, time.Time{}, fmt.Errorf("query work types: %w", err)
	}
	defer rows.Close()

	var workTypes []dto.DLTWorkType
	var latest time.Time
	for rows.Next() {
		var workType dto.DLTWorkType
		var fetchedAt time.Time
		if err := rows.Scan(&workType.WorkID, &workType.Name, &workType.Status, &workType.DateStart, &fetchedAt); err != nil {
			return nil, time.Time{}, fmt.Errorf("scan work type: %w", err)
		}
		if fetchedAt.After(latest) {
			latest = fetchedAt
		}
		workTypes = append(workTypes, workType)
	}
	if err := rows.Err(); err != nil {
		return nil, time.Time{}, fmt.Errorf("iterate work types: %w", err)
	}
	if len(workTypes) == 0 {
		return nil, time.Time{}, fmt.Errorf("no work types stored: %w", ErrNotFound)
	}
	return workTypes, latest, nil
}

func (s *PGStore) LatestSlotSnapshot(ctx context.Context, workTypeID int, currentDate string) (json.RawMessage, string, time.Time, error) {
	var payload string
	var storedDate string
	var fetchedAt time.Time
	err := s.pool.QueryRow(ctx, `SELECT payload::text, current_date_param, fetched_at
		FROM dlt_slot_snapshots
		WHERE tyw_id = $1 AND ($2 = '' OR current_date_param = $2)
		ORDER BY fetched_at DESC, id DESC
		LIMIT 1`,
		workTypeID, currentDate).Scan(&payload, &storedDate, &fetchedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, "", time.Time{}, fmt.Errorf("no slot snapshot for work type %d: %w", workTypeID, ErrNotFound)
	}
	if err != nil {
		return nil, "", time.Time{}, fmt.Errorf("query slot snapshot: %w", err)
	}
	return json.RawMessage(payload), storedDate, fetchedAt, nil
}

func (s *PGStore) LatestMapAvailabilitySnapshots(ctx context.Context, groupID int, keyword string) ([]MapAvailabilitySnapshot, error) {
	rows, err := s.pool.Query(ctx, `SELECT
			work_lookup.site_id,
			work_lookup.payload::text,
			work_lookup.fetched_at,
			slots.payload::text,
			slots.current_date_param,
			slots.fetched_at
		FROM dlt_work_type_snapshots AS work_lookup
		LEFT JOIN LATERAL (
			SELECT payload, current_date_param, fetched_at
			FROM dlt_slot_snapshots
			WHERE tyw_id = NULLIF(work_lookup.payload->0->>'tyw_id', '')::integer
			ORDER BY fetched_at DESC, id DESC
			LIMIT 1
		) AS slots ON TRUE
		WHERE work_lookup.group_id = $1 AND work_lookup.keyword = $2
		ORDER BY work_lookup.site_id`, groupID, keyword)
	if err != nil {
		return nil, fmt.Errorf("query map availability snapshots: %w", err)
	}
	defer rows.Close()

	snapshots := make([]MapAvailabilitySnapshot, 0)
	for rows.Next() {
		var snapshot MapAvailabilitySnapshot
		var workTypesPayload string
		var slotPayload *string
		var snapshotCurrentDate *string
		if err := rows.Scan(
			&snapshot.SiteID,
			&workTypesPayload,
			&snapshot.WorkTypesFetchedAt,
			&slotPayload,
			&snapshotCurrentDate,
			&snapshot.SlotsFetchedAt,
		); err != nil {
			return nil, fmt.Errorf("scan map availability snapshot: %w", err)
		}

		var workTypes []dto.DLTWorkType
		if err := json.Unmarshal([]byte(workTypesPayload), &workTypes); err != nil {
			return nil, fmt.Errorf("decode work types for office %d: %w", snapshot.SiteID, err)
		}
		if len(workTypes) > 0 {
			workType := workTypes[0]
			snapshot.WorkType = &workType
		}
		if slotPayload != nil {
			snapshot.SlotPayload = json.RawMessage(*slotPayload)
		}
		if snapshotCurrentDate != nil {
			snapshot.SnapshotCurrentDate = *snapshotCurrentDate
		}
		snapshots = append(snapshots, snapshot)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate map availability snapshots: %w", err)
	}
	return snapshots, nil
}

func (s *PGStore) RecentFetches(ctx context.Context, limit int) ([]FetchRecord, error) {
	rows, err := s.pool.Query(ctx, `SELECT kind, params::text, ok, COALESCE(error_text, ''), duration_ms, fetched_at
		FROM dlt_fetches
		ORDER BY fetched_at DESC, id DESC
		LIMIT $1`, limit)
	if err != nil {
		return nil, fmt.Errorf("query fetches: %w", err)
	}
	defer rows.Close()

	var fetches []FetchRecord
	for rows.Next() {
		var rec FetchRecord
		var params string
		if err := rows.Scan(&rec.Kind, &params, &rec.OK, &rec.ErrorText, &rec.DurationMS, &rec.FetchedAt); err != nil {
			return nil, fmt.Errorf("scan fetch: %w", err)
		}
		if err := json.Unmarshal([]byte(params), &rec.Params); err != nil {
			return nil, fmt.Errorf("decode fetch params: %w", err)
		}
		fetches = append(fetches, rec)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate fetches: %w", err)
	}
	return fetches, nil
}
