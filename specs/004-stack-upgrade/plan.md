# Implementation Plan: Stack Refresh and Schema Baseline

**Branch**: `004-stack-upgrade` | **Date**: 2026-07-07 | **Spec**: `specs/004-stack-upgrade/spec.md`

## Summary

Mechanical, validation-heavy chore: pin/bump every runtime and dependency to the
verified-latest versions listed in the spec, modernize the compose/Make infra, and
rebuild the DB schema as a single DLT-only baseline (data is disposable). Remove the
last of the generated starter surface (mock endpoints + `runs` table) so code, schema,
and OpenAPI match the actual product.

## Key Decisions

1. **Node 24 LTS, not 26.** Node 26 is Current until October 2026; infra pins LTS.
   `.nvmrc` holds the major (`24`) so nvm resolves the newest installed 24.x.
2. **PostgreSQL 18 via fresh volume.** `down -v` + new baseline instead of pg_upgrade
   — explicitly allowed by the user ("данные можно уничтожать").
3. **One baseline migration.** With no data to preserve, migrations 001+002 collapse
   into a DLT-only `001_init.sql`; the embedded runner and `schema_migrations`
   mechanics stay unchanged for future migrations.
4. **Majors (TS 6, ESLint 10) attempted, gated by validation.** Peer ranges allow
   them; if lint/build fail they roll back individually with a note in the spec.
5. **Starter cleanup counts as schema redesign.** The `runs` table and mock endpoints
   are the only non-DLT surface; removing them is the "better architecture" the user
   asked for — the DLT schema itself was designed fresh in 002 and needs no change
   beyond a lookup index for snapshot work-type filters.

## Constitution Check

- MVP Simplicity: Pass — removes dead surface, adds nothing.
- Go/Thin UI/Postgres-only: Pass — unchanged.
- OpenAPI-First: Pass — OpenAPI shrinks to the real contract.
- Preserve DLT Contract: Pass — untouched; tests re-run.
- Repo-Owned Context: Pass — this spec + TASK_INDEX + constitution amendment.
- Verifiable Delivery: Pass — every phase gated by tests/smoke.

## Risks

- TS 6 / ESLint 10 majors may break `eslint-config-next` in practice despite peer
  ranges — mitigated by per-package rollback.
- PG 18 behavior differences for our SQL are unlikely (plain DDL/DML), verified by the
  full smoke chain on a fresh volume.
