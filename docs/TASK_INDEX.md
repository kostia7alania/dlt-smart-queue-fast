# Task Index

## Active Feature

None.

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Current Next Step

Feature 016 (availability evidence guide) is complete and validated (2026-08-02).
It adds a static
`/guides/how-to-read-dlt-availability` field manual for interpreting live versus
stored sources, freshness, all five Map statuses, History's three stored states,
and office/district/province coordinate precision. It is linked from every
discovery view and the public journey, uses Article JSON-LD derived from visible
content, and avoids
booking, eligibility, office-procedure, and availability-guarantee claims.
Validation covered all Go tests, a live PostgreSQL 18 integration test,
golangci-lint, Biome, 16 Node tests, TypeScript, a 15-route static export,
exported HTML, and desktop/mobile browser smoke. Evidence and the claim boundary
are recorded in `docs/research/2026-08-02-availability-evidence-guide.md`.

There is no active implementation feature. Select the next product slice from
real usage or launch evidence rather than assuming notification demand or adding
unsupported office procedure.

Feature 015 (Bangkok DLT office hub) is complete and validated (2026-08-02).
Static `/offices/bangkok` lists Area Land Transport Offices 1–5 with exact IDs
and committed English names, labelled district-level derived map anchors, and
context-preserving Calendar/Map/History links plus a five-office Compare route.
It never renders mutable opening state or asserts walk-in, eligibility,
document, quality, or current-availability facts. Validation covered all Go
tests, golangci-lint, Biome, 12 Node tests, TypeScript, a 14-route Next static
export, exported HTML, and desktop/mobile browser smoke. The evidence and claim
boundary are recorded in `docs/research/2026-08-02-bangkok-office-hub.md`.

Domain registration, deployment,
Search Console, analytics, and other external account changes still require an
immediate availability/configuration recheck and explicit authorization. Select
the next product slice from real launch/user evidence rather than assuming
notification demand or adding unsupported office procedure.

Feature 013 (production and open-source deployment) is complete and validated
(2026-07-24). The repository now supports a static Cloudflare Pages frontend,
a bounded Cloud Run Go API, managed PostgreSQL, retention maintenance, CI,
OIDC deployment, and honest open-source distribution. No external resources
were provisioned.

Market, SEO, analytics-account, and domain research is recorded in
`docs/research/2026-07-24-market-seo-domain.md`. The working public brand is
**Thai Queue Scout**, with `thaiqueuescout.com` as the primary point-in-time
available domain candidate. Before provisioning, recheck the domain and brand,
then explicitly authorize domain registration and cloud-account changes.

Feature 012 (stored slot history) is complete and validated (2026-07-23):
`GET /v1/dlt/history/slots` reads bounded, newest-first PostgreSQL observations
without calling the DLT upstream and summarizes each with the shared exact
`เต็ม` predicate. `/history` provides URL-driven office/work-option/limit
controls, stale-request cancellation, non-color summary labels, a semantic
responsive table, honest empty/error states, and context-preserving links from
Home, Calendar, Compare, and Map. Validated with Go unit/handler/integration
tests, golangci-lint/format, Node tests, TypeScript, Biome, Next production
build, a live fetch-log invariant, and desktop/mobile browser smoke.

Feature 011 (cancellable, shareable discovery) is complete and validated
(2026-07-23): Calendar, Compare, and Map now use URL query state as their source
of truth; stale browser requests and canceled Go comparisons stop promptly;
Compare-to-Calendar links preserve the exact work option; Map adds office
name/site-ID search, reset/count controls, centralized filtering, and a semantic
text alternative with status and discovery links. Validated with native Node
tests, TypeScript, Biome, Go tests/lint/format, schema-isolated PostgreSQL
integration, Next production build, `git diff --check`, and browser smoke
covering direct URLs, Back/Forward, keyword preservation, search/reset, and the
text alternative.

Feature 010 (snapshot map availability) is complete and validated (2026-07-19):
`GET /v1/dlt/map-availability` derives five last-known statuses from complete
PostgreSQL work-type and slot snapshots without calling the DLT upstream. `/map`
now has NEW/RENEW and available-only controls, status counts, color/size/text
cues, freshness, separate precision/availability legends, and calendar links
that preserve the keyword. Office-list and overlay failures remain independent.
Validated with Go unit/integration tests, golangci-lint, Biome, Node tests, tsc,
Next production build, browser smoke, and a live fetch-history invariant check.

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
`node tools/geocode-offices.mjs --refine` (or `--site-ids=1,3` for a targeted repair).
On 2026-07-19, a province-consistency guard and regression tests repaired seven
false-positive matches: Bangkok areas 1/3/4/5 plus Chumphon, Nan, and Uthai Thani.

## Backlog (agreed plans, in rough priority order)

1. **Shared Tailwind v4 token theme** across Next/Nuxt pet projects — start when a
   second project consumes it (ADR-001 action item 1).
2. **Private shadcn registry (+ MCP)** exposing our components/tokens to AI agents —
   start when >1 project consumes the same components (ADR-001 action item 3).
3. **PWA / desktop / mobile** — webview-first path (Tauri 2 / Capacitor) wraps the
   existing web app when wanted; real native later via Expo + React Native
   Reusables (per ADR-001 "where the puck is heading").
4. **Notifications/monitoring** (Telegram alerts on freed slots, `docs/idea.md`
   "ДЕНЬГИ") — explicitly out of MVP; requires a constitution scope change first.

Vehicle-type filtering was removed from the actionable backlog after a live contract
check on 2026-07-19: vehicle choice is absent from the `workfilter` request, and
`getVehicle` returned the same list for `ve_type=1` and `ve_type=2`. Adding the UI
control now would not change calendar results; revisit only if the upstream contract
exposes a vehicle discriminator.

Local note: if host port 5432 is taken, start PostgreSQL with
`POSTGRES_PORT=5433 docker compose up -d` and set `DATABASE_URL` accordingly.

## Previous Features

`specs/001-align-dlt-mvp` through
`specs/015-bangkok-office-hub` are complete and validated. Validation notes
live in each feature's `tasks.md`. Platform: Node 26, Biome 2.5, golangci-lint v2 + gofumpt, PostgreSQL 18,
Go 1.26, shadcn/ui + FSD + BEM + `tw` prefix (see AGENTS.md and
`docs/adr/ADR-001-ui-kit-strategy.md`).

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
