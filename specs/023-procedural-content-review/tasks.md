# Feature 023 Tasks

- [x] T2301 Confirm the clean remote base and select B03 from the ready backlog.
- [x] T2302 Define the official-source claim boundary and bounded review scope.
- [x] T2303 Record the official source pack and current reachability findings.
- [x] T2304 Add the typed official evidence kind and accessible shared rendering.
- [x] T2305 Review first-licence, renewal and conversion journey claims.
- [x] T2306 Review shared documents, fees, expiry and timing claims in scope.
- [x] T2307 Extend content freshness reporting to dated official claims.
- [x] T2308 Run focused checks and inspect the configured static output.
- [x] T2309 Update project state, backlog and hand-off evidence.

## Validation

Checked on 2026-09-22:

- `npm run lint`, `npm run typecheck`, `npm run test` and `npm run data:check`
  passed. Biome checked 136 files, all 60 tests passed and the 218-entry office
  fallback remained reproducible.
- The configured free production build passed and generated 255 static pages.
  The first sandboxed build attempt was blocked when Turbopack tried to bind a
  local port; the permitted rerun completed without a source change.
- Static HTML for the six reviewed pages with official claims contains the
  official evidence label, exact government link and `2026-09-22` access date;
  official links do not receive the third-party `nofollow` marker. The timing
  page keeps its five re-read third-party claims explicitly attributed and
  dated instead of inventing an official duration.
- Application commit `8e755ac` passed GitHub CI run `35714408763` and was
  deployed to the public Worker as Cloudflare version
  `15fb0b66-9b31-4925-a1dd-3565eb89530c`. Post-deploy checks returned HTTP 200
  for health, home, renewal, calendar and the office-snapshot API. The public
  renewal page contains the exact DLT and PRD links plus the `2026-09-22`
  access date; home remains `index, follow`, calendar remains `noindex, follow`,
  and the live snapshot contains 218 offices.
- The 30-day report now lists 77 dated claims and 13 guides due, down from 91
  claims and 20 guides. No unreviewed source date was advanced.

## Remaining boundary

This feature closes the high-intent B03 slice. Thirteen lower-priority pages
still carry explicitly dated third-party claims beyond the 30-day launch-review
threshold. They remain honest ongoing maintenance rather than a blocker for the
reviewed new, renewal, conversion and preparation journeys.
