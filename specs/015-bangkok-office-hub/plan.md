# Feature 015 Plan

## Product Direction

Extend the calm field-guide surface from Feature 014 with a numbered Bangkok
office ledger. The memorable element is a five-row route board: exact official
snapshot names on the left, evidence and map precision in the middle, and clear
discovery actions on the right. It should help a visitor choose what to inspect,
not imply that a static directory knows today's operational state.

## Architecture

```text
app/offices/bangkok (metadata + ItemList JSON-LD only)
  -> views/bangkok-offices
       -> entities/dlt (committed geo dataset)
       -> widgets/public-site-chrome
       -> shared/config/site
       -> shared/ui
```

- Keep the route file thin and render the page as a static Server Component.
- Put single-use Bangkok composition and typed link contracts in the
  `views/bangkok-offices` slice; do not invent an entity or feature abstraction.
- Import committed geography through the `entities/dlt` public API and fail
  loudly at module initialization if one of the five required records is absent.
- Keep the exact English office names beside the page model because the
  committed upstream fixture is test evidence, not frontend runtime input.
- Reuse the public header/footer and existing Button/Badge primitives; add no
  dependency and no client boundary.
- Put the route path in `shared/config/site.ts` because public navigation,
  metadata, sitemap, Home, and Appointments all consume it.
- Render one visible office list and build matching `ItemList` JSON-LD from the
  same exported model. Use the existing escaped serializer.

## Evidence and Claim Policy

- Safe: exact committed upstream office IDs and English names.
- Safe with attribution: Thai search names, district coordinates, generation
  time, matched place text, and OpenStreetMap attribution from the committed
  geodata.
- Safe: linked tools resolve live or stored appointment observations and label
  their source/freshness.
- Variable: `app_open`, opening hours, availability, walk-ins, documents,
  eligibility, language support, and office quality. Do not render or infer them.
- The coordinate is a district anchor, not a front-door pin or route guarantee.

## Modern Web and Next.js Decisions

- Installed Next.js 16 guidance confirms that the static view can remain a
  Server Component, which avoids shipping unnecessary client JavaScript.
- Use semantic headings, a list of offices, descriptive link text, and visible
  non-color evidence labels. Cards do not receive nested click handlers.
- Use static metadata and a self-canonical route.
- Render JSON-LD with a native script tag and the existing serializer that
  replaces opening angle brackets.
- Add the route through the `sitemap.ts` metadata convention and verify the
  exported HTML instead of relying on development rendering.
- The external modern-web guidance package could not be loaded: sandbox DNS was
  unavailable, unsandboxed registry execution was rejected as unsafe, and no
  local cache existed. No workaround or new dependency is introduced.

## Constitution Check

- No backend endpoint, upstream contract, database, auth, booking, payment,
  notification, worker, queue, or Redis change.
- No source fixture mutation and no attempt to refresh data during builds.
- FSD imports point downward; the route file contains route concerns only.
- No personal data, third-party runtime, analytics, or external account change.

## Validation

1. Run focused page-model and existing Node tests with Node 26.
2. Run all Go tests, Biome, TypeScript, and golangci-lint.
3. Build the static site with an explicit public URL and site name.
4. Inspect the exported route, Home, Appointments, sitemap, canonical metadata,
   JSON-LD, five IDs/names, and query links.
5. Browser-smoke the new page at desktop and mobile widths with an accessibility
   snapshot and screenshots.
6. Run `git diff --check`, review scope/claims, close tasks, and commit locally.

## Rollback

The slice is static content, configuration, and documentation only. Revert its
local commit to remove the route and links; no schema, remote state, or migration
needs rollback.
