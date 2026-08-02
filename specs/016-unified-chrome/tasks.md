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

## Merging the other session's later work (2026-08-01, 03:00)

While this branch was being finished, the parallel session added four more
features directly to `main`: a bespoke Bangkok office directory, an availability
evidence guide, comparable stored-history changes, and a map status radar. Both
sessions had also used the numbers `015` and `016` for different specs.

- [x] T1608 Merge `main` into this branch and resolve eleven conflicted files.
- [x] T1609 Decide who owns `/offices/bangkok` and make the choice enforceable.
- [x] T1610 Fold their routes into the tested sitemap table and the guides index.
- [x] T1611 Re-validate the merged tree end to end.

Resolutions:

| Conflict | Resolution |
| --- | --- |
| `/offices/bangkok` existed twice (their static route, my `[city]` param) | Their bespoke page owns the URL. `STATIC_ROUTE_HUB_SLUGS` excludes `bangkok` from `generateStaticParams`, so the export writes the path once, while the registry keeps Bangkok for links, counts, and the sitemap. A test asserts the exclusion list and the `app/offices/<slug>/page.tsx` files agree in both directions. |
| Header navigation had grown to nine items | One row of seven: Appointments, Calendar, Compare, Map, History, Offices, Guides. Their Bangkok page and availability guide are reachable from the Offices and Guides indexes instead of the nav. |
| Four interactive views: my chrome shell vs their new features inside the same hunks | Took their file content, then re-applied the shell transform mechanically, and replaced each removed link row with a single contextual "How to read this data" link to their guide. |
| `sitemap.ts` inline table vs the tested `STATIC_ROUTES` | Kept the tested table; added their availability guide (their Bangkok path was already listed). |
| `package.json` test glob | Kept `src/**/*.test.mts`, which already covers their three new test directories. |
| README, ROADMAP, TASK_INDEX | Merged both narratives; the roadmap records that the `015`/`016` numbers are duplicated across sessions and should be read by name. |

Validation after the merge: 63 node tests, `tsc --noEmit`, Biome, a 26-page
static build, `npm run data:check`, the full Go suite (7 packages), and
`git diff --check`.
