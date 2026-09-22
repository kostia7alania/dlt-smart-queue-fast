# Feature 022 Tasks

- [x] T2201 Confirm the clean remote base, current production URL and existing SEO surface.
- [x] T2202 Define the Search Console, synthetic audit and real-user evidence boundaries.
- [x] T2203 Create the URL-prefix property and obtain the HTML verification token.
- [x] T2204 Render the verification tag and pass the focused web checks.
- [x] T2205 Deploy the exact revision, verify ownership and submit the sitemap.
- [x] T2206 Audit representative desktop and mobile public journeys.
- [x] T2207 Ship and verify only high-impact blockers found by the audit.
- [x] T2208 Record Search Console state, deployment evidence and remaining B07 work.

## Local validation

Checked on 2026-09-22:

- `npm run lint`, `npm run typecheck`, `npm run test` and `npm run data:check`
  passed. Biome checked 136 files, all 60 tests passed and the 218-entry
  committed office fallback remained reproducible.
- The configured free production build passed and generated 255 static pages.
  Its valid XML sitemap contains 243 URLs and excludes `/calendar`, `/compare`
  and `/history`; those routes render `noindex, follow` with a plain-language
  full-BFF boundary.
- No exported HTML file links to the three unavailable routes in the free
  build. Setting `NEXT_PUBLIC_SLOT_TOOLS_ENABLED=true` retains the full-BFF
  product path without changing consumers or route contracts.
- `make worker-check` passed Worker TypeScript and the Wrangler dry-run with
  2,721 static assets.

## Production validation

Verified on 2026-09-22:

- Google Search Console auto-verified the exact URL-prefix
  `https://thai-driving-license.kostia7alania.workers.dev/` through the
  persistent HTML meta tag. `/sitemap.xml` was submitted; its immediate initial
  status was `Couldn't fetch`, while direct Googlebot and normal requests
  returned valid `application/xml`. URL Inspection's live test reported that
  `/` is available to Google and can be indexed; it was not indexed yet.
- Final application commit `59a81ca` matched `origin/main`. GitHub CI run
  `35709770725` passed, and Cloudflare version
  `c58ad1bb-4279-402f-82b0-c9f2a19dcec3` deployed that configured export.
- `/`, `/calendar`, `/sitemap.xml` and `/healthz` returned HTTP 200. Root HTML
  contains the Search Console tag and `index, follow`; the unsupported calendar
  page contains `noindex, follow` and no raw API error.
- Desktop checks covered home, office discovery, the stored office snapshot,
  map and the direct unsupported-tool state. The map loaded all 218 offices
  from the Cloudflare snapshot without requesting slot data.
- At 390 x 844, the home document had no horizontal overflow
  (`scrollWidth = innerWidth = 390`), the primary office path loaded without an
  unavailable comparison link, and the map remained within the viewport.

## Remaining evidence boundary

This feature proves crawlability and synthetic journeys only. Search Console
has no ranking or traffic evidence yet, its sitemap read must be rechecked
after processing, and B07 still requires 10 real user journeys or direct user
feedback.
