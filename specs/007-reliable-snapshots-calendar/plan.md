# Implementation Plan: Reliable Snapshots and Calendar States

**Branch**: `007-reliable-snapshots-calendar` | **Date**: 2026-07-10

## Summary

Add latest-result JSONB records for the two list-shaped persistence flows while
retaining their typed projections, then make the calendar's independent request,
fallback, empty, and accessible states explicit. This is a correctness-focused slice;
it adds no product capability and no dependency.

## Key Decisions

1. **Latest collection snapshots beside typed rows.** `dlt_offices` and
   `dlt_work_types` stay queryable, while small JSONB snapshot tables preserve exact
   list boundaries and valid empty results. This avoids stale-row leakage without
   deleting useful typed projections.
2. **One work-type snapshot per exact lookup.** The composite key is
   `(site_id, group_id, keyword)` because leading whitespace in the DLT keyword is
   part of the upstream contract.
3. **One transaction per list persistence operation.** Typed projection and snapshot
   freshness move together or not at all.
4. **Independent view state.** The calendar view owns separate office and calendar
   loading/errors. Domain fetching stays in `entities/dlt`; the calendar widget owns
   only calendar presentation state.
5. **Native semantics first.** Existing native buttons, labels, lists, and table
   elements receive names/state instead of adding a custom interaction abstraction.

## Constitution Check

- MVP simplicity: pass; targeted bug fixes, no new dependency.
- Go backend / thin UI / PostgreSQL only: pass.
- OpenAPI-first: pass; response shapes are unchanged.
- Preserve DLT contract: pass; values are marshalled without normalization.
- Repo-owned context: pass; spec, plan, tasks, and task index are updated.
- Verifiable delivery: pass; focused tests plus repository validation commands.

## Validation

- Go unit tests and lint.
- PostgreSQL migration and empty-list round-trip against the local compose database.
- Biome, TypeScript, production Next.js build, and Tailwind-prefix audit.
- Browser automation is intentionally excluded because it was not requested; the
  existing feature 006 smoke result remains the last browser baseline.
