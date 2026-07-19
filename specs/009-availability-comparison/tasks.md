# Tasks: Cross-Office Availability Comparison

**Input**: `specs/009-availability-comparison/spec.md`

## Phase 1: Backend compare endpoint

- [x] T801 DTOs for `GET /v1/dlt/compare` (request validation shape, per-office result, response envelope)
- [x] T802 `service.DLTCompare`: sequential fan-out, 10-min snapshot reuse, live-failure circuit, 300 ms pause, per-office isolation, summary math (`เต็ม` predicate)
- [x] T803 Handler + route registration with validation (1–8 ids, keyword required, date format, defaults)
- [x] T804 Unit tests: summary math, snapshot reuse (no upstream call), circuit (exactly 1 attempted upstream call), isolation, live-only mode, validation errors

## Phase 2: Compare UI

- [x] T805 `entities/dlt`: compare types + `fetchCompare`
- [x] T806 `features/office-multi-select`: search, checkboxes, 8-office cap, snapshot badge (BEM office-multi-select__*)
- [x] T807 `widgets/office-compare`: sorted comparison table, upstream colors/messages unchanged, source freshness, calendar links
- [x] T808 `views/compare` + `/compare` route: deep link `?siteIds=` auto-run, URL sync, keyword toggle, loading/error/retry, Suspense + metadata; cross-links home/calendar/map

## Phase 3: Validation & close-out

- [x] T809 `go test ./...` (incl. schema-isolated integration tests via TEST_DATABASE_URL against PostgreSQL 18), golangci-lint v2 clean
- [x] T810 Biome, tsc, production build (Next 16 / Node 26) green
- [x] T811 Browser smoke (2026-07-19): live upstream — select offices → sorted table (46: 2026-07-27, 48: 2026-07-29, 47: 2026-07-30 stored); deep link `/compare?siteIds=47,46,48` auto-runs; snapshot reuse verified via curl (second call → `source: snapshot` + fetched_at, zero upstream calls); calendar link lands on Ratchaburi #46 with matching green 27th; no console errors. Observed honest empty rows: many offices (1, 2, 14, 19) return zero work types for " NEW THAI" — upstream fact, logged ok in `dlt_fetches`.
- [x] T812 Update TASK_INDEX/backlog + spec status; merge to main
