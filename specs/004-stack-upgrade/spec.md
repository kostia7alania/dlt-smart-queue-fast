# Feature Specification: Stack Refresh and Schema Baseline

**Feature Branch**: `004-stack-upgrade`

**Created**: 2026-07-07

**Status**: Draft

**Input**: User request: "обнови зоопарк стеков, всё последнее — нода, постгри и инфра;
о миграциях не думай, данные можно уничтожать и перепроектировать схему с нуля по
лучшей архитектуре."

## Scope

Bring every runtime, dependency, and infra file to the current latest (LTS where the
ecosystem distinguishes), and rebuild the database schema as a clean baseline. Local
data is explicitly disposable — no upgrade/migration path is required.

Verified current versions (2026-07-07, from official registries):

| Component | Was | Now |
|---|---|---|
| Node.js | unpinned (local v24.0.2) | v24.18.0 (latest LTS "Krypton"; 26 is Current, not LTS) |
| PostgreSQL | `postgres:15-alpine` | `postgres:18-alpine` (18.4) |
| Go directive | 1.24.0 | 1.26.0 (toolchain go1.26.4 = latest) |
| Next.js | 16.2.2 | 16.2.10 |
| React | 19.2.4 | 19.2.7 |
| Tailwind CSS | ^4 (4.x) | 4.3.x |
| TypeScript | ^5 | ^6 (6.0.3; Next peer allows >=3.3.1) — validated |
| ESLint | ^9 | attempted ^10, **rolled back to ^9.39** — eslint-config-next 16.2.10 bundles an eslint-plugin-react that crashes under ESLint 10 (`usedPropTypes.js` TypeError); retry when Next ships a compatible config |
| huma / chi / pgx | v2.38.0 / v5.3.1 / v5.10.0 | already latest (feature 003 review) |
| Compose file | `docker-compose.yml` with obsolete `version:` | `compose.yaml`, healthcheck, v2 CLI |

## User Scenarios

### User Story 1 - Fresh clone runs on the latest stack (Priority: P1)

As a developer, I clone the repo on a machine with current toolchains, run the
documented commands, and everything works with zero legacy warnings.

**Acceptance Scenarios**:

1. **Given** a clean checkout and no existing volume, **When** `make up && make api-dev` runs, **Then** PostgreSQL 18 starts healthy and the API applies the baseline schema.
2. **Given** the repo, **When** `nvm use` / engines check runs, **Then** Node 24 LTS is selected.
3. **Given** `make up`, **When** compose runs, **Then** no obsolete-attribute warnings appear and the DB has a healthcheck.

### User Story 2 - Clean DLT-only schema baseline (Priority: P1)

As a maintainer, I want the schema to contain only what the product uses, so the
data model matches reality.

**Acceptance Scenarios**:

1. **Given** a fresh database, **When** migrations apply, **Then** exactly the four DLT tables exist (offices, work_types, slot_snapshots, fetches) plus `schema_migrations` — the starter `runs` table is gone.
2. **Given** the API, **When** OpenAPI is inspected, **Then** the starter mock endpoints (`/v1/agent/plan`, `/v1/ideas/analyze`, `/v1/runs/{id}`) no longer exist; `/healthz` and all `/v1/dlt/*` remain.
3. **Given** snapshot work-type filter queries, **Then** an index on `(site_id, group_id, keyword)` backs them.

## Requirements

- **FR-001**: Pin Node 24 LTS via `.nvmrc` and `engines` in `apps/web/package.json`.
- **FR-002**: PostgreSQL 18 alpine in a `compose.yaml` (no `version:` attribute) with a `pg_isready` healthcheck and the existing `POSTGRES_PORT` override; Makefile uses the `docker compose` v2 CLI and gains a `db-reset` target.
- **FR-003**: Go module directive 1.26.0; all Go deps at latest.
- **FR-004**: All web dependencies at latest (majors included) with lint/build/browser validation; roll back a major only if validation fails, documenting why.
- **FR-005**: Replace the two migration files with a single baseline `001_init.sql` containing only DLT tables; remove starter endpoints, `RunRepo`, `model.Run`, and their DTOs.
- **FR-006**: Update README, AGENTS.md, and CONSTITUTION version constraints; constitution change follows its governance (version bump + rationale).
- **FR-007**: Preserved-string guarantees and all feature 001–003 behavior remain intact (tests + browser smoke).

## Success Criteria

- **SC-001**: `go test ./...`, `npm run lint`, `npm run build` all green on the new stack.
- **SC-002**: Fresh `docker compose down -v && up` + API start yields a working end-to-end flow (playground and calendar) on PostgreSQL 18.
- **SC-003**: OpenAPI lists only `/healthz` + 10 `/v1/dlt/*` paths.
- **SC-004**: No compose warnings; `docker compose ps` shows the DB healthy.

## Non-Goals

- No data migration path (explicitly waived by the user).
- No Node 26 (not LTS until October 2026).
- No new product behavior.
