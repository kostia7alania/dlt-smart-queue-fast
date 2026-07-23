# Implementation Plan: Stored Slot History

## Technical Context

- Go 1.26 API with Huma and chi.
- PostgreSQL 18 via pgx and existing migrations.
- Next.js 16 App Router, React 19, TypeScript 6, Biome, Tailwind v4 with `tw`
  prefix, shadcn/Base UI primitives, and current FSD layers.
- Existing `dlt_slot_snapshots` table already retains the required history and
  has a `(tyw_id, fetched_at DESC)` index.

## Constitution Check

- Read-only PostgreSQL/API/UI work inside the existing DLT discovery job.
- No auth, billing, booking, queues, Redis, background monitoring, or new
  dependency.
- Exact upstream message/color strings remain unchanged.
- API models and validation are explicit; behavior is covered by unit,
  handler, integration, and browser checks.

## Backend Design

1. Add a repository record and bounded `SlotSnapshots` query ordered by
   `fetched_at DESC, id DESC`.
2. Reuse one pure slot-summary helper across comparison, map availability, and
   history so the `"เต็ม"` predicate cannot drift.
3. Decode and summarize stored payloads in the service; return an explicit
   error for malformed JSON.
4. Expose `GET /v1/dlt/history/slots?workTypeId=...&limit=...` with default 20
   and cap 100. Empty history is a successful empty response.

## Frontend Design

1. Extend the existing DLT entity public API with history types and an
   abortable fetcher.
2. Add an App Router `/history` route with a Suspense boundary.
3. Keep page-only orchestration and rendering in `views/history`; reuse the
   existing office selector and DLT entity helpers.
4. Treat `siteId`, exact `keyword`, and `limit` as URL source of truth.
5. Render a text summary and semantic table; use text labels in addition to
   color and preserve horizontal access on narrow screens.
6. Add context-preserving History links from existing discovery surfaces.

## Validation Strategy

- Targeted repository, service, and handler Go tests during implementation.
- Native Node model tests, TypeScript, and Biome for web changes.
- Full `go test ./...`, golangci-lint, golangci-lint format diff, PostgreSQL
  integration, Next production build, and `git diff --check`.
- Local API/web browser smoke for direct URL restoration, changing controls,
  context links, Back/Forward, and browser console/runtime errors.
