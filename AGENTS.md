# AGENTS.md

## Project purpose
AI-first starter for:
- Next.js web UI
- Go API
- Postgres
- OpenAPI-first backend
- no auth in MVP
- no Redis in MVP

## Constraints
- Keep MVP minimal
- Do not add Redis, Kafka, NATS, background queues, or auth unless explicitly asked
- Prefer simple, production-readable code over abstractions
- Use Go for API and business logic
- Use Next.js only for UI and thin BFF routes
- Use PostgreSQL as the only datastore in v1

## Backend conventions
- Go version: 1.24+
- Router: chi or Huma with chi adapter
- API must expose OpenAPI docs
- Endpoints under /v1
- Health endpoint at /healthz
- JSON responses only
- Context-aware handlers
- No ORM unless explicitly requested
- Prefer sqlc + migrations

## Frontend conventions
- Next.js App Router
- TypeScript
- Minimal UI, no auth
- Add one playground page to call backend endpoints

## Deliverables
- docker-compose.yml for postgres only
- Makefile for common commands
- .env.example
- OpenAPI docs exposed locally
- example endpoints with request/response models
- README with startup instructions

## AI workflow
- Treat repository Markdown as the source of truth, not chat history
- Start new AI sessions by reading docs/TASK_INDEX.md
- Follow active Spec Kit artifacts under specs/* before implementation
- Update task checkboxes in tasks.md as work completes

## Non-goals
- authentication
- billing
- Redis
- websockets
- background workers unless explicitly requested