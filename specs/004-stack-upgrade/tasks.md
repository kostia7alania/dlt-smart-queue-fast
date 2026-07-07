# Tasks: Stack Refresh and Schema Baseline

**Input**: `specs/004-stack-upgrade/spec.md`

## Phase 1: Infra

- [x] T301 Replace `docker-compose.yml` with `compose.yaml`: postgres:18-alpine, healthcheck, `POSTGRES_PORT` override, no `version:`
- [x] T302 Makefile: `docker compose` v2 CLI, add `db-reset` and `test` targets
- [x] T303 Add `.nvmrc` (Node 24 LTS) and `engines` to `apps/web/package.json`

## Phase 2: Runtimes & dependencies

- [x] T304 Bump Go directive to 1.26.0; `go get -u ./...` + tidy; tests green
- [x] T305 Upgrade web deps to latest (next, react, tailwind, typescript@6, eslint@10, types); lint + build green

## Phase 3: Schema baseline & starter cleanup

- [x] T306 Single baseline `apps/api/migrations/001_init.sql` (four DLT tables + indexes incl. work-types lookup index); delete `002_dlt_persistence.sql`
- [x] T307 Remove starter endpoints (`/v1/agent/plan`, `/v1/ideas/analyze`, `/v1/runs/{id}`), `RunRepo`, `model.Run`, related DTOs
- [x] T308 Update README (remove starter examples, bump prerequisites), AGENTS.md, CONSTITUTION (governance: version bump + rationale)

## Phase 4: Validation

- [x] T309 Fresh DB: `docker compose down -v` + `up --wait` on PG18; API applies baseline; psql shows only DLT tables
- [x] T310 Smoke: healthz, live DLT chain, snapshots, fetch log; OpenAPI = healthz + 10 DLT paths
- [x] T311 Browser smoke: playground + calendar on the new stack
- [x] T312 Update `docs/TASK_INDEX.md`; merge to `main`
