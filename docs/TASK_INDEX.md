# Task Index

## Active Feature

None — see the backlog under "Current Next Step". The most recently completed
feature is `specs/007-reliable-snapshots-calendar`.

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 008 (office map) is complete and validated (2026-07-13): coordinates come
from a committed Nominatim-geocoded dataset (research and ROI comparison in
`specs/008-office-map/spec.md`; Google Geocoding rejected on ToS, OpenCage on cost).
210/218 offices are mapped with per-marker precision (`office`/`district`/
`province`), `/map` renders react-leaflet CircleMarkers with OSM attribution, marker
popups deep-link to `/calendar?siteId=`, and the dataset regenerates via
`node tools/geocode-offices.mjs --refine`.

Feature 007 before it (also 2026-07-13): offices/work-type fallbacks now
store and serve the complete latest list result (including valid empty arrays) from
`dlt_offices_snapshot` / `dlt_work_type_snapshots`, with legacy typed-projection
fallback for pre-007 databases; the calendar tracks offices and calendar
loading/errors independently with targeted retries, lists every stored-data
collection with its freshness, renders the successful-empty state, and exposes
accessible names/state (labeled search, real list semantics, fieldset work-option
group, month-nav and day aria-labels, unique route titles). Validated end-to-end:
Go unit + schema-isolated integration test against PostgreSQL 18, golangci-lint,
Biome, tsc, production build (Node 26), and a live browser pass covering live,
stored-data, targeted-error, and retry states.

No active feature. Pick the next one from the backlog below and start a new
`specs/00N-*` directory per the spec-driven loop.

## Backlog (agreed plans, in rough priority order)

1. **Cross-office availability comparison** — the core "compare offices" product
   value (Roadmap Phase 3 leftover); needs a spec for multi-office slot fetching
   within upstream-politeness limits. Natural next step: availability coloring on
   the new map (008 non-goal).
2. **Vehicle-type filter** — needs `tyw_id` mappings catalogued across
   vehicle/New/Renew combinations (see `docs/idea.md` open questions).
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

`specs/001-align-dlt-mvp` through `specs/008-office-map` are
complete, validated, and merged to `main`. Validation notes live in each feature's
`tasks.md`. Platform: Node 26, Biome 2.5, golangci-lint v2 + gofumpt, PostgreSQL 18,
Go 1.26, shadcn/ui + FSD + BEM + `tw` prefix (see AGENTS.md and
`docs/adr/ADR-001-ui-kit-strategy.md`).

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
