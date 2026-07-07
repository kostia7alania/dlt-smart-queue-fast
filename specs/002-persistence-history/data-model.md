# Data Model: Persistence and History

All tables live in the default schema of the `DATABASE_URL` database and are created
by `apps/api/migrations/002_dlt_persistence.sql`.

## schema_migrations

Tracks applied migration files (managed by the embedded runner).

- `version`: integer parsed from the filename prefix (PK)
- `name`: migration filename
- `applied_at`: timestamptz

## dlt_offices

One row per DLT office; upserted on every successful offices fetch.

- `sit_id`: upstream office ID (PK)
- `sit_name`: upstream office name, preserved exactly
- `app_open`: upstream integer flag
- `fetched_at`: timestamptz of the last fetch that saw this office

## dlt_work_types

One row per resolved work type; upserted keyed by `tyw_id`.

- `tyw_id`: upstream work type ID (PK)
- `site_id`: lookup param used to resolve it
- `group_id`: lookup param used to resolve it
- `keyword`: lookup param, preserved exactly (leading spaces matter, e.g. ` NEW THAI`)
- `tyw_name`: upstream name, preserved exactly
- `tyw_status`: upstream status integer
- `tyw_datestart`: upstream start timestamp as raw string (not parsed)
- `fetched_at`: timestamptz of the last fetch

## dlt_slot_snapshots

Append-only history of slot calendar observations.

- `id`: bigserial (PK)
- `tyw_id`: work type the snapshot belongs to
- `current_date_param`: the `currentDate` query value used for the fetch
- `payload`: raw upstream response as JSONB (preserved strings such as `เต็ม`)
- `fetched_at`: timestamptz

Index: `(tyw_id, fetched_at DESC)` for "latest snapshot for work type" reads.

## dlt_fetches

Append-only log of every upstream fetch attempt (all six kinds).

- `id`: bigserial (PK)
- `kind`: one of `offices`, `work-availability`, `vehicles`, `work-types`, `holidays`, `slots`
- `params`: JSONB of request params (empty object when none)
- `ok`: boolean outcome
- `error_text`: nullable error string for failed fetches
- `duration_ms`: integer duration of the upstream call
- `fetched_at`: timestamptz

Index: `(fetched_at DESC)` for newest-first log reads.

## Validation Rules

- Slot payloads MUST be stored as received (raw JSON bytes into JSONB); values are
  never rewritten. JSON key order is not considered part of the contract.
- Upserts update `fetched_at` even when other columns are unchanged (freshness).
- Empty upstream arrays are stored/recorded as valid results.
- Failed fetches never write to `dlt_offices`, `dlt_work_types`, or
  `dlt_slot_snapshots` — only to `dlt_fetches`.
