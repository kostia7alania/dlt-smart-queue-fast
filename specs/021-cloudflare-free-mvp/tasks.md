# Feature 021 Tasks

- [x] T2101 Verify the clean base and current Cloudflare, Workers, KV, cron, SEO and Next static-export constraints.
- [x] T2102 Define the zero-cost scope, BFF-compatible contracts, fallback and canonical migration plan.
- [x] T2103 Amend the constitution and mark Feature 021 active.
- [x] T2104 Implement Worker validation, KV snapshot, scheduled refresh, cooldown and static-asset routing.
- [x] T2105 Add the frontend same-origin/fallback data boundary and accessible office refresh panel.
- [x] T2106 Add focused contract tests and update operations, Free-plan and recovery documentation.
- [x] T2107 Run frontend, data, static-build, Wrangler type/config and local Worker smoke checks.
- [x] T2108 Create the free Cloudflare resources, deploy the exact revision and verify the public URL.
- [x] T2109 Record the deployed revision, URL, cron/KV state, validation evidence and remaining BFF limits.

## Local validation

Checked on 2026-09-21 before the production commit:

- `npm run lint`: Biome checked 134 files with no fixes.
- `npm run test`: 60 tests passed, including the new payload, change-diff and
  failed-attempt cooldown contracts.
- `npm run typecheck` and `npm run data:check`: passed; the committed fallback
  remains reproducible at 218 entries.
- Configured `npm run build`: passed and generated 255 static pages.
- `make worker-check`: generated current bindings with Wrangler 4.135.0,
  passed Worker TypeScript and bundled 2,721 asset files in dry-run mode.
- Local Worker smoke: empty KV used the committed capture; one manual refresh
  fetched 218 live rows, 114 marked open, one null name and three changed office
  IDs relative to the committed capture. An immediate repeat returned
  `cooldown` with the same `fetched_at`. The scheduled handler then completed as
  `unchanged` with 218 rows.
- Browser smoke: the office page and freshness panel rendered at desktop and
  390 x 844, and the manual cooldown message announced its exact UTC time.
- Full `make test` and `make lint` stopped before project checks because this
  host currently has neither `go` nor `golangci-lint`; no Go source changed.
  GitHub CI remains the exact-revision Go gate before production close-out.

## Production validation

Verified on 2026-09-21:

- Application commit `e851e08` was pushed to `origin/main`; GitHub CI run
  `35607461514` passed its `web`, `api` and `container` jobs. The API job ran Go
  tests with PostgreSQL 18 and golangci-lint; the web job included
  `make worker-check`.
- Cloudflare Worker
  `https://thai-driving-license.kostia7alania.workers.dev` is active at version
  `a412522d-14e3-4f0c-93ba-f0608c2e083b`, using KV namespace
  `8d0e349135304e819bf5dd5da489c5f4` and cron `17 */6 * * *`.
- `/`, `/offices`, `/robots.txt`, `/sitemap.xml` and `/healthz` returned HTTP
  200. Root and office canonicals use the exact `workers.dev` origin, public
  HTML is index/follow, and API JSON is `X-Robots-Tag: noindex`.
- Empty KV returned the committed 218-entry capture. The production manual
  refresh stored 218 upstream entries, 114 marked open and three changed IDs.
  An immediate repeat returned `cooldown`, the same `fetched_at` and the next
  allowed UTC time.
- A 390 x 844 browser pass rendered the live office snapshot and exposed the
  refresh control; pressing it announced the cooldown through the page status.
- `/v1/dlt/work-types` returned the intentional HTTP 501 boundary. Work types,
  slots, comparison data and durable history still require the future Go BFF.
