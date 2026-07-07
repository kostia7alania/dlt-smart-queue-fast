# Implementation Plan: 2026 Toolchain — Node 26, Biome, golangci-lint

**Branch**: `005-toolchain-refresh` | **Date**: 2026-07-07 | **Spec**: `specs/005-toolchain-refresh/spec.md`

## Summary

Tooling-only feature; the research and decisions live in the spec. Web swaps ESLint
for Biome 2.5 (single tool for lint + format, official create-next-app option, next
and react rule domains). Go gains golangci-lint v2 with gofumpt. Node moves to the
26 Current line at the user's explicit request.

## Key Decisions

1. **Biome over oxlint suite**: oxfmt is pre-1.0; Biome's formatter is stable and its
   next/react domains replace the eslint-config-next rules we actually used. One
   binary instead of ESLint + (missing) formatter.
2. **Formatter matches existing style** (2-space, double quotes, semicolons) so the
   one-time reformat stays reviewable.
3. **golangci-lint installed via `go install .../v2@latest`** — contained in GOPATH,
   no system package manager involvement; config committed so any machine reproduces.
4. **Node 26 Current, knowingly not LTS** — user decision, recorded in constitution
   amendment 1.0.2.

## Constitution Check

- MVP Simplicity: Pass — replaces two web dev-deps with one, adds one Go dev tool.
- Preserve DLT Contract: Pass — formatting only; contract tests re-run.
- Verifiable Delivery: Pass — SC gates include build, tests, and browser smoke.

## Risks

- Biome rules may flag existing code — resolved during T405, kept behavior-neutral.
- Node 26 Current may hit ecosystem gaps before October LTS — accepted; `.nvmrc`
  makes rollback to 24 a one-line change.
