# Feature 019 Plan

- Base: `main` at `e2fef14`; remote `origin/main` at `a0ed4df` after fetch.
- Recovered branch: `feat/016-unified-chrome` at `be97d8f`, identical to its
  remote and 30 commits ahead of local main. Both worktrees were clean; no stash.
- Integrate with a local fast-forward, preserving every existing commit.
- Keep the dependency-free sitemap table. Validate it against source pages and
  the existing content/directory models in its existing Node test file.
- Keep one current status document and one ordered backlog. Historical specs
  keep their validation dates; correct stale completion headings explicitly.
- Do not modify Go, dependencies, runtime branding, or infrastructure contracts.

Validation: existing Node tests, dataset check, Biome, TypeScript, static export,
exported sitemap/canonical/link audit, and `git diff --check`. The Go code is
unchanged by the recovered branch; its baseline test result is recorded in the
project status, including the skipped PostgreSQL integration tests.

Constitution: Go/PostgreSQL and all MVP non-goals remain in force. A Worker/D1
migration requires a separate decision and constitution change.

Rollback: the pre-integration baseline is `e2fef14`; the recovered branch and
its remote retain `be97d8f`. New reconciliation edits are one separate local
commit. Do not reset shared or dirty branches during rollback.
