# Feature Specification: Comparable Stored History Changes

**Feature Branch**: `017-comparable-history-changes`

**Created**: 2026-08-02

**Status**: Complete (validated 2026-08-02)

**Input**: Independent repository, UX/data, and current-market audits found that
the product promises to help users check what changed, while `/history` still
requires manual row-by-row comparison.

## Problem

Stored History shows isolated observations, but it does not say whether two
adjacent rows are comparable or whether their summarized availability state
changed. Treating rows with different `current_date` request horizons as a
transition would be misleading, and claiming that a change happened at a fetch
timestamp would overstate what irregular user-triggered observations prove.

## User Stories

### User Story 1 - See comparable stored state changes (Priority: P1)

As a user, I can see the latest comparable change between stored availability
states without manually comparing every History row.

**Acceptance Scenarios**:

1. Adjacent newest-first observations with the same `current_date` are labelled
   `changed` or `unchanged` from their summarized states.
2. A `changed` observation includes the exact older summarized state.
3. Adjacent observations with different `current_date` values are labelled
   `not_comparable` instead of being described as a transition.
4. The oldest loaded observation is labelled `no_baseline`; the label is about
   the selected response window, not the full database history.

### User Story 2 - Understand the current comparable run (Priority: P1)

As a user, I can see how many newest observations form one comparable run and
the latest comparable state transition in the selected result window.

**Acceptance Scenarios**:

1. The current run includes the latest observation plus consecutive
   `unchanged` observations and stops at a change or incomparable boundary.
2. The latest comparable transition names the older and newer text states and
   shows both observation times.
3. When no comparable change is loaded, the page says so explicitly.
4. One observation produces an honest insufficient-baseline message.

### User Story 3 - Interpret change evidence safely (Priority: P2)

As a keyboard or screen-reader user, I can understand every comparison without
depending on color or inferred timing.

**Acceptance Scenarios**:

1. The change signal uses headings, a description list, text state labels, and
   machine-readable `<time>` values.
2. Every table row exposes its comparison meaning as text.
3. The page says that a change was observed between two stored fetches and that
   the exact change time is unknown.
4. The page keeps the existing stored-only, user-triggered, non-monitoring
   boundary visible.

## Requirements

- **FR-001**: The history endpoint MUST keep returning bounded, newest-first,
  PostgreSQL-only observations and MUST NOT call the DLT upstream.
- **FR-002**: Every history entry MUST expose one comparison value:
  `no_baseline`, `unchanged`, `changed`, or `not_comparable`.
- **FR-003**: Only adjacent response entries with the same exact `current_date`
  MAY be compared.
- **FR-004**: A `changed` entry MUST expose the older summarized status as
  `previous_status`; other comparison states MUST omit it.
- **FR-005**: `no_baseline` MUST mean no older entry exists in the loaded
  response, not that the row is the first observation ever stored.
- **FR-006**: The frontend MUST derive its signal from the API comparison
  contract and MUST NOT reimplement comparability rules.
- **FR-007**: The UI MUST preserve exact upstream message and color strings in
  the existing first-available display.
- **FR-008**: Change copy MUST say "observed between" stored fetches and MUST
  NOT claim an exact transition time, continuous monitoring, frequency,
  current availability, or future availability.
- **FR-009**: No migration, dependency, new route, new upstream request, auth,
  worker, queue, polling, alert, or booking behavior may be added.

## Success Criteria

- **SC-001**: Focused Go service tests prove all four comparison states, the
  same-`current_date` rule, and exact older status output.
- **SC-002**: The existing handler contract test proves comparison fields are
  serialized without changing validation or limit behavior.
- **SC-003**: A focused pure-model test proves empty, single-row, unchanged-run,
  changed, and incomparable-window signals.
- **SC-004**: TypeScript, Biome, a focused production build, and diff/task-count
  audits pass.
- **SC-005**: No database, external account, remote branch, deployment, or DLT
  state changes during delivery.

## Non-Goals

- Comparing raw slot payloads or individual appointment rounds.
- Comparing observations with different request horizons.
- Measuring elapsed state duration, transition frequency, or probabilities.
- Polling, scheduled collection, alerts, notifications, or predictions.
- Adding another public guide or changing booking/procedure claims.
