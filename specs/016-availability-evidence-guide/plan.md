# Feature 016 Plan

## Product Direction

Create a calm field manual for interpreting evidence, not another marketing
landing page. The memorable element is an evidence ledger: each status is paired
with the exact product predicate, the safe conclusion, and the conclusion that
must not be drawn. A separate tool matrix explains why the same office can look
different in Calendar, Compare, Map, and History.

## Architecture

```text
app/guides/how-to-read-dlt-availability
  -> views/availability-evidence-guide
       -> widgets/public-site-chrome
       -> shared/config/site
       -> shared/ui

interactive views
  -> shared/config/site (guide route only)
```

- Keep the App Router page thin: metadata, escaped Article JSON-LD, and the view
  export only.
- Keep definitions, guardrails, and tool behaviour in the single-use view model.
  Do not invent a new entity or feature.
- Export the page through its `index.ts`; keep model internals private to the
  route and focused tests.
- Put only the route constant and review date in `shared/config/site.ts`, because
  metadata, sitemap, public chrome, and multiple views consume them.
- Repeat a small contextual `Link` in the four client views instead of creating
  a speculative component abstraction.
- Keep the guide a Server Component. It needs no hydration or runtime data.

## Contract Mapping

### Sources

- `live`: the current Calendar or Compare action received the relevant payload
  from the upstream DLT service.
- `stored`: a previous successful observation was read from PostgreSQL. Its
  timestamp is evidence freshness, not an expiry promise.

### Map and history summaries

- `available`: at least one returned day in scope has an exact message other
  than `เต็ม`.
- `full`: scoped days exist and every exact message is `เต็ม`.
- `no_slots`: no scoped day exists in the stored payload.
- `not_offered`: the latest complete stored work-type lookup is empty.
- `unknown`: a work type is known but no usable stored slot payload exists.

History exposes only `available`, `full`, and `no_slots`; Map exposes all five.
The page will say this explicitly rather than implying one universal response
shape.

### Tool behaviour

- Calendar: resolves one office and first matching work type; prefers live and
  can visibly fall back to stored work types or slots.
- Compare: checks 1–8 offices sequentially, reuses snapshots up to ten minutes
  old, then tries live and may fall back to older stored data per office.
- Map: availability overlay is snapshot-only and never fans out live requests.
- History: rows are PostgreSQL-only; resolving the selected work type can use
  the existing live-with-stored-fallback client before the history read.

### Map precision

- `office`: exact office POI match.
- `district`: district-level fallback.
- `province`: province-centroid fallback.

## Modern Web and Next.js Decisions

- Installed Next.js 16 documentation supports a static Server Component for
  public shared content, static metadata, native JSON-LD script markup, and
  build-time prerendering.
- Use an `article`, ordered workflow, definition lists, semantic table with a
  caption and scoped headers, descriptive links, and visible non-color labels.
- Keep wide table content horizontally reachable on small screens.
- Serialize JSON-LD through the existing safe helper; do not add `schema-dts` or
  another dependency.
- The required external modern-web-guidance package was unavailable from the
  sandbox and absent from the local npm cache. No unsafe download workaround is
  introduced.

## Constitution Check

- No backend, database, upstream contract, queue, worker, Redis, auth, booking,
  notification, or payment change.
- No personal data, analytics, runtime third party, form, or external mutation.
- Route concerns remain in `app`; page content and model remain in one `views`
  slice; imports point down through public APIs.
- Exact upstream strings are preserved; uncertain operational claims remain out.

## Validation

1. Run focused model tests and the complete Node test set on Node 26.
2. Run Go tests, Biome, TypeScript, and golangci-lint.
3. Build with an explicit public URL and site name; confirm the guide is static.
4. Audit exported guide/public/discovery HTML, canonical metadata, JSON-LD,
   contextual links, status definitions, sitemap, and playground exclusion.
5. Browser-smoke desktop and mobile layouts, heading structure, table reach,
   fragment navigation, external hand-off, overflow, and console output.
6. Run diff/claim/task audits, close the feature, and commit locally.

## Rollback

The change is static frontend content, links, tests, and documentation. Revert
its local commit to remove it; no schema or remote state needs rollback.
