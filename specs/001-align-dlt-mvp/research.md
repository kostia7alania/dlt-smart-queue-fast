# Research: DLT Read-Only Discovery MVP

## Decision: Use a repo-owned, Markdown-only workflow layer

**Rationale**: Specs, plans, and tasks live in the repository as plain Markdown, so
any AI assistant or editor can read them from an empty chat and continue work. No
assistant-specific tooling is required.

**Alternatives considered**: Editor-bound command frameworks (e.g. Spec Kit slash
commands) add convenience but couple the workflow to one tool. Keeping the artifacts
as plain Markdown stays portable across Windsurf, Claude, Gemini, Codex, Cursor, and
other agents.

## Decision: Keep DLT MVP read-only

**Rationale**: `docs/idea.md` shows useful upstream API endpoints that may work
without UI login. Booking and login behavior remain unclear and higher risk.

**Alternatives considered**: Full booking automation was deferred because it would
require auth/session research and may violate MVP simplicity.

## Decision: Preserve upstream strings exactly

**Rationale**: The official API/UI contains misspellings and mixed-language status
strings. For a parser, those values are part of the external contract.

**Alternatives considered**: Normalizing display labels can be added later as a
separate UI-only layer, but raw contract fields must stay intact.

## Decision: Backend owns upstream DLT calls

**Rationale**: Go is the project’s business-logic layer. Keeping upstream calls in the
API avoids browser CORS issues and provides one place for validation, timeouts, error
mapping, OpenAPI docs, and future persistence.

**Alternatives considered**: Calling DLT directly from Next.js was rejected because the
frontend should remain thin.

## Decision: Defer background monitoring and notifications

**Rationale**: They require scheduling, rate-limit strategy, and delivery channels.
The constitution forbids queues/background workers unless explicitly requested.

**Alternatives considered**: A polling worker or Telegram bot can become a later
feature once read-only lookup and persistence are validated.
