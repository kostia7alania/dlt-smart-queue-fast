-- Preserve the complete latest result for list-shaped lookups. Typed rows remain
-- available for querying, while these JSONB records distinguish a stored empty
-- list from "no snapshot" and prevent older projection rows leaking into fallback.

CREATE TABLE IF NOT EXISTS dlt_offices_snapshot (
    singleton BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS dlt_work_type_snapshots (
    site_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,
    payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (site_id, group_id, keyword)
);

CREATE INDEX IF NOT EXISTS idx_dlt_work_type_snapshots_fetched
    ON dlt_work_type_snapshots (fetched_at DESC);
