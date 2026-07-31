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
