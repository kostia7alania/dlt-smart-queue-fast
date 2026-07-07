# Tasks: 2026 Toolchain — Node 26, Biome, golangci-lint

**Input**: `specs/005-toolchain-refresh/spec.md`

## Phase 1: Node 26

- [x] T401 Install Node 26.4.0 (nvm), set `.nvmrc` to 26, `engines.node >= 26`

## Phase 2: Biome for apps/web

- [x] T402 Add `@biomejs/biome`, write `biome.json` (recommended + next/react domains, existing code style)
- [x] T403 Replace `lint` script with `biome check`, add `format` script
- [x] T404 Remove eslint, eslint-config-next, `eslint.config.mjs`; drop the 004 eslint-disable comments
- [x] T405 Run `biome check --write`, resolve remaining diagnostics, verify diff is style-only

## Phase 3: golangci-lint for apps/api

- [x] T406 Install golangci-lint v2, write `.golangci.yml` (v2 schema, gofumpt formatter)
- [x] T407 Fix or configure all findings; add `make lint`

## Phase 4: Docs & validation

- [x] T408 Update AGENTS.md, CONSTITUTION (amendment 1.0.2), README
- [x] T409 Validate: go test, biome clean, golangci-lint clean, `npm run build` on Node 26, browser smoke
- [x] T410 Update `docs/TASK_INDEX.md`; merge to `main`
