# Tasks: Office Map

**Input**: `specs/008-office-map/spec.md`

## Phase 1: Coordinates dataset

- [x] T701 Research coordinate sources (upstream probe, open-data catalogs, geocoder ToS/ROI) and record the decision in the spec
- [x] T702 Committed re-runnable geocoder (`tools/geocode-offices.mjs`): Thai names from `getSite/1`, cascading Nominatim queries, 1 req/s politeness
- [x] T703 Handle branch-name pattern (`<province>สาขา<district>`) and re-run stragglers incrementally
- [x] T704 Commit `office-geo.json` dataset with provenance, attribution, and precision per office

## Phase 2: Map UI

- [x] T705 Add react-leaflet/leaflet; `widgets/office-map` with CircleMarkers colored by precision, popups with upstream names, legend, OSM attribution (BEM office-map__*)
- [x] T706 `views/map` + `/map` route with live→snapshot office loading, error/retry, unique title
- [x] T707 Deep link `/calendar?siteId=` (Suspense boundary) and cross-links home ↔ map ↔ calendar

## Phase 3: Validation & close-out

- [x] T708 Biome, tsc, production build (Node 26); Tailwind-prefix audit for new files
- [x] T709 Browser smoke: markers render, popup opens, deep link lands on the right office calendar
- [x] T710 Update TASK_INDEX/backlog, spec status; merge to main
