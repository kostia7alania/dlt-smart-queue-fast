# Implementation Plan: DLT Read-Only Discovery MVP

**Branch**: `001-align-dlt-mvp` | **Date**: 2026-05-16 | **Spec**: `specs/001-align-dlt-mvp/spec.md`

**Input**: Feature specification from `specs/001-align-dlt-mvp/spec.md`

## Summary

Replace the generic starter behavior with a focused read-only DLT parser/visualizer MVP.
The Go API owns upstream DLT calls, response normalization, error handling, and OpenAPI
contracts. The Next.js app remains a minimal playground for exercising the backend flow.
PostgreSQL remains the only datastore, but live read-through endpoints can ship before
persistence.

## Technical Context

**Language/Version**: Go 1.24+ for API, TypeScript for Next.js App Router UI

**Primary Dependencies**: chi, Huma, Next.js, React

**Storage**: PostgreSQL only; Phase 1 may use live upstream calls before persistence

**Testing**: Go `testing` via `go test ./...`; frontend validation through existing npm scripts and manual playground checks

**Target Platform**: local development on macOS with Docker Compose for PostgreSQL

**Project Type**: monorepo web application with Go API and Next.js UI

**Performance Goals**: local user sees DLT lookup results in a practical interactive timeframe; no background polling in MVP

**Constraints**: no auth, no booking automation, no Redis, no queues, JSON responses only, endpoints under `/v1`, OpenAPI docs exposed locally

**Scale/Scope**: read-only MVP covering observed DLT office/work/vehicle/work-type/holiday/slot flow

## Constitution Check

*GATE: Must pass before implementation. Re-check after design changes.*

- **MVP Simplicity**: Pass. Scope excludes booking, auth, queues, Redis, and paid alerts.
- **Go Backend / Thin UI / PostgreSQL Only**: Pass. Backend owns DLT logic; UI remains playground.
- **OpenAPI-First JSON API**: Pass. Contracts are defined in `contracts/openapi.yaml`.
- **Preserve External DLT Contract**: Pass. Tasks include fixtures/DTO checks for known upstream strings.
- **Repo-Owned AI Context**: Pass. Active spec, plan, and tasks live under `specs/001-align-dlt-mvp`.
- **Verifiable Incremental Delivery**: Pass. Tasks are grouped by independently testable user stories.

## Project Structure

### Documentation (this feature)

```text
specs/001-align-dlt-mvp/
├── spec.md
├── checklists/
│   └── requirements.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
apps/api/
├── cmd/server/main.go
├── internal/config/config.go
├── internal/dto/dto.go
├── internal/http/handler.go
├── internal/model/model.go
├── internal/repo/repo.go
├── internal/service/service.go
└── migrations/001_init.sql

apps/web/
├── src/app/api/agent/route.ts
├── src/app/page.tsx
└── src/app/playground/page.tsx

docs/
├── PRODUCT_SPEC.md
├── idea.md
├── ROADMAP.md
├── TASK_INDEX.md
└── AI_FIRST_WORKFLOW.md
```

**Structure Decision**: Keep the existing monorepo shape. Add DLT-specific backend
logic inside the current Go app and expose it to the existing Next.js playground.

## Complexity Tracking

No constitution violations are required for the MVP.
