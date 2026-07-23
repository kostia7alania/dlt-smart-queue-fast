# Implementation Plan: Cancellable, Shareable Discovery

**Spec**: `specs/011-cancellable-shareable-discovery/spec.md`

## Constitution Check

- Work remains read-only and inside the existing DLT discovery MVP (I).
- Request/cancellation rules stay in Go or the DLT entity client; page
  composition remains in Next views (II).
- No API response shape or upstream string is changed (III, IV).
- Feature context and validation live in repository artifacts (V, VI).

## Shared DLT Model and Client

1. Add domain-named work-option/query and office-search modules under the
   existing multi-page `entities/dlt` slice, exporting only through `index.ts`.
2. Cover helpers with Node's native TypeScript test runner; add no dependency.
3. Thread optional `AbortSignal` through `getJSON`, fallback, and all endpoint
   helpers. Abort is terminal, not a reason to read another source.

## Backend Cancellation

4. Exit `DLTCompare` before work and during the politeness pause when its context
   is canceled.
5. Add regression coverage proving a pre-canceled context starts no upstream
   requests.

## Page State and UX

6. Make Calendar and Compare query parameters their control source of truth;
   update them with `router.replace(..., {scroll:false})`.
7. Abort Calendar chains and Compare runs on replacement/unmount. Clear
   comparison data as soon as its selection no longer matches.
8. Preserve the exact keyword in Compare-to-Calendar links.
9. Add Map query state, office search/reset/counts, centralized filtering, and
   a semantic text alternative with Calendar/Compare links.
10. Reuse shared office matching in both selectors and make control IDs unique.

## Validation

- Targeted Node and Go cancellation tests while implementing.
- Full Go tests plus golangci-lint v2/gofumpt.
- Biome, Node tests, `tsc --noEmit`, and Next production build on Node 26.
- Browser smoke against local PostgreSQL/API/UI.
