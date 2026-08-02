# Feature 016 Tasks

- [x] T1601 Inventory the per-page link rows and the shells of the four interactive views.
- [x] T1602 Wrap Calendar, Compare, Map, and History in the shared chrome and promote their container to `main`.
- [x] T1603 Delete the per-page link rows and the imports they left behind.
- [x] T1604 Extend the header navigation to cover Map and History.
- [x] T1605 List the feature-014 foreigner guide in the guides index so the nav change hides nothing.
- [x] T1606 Verify the interactive views still work, including the map with a live office list.
- [x] T1607 Run the full validation suite and commit.

## Validation (2026-08-01)

- `npm test` — 52 node tests pass; `npx tsc --noEmit` and `npx biome check .`
  clean; `npm run build` exports 25 pages; `go test ./...` passes for all seven
  API packages.
- Browser pass over the exported output:
  - `/calendar` renders the shared header and footer; with no API running it
    shows its honest "Failed to fetch" notices and retry buttons rather than an
    empty screen.
  - `/map` was checked against a temporary local API started without a database
    (`DATABASE_REQUIRED=false`): the office list loaded 218 offices, the leaflet
    container measured 1150×504 with **210 markers**, the footer sat below the
    map, and the missing-database case degraded to the documented
    "Stored availability is unavailable … all statuses are shown as unknown"
    banner. The API process was stopped afterwards; no database was created and
    no data was written.
- Every public page now has exactly one header, one `main`, and one footer.

## Notes

The interactive views keep the neutral canvas rather than the paper palette; the
shell change is structural only, so day colours and status badges are untouched.
