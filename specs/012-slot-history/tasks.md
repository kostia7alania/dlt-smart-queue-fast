# Tasks: Stored Slot History

**Input**: `specs/012-slot-history/spec.md`

- [x] T1201 Specify stored-history API, URL, accessibility, and validation contracts
- [x] T1202 Add the repository slot-history record and Store boundary
- [x] T1203 Query bounded slot history newest-first with deterministic ties
- [x] T1204 Add PostgreSQL integration coverage for order, limit, isolation, and empty history
- [x] T1205 Add explicit slot-history request and response DTOs
- [x] T1206 Extract one exact upstream slot-summary computation for all consumers
- [x] T1207 Add snapshot-only history decoding and status derivation in the service
- [x] T1208 Cover history summaries, malformed payloads, and missing persistence in service tests
- [x] T1209 Register the bounded `/v1/dlt/history/slots` OpenAPI route
- [x] T1210 Cover handler validation, normalization, empty data, and preserved strings
- [x] T1211 Add frontend history types and an abortable entity fetcher
- [x] T1212 Add the `/history` App Router route with a Suspense fallback
- [x] T1213 Make History office, keyword, and limit controls URL-driven
- [x] T1214 Abort obsolete office/work-type/history request chains
- [x] T1215 Add accessible office, work-option, and observation-limit controls
- [x] T1216 Add non-color history summary cards and state labels
- [x] T1217 Add a semantic responsive history table with loading/empty/error/retry states
- [x] T1218 Add context-preserving History links from Home and Calendar
- [x] T1219 Add context-preserving History links from Compare and Map
- [x] T1220 Run full validation/browser smoke, close docs, and commit feature 012

## Validation

Completed on 2026-07-23:

- `go test ./...` — passed.
- Schema-isolated PostgreSQL integration — passed against PostgreSQL 18,
  covering deterministic order, limit, work-type isolation, and empty history.
- `golangci-lint run` — passed with 0 issues.
- `golangci-lint fmt --diff` — no diff.
- `npm test` — 6 native Node tests passed.
- `tsc --noEmit` — passed.
- `npm run lint` — Biome passed.
- `npm run build` — Next.js production build passed with the static `/history`
  route.
- Snapshot-only invariant — calling the History endpoint left
  `dlt_fetches` unchanged at 114 records.
- `git diff --check` — passed.
- Browser smoke — real RENEW history and exact upstream Thai strings rendered;
  Phuket produced the real empty-history state; a mocked network failure
  produced the retryable error state; URL-driven limit/keyword changes and
  Back restored state; Home, Calendar, Compare, and Map History links preserved
  context; desktop and 390px layouts remained usable; no browser runtime errors
  were recorded.
