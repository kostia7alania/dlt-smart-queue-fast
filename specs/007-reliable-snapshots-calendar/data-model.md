# Data Model: Reliable List Snapshots

Feature 007 keeps the existing typed projections and adds two latest-result records.
The snapshot records own list boundaries; projection rows remain available for later
query-oriented features.

## `dlt_offices_snapshot`

Exactly one row stores the complete latest successful offices response.

- `singleton`: boolean primary key constrained to `TRUE`
- `payload`: JSONB array of `DLTOffice` values, including a valid empty array
- `fetched_at`: timestamp shared with the corresponding typed-row upserts

## `dlt_work_type_snapshots`

One row per exact work-type lookup stores the complete latest successful response.

- `site_id`: DLT office lookup parameter
- `group_id`: DLT work group lookup parameter
- `keyword`: exact lookup value; leading whitespace is significant
- `payload`: JSONB array of `DLTWorkType` values, including a valid empty array
- `fetched_at`: timestamp shared with the corresponding typed-row upserts
- primary key: `(site_id, group_id, keyword)`

## Read semantics

- A matching snapshot row with `payload = []` returns HTTP 200 with an empty array.
- No snapshot row and no legacy typed projection returns the existing readable 404.
- Databases upgraded in place may read legacy typed projections until the first
  successful post-migration fetch creates the complete snapshot row.
- Slot snapshots remain append-only and unchanged.
