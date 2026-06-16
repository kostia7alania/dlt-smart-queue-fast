# Roadmap

## Phase 0 - Repo Context and Spec Discipline

- Spec-driven workflow established (plain Markdown, tooling-agnostic)
- Constitution filled from project constraints
- Active DLT MVP feature created under `specs/001-align-dlt-mvp`
- Task index created for empty-chat continuity

## Phase 1 - DLT Read-Only Discovery MVP

- Replace generic starter API examples with DLT-specific read-only endpoints
- Normalize observed upstream DLT responses without correcting upstream strings
- Expose OpenAPI docs for the local API
- Add minimal frontend playground for office/work/slot exploration

## Phase 2 - Persistence and History

- Add migrations for offices, work types, slot snapshots, and fetch metadata
- Store fetched results in PostgreSQL
- Make UI able to show last fetched data and fetch freshness

## Phase 3 - Map and Calendar UX

- Add office list/map view
- Add calendar status view for selected office and work type
- Add filters for office, New/Renew, vehicle type, dates, and availability

## Deferred

- Login-dependent booking flow
- Telegram/email/SMS notifications
- Background monitoring
- Paid features
- Redis or queues
