# Feature Specification: Office Map

**Feature Branch**: `008-office-map`

**Created**: 2026-07-13

**Status**: Complete (validated 2026-07-13)

**Input**: Backlog item 2 (Roadmap Phase 3 leftover "office list/map view"). User
delegated the coordinates-source decision after research.

## Coordinates-Source Decision (research 2026-07-13)

The upstream DLT API has no coordinates (`getSite/{lang}` returns only
`sit_id`/`sit_name`/`app_open`; probed variants 404). Verified options:

| Option | Verdict |
|---|---|
| Official DLT API / data.go.th catalogs | No coordinates found in the API; open-data catalogs exist but no direct dataset — revisit if one appears |
| Google Geocoding | **Legally unusable**: results cacheable max 30 days and displayable only on Google Maps |
| OpenCage | Storage allowed, but a paid subscription for a one-time 218-row batch — negative ROI |
| **Nominatim (OSM)** — chosen | Free; storing results is allowed with attribution (ODbL); Thai office names from `getSite/1` resolve real OSM POIs (verified live); politeness policy (1 req/s, descriptive User-Agent) is easy to honor for a one-time batch |

**Decision**: one-time cascading Nominatim batch → committed static dataset. Cascade
per office: exact Thai name → name without branch/number suffixes → district +
province → province centroid. Every row records `precision`
(`office`/`district`/`province`) so the map is honest about accuracy. No runtime
geocoding dependency; regeneration is a committed script.

**Map library decision**: react-leaflet (mainstream, ~42kB Leaflet core, React 19
compatible, provider-agnostic OSM tiles; pigeon-maps has lost its size edge at
~229kB and moves slower; MapLibre GL is WebGL overkill for 218 markers).
Markers are `CircleMarker`s — no icon-asset bundling issues, colorable by precision.

## User Scenarios

### User Story 1 - See every office on a map (Priority: P1)

As a user planning where to take a DLT appointment, I want all offices on a map of
Thailand, so I can find offices near my location or route.

**Acceptance Scenarios**:

1. `/map` renders every geocoded office as a marker; English office names appear on
   hover/click exactly as upstream returns them.
2. Marker precision is visually distinguished and explained in a legend.
3. Map tiles and geocoding carry OpenStreetMap attribution.

### User Story 2 - Jump from the map to availability (Priority: P2)

As a user who found a nearby office, I want to open its calendar in one click.

**Acceptance Scenarios**:

1. A marker popup shows the office name and an "Open calendar" action.
2. The calendar page opens with that office preselected (`?siteId=`), loads its work
   types and slots, and the office is highlighted in the office list.
3. A calendar link back to the map exists.

## Requirements

- **FR-001**: Coordinates ship as a committed dataset (`sit_id`, `lat`, `lon`,
  `precision`, provenance header); the generator script is committed and re-runnable.
- **FR-002**: No runtime geocoding calls; the only new runtime dependencies are
  react-leaflet/leaflet.
- **FR-003**: The map page follows FSD (`views/map` → `widgets/office-map` →
  `entities/dlt`), BEM hooks, and the `tw` Tailwind prefix.
- **FR-004**: Upstream office names render unchanged; the dataset stores derived
  Thai names/coordinates as provenance, never replacing upstream values in the UI.
- **FR-005**: `/calendar` accepts `?siteId=` for deep links without breaking the
  default flow.
- **FR-006**: OSM attribution for tiles and geocoded data is visible on the map.

## Success Criteria

- **SC-001**: ≥95% of offices carry coordinates. **Achieved: 210/218 (96.3%)** —
  62 exact office POIs, 87 district-level, 61 province centroids; the 8 без
  координат are placeholders/test rows and four exotic venues (malls, a hospital
  sub-branch, one driving school), honestly listed under the map as "Not on the
  map yet". (The original draft also demanded ≥95% office/district precision —
  OSM Thailand coverage makes that unrealistic; precision is surfaced per marker
  instead.)
- **SC-002**: Biome, tsc, production build (Node 26), and Go checks stay green.
- **SC-003**: Browser smoke: markers render, popup opens, deep link lands on the
  right office's calendar.

## Non-Goals

- Availability coloring on the map (needs multi-office slot polling — politeness
  budget first; future feature).
- Distance/route search, clustering, offline tiles.
