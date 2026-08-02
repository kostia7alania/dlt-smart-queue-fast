# Feature 017 Tasks

## Phase 1 — Evidence and scope

- [x] T1701 Record the clean branch and completed Feature 016 baseline.
- [x] T1702 Run independent repository, market, and UX/data audits with subagents.
- [x] T1703 Verify the current external alternative-office decision problem.
- [x] T1704 Trace the existing product promise and actual History gap.
- [x] T1705 Select comparable stored status changes as the bounded next slice.

## Phase 2 — Contract and specification

- [x] T1706 Define the four-value comparison contract.
- [x] T1707 Require equal `current_date` values for comparability.
- [x] T1708 Define the loaded-window baseline and transition-time limits.
- [x] T1709 Write the feature specification, architecture, and rollback plan.
- [x] T1710 Verify this checklist contains exactly 30 executable tasks.

## Phase 3 — Go comparison contract

- [x] T1711 Extend the history DTO with comparison fields and OpenAPI docs.
- [x] T1712 Mark the oldest loaded entry as `no_baseline`.
- [x] T1713 Annotate same-horizon entries as `unchanged` or `changed`.
- [x] T1714 Mark different-horizon entries as `not_comparable`.
- [x] T1715 Add focused service and handler contract assertions.

## Phase 4 — Typed frontend insight

- [x] T1716 Extend the TypeScript history contract with comparison values.
- [x] T1717 Add a page-local pure History change insight model.
- [x] T1718 Derive the newest comparable run without timing inference.
- [x] T1719 Derive the latest comparable transition and loaded counts.
- [x] T1720 Add focused model cases and wire them into the Node test command.

## Phase 5 — Accessible History integration

- [x] T1721 Add a semantic stored-status-change section.
- [x] T1722 Show older and newer state labels with both observation times.
- [x] T1723 Add text comparison cues to every History table row.
- [x] T1724 Preserve the non-monitoring and exact-time-unknown boundaries.
- [x] T1725 Update research, roadmap, task-index, and route documentation.

## Phase 6 — Proportional validation and delivery

- [x] T1726 Run Go formatting and focused service/handler tests.
- [x] T1727 Run focused Node tests, TypeScript, and Biome.
- [x] T1728 Run the production web build and inspect the History output boundary.
- [x] T1729 Run diff, scope, claim, and exact task-count audits.
- [x] T1730 Close Feature 017 and create one local commit without push or deployment.

## Validation

Validated on 2026-08-02:

- Three read-only subagent audits independently reviewed repository contracts,
  current official/community evidence, and the existing History UX/data gap.
  Their evidence and the rejected any-office eligibility inference are recorded
  in `docs/research/2026-08-02-comparable-history-changes.md`.
- `go test ./internal/service ./internal/http -count=1` passed. The first
  sandboxed attempt could not write to the macOS Go build cache; the same
  focused command passed with build-cache access.
- `node --test src/views/history/model/history-change.test.mts` passed all
  three focused tests covering empty/single, comparable run/change, and
  incomparable boundaries.
- `npm run typecheck` passed, and targeted Biome checks passed across the seven
  changed web source/config files.
- The Node 26 production build passed with the explicit public site URL/name
  and statically rendered all 15 routes. The first sandboxed Turbopack attempt
  was blocked from binding its internal port; the permitted retry completed.
- Exported History HTML contains its updated description and self-canonical
  URL; the client bundle contains the change signal and safe comparison copy.
- `git diff --check` passed. The checklist contains exactly 30 tasks, all
  complete. No schema, migration, dependency, route, upstream request,
  PostgreSQL data, external account, deployment, or remote branch changed.
- PostgreSQL integration and browser automation were intentionally skipped:
  this slice changes no query/schema and retains the existing responsive table
  and route structure; focused contract, type, lint, and build gates cover the
  changed risk surface.
