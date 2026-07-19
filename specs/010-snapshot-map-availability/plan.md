# Implementation Plan: Snapshot Availability on the Office Map

**Spec**: `specs/010-snapshot-map-availability/spec.md`

## Constitution Check

- Summary/status business logic stays in Go; Next.js renders the API result (II).
- The JSON endpoint is under `/v1`, modeled explicitly, and registered in Huma
  OpenAPI (III).
- `เต็ม`, upstream messages, colors, names, and IDs remain unchanged (IV).
- PostgreSQL is the only data source; no queue, polling, auth, or new dependency
  is introduced (I, II).

## Backend

1. Add a repository snapshot row carrying site ID, latest complete work-type
   lookup, optional latest slot payload, lookup freshness, slot freshness, and
   original slot `current_date_param`.
2. Query `dlt_work_type_snapshots` by exact group/keyword and use a lateral join
   to the newest `dlt_slot_snapshots` row for the collection's first `tyw_id`.
   Decode the complete collection in Go so stored empty arrays stay authoritative.
3. Add `DLTMapAvailability`: return `ErrPersistenceUnavailable` without a store,
   isolate corrupt/missing slot payloads as `unknown`, discard days before the
   requested date, and derive the five status values.
4. Register `GET /v1/dlt/map-availability` with keyword/group/date validation and
   Huma response DTOs.
5. Cover repository behavior in the existing schema-isolated PostgreSQL test and
   cover aggregation/handler behavior with fakes.

## Frontend

6. Extend the existing `entities/dlt` public API with map-availability contract
   types and `fetchMapAvailability`; it has no live fallback.
7. Reuse `features/work-option-filter` on `/map` for NEW/RENEW and Available only.
   Keep office list and overlay requests independent so a 503 overlay never hides
   the base map.
8. Pass a site-indexed result map to `widgets/office-map`. Fill color represents
   availability; radius/dash pattern and popup text provide non-color cues.
   Preserve coordinate precision text and `/calendar?siteId=` links.
9. Show a visible status-count summary, freshness in popups, and separate
   availability/precision legends.

## Validation

- `go test ./...`; schema-isolated integration test when PostgreSQL is available.
- golangci-lint v2 + gofumpt.
- Biome, Node tests, `tsc --noEmit`, Next production build on Node 26.
- Browser smoke against local API/PostgreSQL when available.
