# Task Index

## Active Feature

`specs/016-license-authority-rebrand/` — the licence-authority rebrand, in
progress. One branch is complete, validated, and pushed:
`feat/016-unified-chrome`. It contains `feat/015-local-hubs-guides` (area office
hubs and licence guides), the site-chrome unification, and a merge of everything
the parallel session put on `main` (Bangkok directory, availability guide,
comparable history changes, map status radar). `main` is an ancestor of it, so:

```bash
git merge --ff-only feat/016-unified-chrome
```

If the parallel session has since added more commits to `main`, merge normally
and re-run `npm test && npm run build` before pushing.

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

**Feature 016, the licence-authority rebrand, is implemented and validated
(2026-08-01) on `feat/016-unified-chrome`, pushed.**

What changed, in one paragraph: the product is no longer an appointment-slot
finder called Thai Queue Scout. It is **Thai Driving License** on
`thai-driving-license.com` (defensive: `thai-driving-licence.com`;
`thai-driver-license.com` rejected), and it now answers the whole licence
question, with the availability tools kept as the evidence layer underneath.

Shipped tonight:

- `/licence` — 20 statically exported pages: eight licence journeys (first
  licence, renewal, conversion, motorcycle, international permit, lost or
  damaged, expired, five-year) and twelve process pages (tests, theory,
  practical, aptitude, e-learning, medical certificate, residence certificate,
  documents, costs, processing time, road rules, FAQ). Roughly 295 statements,
  each labelled observed / DLT-only / dated third-party report, with sources and
  read dates, prerequisite and next-step chaining, and a start-here table that
  maps a situation to a page.
- 206 per-office pages at `/offices/site/<id>` plus `/offices/all`, so every
  office in the captured list that has a name and a position is reachable.
- Brand assets the project never had: `icon.svg`, apple icon, and generated
  1200×630 Open Graph and Twitter images, with explicit content types because
  Next emits them without a file extension.
- The two topic guides that duplicated the cluster now 301 to it; `/guides`
  keeps only the evidence guides.

Evidence: `docs/research/2026-08-01-keyword-brand-demand.md` and
`docs/research/2026-08-01-domain-availability-rebrand.md`. Validation is in
`specs/016-license-authority-rebrand/tasks.md`.

**Open for the owner:** register the domain (nothing was purchased), point DNS
and the Cloudflare Pages project at it, then create Search Console and analytics
properties. The repository name, the Go module path, and the Cloud Run service
name still carry the old identity on purpose — each is a separate migration.


Four features landed across the night of 2026-07-31 to 2026-08-01, built by two
sessions working in parallel. Read the specs by name, not by number: both
sessions numbered their work `015` and `016`.

### This session's branch (`feat/016-unified-chrome`, includes `feat/015-local-hubs-guides`)

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

Keyword-demand and brand-phrasing research is recorded in
`docs/research/2026-08-01-keyword-brand-demand.md`, and domain availability in
`docs/research/2026-08-01-domain-availability-rebrand.md`. Google autocomplete
and competitor URL spelling both favour US `thai driving license` over
`thai driver license`; Thailand's own English register is UK `licence` (the
official app is `th.go.dlt.qrlicence`).

**Decision of record (2026-08-01, owner's call):** the product is renamed
**Thai Driving License** on **`thai-driving-license.com`**, with
`thai-driving-licence.com` as the defensive redirect and `thai-driver-license.com`
rejected. The positioning widens from slot discovery to closing the whole licence
question. See `specs/016-license-authority-rebrand/spec.md`.

The keyword research argued the opposite — keep the old brand and use a keyword
domain only as a redirect, because Google serves the same corpus for both
spellings. That dissent is recorded in the feature spec so a later reversal has
its reasoning ready; it does not describe the current decision.

Domain registration, deployment, Search Console, analytics, and other external
account changes still require an immediate recheck and explicit authorization.
The next product expansion should be selected from real launch evidence rather
than assumed notification demand.

### The other session's work, already on `main`

Feature 018 (Map status radar) is complete and validated (2026-08-02). It adds
URL-driven filtering for all five existing stored Map statuses, keeps counts
search-scoped, filters Leaflet and the semantic text path through one office
list, and preserves `available=1` as a legacy alias. Targeted Biome, TypeScript,
a 15-route production build, exported-output inspection, and URL/diff/scope/
claim/task-count audits passed. Per the user's instruction, no test suite ran
and no test file was added.

Research and the office-claim boundary are recorded in
`docs/research/2026-08-02-map-status-radar.md`.

There is no active implementation feature. Context-preserving discovery links
remain a small UX candidate. Procedure source cards require exact procedure
mapping and fresh official evidence before implementation.

Feature 017 (comparable stored History changes) is complete and validated
(2026-08-02). It annotates adjacent newest-first History observations only when
their exact `current_date` request horizon matches, exposes changed, unchanged,
not-comparable, and loaded-window baseline states, and adds an accessible
change signal without new collection, migrations, routes, dependencies, or
external mutations. Focused Go service/handler tests, native Node model tests,
TypeScript, targeted Biome, a 15-route production build, exported-output checks,
and diff/task-count/claim audits passed.

Research and the claim boundary are recorded in
`docs/research/2026-08-02-comparable-history-changes.md`.

There is no active implementation feature. Current external evidence supports
helping users evaluate alternative offices, but not promising that every
foreign applicant can use every office. Select the next slice from real usage
or launch evidence and preserve that procedure/eligibility boundary.

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
`docs/research/2026-07-24-market-seo-domain.md`. Its Thai Queue Scout /
`thaiqueuescout.com` conclusion is superseded: the brand and domain of record
are now decided by the licence-authority rebrand in
`specs/016-license-authority-rebrand/`. Before provisioning, recheck the domain
and brand, then explicitly authorize domain registration and cloud-account
changes.

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
`specs/018-map-status-radar` are complete and validated. Validation notes
live in each feature's `tasks.md`. Platform: Node 26, Biome 2.5, golangci-lint v2 + gofumpt, PostgreSQL 18,
Go 1.26, shadcn/ui + FSD + BEM + `tw` prefix (see AGENTS.md and
`docs/adr/ADR-001-ui-kit-strategy.md`).

## Important Context

- Raw DLT research is in `docs/idea.md`.
- Upstream strings must be preserved exactly.
- MVP is read-only discovery; no auth, no booking, no queues, no Redis.
