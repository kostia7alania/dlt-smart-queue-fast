# Tasks: shadcn/ui + FSD + BEM + Tailwind Prefix

**Input**: `specs/006-fsd-ui-kit/spec.md`

## Phase 1: Foundations

- [x] T501 Enable Tailwind v4 `prefix(tw)` in `globals.css`; prefix existing token theme
- [x] T502 Init shadcn (components.json, Base UI, zinc, css variables); wire `cn()` via `extendTailwindMerge({ prefix: "tw" })`
- [x] T503 Add shared/ui components: button, card, input, checkbox, badge, table; verify classes are `tw:`-prefixed
- [x] T504 Create FSD skeleton: `views/ widgets/ features/ entities/ shared/` with segment layout

## Phase 2: Entities & shared

- [x] T505 `entities/dlt`: types (Office, WorkType, SlotDay, Holiday, FetchRecord, Sourced), api client (getJSON, fetchWithFallback, endpoint builders), date helpers
- [x] T506 `shared/config/api.ts` (API base), `shared/lib/utils.ts` (cn)

## Phase 3: Features, widgets, views

- [x] T507 `features/office-select` (search + list, BEM office-select__*)
- [x] T508 `features/work-option-filter` (keyword toggle + available-only, BEM work-option-filter__*)
- [x] T509 `features/dlt-step-runner` (playground step card, BEM dlt-step__*)
- [x] T510 `widgets/slot-calendar` (month grid, nav, day details, BEM slot-calendar__*)
- [x] T511 `views/home`, `views/calendar`, `views/playground`; `src/app` routes become thin re-exports
- [x] T512 Rewrite all classNames with `tw:` prefix; BEM hooks on slice roots and key elements

## Phase 4: Validation & docs

- [x] T513 biome check, tsc --noEmit, next build (Node 26) green; prefix grep-audit clean
- [x] T514 Browser smoke: calendar full flow + playground live/snapshot steps
- [x] T515 AGENTS.md conventions, ADR-001 action item, TASK_INDEX; merge to main
