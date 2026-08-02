# Feature 016 Plan

## Execution model

The owner asked for a large night batch with subagents and no new test suites.
The work is therefore split by **file ownership** so several agents can write at
once without touching the same file. The orchestrator keeps: decisions, the
registry wiring, integration, the build, and the commits.

| Owner | Files |
| --- | --- |
| Orchestrator | `entities/guide/model/journey.ts`, `journeys.ts`, `entities/guide/index.ts`, `views/licence*`, `app/licence/**`, `shared/config/site.ts`, `shared/config/static-routes.ts`, all `specs/016-*` |
| Content agent A | `entities/guide/model/journeys-licence.ts` |
| Content agent B | `entities/guide/model/journeys-process.ts` |
| Copy agent | `views/home`, `widgets/discovery-capabilities`, `views/dlt-foreigner-guide`, `views/availability-evidence-guide`, `app/guides/how-to-read-dlt-availability` |
| Assets agent | `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/layout.tsx` |
| Docs agent | `docs/**` except the two 2026-08-01 research files, `CONTRIBUTING.md`, `THIRD_PARTY_NOTICES.md` |
| Office agent | `views/office-detail`, `app/offices/site/**`, `widgets/office-directory-table` |
| Research agents | `docs/research/2026-08-01-*.md` |

## Naming decision procedure

1. Keyword agent measures demand for `driving license` / `driver license` /
   `driving licence` with autocomplete, SERP composition, and competitor URL
   vocabulary, and writes the recommendation.
2. Domain agent checks RDAP for every candidate, whether taken ones resolve to a
   live competitor, and handle availability.
3. The orchestrator picks the name only when both land, then changes
   `SITE_NAME` in one place. The audit proved that single constant plus
   `.env.example` drives ~90% of the rendered brand.
4. The losing spelling becomes the defensive registration recommendation. No
   domain is purchased here — that is the owner's action.

## Content contract for the licence cluster

Same three claim kinds as the guides, enforced by the type system:

- `proven` — observed in the appointment data this project reads.
- `official-only` — only DLT can confirm it; we name the question, not the answer.
- `reported` — dated, attributed, with an HTTPS source read on a stated date.

Journeys add `audience`, `outcome`, `prerequisites`, `nextSteps`, and a
`keyword` that is either an exact upstream work option or `null` with a note
saying the booking contract cannot express that step. Cross-links between
journeys are validated by `danglingJourneyLinks()` so a renamed slug surfaces as
a broken chain rather than a dead link.

## What must not change

- Upstream DLT strings, route slugs that describe the upstream service
  (`/guides/dlt-smart-queue-for-foreigners`, `/guides/how-to-read-dlt-availability`).
- The independence, privacy, and availability notices.
- The Go module path, the GitHub repository name, and the Cloud Run service
  name — each is a separate migration with real breakage risk.
- Dated research documents: they get a superseded banner, never a rewrite.

## Validation (no new test suites, per the owner)

Biome, TypeScript, the production static export, exported-HTML checks for brand
residue and canonicals, an internal-link audit, and a browser pass at desktop and
mobile widths. The existing suite must still pass; the only test file touched is
the sitemap route table, which learns about the new registry.

## Rollback

Content, config, and static routes. Reverting the feature's commits restores the
previous brand and route set; no schema, no external state, nothing purchased.
