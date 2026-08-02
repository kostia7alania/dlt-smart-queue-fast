# Feature 016: Licence-Authority Rebrand

**Status:** In Progress
**Created:** 2026-08-01

## Why

The product started as an appointment-slot finder and was branded that way
("Thai Queue Scout"). The real, repeatedly observed pain is wider: a foreigner in
Thailand does not want a slot, they want the licence question closed — which
licence they can get, what it involves, which office, when, and what happens
after. Slot discovery is one step inside that journey, not the product.

The rebrand therefore does two things at once:

1. moves the identity to a name that says what the site is about — the Thai
   driving licence — on a keyword-legible domain
   (`thai-driving-license.com` / `thai-driver-license.com`, chosen by measured
   search demand, see `docs/research/2026-08-01-keyword-brand-demand.md`);
2. widens the content architecture from "find a slot" to "get the licence",
   with the live availability tools kept as the proof-carrying core the
   competitors do not have.

## Decision (2026-08-01)

**Name:** Thai Driving License. **Primary domain:** `thai-driving-license.com`.
**Defensive:** `thai-driving-licence.com` (Commonwealth spelling, 301 to the
primary). `thai-driver-license.com` is rejected.

Evidence, in `docs/research/2026-08-01-keyword-brand-demand.md` and
`docs/research/2026-08-01-domain-availability-rebrand.md`:

- Google autocomplete completes the ambiguous prefix `thai driving l` to
  "driving license" in every observed suggestion; the `driver license` variant
  has a thinner, more commercial tail and no leading competitor uses it in a URL.
- Thailand's own English register is UK "licence" (the official app package is
  `th.go.dlt.qrlicence`), which is why the UK spelling is bought defensively and
  used in prose, while slugs and the domain keep the US spelling that people
  actually search.
- Both target domains returned RDAP 404 on 2026-08-01. Unhyphenated exact
  matches are held by domain investors (`thaidrivinglicense.com`,
  `thaidrivinglicence.com` on Afternic nameservers) or serve scraped content
  (`thaidriverslicense.com`) — none is a real competitor, none is buyable cheaply.
- `thaidlt.com` is held by a Thai state research centre and is rejected outright:
  "DLT" is the government agency's own initialism.
- Also free and worth the owner's consideration:
  `thailanddrivinglicense.com` (unhyphenated, exact match on a longer phrase).

**Recorded dissent.** The keyword research recommended *not* moving the primary
identity to a keyword domain: Google serves the same result corpus for both
spellings, so an exact-match domain buys little ranking value, and a descriptive
name reads closer to the paperwork agencies this product is deliberately not.
The owner's decision is to rebrand anyway, for positioning clarity; the dissent
is kept here so a later reversal has its reasoning already written down.

No domain was registered. Purchase, DNS, and analytics remain the owner's action.

## Scope

- One brand name, tagline, and domain, applied everywhere the old brand appears
  (config, metadata, structured data, chrome, docs, deployment templates,
  research notes, and generated assets).
- A licence-journey content cluster under `/licence/*` that answers the whole
  question, with every statement still labelled observed / DLT-only / reported.
- Existing discovery routes (`/calendar`, `/compare`, `/map`, `/history`,
  `/offices/*`) kept and re-framed as the evidence layer of the journey.
- Brand-carrying assets that do not exist yet: favicon, OG image, and an app
  icon, generated as committed static files with no external dependency.

## Non-goals

- Registering, transferring, or paying for any domain, DNS, or hosting. The
  research produces a recommendation; the purchase is the owner's action.
- Changing the Go module path or the GitHub repository name in this feature
  (expensive, and orthogonal to the public identity).
- Any claim of official status, guaranteed appointments, or procedural authority.
  The evidence rules from features 014 and 015 stay in force.
- Collecting personal data, adding analytics, auth, or booking automation.

## Requirements

1. Exactly one source of truth for the brand: `apps/web/src/shared/config/site.ts`.
   No page may hard-code the product name, tagline, or official URL.
2. The chosen domain and name MUST be justified by recorded evidence, and the
   losing candidate MUST be recorded as a defensive registration.
3. Every public page MUST carry the new name in its title template, canonical
   host, and structured data, with no residue of the old brand anywhere in the
   exported output.
4. The `/licence/*` cluster MUST use the same typed claim model as `/guides/*`
   (observed / DLT-only / dated third-party report) — no unsourced procedure.
5. Every new page MUST be statically exported, linked from at least one other
   page, present in the sitemap, and free of client-side state.
6. Brand assets MUST be committed files (SVG/ICO/PNG produced locally), never
   fetched at build time.
7. Upstream DLT strings stay byte-for-byte unchanged, including the known
   defects.

## Success criteria

- `grep -ri "queue scout\|thaiqueuescout"` over the repo returns only historical
  research notes that are explicitly dated and marked superseded.
- The exported site shows the new brand in `<title>`, OG tags, JSON-LD, header,
  and footer on every route.
- The licence cluster covers the journeys the keyword research ranks highest,
  each linked into live availability.
- A production static export builds with the new brand and the full route set.
