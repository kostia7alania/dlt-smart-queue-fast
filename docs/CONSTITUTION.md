<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles: placeholder principles -> concrete DLT Parser MVP principles
Added sections: Technology Constraints, Development Workflow
Removed sections: unresolved template placeholders
Templates requiring updates: no template edits required; active feature artifacts reference this constitution
Follow-up TODOs: none
-->

# DLT Parser Constitution

## Core Principles

### I. MVP Simplicity and Explicit Non-Goals
The project MUST stay minimal until a working DLT slot discovery MVP exists.
Authentication, billing, Redis, Kafka, NATS, background queues, websockets, and
booking automation MUST NOT be added unless the user explicitly requests them.
Complex abstractions MUST be rejected when direct, production-readable code is enough.

### II. Go Backend, Thin Next.js UI, PostgreSQL Only
Business logic and upstream DLT API normalization MUST live in the Go API. Next.js
MUST be used for UI and thin BFF routes only. PostgreSQL is the only datastore for
v1. No ORM may be introduced unless explicitly requested; migrations and simple SQL
are preferred.

### III. OpenAPI-First JSON API
The backend MUST expose JSON endpoints under `/v1`, a health endpoint at `/healthz`,
and local OpenAPI documentation. Request and response models MUST be explicit and
stable enough for the frontend and future agents to consume without reading handler
internals.

### IV. Preserve External DLT Contract Exactly
Strings and field names observed from the DLT Smart Queue API MUST be treated as an
external contract. Known oddities such as `Car and Motocycle`, `car`,
`New thai driving license.`, `Renew thai driving license.`, `เต็ม`, and `[empty]`
MUST NOT be silently corrected in parsers, fixtures, or documentation.

### V. Repo-Owned AI Context
Important product, architecture, and implementation context MUST live in repository
Markdown files, not only in chat history. New work SHOULD start from
`docs/TASK_INDEX.md`, the active `specs/*/spec.md`, `plan.md`, and `tasks.md`.
Agents MUST update task checkboxes and relevant docs as work completes.

### VI. Verifiable Incremental Delivery
Each implementation slice MUST be independently testable. Before marking a task
complete, the agent SHOULD run the smallest relevant validation command. Contract,
parsing, and API behavior changes SHOULD include tests or documented manual checks.

## Technology Constraints

- Go version: 1.24+.
- Backend router: chi or Huma with chi adapter.
- Frontend: Next.js App Router with TypeScript.
- Local services: Docker Compose for PostgreSQL only.
- API responses: JSON only.
- Handlers: context-aware.
- MVP notifications are documentation-only unless explicitly promoted to scope.

## Development Workflow

1. Read `AGENTS.md`, `docs/TASK_INDEX.md`, and the active feature under `specs/`.
2. If the request is larger than a small fix, update or create spec artifacts first.
3. Implement tasks in `tasks.md` order, preferring the MVP user story first.
4. Keep external DLT observations traceable to `docs/idea.md` and `docs/assets/`.
5. Do not introduce auth, queues, Redis, or booking automation without explicit scope change.
6. Finish by updating task checkboxes and summarizing validation performed.

## Governance

This constitution supersedes ad-hoc agent behavior and generated boilerplate. Changes
to these principles require an explicit documentation update, a version bump, and a
short rationale in the relevant spec or decision document. Feature plans and tasks
MUST pass the constitution check before implementation.

**Version**: 1.0.0 | **Ratified**: 2026-05-16 | **Last Amended**: 2026-05-16
