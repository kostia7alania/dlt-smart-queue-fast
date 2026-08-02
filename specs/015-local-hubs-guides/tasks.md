# Feature 015 Tasks

Twenty bounded tasks for the night of 2026-07-31. Each task ends with a working
tree that lints, builds, and is committable on its own.

- [x] T1501 Detect the concurrent session, isolate this work in a git worktree, and record the baseline refs.
- [x] T1502 Verify what official DLT web properties actually serve to a plain fetch, and record it.
- [x] T1503 Record the crawl-policy and politeness posture observed on the upstream hosts.
- [x] T1504 Separate proven, official-only, and third-party-reported licence-process claims into dated notes.
- [x] T1505 Recheck the brand and domain candidates against the registry and record the point-in-time result.
- [x] T1506 Write the feature specification, including its relationship to Feature 014.
- [x] T1507 Write the plan: data flow, city registry, claim policy, merge contract, validation, rollback.
- [x] T1508 Build the office-directory generator tool with committed provenance and an optional live source.
- [x] T1509 Generate the committed office-directory dataset and test the generator's invariants.
- [x] T1510 Add the directory model, city registry, and selectors with unit tests.
- [x] T1511 Add the shared office-directory table widget.
- [x] T1512 Add the `/offices` index route with per-city coverage counts.
- [x] T1513 Add the statically exported `/offices/[city]` hub route.
- [x] T1514 Add city-scoped Calendar, Compare, and Map deep links with the 8-office cap stated honestly.
- [x] T1515 Add the typed guide content model with proven/official-only/reported claim categories.
- [x] T1516 Add the `/guides` index route.
- [x] T1517 Add `/guides/renew-thai-driving-license`.
- [x] T1518 Add `/guides/convert-foreign-driving-license-thailand`.
- [x] T1519 Add metadata, canonicals, breadcrumb and item-list structured data, and sitemap entries with tests.
- [x] T1520 Run the full validation suite, audit claims and diff, update docs, close the feature, commit, and push the branch.

## Validation

Performed 2026-07-31 in the isolated worktree
(`/Users/kostiabazrov/Documents/apps/pet/dtl-parser-015`), Node 26.5.0, Go 1.26.4.

**Automated**

- `npm test` — 46 node tests pass, covering: generator invariants and upstream
  name preservation (`Phuket Provincial Land Land Transport Office`,
  `Samut PrakanProvincial…`, `Site For Test`, `-`, `""`, `null`); derived totals;
  city-registry integrity (existing IDs, no ID in two hubs, URL-safe slugs, map
  search terms selecting exactly their hub); Compare selection preferring
  appointment-open offices and reporting omissions; deep links round-tripping
  through the views' own parsers with the leading space of `" RENEW THAI"`
  intact; guide attribution rules; JSON-LD escaping; and sitemap coverage of
  every hub and guide slug with `/playground` excluded.
- `npx tsc --noEmit` — clean.
- `npx biome check .` — clean.
- `NEXT_PUBLIC_SITE_URL=https://thaiqueuescout.com npm run build` — 19 static
  pages, including `/offices`, four hubs, `/guides`, and two guides.
- `cd apps/api && go test ./...` — all packages pass, proving the backend is
  untouched by this feature.
- `git diff --check` — no whitespace errors.

**Exported-output checks**

- `out/offices/phuket.html` contains
  `<link rel="canonical" href="https://thaiqueuescout.com/offices/phuket">`, the
  title `DLT offices in Phuket | Thai Queue Scout`, breadcrumb plus item-list
  JSON-LD, and the upstream name with its duplicated word intact.
- `out/sitemap.xml` lists 13 URLs: home, calendar, offices index, four hubs, map,
  compare, guides index, two guides, and history.
- No page contains `guaranteed`, `fast track`, or `reserved slot`.

**Browser pass over the exported output** (static file server on 127.0.0.1:4315)

- `/offices/chiang-mai` renders the nav, breadcrumb, honest cap note ("All 5
  offices fit inside the 8-office comparison limit"), the capture-dated coverage
  sentence ("3 of 5 were marked open … on 2026-07-31"), and per-office rows with
  `app_open` badges, position precision, and Calendar/Map links.
- Both guides render one evidence badge per section, with per-claim attribution
  and read dates on reported claims. No console errors.
- Mobile (375×812): no page-level horizontal overflow; the office table scrolls
  inside its own `overflow-x: auto` container (327 visible, 395 content).

**Not covered**

- PostgreSQL integration tests were not run: Docker was not running on the host,
  so `repo` integration tests skipped as designed.
- The parallel feature-014 branch was not merged, so the shared public chrome and
  its trust copy are not yet adopted here; `widgets/discovery-nav` and
  `shared/config/official-links.ts` are the documented temporary stand-ins.

## Integration with Feature 014 (same night)

Feature 014 landed on `main` at 19:58, after this feature's first validation
pass. The merge contract in `plan.md` was then executed as a second batch.

- [x] T1521 Inspect what 014 shipped: `site.ts` constants, `json-ld.ts`, the public chrome, and its sitemap.
- [x] T1522 Rebase `feat/015-local-hubs-guides` onto `main` and resolve the three expected conflicts.
- [x] T1523 Adopt `widgets/public-site-chrome` on all four new routes and delete `widgets/discovery-nav`.
- [x] T1524 Fold `shared/config/official-links.ts` into `shared/config/site.ts` and delete the stand-in.
- [x] T1525 Move the breadcrumb and item-list builders into `shared/lib/json-ld.ts` and delete the duplicate module.
- [x] T1526 Add `/offices` and `/guides` to the public navigation so both features cross-link.
- [x] T1527 Re-run the full validation suite on the merged tree.
- [x] T1528 Re-verify the merged surface in the browser at desktop and mobile widths.
- [x] T1529 Merge the documentation narratives for both features.
- [x] T1530 Commit the integration and push the branch.

### Conflict resolutions

| File | Resolution |
| --- | --- |
| `apps/web/package.json` | Kept the broad `src/**/*.test.mts` glob, which also covers 014's test files. |
| `apps/web/src/app/sitemap.ts` | Kept the tested `STATIC_ROUTES` table and added 014's `/appointments` and foreigner-guide entries to it. |
| `README.md`, `docs/ROADMAP.md`, `docs/TASK_INDEX.md` | Merged both narratives; roadmap phase 5 now lists both features as done. |

The sitemap test was strengthened while resolving: any path that is not a
registry-backed hub or guide must have a matching `src/app/<path>/page.tsx`, so
the table cannot list a page that does not exist — including pages owned by other
features.

### Integration validation (2026-07-31, merged tree)

- `npm test` — 48 node tests pass (46 from this feature plus 014's site-config
  and JSON-LD cases, now including the breadcrumb/item-list builders).
- `npx tsc --noEmit`, `npx biome check .` — clean.
- `npm run build` — 21 static pages: home, `/appointments`, calendar, compare,
  map, history, playground, `/offices` + 4 hubs, `/guides` + 2 guides + 014's
  foreigner guide, robots, sitemap.
- `cd apps/api && go test ./...` — all packages pass.
- Browser pass on the exported output: the shared header/footer render on
  `/offices`, hubs, `/guides`, and guide pages; navigation exposes Offices and
  Guides; the footer's official link keeps `rel="noopener noreferrer"`; mobile
  375 px shows no page-level overflow and the office table scrolls inside its own
  container.

## Accessibility and staleness pass (post-integration)

- [x] T1531 Restore the `main` landmark on guide pages, lost while adopting the shared chrome.
- [x] T1532 Measure text contrast on the paper surface and fix what fails WCAG AA.
- [x] T1533 Guard the committed dataset against drift in CI and `make test`.

Findings and fixes:

- `text-muted-foreground` (#737373) reads at **4.21:1** on the launch surface's
  paper background (#f5f1e8) — below the 4.5:1 AA threshold for body text. All
  five content files now use `stone-600` (#57534e): **6.77:1** on paper and
  **7.63:1** inside white cards. Inline links moved to `stone-950` with an offset
  underline (17.53:1).
- Re-measured in the browser over the exported pages with a canvas-based colour
  resolver (computed styles are `lab()`, so naive string parsing gives wrong
  ratios): Bangkok hub 57 text nodes and the conversion guide 32 text nodes, both
  with **zero** contrast failures; heading order `H1>H2…` with no skips; every
  link has an accessible name; every `th` carries `scope`; exactly one `main`,
  one site header, and one footer per page.
- External links keep `rel="noopener noreferrer"`, and third-party sources also
  carry `nofollow`; the only non-source external host is `gecc.dlt.go.th`.
- `npm run data:check` (`build-office-directory.mjs --check`) now runs in the web
  CI job and `make test`; verified it reports "current" on the committed dataset
  and exits 1 after a single edited total.

## Coverage expansion (same night)

- [x] T1534 Publish four more area hubs where the captured list proves coverage.
- [x] T1535 Link the published areas from the home page body, not only the header nav.

New hubs, each with a hand-written honest summary rather than a template:

| Hub | Offices | Marked open | Notes carried onto the page |
| --- | --- | --- | --- |
| `koh-samui` (Koh Samui and Surat Thani) | 5 | 5 | Island served by the Koh Samui branch; four mainland alternatives |
| `krabi` | 2 | 2 | Province office name is spelled with a doubled word upstream and kept as-is |
| `hua-hin` (Hua Hin and Prachuap Khiri Khan) | 3 | 3 | No office is named Hua Hin; Pranburi branch is the nearest entry |
| `udon-thani` | 8 | 1 | Widest spread, least availability; two entries are a hospital sub-branch and a mall counter with no mapped position |

Songkhla/Hat Yai was considered and deliberately left unpublished: all three of
its entries were marked closed in the capture, so a page would add a route
without adding an answer. The "unknown slug" test now uses `songkhla` to record
that decision.

Home gains a "START FROM YOUR AREA" strip rendered from the hub registry, so the
eight areas, the index, and the guides are reachable from the page body as well
as the header. Measured on the exported home page: heading 6.75:1, links
17.53:1, heading order `H1>H2…` with no skips.

Validation after the expansion: 48 node tests, tsc, Biome, and a 25-page static
build (19 sitemap URLs).
