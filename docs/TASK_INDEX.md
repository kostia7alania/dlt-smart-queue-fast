# Task Index

## Active Feature

None. Two branches are complete, validated, and pushed, waiting to be merged
into `main` in this order:

1. `feat/015-local-hubs-guides` — `specs/015-local-hubs-guides` (area office hubs
   and licence guides), rebased onto the merged
   `specs/014-launch-trust-handoff` work.
2. `feat/016-unified-chrome` — `specs/016-unified-chrome` (one site chrome across
   every route), branched from 015.

```bash
git merge --ff-only feat/015-local-hubs-guides
git merge --ff-only feat/016-unified-chrome
```

See "Parallel work on 2026-07-31" for why the work happened on a branch.

## How to Continue

1. Read `AGENTS.md`.
2. Read `docs/CONSTITUTION.md`.
3. Read the active feature's `spec.md` and `plan.md`.
4. Open the active feature's `tasks.md`.
5. Start from the first unchecked task.
6. Mark completed tasks as `- [x]` only after validation.

## Parallel work on 2026-07-31 — resolved

Two agent sessions worked on this repository at the same time (both started
19:32). Feature 015 was therefore developed in a separate git worktree so that
builds, `node_modules`, `out/`, and commits could not collide:

```text
/Users/kostiabazrov/Documents/apps/pet/dtl-parser       main        feature 014
/Users/kostiabazrov/Documents/apps/pet/dtl-parser-015   feat/015-…  feature 015
```

Feature 014 landed on `main` at 19:58; feature 015 was then rebased onto it and
integrated the same night. The result:

- `apps/web/src/shared/config/static-routes.ts` is the single sitemap route
  table, unit tested against the city-hub and guide registries, and every path
  that is not registry-backed must have its own `src/app/<path>/page.tsx`.
- `widgets/public-site-chrome` is the only public header/footer; the temporary
  content nav was deleted, and its navigation now includes Offices and Guides.
- `shared/config/site.ts` holds all product identity, notices, paths, and the
  official destination; the temporary `official-links.ts` was deleted.
- `shared/lib/json-ld.ts` holds `serializeJsonLd` plus the breadcrumb and
  item-list builders; the duplicate module was deleted.
- `apps/web/package.json` runs `node --test "src/**/*.test.mts"`, so new test
  files are picked up without editing the script.

Conflict resolutions and integration validation are recorded in
`specs/015-local-hubs-guides/tasks.md`.

If two sessions are ever run in parallel again: give each one its own worktree
before it writes a single file, and agree the shared files (sitemap, site config,
package scripts, docs) up front.

## Current Next Step

Features 014 (launch trust and official hand-off) and 015 (area office hubs and
licence guides) both landed on 2026-07-31, developed in parallel sessions.

Feature 015: `/offices`, eight area hubs, `/guides`, and two licence guides are
statically exported with canonicals, breadcrumb and item-list JSON-LD, and
sitemap entries. A committed, regenerable office directory
(`node tools/build-office-directory.mjs`) supplies coverage counts, and the guide
model forces every statement into observed / DLT-only / dated-report categories.
Validation: 52 node tests, `tsc --noEmit`, Biome, a 25-page production static
build, `npm run data:check`, the full Go test suite, `git diff --check`, and a
browser pass over the exported output at desktop and mobile widths.

Feature 014: the public surface leads with Thai Queue Scout's appointment
discovery outcome, explains Calendar/Compare/Map/History, and exposes visible
independence, privacy, freshness, no-booking, and official DLT hand-off
boundaries. Static `/appointments` and `/guides/dlt-smart-queue-for-foreigners`
routes add unique canonicals, escaped structured data, sitemap coverage, and
internal links. Validation covered all Go tests, golangci-lint, Biome, Node
tests, TypeScript, the Next static export, exported HTML, and desktop/mobile
browser smoke. Research and the claim boundary are in
`docs/research/2026-07-31-launch-trust-handoff.md`.

Research recorded the same night in `docs/research/`:
`2026-07-31-dlt-source-and-process-evidence.md` (official DLT pages serve
JavaScript-only shells, `ttms.dlt.go.th` fails certificate verification, both
upstream hosts allow all crawlers and set no content signals, and the
proven/official-only/reported split with its unresolved conflicts) and
`2026-07-31-brand-domain-recheck.md` (all six `.com` candidates still return RDAP
404, `queuescout.com` is registered, GitHub handles free).

After the two features were integrated, the same night continued with quality
work on the merged surface:

- eight area hubs instead of four (Koh Samui/Surat Thani, Krabi, Hua Hin/Prachuap
  Khiri Khan, and Udon Thani added); Songkhla deliberately left unpublished
  because every one of its entries was marked closed;
- WCAG AA contrast fixed on the paper launch surface (the muted token reads
  4.21:1 on #f5f1e8; content text is now stone-600 at 6.77:1) and the `main`
  landmark restored on guide pages;
- Open Graph and Twitter metadata added site-wide with per-page overrides;
- internal links from the home page and `/appointments` into the hubs and guides;
- `npm run data:check` wired into CI and `make test`, and
  `npm run content:review` added so dated third-party claims cannot rot unnoticed;
- `docs/research/2026-08-01-content-surface-gap-analysis.md` records that the
  planned search architecture is fully shipped, that hubs reach 20 of the 115
  marked-open offices, and that the next hubs should be chosen from real query
  data rather than office counts.

Domain registration, deployment, Search Console, analytics, and other external
account changes still require an immediate recheck and explicit authorization.
The next product expansion should be selected from real launch evidence rather
than assumed notification demand.

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
`specs/014-launch-trust-handoff` are complete and validated. Validation notes
live in each feature's `tasks.md`. Platform: Node 26, Biome 2.5, golangci-lint v2 + gofumpt, PostgreSQL 18,
Go 1.26, shadcn/ui + FSD + BEM + `tw` prefix (see AGENTS.md and
`docs/adr/ADR-001-ui-kit-strategy.md`).

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
