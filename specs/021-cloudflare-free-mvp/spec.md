# Feature 021: Free Cloudflare MVP

**Status:** Active  
**Created:** 2026-09-21

## Problem

The useful static licence and office content is ready, but the documented
production shape still requires a paid domain, a Go service and PostgreSQL.
That delays the first public learning loop and leaves the office list frozen at
the repository capture. The owner explicitly chose a zero-cost first release on
Cloudflare and wants the runtime boundary to remain easy to move behind a Go
BFF later.

## Scope

1. Publish the existing Next.js static export and a small same-origin Worker as
   one Cloudflare Workers deployment on the Free plan.
2. Use the assigned `workers.dev` origin as the initial indexable canonical;
   keep every canonical derived from `NEXT_PUBLIC_SITE_URL` so a future custom
   domain is a build-time configuration change, not a route rewrite.
3. Keep the committed 218-entry office directory as the immutable emergency
   fallback. Store the last successful live office snapshot in one Workers KV
   key.
4. Refresh the snapshot on a six-hour Cron Trigger and through a public manual
   refresh action protected by a 30-minute global best-effort cooldown.
5. Keep the browser on same-origin `/v1` contracts. The browser MUST NOT call
   the DLT upstream directly. The Worker exposes the existing office and office
   snapshot response shapes so a later BFF can replace it without changing UI
   consumers.
6. Show office-data source, timestamp, count and refresh result on the office
   landing page. A failed refresh keeps and labels the last usable snapshot.

## Non-goals

- Purchasing a domain or making any paid Cloudflare resource mandatory.
- Reimplementing work-type, slot, compare, map-history or booking logic in the
  Worker. Those remain Go/PostgreSQL capabilities for a later BFF deployment.
- D1, R2, Durable Objects, authentication, accounts, payments, notifications,
  queues or automated booking.
- Writing runtime refresh results back to GitHub.
- Claiming that an office's `app_open` value guarantees a bookable appointment
  or applicant eligibility.

## User stories

### P1: Useful free public site

As a visitor, I can open an indexed `workers.dev` site and use the licence and
office content without the Go API or a paid domain.

### P1: Fresh office list

As a visitor, I can see when the office list was captured and request a bounded
refresh. If DLT is unavailable, I still see the last successful or committed
snapshot and a truthful status.

### P1: Portable backend boundary

As the owner, I can later point the static frontend at a BFF implementing the
same `/v1/dlt/offices` contracts without rewriting the pages.

## Acceptance

- A production Worker serves the static export and `/v1/dlt/offices*` from one
  HTTPS `workers.dev` origin with index/follow metadata and self-canonicals.
- The committed snapshot renders when KV is empty or DLT fails.
- A successful scheduled or allowed manual refresh validates a bounded upstream
  payload before replacing KV; an invalid/failed refresh cannot erase good data.
- Manual refresh within 30 minutes returns the current snapshot without another
  upstream call and communicates the next allowed time.
- The office page exposes an accessible loading, success, cooldown and error
  state. Static office routes remain crawlable without client JavaScript.
- Wrangler configuration, generated bindings, deploy/recovery commands and Free
  plan assumptions are committed and checked.

