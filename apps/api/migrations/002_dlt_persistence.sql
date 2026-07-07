-- Feature 002: Persistence and History
-- Stored DLT data with fetch freshness. Slot snapshots keep raw upstream JSON.

CREATE TABLE IF NOT EXISTS dlt_offices (
    sit_id INTEGER PRIMARY KEY,
    sit_name TEXT NOT NULL,
    app_open INTEGER NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS dlt_work_types (
    tyw_id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    tyw_name TEXT NOT NULL,
    tyw_status INTEGER NOT NULL,
    tyw_datestart TEXT NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS dlt_slot_snapshots (
    id BIGSERIAL PRIMARY KEY,
    tyw_id INTEGER NOT NULL,
    current_date_param TEXT NOT NULL,
    payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dlt_slot_snapshots_tyw_fetched
    ON dlt_slot_snapshots (tyw_id, fetched_at DESC);

CREATE TABLE IF NOT EXISTS dlt_fetches (
    id BIGSERIAL PRIMARY KEY,
    kind TEXT NOT NULL,
    params JSONB NOT NULL DEFAULT '{}'::jsonb,
    ok BOOLEAN NOT NULL,
    error_text TEXT,
    duration_ms BIGINT NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dlt_fetches_fetched
    ON dlt_fetches (fetched_at DESC);
