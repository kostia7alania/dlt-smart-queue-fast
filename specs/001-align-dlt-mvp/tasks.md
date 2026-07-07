# Tasks: DLT Read-Only Discovery MVP

**Input**: Design documents from `specs/001-align-dlt-mvp/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `quickstart.md`

**Tests**: Include focused Go tests for parser/client behavior when changing backend logic.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Align the generated starter with the DLT MVP and repo-owned AI context.

- [x] T001 Review current Go API structure in `apps/api/internal/*` and identify generic starter code to replace
- [x] T002 Review current Next.js playground in `apps/web/src/app/playground/page.tsx` and identify generic starter UI to replace
- [x] T003 [P] Add DLT upstream base URL configuration to `apps/api/internal/config/config.go`
- [x] T004 [P] Add DLT preserved-string fixtures or test data under `apps/api/internal/dto/` or an appropriate Go test file
- [x] T005 Update `README.md` to point developers to `docs/TASK_INDEX.md` and the DLT MVP feature

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Define shared backend types and upstream client behavior used by all user stories.

**Critical**: No user story work should begin until DTOs, client boundaries, and error mapping are clear.

- [x] T006 Define DLT DTOs for office, work availability, vehicle, work type, holiday, and slot responses in `apps/api/internal/dto/dto.go`
- [x] T007 Define DLT domain models or response models in `apps/api/internal/model/model.go`
- [x] T008 Implement a small context-aware DLT upstream client boundary in `apps/api/internal/service/service.go`
- [x] T009 Add timeout and upstream error handling strategy in `apps/api/internal/service/service.go`
- [x] T010 Add Go tests that prove preserved strings remain unchanged in `apps/api/internal/dto/` or `apps/api/internal/service/`

**Checkpoint**: Backend can represent the observed DLT flow without losing raw contract values.

---

## Phase 3: User Story 1 - Discover DLT offices and work options (Priority: P1) MVP

**Goal**: User can fetch offices and work availability by office.

**Independent Test**: `curl /v1/dlt/offices` and `curl /v1/dlt/offices/{siteId}/work-availability` return JSON matching observed fields.

### Implementation for User Story 1

- [x] T011 [US1] Implement DLT offices service call in `apps/api/internal/service/service.go`
- [x] T012 [US1] Implement DLT work availability service call in `apps/api/internal/service/service.go`
- [x] T013 [US1] Register `/v1/dlt/offices` endpoint in `apps/api/internal/http/handler.go`
- [x] T014 [US1] Register `/v1/dlt/offices/{siteId}/work-availability` endpoint in `apps/api/internal/http/handler.go`
- [x] T015 [US1] Validate OpenAPI output includes office and work availability endpoints from `apps/api/internal/http/handler.go`
- [x] T016 [US1] Manually validate US1 with curl commands from `specs/001-align-dlt-mvp/quickstart.md`

**Checkpoint**: User Story 1 works independently and can be demoed without frontend changes.

---

## Phase 4: User Story 2 - Resolve vehicle and work type IDs (Priority: P2)

**Goal**: User can fetch vehicle types and resolve `tyw_id` values for calendar lookup.

**Independent Test**: `curl /v1/dlt/vehicles` and `/v1/dlt/work-types?...` return preserved vehicle names and work type IDs.

### Implementation for User Story 2

- [x] T017 [US2] Implement vehicle type service call in `apps/api/internal/service/service.go`
- [x] T018 [US2] Implement work type resolver service call in `apps/api/internal/service/service.go`
- [x] T019 [US2] Register `/v1/dlt/vehicles` endpoint in `apps/api/internal/http/handler.go`
- [x] T020 [US2] Register `/v1/dlt/work-types` endpoint in `apps/api/internal/http/handler.go`
- [x] T021 [US2] Add validation for required `siteId`, `groupId`, and `keyword` inputs in `apps/api/internal/http/handler.go`
- [x] T022 [US2] Manually validate US2 with curl commands from `specs/001-align-dlt-mvp/quickstart.md`

**Checkpoint**: User Story 2 works independently and produces `tyw_id` inputs for calendars.

---

## Phase 5: User Story 3 - View holidays and slot availability (Priority: P3)

**Goal**: User can fetch holidays and slot statuses for a selected `tyw_id`.

**Independent Test**: `curl /v1/dlt/work-types/{workTypeId}/holidays` and `/slots?currentDate=...` return JSON with date, message, color, rounds, count, and MaxCount.

### Implementation for User Story 3

- [x] T023 [US3] Implement holiday service call in `apps/api/internal/service/service.go`
- [x] T024 [US3] Implement slot availability service call in `apps/api/internal/service/service.go`
- [x] T025 [US3] Register `/v1/dlt/work-types/{workTypeId}/holidays` endpoint in `apps/api/internal/http/handler.go`
- [x] T026 [US3] Register `/v1/dlt/work-types/{workTypeId}/slots` endpoint in `apps/api/internal/http/handler.go`
- [x] T027 [US3] Add validation for `workTypeId` and `currentDate` inputs in `apps/api/internal/http/handler.go`
- [x] T028 [US3] Manually validate US3 with curl commands from `specs/001-align-dlt-mvp/quickstart.md`

**Checkpoint**: User Story 3 exposes the calendar data needed for future visualization.

---

## Phase 6: User Story 4 - Explore the flow in a minimal UI (Priority: P4)

**Goal**: Developer-user can exercise the DLT flow from the browser.

**Independent Test**: Open the playground, trigger each step, and verify displayed JSON or readable errors.

### Implementation for User Story 4

- [x] T029 [US4] Replace generic playground content with DLT flow controls in `apps/web/src/app/playground/page.tsx`
- [x] T030 [US4] Add frontend request helpers or thin BFF calls for DLT endpoints under `apps/web/src/app/api/` if needed
- [x] T031 [US4] Display raw JSON responses without rewriting preserved upstream strings in `apps/web/src/app/playground/page.tsx`
- [x] T032 [US4] Add readable loading and error states in `apps/web/src/app/playground/page.tsx`
- [x] T033 [US4] Manually validate the browser flow against `specs/001-align-dlt-mvp/quickstart.md`

**Checkpoint**: Full read-only DLT lookup chain can be demonstrated in the browser.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Validate, document, and keep AI context current.

- [x] T034 Run `go test ./...` in `apps/api`
- [x] T035 Run the frontend validation command available in `apps/web/package.json`
- [x] T036 Validate local OpenAPI docs include all `/v1/dlt` endpoints
- [x] T037 Update `docs/idea.md` only if new upstream observations are discovered
- [x] T038 Update `docs/TASK_INDEX.md` if the active next step changes
- [x] T039 Update completed task checkboxes in `specs/001-align-dlt-mvp/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies
- **Phase 2**: Depends on Phase 1 review
- **Phase 3 / US1**: Depends on Phase 2
- **Phase 4 / US2**: Depends on Phase 2; can follow US1 for easier manual flow
- **Phase 5 / US3**: Depends on US2 because slots require `tyw_id`
- **Phase 6 / US4**: Depends on backend endpoints from US1-US3
- **Final Phase**: Depends on selected user stories being complete

### MVP First

1. Complete Phase 1.
2. Complete Phase 2.
3. Complete Phase 3.
4. Stop and validate with curl before adding more scope.

### Parallel Opportunities

- T003 and T004 can run in parallel.
- DTO/model work can be reviewed independently from UI review.
- Once backend contracts are stable, UI tasks T029-T033 can proceed without touching Go files.

## Notes

- Do not add auth, booking, Redis, queues, or background workers in this feature.
- Preserve upstream strings exactly.
- Prefer small, direct Go code over abstractions.
- Mark tasks complete only after the relevant validation step.
