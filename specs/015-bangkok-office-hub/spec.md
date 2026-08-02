# Feature 015: Bangkok DLT Office Hub

**Status:** Complete
**Created:** 2026-08-02

## Goal

Give an English-speaking visitor one evidence-bounded page for discovering the
five Bangkok Area Land Transport Offices, then send them into Calendar, Compare,
Map, or History with the correct office IDs. The page is a directory and launch
surface, not a booking guide or a ranking of offices.

## Research Basis

- The committed upstream office snapshot contains Bangkok area-office IDs 1–5
  and their English names.
- The committed Nominatim-derived dataset maps those five offices with
  district-level coordinates, Thai search names, match strings, generation
  time, and OpenStreetMap attribution.
- Current search results mix commercial service pages with contradictory
  community anecdotes about appointments and walk-ins. They do not support a
  durable “best office” or procedure claim.
- The official Smart Queue foreigner entry is discoverable, but a direct live
  request to the observed office endpoint timed out during this research.
- The static page can safely identify offices and link to product tools. It
  cannot safely claim current opening state, slot availability, acceptance,
  eligibility, required documents, or walk-in policy.

## User Stories

### P1 — See the real Bangkok choices

As a visitor in Bangkok, I can see all five area offices with their exact source
names, Thai names, stable site IDs, and location-precision disclosure.

### P1 — Continue with useful context

As a visitor considering an office, I can open its Calendar, Map, or History
view, or compare all five offices without re-entering the office ID.

### P2 — Understand the evidence boundary

As a cautious visitor, I can tell which details come from the committed DLT
snapshot, which coordinates are derived from OpenStreetMap data, and which facts
must still be checked live or with DLT.

### P2 — Reach the directory from public pages

As a search or home-page visitor, I can reach the Bangkok office hub through
clear internal links, canonical metadata, and the sitemap.

## Functional Requirements

1. `/offices/bangkok` MUST list exactly site IDs 1, 2, 3, 4, and 5.
2. Each office MUST show the committed upstream English name and derived Thai
   search name without rewriting either source value.
3. Each office MUST link to Calendar, Map, and History with its exact `siteId`.
4. The page MUST provide one compare-all link containing all five IDs and one
   map-all link that uses the existing shareable map search.
5. The page MUST disclose that coordinates are approximate district-level map
   anchors derived from OpenStreetMap data and are not door-level directions.
6. The page MUST distinguish committed directory facts from live or stored
   appointment observations resolved by linked tools.
7. The page MUST NOT render the snapshot's `app_open` value or claim current
   opening, availability, eligibility, documents, walk-in policy, or a “best”
   office.
8. The route MUST remain a static Server Component and add no client state,
   browser API, third-party script, dependency, form, identifier, or tracking.
9. The route MUST have unique metadata, a self-canonical URL, a sitemap entry,
   and visible `ItemList` JSON-LD containing only rendered directory claims.
10. The public header, Home, and Appointments pages MUST link to the new hub.
11. New UI MUST follow the existing FSD layers, shadcn/Base UI primitives, BEM
    hooks, and `tw:` Tailwind prefix.
12. Focused regression tests MUST protect the five IDs, names, geo precision,
    provenance, and deep-link contracts.

## Non-Goals

- Dynamic office detail routes, geolocation, routing, travel-time estimates, or
  distance ranking.
- Advice about documents, licence conversion, eligibility, walk-ins, language
  support, opening hours, service quality, or appointment success.
- Copying commercial rankings or unverified community anecdotes.
- Live upstream fetching during the static build.
- Booking automation, auth, alerts, payments, analytics, deployment, or domain
  and cloud-account changes.

## Success Criteria

- The exported route visibly contains five correct office entries and their
  contextual discovery links.
- Tests fail if an office ID/name/precision/link drifts from the committed
  evidence.
- Canonical metadata, `ItemList` JSON-LD, internal links, and sitemap coverage
  are present in the static output.
- Node tests, Go tests, Biome, TypeScript, golangci-lint, static build, exported
  HTML checks, and desktop/mobile browser smoke pass.
- Feature documentation records the research limit, validation evidence, and a
  local commit; no push or external mutation occurs.
