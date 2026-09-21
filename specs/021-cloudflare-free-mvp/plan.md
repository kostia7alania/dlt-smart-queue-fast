# Feature 021 Plan

## Baseline

- Clean `main` at `bf776f6`, matching `origin/main` on 2026-09-21.
- Next.js already exports static files to `apps/web/out`.
- The repository contains a reproducible 218-entry office directory generated
  from a dated DLT capture, but runtime office freshness depends on the Go API.
- No production deployment or paid domain is verified.

## Architecture

```text
browser
   |
   | same origin
   v
Cloudflare Worker + Static Assets (workers.dev)
   |                         |
   | /v1/dlt/offices*        | static Next export
   v                         v
Workers KV <---- cron/manual refresh ---- DLT getSite/2
   |
   +---- committed directory fallback bundled with the Worker
```

The Worker owns only transport, validation, freshness metadata and a bounded
cache for the public office list. It deliberately does not absorb licence,
eligibility, slot or booking business logic. The public HTTP boundary stays
compatible with the existing Go endpoints.

## Delivery sequence

1. Amend the constitution for the explicitly authorized read-only edge MVP and
   record Feature 021 as active.
2. Add Worker snapshot parsing, change detection, cooldown and handlers. Generate
   bindings from Wrangler configuration rather than hand-writing `Env`.
3. Make the frontend use a same-origin API in production, add a committed office
   fallback, and add a narrow client refresh panel to the static office page.
4. Update deployment, recovery, canonical and Free-plan documentation.
5. Run focused contract tests, frontend lint/typecheck/data checks, a configured
   static build, Wrangler type/config checks and local Worker smoke checks.
6. Create the free KV namespace and deploy only after the exact source revision
   is ready; verify HTML, canonical, robots, API fallback, manual refresh and the
   configured cron on the public URL.

## Free-plan guardrails

- One KV key for the current office snapshot; no history table.
- Four cron runs per UTC day (`17 */6 * * *`).
- Thirty-minute manual refresh cooldown stored with the snapshot.
- One bounded upstream response, maximum 1,000 offices and 1 MiB JSON.
- Ten-second upstream timeout; failed refreshes never replace the stored value.
- Static asset requests are served by Workers Static Assets; only API/refresh
  traffic invokes Worker code.

## Canonical migration

The first deployment builds with its exact `https://<name>.<subdomain>.workers.dev`
origin. When a custom domain is added later, rebuild with that origin, ensure the
old host emits canonicals for the new origin, and then configure a permanent
host redirect or disable the `workers.dev` route after search migration is
verified. Route paths and API contracts do not change.

## Rollback

Redeploy the previous Worker version. KV is an optimization: removing its
binding or losing its value still leaves the committed snapshot. A custom domain
is not part of this feature, so rollback cannot depend on DNS or a registrar.

## Constitution check

This is an explicit, narrow exception to the former Go/PostgreSQL-only runtime:
the Worker caches one public read-only upstream list behind an existing contract
to enable a zero-cost product test. No eligibility, booking, slot interpretation,
auth or durable product history moves out of Go/PostgreSQL.

