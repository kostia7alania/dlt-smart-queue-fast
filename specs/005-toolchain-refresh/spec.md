# Feature Specification: 2026 Toolchain — Node 26, Biome, golangci-lint

**Feature Branch**: `005-toolchain-refresh`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User request: "ставь ноду 26 (последние версии!) и сделай глубокий ресерч
по форматерам/линтерам — что в 2026+ актуально."

## Research Summary (2026-07-07)

Sources: PkgPulse/jsmanifest 2026 linter comparisons, Next.js official docs,
biomejs.dev, golangci-lint.run, npm registry versions.

- **Biome 2.5.2**: one Rust binary for lint + format, 25–35× ESLint, type-aware
  linting without tsc, stable formatter. Ships rule **domains** for `next` (14+) and
  `react` (16+) covering the hooks/JSX rules we used from eslint-config-next
  (`useExhaustiveDependencies`, `useHookAtTopLevel`, `noImgElement`,
  `useJsxKeyInIterable`). **create-next-app officially offers "ESLint / Biome /
  None"** — Biome is a first-class Next.js option now.
- **Oxlint 1.73** (oxc): fastest linter (50–100× ESLint), but lint-only; the oxc
  formatter **oxfmt is 0.58 — pre-1.0**, not stable. Best today as a CI pre-pass in
  large monorepos, not as the single tool.
- **ESLint 10.6**: unmatched plugin ecosystem, but for this repo it brought a crash
  (eslint-config-next bundles an ESLint-10-incompatible plugin, see 004) and needs a
  separate formatter (we never had one — no Prettier in the repo).
- **Prettier 3.9**: fine, but redundant once Biome formats.
- **Go**: **golangci-lint v2** is the standard aggregator (71 analyzers; v2 config
  separates linters from formatters); **gofumpt** is the widely adopted stricter
  gofmt. Both integrate: `golangci-lint` runs gofumpt as a formatter.
- **Node 26.4.0**: Current release line (LTS promotion October 2026). The user
  explicitly chooses Current over LTS 24 — accepted risk for a local pet project.

**Decision**: Biome 2.5 replaces ESLint for `apps/web` (lint + format, next/react
domains). golangci-lint v2 with gofumpt covers `apps/api`. Node pinned to 26.

## Requirements

- **FR-001**: `.nvmrc` = 26; `engines.node >= 26`; build and browser smoke run under
  Node 26.4.0.
- **FR-002**: `apps/web` lints and formats with Biome only: `@biomejs/biome` dev
  dependency, `biome.json` with recommended rules + `next`/`react` domains, scripts
  `lint` → `biome check`, `format` → `biome format --write`; ESLint packages and
  `eslint.config.mjs` removed.
- **FR-003**: Biome formatter configured to match the existing code style (2-space
  indent, double quotes, semicolons, ~100 line width) and applied to the whole web
  app once; the diff must be formatting-only.
- **FR-004**: `apps/api` gets `.golangci.yml` (v2 schema) with the default linter set
  plus staticcheck extras and gofumpt as formatter; `make lint` runs it; all findings
  fixed or explicitly configured away.
- **FR-005**: Docs updated: AGENTS.md conventions, CONSTITUTION amendment (1.0.2),
  README prerequisites/commands, TASK_INDEX.
- **FR-006**: All feature behavior unchanged: Go tests, web build, and a browser
  smoke of playground + calendar pass on the new toolchain.

## Success Criteria

- **SC-001**: `npm run lint` (Biome) and `npm run format -- --check`-equivalent are
  clean; no eslint packages remain in `package.json`.
- **SC-002**: `golangci-lint run` exits clean in `apps/api`.
- **SC-003**: `npm run build` succeeds under Node 26.4.0.
- **SC-004**: Browser smoke on Node 26 dev server shows offices + colored calendar
  days and playground responses.

## Non-Goals

- Oxlint CI pre-pass (revisit if lint time ever matters at this repo size).
- Prettier (redundant with Biome).
- CI pipeline setup (no CI exists in this repo yet).
