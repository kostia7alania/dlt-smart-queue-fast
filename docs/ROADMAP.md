# Roadmap

## Phase 0 - Repo Context and Spec Discipline — DONE

- Spec-driven workflow established (plain Markdown, tooling-agnostic)
- Constitution filled from project constraints
- Active DLT MVP feature created under `specs/001-align-dlt-mvp`
- Task index created for empty-chat continuity

## Phase 1 - DLT Read-Only Discovery MVP — DONE (`specs/001-align-dlt-mvp`)

- Replace generic starter API examples with DLT-specific read-only endpoints
- Normalize observed upstream DLT responses without correcting upstream strings
- Expose OpenAPI docs for the local API
- Add minimal frontend playground for office/work/slot exploration

## Phase 2 - Persistence and History — DONE (`specs/002-persistence-history`)

- Add migrations for offices, work types, slot snapshots, and fetch metadata
- Store fetched results in PostgreSQL
- Make UI able to show last fetched data and fetch freshness

## Phase 3 - Map and Calendar UX — DONE
## (`specs/003-calendar-office-ux`, `specs/008-office-map`, `specs/009-availability-comparison`, `specs/010-snapshot-map-availability`, `specs/011-cancellable-shareable-discovery`)

- Add office list/map view — office list done (003); map done (008, committed
  Nominatim-geocoded dataset + react-leaflet)
- Add calendar status view for selected office and work type — done (003)
- Cross-office availability comparison (`/compare`, `GET /v1/dlt/compare`) —
  done (009, politeness-bounded sequential fetching with snapshot reuse)
- Snapshot-only availability coloring (`/map`, `GET /v1/dlt/map-availability`) —
  done (010, five honest last-known states with no upstream fan-out)
- Shareable query state, request cancellation, office search, and a semantic
  text alternative for Map — done (011)
- Add filters for office, New/Renew, vehicle type, dates, and availability —
  office/New/Renew/availability done; vehicle type is not actionable in the
  observed contract because `workfilter` has no vehicle discriminator (recheck if
  upstream changes)

## Phase 4 - Stored Availability History — DONE (`specs/012-slot-history`)

- Expose bounded, newest-first slot observations from PostgreSQL without
  calling the DLT upstream
- Summarize availability with the same exact upstream full marker used by
  Compare and Map
- Add a shareable `/history` page with accessible summaries, a semantic table,
  empty/error states, and context links across discovery views

## Deferred

- Login-dependent booking flow
- Telegram/email/SMS notifications
- Background monitoring
- Paid features
- Redis or queues
