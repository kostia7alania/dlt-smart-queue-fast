# Implementation Plan: Cross-Office Availability Comparison

**Spec**: `specs/009-availability-comparison/spec.md`

## Constitution Check

- Business logic (fan-out, politeness, summary math) lives in Go (II).
- New endpoint under `/v1`, explicit request/response DTOs, OpenAPI via Huma (III).
- `เต็ม` and all upstream strings pass through untouched; the availability
  predicate compares against the exact upstream constant (IV).
- No queues, no background workers: comparison is on-demand within one request;
  politeness is achieved by bounding + serializing + snapshot reuse (I).
- PostgreSQL only; reuses existing snapshot tables, no schema change (II).

## Backend

1. **DTOs** (`internal/dto/dto.go`): `DLTCompareRequest` (query `siteIds`,
   `keyword`, `groupId`, `currentDate`), `DLTCompareOfficeResult` (`sit_id`,
   optional `work_type`, `source`, `fetched_at`, `total_days`,
   `available_days`, optional `first_available` day {date,message,color},
   optional `error`), `DLTCompareResponse` (echoes resolved `keyword`,
   `group_id`, `current_date`, plus `results` in request order).
2. **Service** (`internal/service/compare.go`): `DLTCompare(ctx, siteIDs,
   groupID, keyword, currentDate)`:
   - per office: work types via fresh snapshot (≤10 min) else live
     (`DLTWorkTypes`, which persists + logs) else stale snapshot; first work
     type (same choice the calendar page makes); slots via fresh snapshot else
     live (`DLTSlots`) else stale snapshot.
   - `liveDown` flag: after the first live error, later offices go
     snapshot-only. 300 ms context-aware pause after each office that hit the
     live upstream.
   - summary: `total_days` = returned days, `available_days` = days with
     `message != "เต็ม"`, `first_available` = lexicographically smallest date
     among available days (upstream dates are `YYYY-MM-DD`).
   - `source`/`fetched_at` describe the slots payload (live → `live`, stored →
     `snapshot` + fetched_at).
   - no store: skip snapshot steps entirely (live-only mode still works).
3. **Handler** (`internal/http/handler.go`): parse/validate CSV (1–8 positive
   ints after dedupe), keyword required, `currentDate` format check, groupId
   default 4, currentDate default today; register `dlt-compare` operation.
4. **Tests** (`internal/service/compare_test.go`,
   `internal/http/handler_test.go`): fake store with configurable snapshots +
   counting fake upstream; cases from SC-001. The politeness pause is a service
   field so tests can zero it.

## Frontend

5. **Entities** (`entities/dlt`): `CompareOfficeResult`/`CompareResponse` types
   mirroring the DTOs; `fetchCompare(siteIds, keyword, currentDate)` (no
   client-side fallback — the server already falls back per office).
6. **Feature** `features/office-multi-select`: search + checkbox list (reuses
   Checkbox/Input/Card), caps selection at 8 with a visible hint, snapshot
   badge like `office-select`.
7. **Widget** `widgets/office-compare`: result table sorted by
   `first_available.date` (null → bottom), color badge from upstream day color,
   per-row source/freshness, calendar links, honest empty/error rows.
8. **View + route**: `views/compare` client page (offices load, selection from
   `?siteIds=`, keyword toggle, explicit "Compare" button, auto-run for deep
   links, URL sync via `router.replace`); `app/compare/page.tsx` with Suspense
   and unique metadata; nav links on home/calendar/map pages.

## Validation

- `go test ./...`, `make lint` (golangci-lint), gofumpt.
- `npm run lint` (Biome), `tsc`, production build.
- Live browser pass per SC-003 (Postgres on 5433 per local note).
