# Tasks: Persistence and History

**Input**: Design documents from `specs/002-persistence-history/`

**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Go tests for the migration runner, store round-trips (via interface fakes),
and handler behavior with store present/absent.

## Phase 1: Setup (Shared Infrastructure)

- [ ] T101 Add `pgx/v5` dependency to `apps/api/go.mod` and verify `go build ./...`
- [ ] T102 Write `apps/api/migrations/002_dlt_persistence.sql` per `data-model.md`
- [ ] T103 Implement embedded migration runner (embed.FS, `schema_migrations`, tx per file) in `apps/api/internal/repo/`
- [ ] T104 Wire pool creation + migration run + graceful live-only fallback in `apps/api/cmd/server/main.go`
- [ ] T105 Add Go test covering migration runner ordering/idempotency logic

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T106 Define `Store` interface (offices/work-types/slot-snapshot upserts, fetch log, snapshot reads) in `apps/api/internal/service/service.go`
- [ ] T107 Implement pgx `Store` in `apps/api/internal/repo/repo.go` with plain SQL from `data-model.md`
- [ ] T108 Add snapshot/fetch DTOs in `apps/api/internal/dto/dto.go`

**Checkpoint**: API compiles with a store wired but no behavior change yet.

## Phase 3: User Story 1 - Persist fetched DLT data (Priority: P1) MVP

- [ ] T109 [US1] Write-through offices upsert after successful live offices fetch in `apps/api/internal/service/service.go`
- [ ] T110 [US1] Write-through work types upsert after successful live work-types fetch
- [ ] T111 [US1] Append slot snapshot (raw payload bytes) after successful live slots fetch
- [ ] T112 [US1] Best-effort semantics: store errors are logged, never returned to the client (Go test with failing fake store)
- [ ] T113 [US1] Manually validate stored rows via psql per `quickstart.md`

**Checkpoint**: Live lookups populate PostgreSQL; DB down does not break live flow.

## Phase 4: User Story 2 - Record fetch metadata (Priority: P2)

- [ ] T114 [US2] Record fetch attempts (kind, params, ok, error, duration) for all six DLT kinds in `apps/api/internal/service/service.go`
- [ ] T115 [US2] Implement `GET /v1/dlt/fetches?limit=` in `apps/api/internal/http/handler.go` (503 when store absent, limit clamped to 100)
- [ ] T116 [US2] Manually validate fetch log per `quickstart.md`

## Phase 5: User Story 3 - Read snapshots with freshness (Priority: P3)

- [ ] T117 [US3] Implement `GET /v1/dlt/snapshots/offices` (200/404/503)
- [ ] T118 [US3] Implement `GET /v1/dlt/snapshots/work-types` with optional param filters
- [ ] T119 [US3] Implement `GET /v1/dlt/snapshots/slots?workTypeId=&currentDate=` returning latest matching payload
- [ ] T120 [US3] Go test: slot payload with `เต็ม` round-trips byte-identical through store fake and handler
- [ ] T121 [US3] Go test: snapshot endpoints return 503 without store, 404 when empty
- [ ] T122 [US3] Manually validate snapshot endpoints per `quickstart.md`

## Phase 6: User Story 4 - Playground freshness (Priority: P4)

- [ ] T123 [US4] Add "Snapshots & freshness" section to `apps/web/src/app/playground/page.tsx` (fetch log + 3 snapshot loaders)
- [ ] T124 [US4] Show `fetched_at` freshness alongside snapshot JSON; readable errors on 404/503
- [ ] T125 [US4] Manually validate playground snapshot flow per `quickstart.md`

## Final Phase: Polish & Cross-Cutting Concerns

- [ ] T126 Run `go test ./...` in `apps/api`
- [ ] T127 Run `npm --prefix apps/web run lint` and `npm --prefix apps/web run build`
- [ ] T128 Validate OpenAPI docs include snapshots/fetches endpoints
- [ ] T129 Validate degradation path (`make down`) per `quickstart.md`
- [ ] T130 Update `docs/TASK_INDEX.md` and task checkboxes here

## Dependencies & Execution Order

- Phase 1 → Phase 2 → US1 → US2 → US3 → US4 → Final.
- US2 and US3 both depend only on Phase 2 + US1 write paths existing (US2 can start
  after T114's hook points exist).
- UI (US4) needs US2/US3 endpoints.

## Notes

- No auth, booking, Redis, queues, background refresh.
- Preserve upstream strings exactly; store slot payloads as raw JSON bytes.
- Prefer small, direct Go code over abstractions.
- Mark tasks complete only after the relevant validation step.
