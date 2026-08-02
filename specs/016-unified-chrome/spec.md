# Feature 016: One Site Chrome Across Every Route

**Status:** Complete
**Created:** 2026-08-01

## Problem

Features 014 and 015 gave the public content routes a shared header and footer.
The four interactive views — Calendar, Compare, Map, History — still rendered
their own page shell with a hand-written link row ("← Back to Home", plus two or
three siblings). A visitor arriving from an area hub therefore crossed what
looked like a boundary between two different sites, and the site name,
independence notice, and official hand-off disappeared exactly where a user is
closest to acting on availability.

Navigation was also incomplete in both directions: the shared header linked
Appointments, Calendar, Compare, Offices, Guides, and the foreigner guide, but
not Map or History; and the guides index listed only the two registry guides, not
the foreigner guide that feature 014 shipped.

## Scope

1. Wrap Calendar, Compare, Map, and History in `widgets/public-site-chrome`, with
   the page container promoted to the `main` landmark.
2. Delete the four per-page link rows; the header owns navigation.
3. Header navigation covers every tool and section: Appointments, Calendar,
   Compare, Map, History, Offices, Guides.
4. The guides index lists the foreigner guide alongside the registry guides.

## Non-Goals

- Restyling the interactive views onto the paper launch palette. Tools keep the
  neutral canvas: their data tables, day colours, and status badges are tuned for
  it, and recolouring them would risk the contrast work done for the content
  pages without improving the tools.
- Any change to data fetching, query-state handling, cancellation, or the
  upstream contract.
- Touching the playground, which stays a developer page and remains excluded
  from the sitemap and robots.

## Success Criteria

- Every public route renders exactly one site header, one `main`, and one footer.
- No route depends on a link row that only exists on that page.
- Node tests, TypeScript, Biome, the static export, and the Go suite all pass.
- The map still renders its markers inside the new flex shell, verified against a
  live office list.
