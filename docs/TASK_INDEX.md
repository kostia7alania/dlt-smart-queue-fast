# Task Index

## Active Feature

None — see the backlog under "Current Next Step". The most recently completed
feature is `specs/009-availability-comparison`.

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 009 (cross-office availability comparison) is complete and validated
(2026-07-19): `GET /v1/dlt/compare` sequentially resolves work types and slots
for 1–8 offices with a 10-minute snapshot reuse window, a 300 ms inter-office
pause, a live-failure circuit (after one live error the rest of the batch is
snapshot-only), and per-office error isolation; the summary (first available
day, available/total counts, `เต็ม` predicate) is computed in Go. `/compare`
offers search + checkbox multi-select (cap 8), NEW/RENEW toggle, a table
sorted by earliest available day with upstream day colors/messages unchanged,
per-row live/stored freshness, `?siteIds=` deep links that auto-run, and
calendar cross-links. Validated: Go unit tests (snapshot reuse, circuit,
isolation, summary math, validation), schema-isolated integration tests
(PostgreSQL 18), golangci-lint, Biome, tsc, production build (Node 26), and a
live browser pass (sorted rows 46→48→47, snapshot reuse on repeat calls,
deep-link auto-run, calendar landing). Observed upstream fact: many offices
return zero work types for " NEW THAI" — rendered honestly, not as errors.

Feature 008 before it (office map, validated 2026-07-13): coordinates come
from a committed Nominatim-geocoded dataset (research and ROI comparison in
`specs/008-office-map/spec.md`; Google Geocoding rejected on ToS, OpenCage on cost).
210/218 offices are mapped with per-marker precision (`office`/`district`/
`province`), `/map` renders react-leaflet CircleMarkers with OSM attribution, marker
popups deep-link to `/calendar?siteId=`, and the dataset regenerates via
`node tools/geocode-offices.mjs --refine`.

No active feature. Pick the next one from the backlog below and start a new
`specs/00N-*` directory per the spec-driven loop.

## Backlog (agreed plans, in rough priority order)

1. **Vehicle-type filter** — needs `tyw_id` mappings catalogued across
   vehicle/New/Renew combinations (see `docs/idea.md` open questions).
2. **Availability coloring on the map** — reuse `GET /v1/dlt/compare` semantics
   for map markers; needs a background/refresh budget decision first, since the
   8-office on-demand cap (009) cannot cover ~210 markers politely.
3. **Shared Tailwind v4 token theme** across Next/Nuxt pet projects — start when a
   second project consumes it (ADR-001 action item 1).
4. **Private shadcn registry (+ MCP)** exposing our components/tokens to AI agents —
   start when >1 project consumes the same components (ADR-001 action item 3).
5. **PWA / desktop / mobile** — webview-first path (Tauri 2 / Capacitor) wraps the
   existing web app when wanted; real native later via Expo + React Native
   Reusables (per ADR-001 "where the puck is heading").
6. **Notifications/monitoring** (Telegram alerts on freed slots, `docs/idea.md`
   "ДЕНЬГИ") — explicitly out of MVP; requires a constitution scope change first.

Local note: if host port 5432 is taken, start PostgreSQL with
`POSTGRES_PORT=5433 docker compose up -d` and set `DATABASE_URL` accordingly.

## Previous Features

`specs/001-align-dlt-mvp` through `specs/009-availability-comparison` are
complete, validated, and merged to `main`. Validation notes live in each feature's
`tasks.md`. Platform: Node 26, Biome 2.5, golangci-lint v2 + gofumpt, PostgreSQL 18,
Go 1.26, shadcn/ui + FSD + BEM + `tw` prefix (see AGENTS.md and
`docs/adr/ADR-001-ui-kit-strategy.md`).

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
