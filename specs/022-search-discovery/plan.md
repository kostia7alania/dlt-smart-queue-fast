# Feature 022 Plan

## Baseline

- `main` and `origin/main` matched at `f731d1d` on 2026-09-22.
- Production is the free Cloudflare Worker at
  `https://thai-driving-license.kostia7alania.workers.dev`.
- `/robots.txt` and `/sitemap.xml` already return HTTP 200 with the production
  origin, but no Search Console property was configured.

## Delivery sequence

1. Add the Search Console URL-prefix property and obtain its HTML meta token.
2. Render that token through Next.js metadata, run the focused web checks and
   deploy the exact revision.
3. Complete Search Console verification, submit `/sitemap.xml` and inspect the
   production landing URL.
4. Audit representative public journeys at desktop and mobile widths.
5. Ship only evidence-backed product fixes, repeat the focused checks and record
   the remaining real-user measurement work.

## Measurement boundary

Search Console supplies search discovery and indexing evidence without adding a
client tracker. Synthetic browser journeys can prove rendering and interaction
states, but not demand, comprehension or completed DLT outcomes. B07 therefore
remains open until real journeys or direct user feedback exist.

