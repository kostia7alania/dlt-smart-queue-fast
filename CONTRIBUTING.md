# Contributing

Thanks for improving DLT Smart Queue Fast.

## Before starting

1. Read `AGENTS.md`, `docs/TASK_INDEX.md`, and the active feature under
   `specs/`.
2. Open an issue for a broad product change. Small bug fixes can go directly to
   a focused pull request.
3. Keep the MVP constraints: no auth, booking, payments, Redis, queues, or
   background workers unless a specification explicitly approves them.

## Development

```bash
cp .env.example .env
make up
make web-install
make check
```

Backend changes should use Go, context-aware handlers, plain SQL, and embedded
migrations. Frontend routes stay thin and follow the repository's FSD layer
direction. Tailwind utilities require the `tw:` prefix.

Do not commit secrets, production data, generated build output, or unrelated
formatting. Preserve upstream Thai and English values instead of translating or
normalizing them silently.

## Pull requests

- Explain the user-visible behavior and operational impact.
- Link the relevant specification task or issue.
- Add focused tests for behavior changes.
- Run `make check`; report any check you could not run.
- Keep migrations forward-only and compatible with the previous application
  revision so rollback remains possible.
- Update documentation and task checkboxes when the contract changes.

By contributing, you agree that your contribution is licensed under the
repository's GNU AGPL-3.0-or-later license.
