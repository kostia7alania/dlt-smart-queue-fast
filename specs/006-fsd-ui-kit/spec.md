# Feature Specification: shadcn/ui + FSD + BEM + Tailwind Prefix

**Feature Branch**: `006-fsd-ui-kit`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User request: "заводи [shadcn per ADR-001] с соблюдением FSD, BEM,
tailwind prefix (tw)".

## Scope

Adopt the UI-kit strategy from `docs/adr/ADR-001-ui-kit-strategy.md` in `apps/web`
and restructure the frontend by three conventions at once:

1. **shadcn/ui** (Base UI primitives, components copied into the repo) as the
   component kit — `shared/ui` layer.
2. **FSD (Feature-Sliced Design)** — layers `app` (Next routes only) → `views` →
   `widgets` → `features` → `entities` → `shared`, imports point downward only.
   The FSD "pages" layer is named `views` to avoid the Next.js pages-router
   convention clash (per FSD's own Next.js guidance).
3. **BEM** class names as semantic/test hooks alongside Tailwind utilities
   (`slot-calendar__day slot-calendar__day--full`); styling stays in Tailwind.
4. **Tailwind v4 prefix `tw`** — `@import "tailwindcss" prefix(tw)`; every utility
   becomes `tw:...` (variants included: `tw:hover:...`, `tw:md:...`), leaving the
   unprefixed namespace to BEM classes. `cn()` uses `extendTailwindMerge` configured
   for the prefix so class merging keeps working.

## Target structure

```text
apps/web/src/
├── app/                     # Next.js App Router: routes, layout, globals.css only
├── views/                   # page compositions (home, calendar, playground)
│   └── <slice>/ui/…
├── widgets/                 # slot-calendar (grid + nav + day details)
├── features/                # office-select, work-option-filter, dlt-step-runner
├── entities/                # dlt: model/types.ts, api/client.ts (fetchWithFallback)
└── shared/
    ├── ui/                  # shadcn components (button, card, input, …)
    ├── lib/utils.ts         # cn() with prefix-aware tailwind-merge
    └── config/api.ts        # API base URL
```

## Functional Requirements

- **FR-001**: All three pages behave exactly as before (calendar flow, playground
  steps, snapshot fallback, freshness, preserved DLT strings).
- **FR-002**: Next route files under `src/app` contain no UI logic — only imports
  from `views`.
- **FR-003**: FSD import direction is respected (no upward or cross-slice imports).
- **FR-004**: Every slice's root element and key sub-elements carry BEM classes;
  modifiers encode state (`--selected`, `--full`, `--holiday`, `--snapshot`).
- **FR-005**: No unprefixed Tailwind utilities remain in `className`s; Biome and
  build stay green.
- **FR-006**: Interactive controls (buttons, inputs, checkbox, table, badges) come
  from `shared/ui` shadcn components instead of ad-hoc markup.
- **FR-007**: AGENTS.md frontend conventions document FSD/BEM/prefix/shadcn.

## Success Criteria

- **SC-001**: `biome check`, `tsc --noEmit`, `next build` (Node 26) all green.
- **SC-002**: Browser smoke: calendar (offices, colored days, day details, filters)
  and playground (live step + snapshot loaders) work unchanged.
- **SC-003**: `grep`-audit finds no `className` token matching a known Tailwind
  utility without the `tw:` prefix.
- **SC-004**: ADR-001 action item "adopt shadcn/ui in dtl-parser" checked off.

## Non-Goals

- Visual redesign (the look may shift slightly to shadcn defaults, but layout and
  information architecture stay).
- Shared token package across projects (ADR action item, deferred until a second
  consumer exists).
- Publishing a registry.
