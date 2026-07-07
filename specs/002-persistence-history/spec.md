# Feature Specification: Persistence and History

**Feature Branch**: `002-persistence-history`

**Created**: 2026-07-07

**Status**: Draft

**Input**: Roadmap Phase 2 - "Persistence and History": add migrations for offices,
work types, slot snapshots, and fetch metadata; store fetched results in PostgreSQL;
make the UI able to show last fetched data and fetch freshness.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Persist fetched DLT data automatically (Priority: P1)

As a user exploring DLT availability, I want every successful lookup to be stored
locally, so the data I already fetched is not lost when the upstream API is slow,
rate-limited, or unavailable.

**Why this priority**: Persistence is the foundation for history, freshness, and the
Phase 3 map/calendar UX. Without stored rows there is nothing to display offline.

**Independent Test**: With PostgreSQL running, call `/v1/dlt/offices`,
`/v1/dlt/work-types?...`, and `/v1/dlt/work-types/{id}/slots?...`, then verify rows
exist in `dlt_offices`, `dlt_work_types`, and `dlt_slot_snapshots` with `fetched_at`
timestamps.

**Acceptance Scenarios**:

1. **Given** PostgreSQL is running and migrations applied, **When** the user fetches offices, **Then** the office rows are upserted with a `fetched_at` timestamp.
2. **Given** PostgreSQL is running, **When** the user resolves work types, **Then** the returned work types are upserted keyed by `tyw_id`.
3. **Given** PostgreSQL is running, **When** the user fetches slots, **Then** a new immutable slot snapshot row is appended (history, not overwrite).
4. **Given** PostgreSQL is down, **When** the user fetches live data, **Then** the live response still succeeds and a warning is logged (best-effort persistence).

---

### User Story 2 - Record fetch metadata (Priority: P2)

As a developer-user, I want each upstream fetch attempt recorded with kind, params,
outcome, and duration, so I can see when data was last refreshed and whether upstream
calls are failing.

**Why this priority**: Freshness display and debugging depend on a fetch log.

**Independent Test**: Trigger several live lookups (including one that fails), then
`curl /v1/dlt/fetches?limit=10` and verify entries include kind, params, ok/error,
duration, and timestamp.

**Acceptance Scenarios**:

1. **Given** a successful upstream fetch, **When** it completes, **Then** a `dlt_fetches` row is appended with `ok = true` and duration.
2. **Given** a failed upstream fetch, **When** it errors or times out, **Then** a row is appended with `ok = false` and the error text.
3. **Given** recorded fetches, **When** the user requests `/v1/dlt/fetches`, **Then** the most recent entries are returned newest-first.

---

### User Story 3 - Read last fetched data with freshness (Priority: P3)

As a user, I want to load the last stored offices, work types, and slot snapshot with
their fetch time, so I can inspect known data without re-hitting the upstream API.

**Why this priority**: This is the user-visible payoff of persistence and the
read path Phase 3 will build on.

**Independent Test**: After live fetches, call `/v1/dlt/snapshots/offices`,
`/v1/dlt/snapshots/work-types?...`, and `/v1/dlt/snapshots/slots?workTypeId=...`
and verify stored data plus `fetched_at` is returned without contacting upstream.

**Acceptance Scenarios**:

1. **Given** stored offices, **When** the user requests the offices snapshot, **Then** stored offices and the latest `fetched_at` are returned.
2. **Given** stored slot snapshots, **When** the user requests the slots snapshot for a `workTypeId`, **Then** the latest matching snapshot payload is returned unchanged (preserved strings such as `เต็ม`).
3. **Given** no stored data for the requested kind/params, **When** the user requests a snapshot, **Then** the API returns a readable 404.
4. **Given** PostgreSQL is unavailable, **When** the user requests any snapshot endpoint, **Then** the API returns a readable 503 without crashing.

---

### User Story 4 - See freshness in the playground (Priority: P4)

As a developer-user, I want the playground to show recent fetch history and let me
load the last snapshot per step, so I can compare live data with stored data.

**Independent Test**: Open the playground, run live steps, then use the snapshot
controls and verify stored JSON and fetch timestamps are displayed.

**Acceptance Scenarios**:

1. **Given** the API is running with persistence, **When** the user opens the playground, **Then** a snapshots section can load offices/work-types/slots snapshots and the fetch log.
2. **Given** persistence is unavailable, **When** the user uses snapshot controls, **Then** the UI shows a readable error and live controls keep working.

### Edge Cases

- PostgreSQL is not running (docker compose down) — live flow must keep working.
- Migrations not yet applied — the API applies them automatically at startup.
- The same offices list fetched twice — upsert keeps one row per `sit_id`, freshness updates.
- Slot snapshots for the same `tyw_id`/`currentDate` fetched twice — two history rows.
- Upstream returns an empty array — snapshot is still recorded (empty data is valid data).
- Stored payloads must preserve upstream strings exactly (`เต็ม`, `Car and Motocycle`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply SQL migrations automatically at API startup, tracked in a `schema_migrations` table.
- **FR-002**: System MUST create tables for offices, work types, slot snapshots, and fetch metadata.
- **FR-003**: System MUST upsert offices and work types on each successful live fetch, stamping `fetched_at`.
- **FR-004**: System MUST append an immutable slot snapshot row (raw payload as JSONB) on each successful slots fetch.
- **FR-005**: System MUST append a fetch metadata row for every upstream fetch attempt (all kinds), recording kind, params, outcome, error text, and duration.
- **FR-006**: System MUST expose read-only snapshot endpoints for offices, work types, and slots returning stored data plus `fetched_at`.
- **FR-007**: System MUST expose a read-only fetch log endpoint returning recent fetch metadata newest-first.
- **FR-008**: Persistence MUST be best-effort for live endpoints: a database failure MUST NOT fail a live upstream response.
- **FR-009**: Snapshot endpoints MUST return a readable 503 when the database is unavailable and 404 when no snapshot exists.
- **FR-010**: Stored payloads and returned snapshot data MUST preserve upstream strings exactly.
- **FR-011**: System MUST NOT add auth, booking, Redis, queues, or background refresh; persistence happens only on user-triggered fetches.

### Key Entities

- **DltOfficeRow**: stored office (`sit_id` PK, `sit_name`, `app_open`, `fetched_at`).
- **DltWorkTypeRow**: stored work type (`tyw_id` PK, lookup params `site_id`/`group_id`/`keyword`, upstream fields, `fetched_at`).
- **DltSlotSnapshot**: append-only snapshot (`id`, `tyw_id`, `current_date`, raw `payload` JSONB, `fetched_at`).
- **DltFetch**: append-only fetch log (`id`, `kind`, `params` JSONB, `ok`, `error_text`, `duration_ms`, `fetched_at`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After running the live lookup chain once, stored offices, work types, and a slot snapshot are retrievable via snapshot endpoints without upstream access.
- **SC-002**: Fetch freshness (`fetched_at`) is visible via API and in the playground.
- **SC-003**: With PostgreSQL stopped, all Phase 1 live endpoints still work unchanged.
- **SC-004**: All new endpoints appear in local OpenAPI docs.
- **SC-005**: Preserved strings round-trip through PostgreSQL with values exactly intact (validated by Go tests; JSONB normalizes whitespace/key order, which is not part of the contract).

## Assumptions

- Single local user; no concurrent-writer concerns beyond simple upserts.
- `docker-compose.yml` PostgreSQL defaults (`myuser`/`mypassword`/`mydb`) stay the dev default via `DATABASE_URL`.
- Snapshot history growth is acceptable for a local MVP; retention/pruning is out of scope.
- Work availability, vehicles, and holidays are logged in fetch metadata but not stored as typed rows in this phase (deferred until a UX needs them).
