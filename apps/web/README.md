# Thai Driving License Web

Static Next.js App Router UI for licence journeys, office discovery and DLT
appointment evidence. Read [the project README](../../README.md),
[status](../../docs/PROJECT_STATUS.md) and [backlog](../../docs/BACKLOG.md) first.

## Development

Use the Node version from `.nvmrc` (26.x). From the repository root:

```bash
make web-install
make web-dev
```

The browser calls the Go API directly. `NEXT_PUBLIC_API_URL` defaults to
`http://localhost:8080`; start the API and PostgreSQL using the root README.
Static guides and office content do not need an API at build time.

## Structure

Routes live in `src/app` and render `src/views`. Imports follow FSD layers:
app -> views -> widgets -> features -> entities -> shared. UI primitives live
in `src/shared/ui`. Tailwind classes use the `tw` prefix; semantic hooks use BEM.
Follow [AGENTS.md](AGENTS.md) and the repository conventions before editing.

## Checks and Build

From `apps/web`:

```bash
npm run lint
npm test
npm run typecheck
npm run data:check
npm run build
```

The build exports `out/` for a static host; it does not run a Next.js server or
BFF. Set `NEXT_PUBLIC_SITE_URL` for production canonicals and indexing, and
`NEXT_PUBLIC_SITE_NAME` for the public brand, before building. An unset site URL
keeps indexing disabled. Deployment and failure-mode requirements are in
[DEPLOYMENT.md](../../docs/DEPLOYMENT.md).

`npm run content:review` lists dated claims due for rereading. `data:check`
checks committed dataset reproducibility, not current upstream freshness.
