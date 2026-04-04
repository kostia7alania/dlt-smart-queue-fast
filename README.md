# AI-First Starter Project

A minimal, production-oriented monorepo for solo developers building AI-first applications.

## Architecture

- **Frontend:** Next.js (App Router, TypeScript)
- **Backend:** Go (Chi + Huma for OpenAPI)
- **Database:** PostgreSQL
- **Infrastructure:** Docker Compose (local dev only)

## Prerequisites

- Docker and Docker Compose
- Go 1.24+
- Node.js 18+

## Startup Steps

1. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

2. Start the database:
   ```bash
   make up
   ```

3. Start the API (in a new terminal):
   ```bash
   make api-dev
   ```

4. Start the frontend (in a new terminal):
   ```bash
   make web-dev
   ```

## Example API Requests

**Health Check**
```bash
curl -X GET http://localhost:8080/healthz
```

**Generate Agent Plan**
```bash
curl -X POST http://localhost:8080/v1/agent/plan \
  -H "Content-Type: application/json" \
  -d '{"goal": "Build a simple blog"}'
```

**Analyze Idea**
```bash
curl -X POST http://localhost:8080/v1/ideas/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "A habit tracking app that rewards you with dog pictures"}'
```

**Get Run Status**
```bash
curl -X GET http://localhost:8080/v1/runs/123
```
