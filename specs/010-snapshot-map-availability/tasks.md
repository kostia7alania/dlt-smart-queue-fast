# Tasks: Snapshot Availability on the Office Map

**Input**: `specs/010-snapshot-map-availability/spec.md`

- [x] T901 Specify the snapshot-only refresh budget, statuses, API shape, and UI acceptance criteria
- [x] T902 Add backend DTOs and store contract for map availability snapshots
- [x] T903 Implement latest-per-office PostgreSQL query using complete work-type collections
- [x] T904 Implement service aggregation, upcoming-day filtering, and per-office unknown isolation
- [x] T905 Register the validated OpenAPI endpoint and add unit/integration coverage
- [x] T906 Add frontend map-availability types and API client through `entities/dlt`
- [x] T907 Reuse accessible NEW/RENEW and available-only controls with independent overlay state
- [x] T908 Color/shape markers, add textual popup statuses, counts, freshness, and legends
- [x] T909 Run relevant validation, browser smoke when available, update task docs, and commit feature 010

## Validation

- `go test ./...`
- schema-isolated PostgreSQL integration test for latest-slot selection and empty
  work-type collections
- `golangci-lint fmt --diff` and `golangci-lint run` (`0 issues`)
- `npm run lint`, `npm run test`, `npx tsc --noEmit`, and `npm run build` on
  Node.js 26.4.0
- browser smoke against local PostgreSQL/API/UI: NEW/RENEW switching,
  available-only filtering, textual status/freshness popup, keyword-preserving
  calendar deep link, and empty browser error log
- live fetch-history comparison before/after the map request confirmed that the
  snapshot-only endpoint creates no upstream fetch record
