# Implementation Plan: Persistence and History

**Branch**: `002-persistence-history` | **Date**: 2026-07-07 | **Spec**: `specs/002-persistence-history/spec.md`

**Input**: Feature specification from `specs/002-persistence-history/spec.md`

## Summary

Add best-effort write-through persistence to the existing read-only DLT flow. The Go
API connects to PostgreSQL at startup, applies embedded SQL migrations, and stores
offices, work types, slot snapshots, and fetch metadata whenever the user triggers a
live lookup. New read-only `/v1/dlt/snapshots/*` and `/v1/dlt/fetches` endpoints expose
stored data with freshness. The playground gets a snapshots section. Live endpoints
keep working with the database down.

## Technical Context

**Language/Version**: Go 1.24+ for API, TypeScript for Next.js App Router UI

**Primary Dependencies**: chi, Huma, pgx/v5 (`pgxpool`), Next.js, React

**Storage**: PostgreSQL 15 via existing `docker-compose.yml`; `DATABASE_URL` from config

**Testing**: Go `testing`; store behavior tested through a `Store` interface with a
fake in handler/service tests; SQL exercised via manual quickstart validation against
the compose database

**Constraints**: no ORM; plain SQL with pgx; no background refresh; JSON only;
persistence must never break live endpoints

## Key Decisions

1. **pgx/v5 with handwritten SQL, no sqlc yet.** Only ~8 small queries exist in this
   phase. sqlc adds a codegen step without enough query surface to pay for it; the
   schema and queries are written so sqlc can be adopted later without churn.
2. **Embedded migration runner instead of golang-migrate.** A ~40-line runner applies
   `apps/api/migrations/*.sql` in filename order inside transactions and records them
   in `schema_migrations`. Avoids a new binary/dependency for two migration files.
3. **Typed rows for offices and work types, JSONB history for slots.** Offices and
   work types are natural upsert targets that Phase 3 (map/calendar) will query as
   rows. Slot data is a point-in-time observation, so it is appended as a raw JSONB
   payload (`dlt_slot_snapshots`) — this both provides history and guarantees
   preserved upstream strings byte-for-byte.
4. **`Store` interface in the service package, pgx implementation in `repo`.** The
   service depends on a small interface; `nil`/failing store degrades to live-only
   behavior. Handlers return 503 for snapshot endpoints when the store is absent.
5. **Fetch log covers all six kinds.** Even kinds without typed tables
   (work-availability, vehicles, holidays) are recorded in `dlt_fetches` for
   freshness/debugging; that is one insert, not new schema.

## Constitution Check

- **MVP Simplicity**: Pass. No queues, no background workers; persistence only on
  user-triggered fetches. One new dependency (pgx) — the standard Postgres driver.
- **Go Backend / Thin UI / PostgreSQL Only**: Pass. All persistence in Go; UI only
  reads new JSON endpoints.
- **OpenAPI-First JSON API**: Pass. New endpoints registered via Huma and described in
  `contracts/openapi.yaml`.
- **Preserve External DLT Contract**: Pass. Slot payloads stored as raw JSONB;
  Go tests assert byte-identical round-trips of `เต็ม` and friends.
- **Repo-Owned AI Context**: Pass. This directory + updated `docs/TASK_INDEX.md`.
- **Verifiable Incremental Delivery**: Pass. Each user story independently testable;
  degradation path (DB down) explicitly validated.

## Project Structure

### Documentation (this feature)

```text
specs/002-persistence-history/
├── spec.md
├── plan.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (changes)

```text
apps/api/
├── cmd/server/main.go              # connect pool, run migrations, wire store
├── internal/config/config.go       # (existing DATABASE_URL)
├── internal/repo/repo.go           # pgx Store implementation + migration runner
├── internal/service/service.go     # Store interface, write-through, fetch log
├── internal/dto/dto.go             # snapshot/fetch DTOs
├── internal/http/handler.go        # /v1/dlt/snapshots/*, /v1/dlt/fetches
└── migrations/
    ├── 001_init.sql                # existing starter table
    └── 002_dlt_persistence.sql     # offices, work types, slot snapshots, fetches

apps/web/
└── src/app/playground/page.tsx     # snapshots & freshness section
```

## API Surface (new, all read paths except side effects of existing live calls)

- `GET /v1/dlt/snapshots/offices` → `{ fetched_at, offices: [...] }`
- `GET /v1/dlt/snapshots/work-types?siteId=&groupId=&keyword=` → `{ fetched_at, work_types: [...] }`
- `GET /v1/dlt/snapshots/slots?workTypeId=&currentDate=` → `{ fetched_at, current_date, data: [...] }` (latest matching; `currentDate` optional)
- `GET /v1/dlt/fetches?limit=` → `[{ kind, params, ok, error, duration_ms, fetched_at }]`

Errors: 503 `persistence unavailable` when DB is down; 404 when nothing stored.

## Risks

- **pgx module download requires network** — mitigated: validated during setup task.
- **JSONB round-trip alters key order** — acceptable: JSON object key order is not
  part of the contract; string values are. Tests assert values, not order.
- **Schema lock-in before Phase 3 UX** — mitigated by keeping slots as raw payloads
  and only typing entities with obvious keys (`sit_id`, `tyw_id`).

## Complexity Tracking

No constitution violations. One new dependency (pgx/v5) justified as the standard
PostgreSQL driver required by "PostgreSQL as the only datastore".
