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
- Go version: 1.26+
- Lint/format with golangci-lint v2 + gofumpt (`make lint`, `make fmt`)
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
- Node.js 26 (Current line, see `.nvmrc`)
- Lint/format with Biome (`npm run lint`, `npm run format`); no ESLint/Prettier
- UI kit: shadcn/ui (Base UI primitives) in `src/shared/ui`; add components via
  `npx shadcn add <name>` (components.json carries aliases and the `tw` prefix)
- Architecture: FSD layers `app` (routes only) → `views` → `widgets` → `features`
  → `entities` → `shared`; imports point downward only; slices expose `index.ts`
- Styling: Tailwind v4 with prefix `tw` (`tw:flex`, `tw:hover:...`); unprefixed
  class names are BEM semantic/test hooks (`slot-calendar__day--full`), never styling
- See `docs/adr/ADR-001-ui-kit-strategy.md` for the cross-project design rationale
- Minimal UI, no auth
- Add one playground page to call backend endpoints

## Deliverables
- compose.yaml for postgres only (PostgreSQL 18)
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