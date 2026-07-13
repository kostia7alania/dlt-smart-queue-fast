# Tasks: Reliable Snapshots and Calendar States

**Input**: `specs/007-reliable-snapshots-calendar/spec.md`

## Phase 1: Persistence fidelity

- [x] T601 Add migration for latest offices and work-type collection snapshots
- [x] T602 Store typed projections and complete list snapshots atomically
- [x] T603 Read latest collection snapshots, including valid empty arrays
- [x] T604 Add focused service/handler coverage for empty successful results

## Phase 2: Calendar request and fallback states

- [x] T605 Separate offices and calendar loading/error state with targeted retry
- [x] T606 Show one freshness notice for every collection using stored data
- [x] T607 Render the successful empty-slots state explicitly

## Phase 3: Calendar accessibility

- [x] T608 Label office search and expose office/work-option/day selection state
- [x] T609 Name month navigation and add semantic round-table metadata
- [x] T610 Add unique calendar and playground route titles

## Phase 4: Validation and close-out

- [x] T611 Run Go tests/lint and verify the migration against local PostgreSQL
- [x] T612 Run Biome, TypeScript, build, and Tailwind-prefix audit
- [x] T613 Re-review the final diff and close the task index/spec status
