# Feature 015 Plan

## Working Context

Two sessions were active in this repository on 2026-07-31 at 19:32. The second
session owns Feature 014 in the primary working tree. This feature is developed
in an isolated git worktree so that builds, `out/`, `node_modules`, and commits
cannot collide:

```text
/Users/kostiabazrov/Documents/apps/pet/dtl-parser       main        (feature 014, other session)
/Users/kostiabazrov/Documents/apps/pet/dtl-parser-015   feat/015-…  (this feature)
```

## Data Flow

```text
docs/assets/1-get-dlt-offices.json      (captured upstream office list)
entities/dlt/data/office-geo.json       (committed Nominatim geocodes)
        |
        v
tools/build-office-directory.mjs        (generator, --from-api optional)
        |
        v
entities/dlt/data/office-directory.json (committed, provenance-stamped)
        |
        v
entities/dlt/model/office-directory.ts  (types, city registry, selectors)
        |
        +--> views/offices          -> /offices
        +--> views/office-city-hub  -> /offices/[city]      (generateStaticParams)
        +--> views/guides           -> /guides, /guides/<slug>
```

Nothing in this chain calls the DLT upstream or the Go API at build time. The
generator may be pointed at a running local API (`--from-api`) when refreshing
the capture, and prints a diff summary instead of silently rewriting names.

## City Registry

Four hubs, chosen because the dataset proves multi-office coverage and the
market research names them as the strongest initial audiences:

| Slug | Label | Site IDs | Notes |
| --- | --- | --- | --- |
| `bangkok` | Bangkok | 1, 2, 3, 4, 5, 209 | Five area offices plus the registration section entry |
| `chiang-mai` | Chiang Mai | 19, 20, 123, 124, 125 | Two city offices plus Fang, Chom Thong, Mae Taeng branches |
| `pattaya` | Pattaya and Chonburi | 33, 113, 114, 115 | Bang Lamung branch is the Pattaya-area office |
| `phuket` | Phuket | 84 | Single office; the page must say so plainly |

The registry is committed data with a test asserting every ID exists in the
dataset and that no ID appears in two hubs.

## Architecture

- `app/offices/page.tsx`, `app/offices/[city]/page.tsx`,
  `app/guides/page.tsx`, `app/guides/<slug>/page.tsx` hold metadata,
  `generateStaticParams`, and JSON-LD only.
- Views render the content; a small `widgets/office-directory-table` renders the
  per-office table so `/offices/[city]` and future pages share one layout.
- Guide bodies live in the view layer as typed content structures, not MDX, to
  avoid a new dependency and to keep claim categories enforceable by types:
  `proven` / `official-only` / `reported`.
- `reported` entries carry `source`, `sourceUrl`, and `observedOn`, and render
  with visible attribution.

## Claim Policy

Inherited from Feature 014 and tightened for guides:

- Safe: what the dataset contains, what the upstream flag says, what this
  service does and does not do, where the official service lives.
- Official-only: documents, tests, fees, medical certificates, translation and
  residence requirements, walk-in acceptance, eligibility, online renewal
  availability.
- `reported` claims MUST name the third-party source and the date it was read,
  and MUST be phrased as a report, never as a requirement.
- Forbidden words: `official` (about us), `guaranteed`, `reserved`,
  `fast track`, and any statement that a shown slot will still exist.

## Merge Contract with Feature 014

- Do not modify `views/home`, `app/page.tsx`, `app/appointments/**`,
  `app/guides/dlt-smart-queue-for-foreigners/**`,
  `widgets/public-site-chrome/**`, or `shared/lib/json-ld.ts` on this branch.
- If 014 lands first, rebase and adopt its chrome and JSON-LD helper before
  final validation, replacing the local minimal equivalents.
- If 014 has not landed, this branch keeps a local `escapeJsonLd` helper in
  `shared/lib/structured-data.ts` under a distinct filename so the merge is
  additive, and links to `/appointments` are omitted rather than guessed.
- `app/sitemap.ts` conflict resolution: keep the union of both route lists,
  ordered by priority then path.

## Constitution Check

- No auth, payments, notifications, queues, Redis, workers, or new datastore.
- No ORM, no schema change, no Go business-logic change.
- Next.js stays UI-only and statically exportable; no server runtime added.
- Upstream strings preserved byte-for-byte, including known oddities.
- Each task is independently testable and reversible.

## Validation

1. `node --test` for the generator, directory model, city registry, sitemap.
2. `npx tsc --noEmit` and `npx biome check .`.
3. `NEXT_PUBLIC_SITE_URL=https://thaiqueuescout.com npm run build`, then assert
   the exported HTML for each new route contains its canonical, breadcrumb
   JSON-LD, and no forbidden claim word.
4. `cd apps/api && go test ./...` to prove the backend is untouched.
5. `git diff --check` plus a manual scope and claim audit.
6. Browser smoke over the exported static output for one hub and one guide.

## Rollback

Static content, one committed dataset, one generator script, and additive
routes. Reverting this branch's commits restores the previous route set; no
migration, no external state, no upstream calls.
