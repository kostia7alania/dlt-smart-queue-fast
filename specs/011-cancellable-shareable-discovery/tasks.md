# Tasks: Cancellable, Shareable Discovery

**Input**: `specs/011-cancellable-shareable-discovery/spec.md`

- [x] T1101 Specify URL, cancellation, accessibility, and validation contracts
- [x] T1102 Add shared exact work-option constants and keyword parser
- [x] T1103 Add shared office name/site-ID search matching
- [x] T1104 Add positive site-ID list and boolean query parsers
- [x] T1105 Add native Node tests for shared helpers and wire them into `npm test`
- [x] T1106 Add optional `AbortSignal` support to JSON and fallback clients
- [x] T1107 Thread cancellation through every DLT fetcher and make abort terminal
- [x] T1108 Stop Go comparison work promptly when its context is canceled
- [x] T1109 Add a zero-upstream-call Go cancellation regression test
- [x] T1110 Make Calendar site/work/availability controls URL-driven
- [x] T1111 Abort stale Calendar chains and suppress intentional abort errors
- [x] T1112 Make Compare office/work controls URL-driven
- [x] T1113 Abort and clear stale Compare runs when their inputs change
- [x] T1114 Preserve Compare's exact work option in Calendar links
- [x] T1115 Add URL-driven Map keyword, availability, and search state with Suspense
- [x] T1116 Add accessible Map search, reset, and visible-result counts
- [x] T1117 Centralize Map marker filtering and filtered status counts
- [x] T1118 Add a semantic Map text alternative with Calendar/Compare links
- [x] T1119 Reuse office matching in selectors and add unique IDs/result counts
- [x] T1120 Run full validation/browser smoke, close docs, and commit feature 011

## Validation

Completed on 2026-07-23:

- `npm test` — 6 native Node tests passed.
- `npm run typecheck` — passed.
- `npm run lint` — Biome passed.
- `npm run build` — Next.js production build passed with Node 26.4.0.
- `go test ./...` — passed.
- `golangci-lint run` — passed with 0 issues.
- `golangci-lint fmt --diff` — no diff.
- Schema-isolated PostgreSQL integration suite — passed against PostgreSQL 18.
- `git diff --check` — passed.
- Browser smoke — direct Calendar/Compare/Map URLs restored state; Map
  search/reset and the semantic text alternative worked; Compare preserved the
  exact keyword in Calendar links; Back/Forward restored the URLs; no runtime
  browser errors were recorded.
