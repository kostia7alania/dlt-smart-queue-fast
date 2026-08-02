# Content Surface Gap Analysis

**Date:** 2026-08-01 (overnight session continuing 2026-07-31)
**Question:** now that features 014 and 015 have landed, how much of the
search architecture proposed in `2026-07-24-market-seo-domain.md` actually
exists, what is still missing, and what is the next lever worth pulling?
**Method:** compare the proposed route tree against the built static export, and
compute coverage directly from the committed office directory.

## 1. Proposed architecture versus shipped routes

| Proposed (2026-07-24) | Status | Route |
| --- | --- | --- |
| `/` | Shipped (014) | Product-led home with the boundary card |
| `/appointments` | Shipped (014) | Static product-intent page |
| `/calendar`, `/compare`, `/map` | Already existed | Interactive views |
| `/guides/dlt-smart-queue-for-foreigners` | Shipped (014) | Bounded foreigner guide |
| `/guides/convert-foreign-driving-license-thailand` | Shipped (015) | Evidence-bounded guide |
| `/guides/renew-thai-driving-license` | Shipped (015) | Evidence-bounded guide |
| `/offices/bangkok`, `/chiang-mai`, `/pattaya`, `/phuket` | Shipped (015) | Area hubs from committed data |
| — (not proposed) | Added (015) | `/guides` index, `/offices` index, and four extra hubs: Koh Samui/Surat Thani, Krabi, Hua Hin/Prachuap Khiri Khan, Udon Thani |

The proposed tree is therefore complete, plus two index pages and four extra
areas. 25 pages are prerendered; 19 are in the sitemap (`/playground` and the
404 stay out, and dynamic routes are listed by their concrete paths).

## 2. Coverage the hubs actually give

Computed from `apps/web/src/entities/dlt/data/office-directory.json`:

| Measure | Value |
| --- | --- |
| Entries in the captured list | 218 |
| Entries marked `app_open = 1` | 115 |
| Offices reachable from a published hub | 34 |
| Marked-open offices reachable from a hub | 20 of 115 (17%) |
| Marked-open offices with no hub | 95 |

Provinces with the most uncovered marked-open offices: Nakhon Ratchasima (5),
Khon Kaen (4), then Lampang, Phetchabun, Nakhon Pathom, Kanchanaburi, and
Phatthalung with three each.

Two honest readings of that 17%:

1. **It is not a hole in the product.** `/map`, `/compare`, and the office search
   already reach every office in the list. Hubs are an entry point for people who
   search by place name, not the only way in.
2. **It is a real content ceiling for search.** Someone searching "DLT office
   Khon Kaen" has no page. The provinces above are ranked by data, not by guess,
   so they are the honest queue if more hubs are wanted.

The counter-argument against publishing all of them: the market research warns
against templated city pages with no unique verified content. Each existing hub
carries a hand-written summary of what its own data says. Nine more provinces
means nine more summaries that somebody has to keep true — which is a content
maintenance commitment, not a code change.

**Recommendation:** stop at eight until there is real query evidence. The eight
cover the places foreigners actually ask about, and the next four should be
chosen from Search Console data rather than from office counts.

## 3. What is still missing

| Gap | Blocked by | Note |
| --- | --- | --- |
| Domain, deployment, Search Console, analytics property | Explicit user authorization | Unchanged since 2026-07-24; the RDAP recheck on 2026-07-31 found all candidates still unregistered |
| Real query data | The above | Every keyword statement in the research remains a hypothesis |
| Thai-language pages | A maintained translation workflow | Machine translation of these pages would break the claim boundary they exist to protect |
| Per-office pages (`/offices/site/<id>`) | Not proposed, and thin by nature | An office page would repeat one table row plus links; hubs already do that better |
| A review cadence for dated claims | Nothing — this is the one gap we can close ourselves | See below |

## 4. The one gap worth closing now: claim freshness

Every `reported` claim in a guide carries `source`, `sourceUrl`, and
`observedOn`, and each guide carries `updatedOn`. Nothing yet forces anyone to
revisit them. The two 2026 renewal-rule claims will age badly: the Nation article
says an electronic renewal system is *in development*, which is precisely the
kind of statement that becomes wrong without warning.

Proposal, in increasing cost:

1. `npm run content:review` — a script that lists every guide claim older than
   180 days with its source URL, so a human can re-read the sources in one pass.
   Cheap, no false failures, no time-bomb in CI.
2. A test that fails when a guide's `updatedOn` is older than 365 days. Honest,
   but it fails on a calendar date rather than on a code change, which is a poor
   CI signal for a hobby-scale project.
3. Automated source re-fetching. Rejected: the sources are HTML pages whose
   wording changes without changing meaning, so a diff would be noise.

Option 1 is the recommendation.

## 5. What the next session should not do

- Do not add hubs "because the data is there" — the constraint is maintained
  content, not available rows.
- Do not soften the claim categories to make guides read more confidently. The
  reason the guides are defensible is that they refuse to assert procedure.
- Do not register the domain or create analytics properties without explicit
  authorization, and recheck availability immediately before doing so.

## Sources

- `docs/research/2026-07-24-market-seo-domain.md` (architecture and audience)
- `docs/research/2026-07-31-dlt-source-and-process-evidence.md` (claim boundary)
- `docs/research/2026-07-31-brand-domain-recheck.md` (registry state)
- `apps/web/src/entities/dlt/data/office-directory.json` (coverage arithmetic)
- The 2026-08-01 static export in `apps/web/out` (shipped route list)
