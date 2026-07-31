# Feature 014 Tasks

- [x] T1401 Record the clean baseline, current refs, and completed-feature state.
- [x] T1402 Revalidate the official Smart Queue entry point and current market signal.
- [x] T1403 Separate product-verifiable claims from variable office procedure.
- [x] T1404 Specify the launch-trust scope, acceptance criteria, and explicit non-goals.
- [x] T1405 Define the FSD, static-export, privacy, evidence, and rollback plan.
- [x] T1406 Create this executable checklist with exactly 20 bounded tasks.
- [x] T1407 Read the relevant checked-in Next.js 16 guidance and inventory the existing UI kit.
- [x] T1408 Centralize product identity, trust copy, capabilities, and official external links.
- [x] T1409 Rewrite the home-page value proposition for Thai Queue Scout.
- [x] T1410 Establish one primary discovery action and one clear comparison alternative.
- [x] T1411 Add concise capability cards for Calendar, Compare, Map, and History.
- [x] T1412 Add visible independence, privacy, freshness, and no-booking disclosure.
- [x] T1413 Add a three-step discovery flow with a safe official DLT hand-off.
- [x] T1414 Add the static, indexable `/appointments` product-intent route.
- [x] T1415 Add the evidence-bounded `/guides/dlt-smart-queue-for-foreigners` route.
- [x] T1416 Add unique metadata, canonical URLs, and appropriate structured data.
- [x] T1417 Add sitemap entries and internal links for the new public routes.
- [x] T1418 Add focused regression tests for launch content and configuration contracts.
- [x] T1419 Run lint, tests, typecheck, static build, exported-HTML checks, and diff audit.
- [x] T1420 Update research, roadmap, task index, close the feature, review, and commit locally.

## Validation

Validated on 2026-07-31:

- Rechecked the official Smart Queue and foreigner entry routes, current market
  signal, contradictory office anecdotes, and the brand-domain RDAP signal.
  `thaiqueuescout.com` returned a point-in-time Verisign RDAP `404`; no purchase
  or external account mutation occurred.
- `make test` passed with Node 26: all Go packages, Biome, 9 Node tests, and
  TypeScript completed successfully.
- `make lint` passed: golangci-lint reported `0 issues`, and Biome checked 74
  files without diagnostics.
- `NEXT_PUBLIC_SITE_URL=https://thaiqueuescout.example NEXT_PUBLIC_SITE_NAME="Thai Queue Scout" npm run build`
  passed on Node 26.4.0. Next 16 statically rendered 13 routes, including `/`,
  `/appointments`, `/guides/dlt-smart-queue-for-foreigners`, `robots.txt`, and
  `sitemap.xml`.
- Exported-HTML checks confirmed the new value proposition, canonical URLs,
  escaped `CollectionPage`/`Article` JSON-LD, safe external-link attributes,
  new sitemap entries, and continued playground exclusion.
- Browser smoke passed at 1440×1000 and 390×844 for Home. Separate accessibility
  snapshots for Appointments and the guide confirmed one H1, ordered section
  headings, internal discovery links, and labelled official new-tab hand-offs.
- `git diff --check` passed. No backend contract, database, deployment, domain,
  analytics property, or remote branch was changed.
