# Feature 015 Tasks

- [x] T1501 Record the clean baseline, current refs, and completed-feature state.
- [x] T1502 Research the current Bangkok search landscape and official foreigner entry.
- [x] T1503 Verify Bangkok office IDs, exact names, geography, and precision locally.
- [x] T1504 Specify the office-hub scope, acceptance criteria, and claim boundary.
- [x] T1505 Define the FSD, static-export, evidence, validation, and rollback plan.
- [x] T1506 Create this executable checklist with exactly 20 bounded tasks.
- [x] T1507 Read installed Next.js guidance and attempt required modern-web guidance.
- [x] T1508 Add a typed, page-local Bangkok office model from committed evidence.
- [x] T1509 Add regression tests for IDs, names, geography, provenance, and links.
- [x] T1510 Add the hero and compare-all and map-all discovery actions.
- [x] T1511 Add an accessible directory containing exactly five office entries.
- [x] T1512 Add contextual Calendar, Map, and History links for every office.
- [x] T1513 Add visible snapshot, live-state, provenance, and precision disclosures.
- [x] T1514 Add the static `/offices/bangkok` App Router page.
- [x] T1515 Add unique metadata, a canonical URL, and visible `ItemList` JSON-LD.
- [x] T1516 Link the hub from public navigation, Home, and Appointments.
- [x] T1517 Add the Bangkok hub to the generated sitemap.
- [x] T1518 Update research, README, product spec, roadmap, and task index.
- [x] T1519 Run tests, lint, typecheck, static build, HTML checks, and browser smoke.
- [x] T1520 Close the feature, audit the diff and claims, and commit locally.

## Validation

Validated on 2026-08-02:

- Rechecked the search-visible official foreigner entry, Bangkok office-selection
  results, current community uncertainty, committed DLT office fixture, and
  committed derived geodata. A bounded live office request timed out after 20
  seconds with no response bytes, so the directory makes no current operational
  claims and does not render the fixture's mutable opening-state value.
- `make test` passed with Node 26: all Go packages, Biome across 80 files, 12
  Node tests, and TypeScript completed successfully.
- `make lint` passed with golangci-lint 2.12.2 reporting `0 issues`; Biome again
  checked 80 files without diagnostics.
- `NEXT_PUBLIC_SITE_URL=https://thaiqueuescout.example NEXT_PUBLIC_SITE_NAME="Thai Queue Scout" npm run build`
  passed on Node 26.4.0. Next 16 statically rendered 14 routes, including the new
  `/offices/bangkok`, `robots.txt`, and `sitemap.xml`.
- Exported-HTML checks confirmed the unique title/description/canonical, visible
  `ItemList` JSON-LD with five `ListItem` records, five directory anchors, the
  exact Compare/Map routes, five each of Calendar/Map/History links, Home and
  Appointments links, sitemap coverage, and continued playground exclusion.
- Browser smoke passed at 1440×1000 and 390×844: one H1, five office articles,
  no horizontal overflow, no console warnings/errors, and the mobile office
  index scrolled to its target. This test found and fixed a static-host-sensitive
  full-path anchor by changing it to a same-document fragment.
- `git diff --check` passed. No API, upstream fixture, database, migration,
  dependency, deployment, domain, analytics property, or remote branch changed.
