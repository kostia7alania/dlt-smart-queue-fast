# Feature 018 Tasks

## Phase 1 — Baseline and evidence

- [x] T1731 Record the clean Feature 017 baseline and current branch state.
- [x] T1732 Confirm that no implementation feature is active.
- [x] T1733 Run independent official-source, UX, and market/SEO subagent audits.
- [x] T1734 Recheck current primary government office-choice evidence.
- [x] T1735 Rank Map radar above duplicate guide and procedure-card candidates.

## Phase 2 — URL and safety contract

- [x] T1736 Inventory all five existing Map status values and labels.
- [x] T1737 Define absent, canonical-list, and `none` URL semantics.
- [x] T1738 Define mixed-valid and wholly invalid input fallbacks.
- [x] T1739 Preserve `available=1` as a lower-priority legacy alias.
- [x] T1740 Define count order, reset behavior, and no-refetch invariant.

## Phase 3 — Specification and continuity

- [x] T1741 Write the Map radar user stories and acceptance scenarios.
- [x] T1742 Record explicit non-goals and unsafe office claims.
- [x] T1743 Choose a page-local FSD model with no new dependency.
- [x] T1744 Document the user-directed no-test validation strategy.
- [x] T1745 Create and verify this exact 40-task checklist.

## Phase 4 — Page-local status model

- [x] T1746 Add the canonical five-status order.
- [x] T1747 Parse absent and legacy available-only query state.
- [x] T1748 Parse canonical, duplicate, mixed, invalid, and `none` values.
- [x] T1749 Serialize selected statuses in canonical order.
- [x] T1750 Toggle one status without mutating the previous selection.

## Phase 5 — URL and filtering integration

- [x] T1751 Read `statuses`, `available`, `keyword`, and search from the URL.
- [x] T1752 Give explicit `statuses` precedence over the legacy alias.
- [x] T1753 Filter searched offices through the selected status set once.
- [x] T1754 Keep the available-only shortcut synchronized and compatible.
- [x] T1755 Clear both status parameters through the existing reset action.

## Phase 6 — Accessible radar controls

- [x] T1756 Replace passive status counts with keyboard-operable toggle buttons.
- [x] T1757 Add fieldset, legend, count text, and `aria-pressed` semantics.
- [x] T1758 Add a restore-all action and visible active-filter summary.
- [x] T1759 Keep marker and semantic text-list visibility synchronized.
- [x] T1760 Preserve unknown fallback, stored-only copy, and color-independent labels.

## Phase 7 — Metadata and documentation

- [x] T1761 Update Map metadata for five-status stored evidence filtering.
- [x] T1762 Record research sources, dates, candidate ranking, and claim boundary.
- [x] T1763 Add Feature 018 to the roadmap and active task index.
- [x] T1764 Update README Map capability and research references.
- [x] T1765 Audit route count, API/schema/dependency scope, and rollback notes.

## Phase 8 — No-test validation and delivery

- [x] T1766 Run targeted formatting and Biome checks without test suites.
- [x] T1767 Run TypeScript no-emit validation without test suites.
- [x] T1768 Run the Node 26 production build and inspect Map output boundaries.
- [x] T1769 Run URL-case, diff, scope, claim, and exact task-count audits.
- [x] T1770 Close Feature 018 and create one local commit without push or deployment.

## Validation

Validated on 2026-08-02:

- Three read-only subagents independently audited current official sources,
  repository UX/data flow, and product/SEO demand. Their source pack, candidate
  ranking, and rejected any-office inference are recorded in
  `docs/research/2026-08-02-map-status-radar.md`.
- No automated test file was added and no test suite was run, matching the
  user's explicit no-test instruction for this cycle.
- Targeted Biome formatting/check passed for the page-local status model, Map
  page, and route metadata.
- `npm run typecheck` passed on Node 26.4.0.
- The production Next build passed with explicit public site configuration and
  statically generated all 15 routes, including `/map`.
- Exported Map HTML contains the updated five-status description and
  self-canonical URL. The client bundle contains the status radar labels and
  URL contract.
- Source inspection covered absent, single, multi-value, duplicate,
  mixed-valid, wholly invalid, `none`, and legacy `available=1` states. Explicit
  `statuses` takes precedence, canonical serialization is stable, and the
  availability effect still depends only on `keyword`.
- `git diff --check` passed. The checklist contains exactly 40 tasks, all
  complete. No Go/API/schema/migration/dependency/route/upstream request,
  external account, deployment, or remote branch changed.
