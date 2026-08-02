# Roadmap

## Phase 0 - Repo Context and Spec Discipline — DONE

- Spec-driven workflow established (plain Markdown, tooling-agnostic)
- Constitution filled from project constraints
- Active DLT MVP feature created under `specs/001-align-dlt-mvp`
- Task index created for empty-chat continuity

## Phase 1 - DLT Read-Only Discovery MVP — DONE (`specs/001-align-dlt-mvp`)

- Replace generic starter API examples with DLT-specific read-only endpoints
- Normalize observed upstream DLT responses without correcting upstream strings
- Expose OpenAPI docs for the local API
- Add minimal frontend playground for office/work/slot exploration

## Phase 2 - Persistence and History — DONE (`specs/002-persistence-history`)

- Add migrations for offices, work types, slot snapshots, and fetch metadata
- Store fetched results in PostgreSQL
- Make UI able to show last fetched data and fetch freshness

## Phase 3 - Map and Calendar UX — DONE
## (`specs/003-calendar-office-ux`, `specs/008-office-map`, `specs/009-availability-comparison`, `specs/010-snapshot-map-availability`, `specs/011-cancellable-shareable-discovery`)

- Add office list/map view — office list done (003); map done (008, committed
  Nominatim-geocoded dataset + react-leaflet)
- Add calendar status view for selected office and work type — done (003)
- Cross-office availability comparison (`/compare`, `GET /v1/dlt/compare`) —
  done (009, politeness-bounded sequential fetching with snapshot reuse)
- Snapshot-only availability coloring (`/map`, `GET /v1/dlt/map-availability`) —
  done (010, five honest last-known states with no upstream fan-out)
- Shareable query state, request cancellation, office search, and a semantic
  text alternative for Map — done (011)
- Add filters for office, New/Renew, vehicle type, dates, and availability —
  office/New/Renew/availability done; vehicle type is not actionable in the
  observed contract because `workfilter` has no vehicle discriminator (recheck if
  upstream changes)

## Phase 4 - Stored Availability History — DONE (`specs/012-slot-history`)

- Expose bounded, newest-first slot observations from PostgreSQL without
  calling the DLT upstream
- Summarize availability with the same exact upstream full marker used by
  Compare and Map
- Add a shareable `/history` page with accessible summaries, a semantic table,
  empty/error states, and context links across discovery views

## Phase 5 - Public Launch Trust — DONE (`specs/014-launch-trust-handoff`)

- Replace the developer-oriented home page with a product-led appointment
  discovery entry point
- Put independence, privacy, freshness, no-booking, and official hand-off
  boundaries in the primary journey
- Add static `/appointments` and bounded foreigner-guide pages with canonical
  metadata, structured data, sitemap coverage, and internal links
- Keep launch content free of analytics, forms, credentials, variable office
  procedure, and unsupported booking claims

## Phase 6 - Bangkok Office Discovery — DONE (`specs/015-bangkok-office-hub`)

- Add one evidence-bounded directory for Bangkok Area Land Transport Offices
  1–5 using committed source names and site IDs
- Label district-level OpenStreetMap-derived anchors and separate directory
  facts from live or stored appointment observations
- Deep-link each office into Calendar, Map, and History, plus a five-office
  Compare route
- Add canonical metadata, visible `ItemList` structured data, sitemap coverage,
  internal links, and regression tests without adding client state

## Phase 7 - Availability Evidence Guide — DONE
## (`specs/016-availability-evidence-guide`)

- Centralize the live/stored, freshness, five-status, and map-precision meanings
  already implemented across Calendar, Compare, Map, and History
- Pair each status with a safe conclusion and an explicit non-conclusion
- Explain each tool's upstream and PostgreSQL behaviour in a semantic matrix
- Add a static guide, metadata, Article JSON-LD, sitemap coverage, contextual
  discovery links, and regression tests without adding runtime data or state

## Phase 8 - Comparable Stored History Changes — DONE
## (`specs/017-comparable-history-changes`)

- Compare neighboring History rows only when their exact request date matches
- Expose changed, unchanged, not-comparable, and loaded-window baseline states
- Show the newest comparable run and latest comparable transition with textual,
  accessible evidence boundaries
- Keep History stored-only and avoid exact-time, monitoring, duration,
  probability, or current-availability claims

## Deferred

- Login-dependent booking flow
- Telegram/email/SMS notifications
- Background monitoring
- Paid features
- Redis or queues
