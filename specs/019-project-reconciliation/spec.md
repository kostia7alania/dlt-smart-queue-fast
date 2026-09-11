# Feature 019: Project Reconciliation

**Status:** Complete
**Created:** 2026-09-11

## Problem

The main checkout described Thai Queue Scout while 30 completed commits for
Thai Driving License remained on `feat/016-unified-chrome`. Task documents mixed
completed work, historical research, and launch prerequisites. The rebrand's
sitemap also omitted the existing availability evidence guide.

## Scope

1. Recover the provenance of the previously uncommitted work and verify its
   current commit and worktree state.
2. Integrate the completed rebrand into local `main` after verifying a clean
   fast-forward base.
3. Restore the availability evidence guide to the sitemap and check public
   page coverage against the actual route files and content registries.
4. Reconcile the product spec, roadmap, task index, backlog, startup and
   deployment documentation with the combined implementation.
5. Preserve the requirement for useful static content without a paid domain or
   live API. Record unimplemented resilience work separately from the proposed
   Worker/D1 rewrite and alternative brand research.

## Non-goals

Domain purchase, deployment, push, account changes, infrastructure migration,
new licence procedure claims, notifications, or deleting the linked worktree.

## Acceptance

- Local `main` contains `be97d8f` and the earlier map fix `41a31bb`.
- Every public static page, licence journey, city hub and generated office
  page has a sitemap entry; the playground remains excluded.
- Current docs distinguish implemented capabilities, validation evidence,
  launch work and proposals. No active task points at an already completed
  historical feature.
- Existing web checks, production export and a sitemap/export audit pass.
- No historical source-read date is changed without rereading its source.

Sitemap policy follows [Google's canonical URL guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
and the installed Next.js sitemap/static-export documentation.
