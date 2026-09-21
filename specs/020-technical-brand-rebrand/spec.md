# Feature 020: Technical Brand Rebrand

**Status:** In progress
**Created:** 2026-09-21

## Problem

The public product is already named **Thai Driving License**, but the repository,
Go module, frontend package, container tags, deployment template and current
documentation still expose earlier working names. That split makes the project
look unfinished and makes clone, security and deployment instructions drift from
the product identity.

## Scope

1. Use `thai-driving-license` as the technical slug for the GitHub repository,
   Go module, frontend package, local/CI container tags and future deployment
   identifiers.
2. Use **Thai Driving License** in the runtime OpenAPI title and current project
   governance documentation.
3. Update current repository, clone, security and handoff links to the renamed
   GitHub repository.
4. Rename the GitHub repository, update the local `origin`, and verify the new
   default-branch URL after the source revision passes its checks.
5. Preserve exact DLT Smart Queue upstream paths, DLT domain language, completed
   validation logs and superseded brand research as historical evidence.

## Non-goals

- Purchasing or claiming `thai-driving-license.com`.
- Claiming a production launch or renaming a verified production cloud resource.
- Rewriting historical research, old test output, old worktree paths or upstream
  DLT API endpoints to pretend they used the new identity.
- Product behavior, dependency or schema changes.

## Acceptance

- Current executable/configuration identifiers use `thai-driving-license` or
  `thai-driving-license-api`; the Go packages compile in CI under the new module.
- Current clone, security and handoff links resolve under
  `github.com/kostia7alania/thai-driving-license`.
- GitHub reports repository `kostia7alania/thai-driving-license`, default branch
  `main`, and the local `origin` uses the new URL.
- Frontend checks, data reproducibility, configured static build, Go tests/lint
  and the API container build pass locally or in GitHub CI as applicable.
- Remaining old names are explicitly historical evidence or immutable upstream
  DLT contract values, not active project identity.
