# Keyword Demand and Brand Phrasing

**Date:** 2026-08-01 (overnight session; the Verisign RDAP responses carry a
`last update of RDAP database` timestamp of 2026-08-02)
**Question:** which English phrasing of "Thai driving licence" carries the most
search demand, and does that justify buying `thai-driving-license.com` or
`thai-driver-license.com` as a rebrand away from `thaiqueuescout.com`?
**Method:** Google autocomplete (`suggestqueries.google.com`), SERP composition
from web search, competitor title and URL spelling, Verisign `.com` RDAP, and
direct HTTP fetches of the domains already registered. Read-only. Nothing was
registered, reserved, or changed.

## 0. The honesty disclaimer that governs this whole document

**There is no volume data in here.** No Keyword Planner, no Ahrefs, no Semrush,
no Search Console — the site is not deployed, so we have no first-party queries
either. Google Trends was attempted twice and returned `HTTP 429 Too Many
Requests` both times (a plain-fetch rate limit, not a JS shell), so even the
relative-interest comparison is unavailable.

Everything below is ranked on three proxies:

1. **Autocomplete ordering.** Google orders suggestions roughly by frequency for
   the prefix. This is directional, personalization-free for an anonymous fetch,
   and the best free signal available.
2. **Autocomplete presence at the point of divergence.** If a prefix that could
   complete to either spelling only ever completes to one, that one is the
   dominant query form.
3. **Competitor title and URL spelling.** Sites that have ranked for years have
   done the keyword research we cannot do; their URL slugs are a fossil record
   of it.

Every claim below names which proxy it rests on. Where a proxy is weak, that is
stated rather than smoothed over.

A note on the `google:suggestsubtypes` field seen in the raw JSON: within each
response, items tagged `[512]` consistently appear before items tagged
`[22,30]`, and the `[22,30]` items are looser expansions (often swapping "thai"
for "thailand", or drifting to a different head term). I use ordering as the
signal and treat the subtype only as a secondary hint, because the exact
semantics of these codes are undocumented and I did not verify them.

## 1. The decisive autocomplete test

The prefix `thai driving l` is ambiguous — it can complete to `license` or
`licence`. All ten suggestions returned the US spelling, and none returned the
UK spelling:

```
["thai driving l",["thai driving license","thai driving license test",
"thai driving license renewal","thai driving license test questions and answers",
"thai driving license for foreigners",
"thai driving license test questions and answers 2026",
"thai driving license test for foreigners","thai driving license test app",
"thai driving license renewal for foreigner","thai driving license renewal online"]]
```

The UK spelling only surfaces when the user types it explicitly (`thai driving
licence`), and even then the tail is visibly thinner — the last three of ten are
`[22,30]`-tagged and drift to local-service queries (`pattaya`, `service hua
hin`) rather than to the core task cluster.

The one place the UK spelling wins outright is the **renewal** cluster:

```
["renew thai driv",["renew thai driving licence","renew thai driving licence online",
"renew thai driving license for foreigners","renew thai driving license 5 years",
"renew thai driving license phuket"]]
```

Positions 1 and 2 are UK, positions 3–5 are US. That is consistent with the
renewal audience skewing toward long-settled expats from the UK, Ireland,
Australia, and New Zealand, while the acquisition audience is a wider global mix.
It is a real split, but it is confined to one intent, and it is a five-item list.

And Google actively rewrites the UK spelling toward the US one in the conversion
cluster — this prefix is UK-spelled, and the single suggestion returned is not:

```
["convert foreign driving licence thail",["convert foreign driving license to thai"]]
```

## 2. Every phrasing, with the evidence actually collected

No volume column exists because no volume data was obtainable. The rank column
is my ordering on the proxies, and it is an opinion built from the evidence in
the adjacent columns.

| # | Phrasing | Autocomplete evidence | SERP / competitor evidence | Rank |
| --- | --- | --- | --- | --- |
| 1 | `thai driving license` (US) | 10/10 completions of the ambiguous prefix `thai driving l`; it is the #1 suggestion for `thai driving lic` and `thai driving l`; supports the deepest tail (test, renewal, for foreigners, cost, conversion, check, chiang mai) | Every top-ranking competitor title uses it: thethailandlife, tdl-service, thailandelitevisas, onestophuahin, byklo.rent, thairanked | **1** |
| 2 | `thailand driving license` | Own full 10-item tail (`test`, `renewal`, `age`, `extension`, `cost`, `categories`, `can use in malaysia`); appears as `[22,30]` expansion inside `thai driving license for ` results | thailandelitevisa.com titles "How to Get a Driving License Thailand" | **2** |
| 3 | `thai drivers license` (plural possessive-less) | Own 10-item tail incl. `for foreigners`, `renewal`, `test`, `test practice`, `australia`; and it is the **#1** completion of `how to get thai driv` | HubPages "Renewing a Thailand Driver's License"; expat forums use it conversationally | **3** |
| 4 | `thai driving licence` (UK) | Wins the renewal cluster (positions 1–2 of `renew thai driv`); otherwise never surfaces unless typed; thin `[22,30]` tail | motorist.co.th, thethaiger, aseannow, roojai use it in titles; **official DLT uses it** (see §4) | **4** |
| 5 | `thai driver license` (singular) | Own 10-item tail, but visibly weaker and more commercial (`service`, `app`, `in australia`, `exam`); `for foreigners` is last of ten, versus fifth of ten for the `driving license` prefix | No top-ranking competitor titles a page this way | **5** |
| 6 | `thai drivers licence` | Appears only as the tenth and last item of the `thai drivers lic` list | None found | **6** |

**Reading:** the `driving` variants beat the `driver`/`drivers` variants, and
within `driving`, US `license` beats UK `licence` everywhere except renewal.
`thai driver license` — one of the two domains under consideration — is the
**fifth-strongest** phrasing of six tested.

### Head-term detail collected

| Head term | Autocomplete evidence (verbatim, in returned order) |
| --- | --- |
| `thai driving license test` | `questions and answers`, `questions and answers 2026`, `for foreigners`, `app`, `2026`, `online`, `pdf`, `practice`, `questions`, `motorcycle` — all ten `[512]`. The single deepest cluster found. |
| `thai driving license renewal` | `for foreigner`, `online`, `online appointment`, `documents`, `pattaya`, `online test`, `form` |
| `thai driving license c…` | `cost`, `conversion`, `check`, then `chiang mai`, `can use in malaysia`, `card`, `certificate`, `course` |
| `thai driving license for …` | `foreigners` `[512]`, then `tourist`, `expats`, and `thailand …` variants all `[22,30]` |
| `thai driving license appoint…` | `appointment`, `renewal online appointment` — only two suggestions. Low-competition, high product fit. |
| `international driving permit thailand` | `for indian`, `price`, `uk`, `australia`, `post office`, `motorbike`, `online`, `scooter`, `number` — the tail is nationality-driven |
| `dlt office …` | `near me`, `bangkok`, `madiwala`, `hua hin`, `phuket`, `rayong`, `chatuchak`, `krabi`, `pattaya`, `chiang mai` |
| `dlt ` (bare) | `dlt trading`, **`dlt smart queue`** (#2 worldwide for the bare prefix), `dlt registration`, `dlt full form`, `dlt malta`, `dlt elearning`, `dlt meaning`, `dlt podiatry`, `dlt malta 2026`, `dlt thailand` |
| `dlt e-learning ` | `app`, `(www.dlt-elearning.com)`, `website`, `(dlt-elearning.com)`, `app download`, `portal`, `platform`, `english`, `for foreigners` |
| `thai motorcycle lic…` | `license`, `license test`, `license plate`, `test questions`, `age`, `in vietnam`, `practice test`, `cost`, `on tourist visa` |
| `residence certificate thailand ` | `form`, `online`, `immigration`, `requirements`, `application form`, **`driving license`**, `indian embassy`, `cost`, `documents` |
| `driving in thailand ` | `for foreigners`, `for malaysian`, `from uk`, `as tourist`, `for indians`, `reddit`, `singapore license`, `which side`, `left or right`, `australian license` |
| `thai driving license medical` | `medical certificate` — one suggestion only |
| `how to get thai driv` | `how to get thai drivers license`, `how to get thai driving license for foreigners`, then `[22,30]` thailand variants |

The `dlt smart queue` result is the single most product-relevant finding: it is
the #2 completion for the bare prefix `dlt` against a worldwide field that
includes distributed-ledger-technology queries. The site already owns
`/guides/dlt-smart-queue-for-foreigners`.

## 3. What the SERP looks like

Searching the UK spelling and searching the US spelling return **overlapping
result sets built mostly of US-spelled URLs**. Search for `"thai driving licence"
renew UK spelling` and you get `forbesandpartners.com/renew-thai-driving-license-foreigner/`
and `roojai.com/en/article/driving-guides/expired-driving-license/` — US slugs
ranking for a UK-spelled query. Roojai even runs both spellings across its own
URLs (`/how-to-get-thai-driving-licence-for-foreigners/` alongside
`/expired-driving-license/`).

**Conclusion: Google treats the two spellings as retrieval-equivalent.** The
spelling choice is therefore not a ranking problem. It is a click-through and
snippet-bolding problem, and a brand-recall problem. That materially lowers the
stakes of this whole decision, and I would rather say so than dress it up.

Competitor URL architecture, which is the most useful artefact collected
(tdl-service.com is the clear commercial leader in this SERP):

| Competitor | Spelling in URL | Pattern |
| --- | --- | --- |
| tdl-service.com | `license` (US) | `/thai-driving-license` pillar with `/license-types`, `/license-categories-explained`, `/renewal`, `/online-renewal-2026`, `/dlt-appointment-booking`, `/digital-license-app` children; plus `/convert-license`, `/book-appointment`, `/driving-in-thailand/dlt-guide`, `/blog/thai-driving-license-requirements-2026` |
| expatden.com | `license` (US) | `/thailand/thai-driving-license/` |
| forbesandpartners.com | `license` (US) | `/renew-thai-driving-license-foreigner/`, `/convert-foreign-driving-license-thailand/` |
| thethailandlife.com | `license` in title, neither in URL | `/learning-to-drive-in-thailand`, titled "Thai Driving License 2026: Guide for Foreigners" |
| thailandknowledge.com | `license` (US) | `/living-in-thailand/driving-license-conversion` |
| roojai.com | **both** | `/how-to-get-thai-driving-licence-for-foreigners/` and `/expired-driving-license/` |
| motorist.co.th | `licence` (UK) | `/en/article/2580/how-to-book-a-driver-s-licence-appointment-through-dlt-smart-queue-2025-update` |
| thethaiger.com | `licence` (UK) in title, `license` in another | mixed |

The commercial/service sites are uniformly US-spelled. The editorial and
community sites are the ones that use UK spelling. That is exactly what the
autocomplete data predicts.

Note that `forbesandpartners.com` already owns `convert-foreign-driving-license-thailand`
as a slug — identical to this repo's existing guide slug. That is a direct
head-to-head on an established competitor's term.

## 4. What Thailand officially uses

`dlt.go.th` renders through JavaScript and returned no readable text to a plain
fetch (the `/en/driving-license/` page returned only "Loading…"; the Smart Queue
foreigner login at `gecc.dlt.go.th` returned a 212-byte shell). So I could not
read the department's own English pages directly, and I will not guess at their
wording.

What I could verify:

- The department's own Android application is published under the package id
  **`th.go.dlt.qrlicence`** and is titled **"DLT QR LICENCE"** on Google Play.
  The package id is a string DLT itself chose and cannot be attributed to a
  translator or a journalist. This is the strongest available evidence that the
  official English register is **UK "licence"**.
- Wikipedia's DLT article states the department "issues the driving licences,
  transport licences and other documents related to road transport" — UK
  spelling, but this is a secondary source and carries no official weight.

So the premise in the brief holds: **Thailand's official English is "licence";
global search demand is "license".** They genuinely disagree, and any site in
this space has to pick a primary and handle the other gracefully.

## 5. Domain availability — verified, and it changes the question

Verisign `.com` RDAP, 2026-08-01. `404` = registry holds no object; `200` =
registered. Confirmed with `dig` for the three names that matter (no NS records
returned for any of them, consistent with unregistered).

| Domain | RDAP | What is actually there |
| --- | --- | --- |
| `thai-driving-license.com` | **404 free** | — |
| `thai-driver-license.com` | **404 free** | — |
| `thai-driving-licence.com` | 404 free | — |
| `thai-drivers-license.com` | 404 free | — |
| `thailanddrivinglicense.com` | **404 free** | — **unhyphenated exact match, still available** |
| `thaidrivinglicense.com` | 200 taken | NameCheap, reg. 2021-10-13, NS `AFTERNIC.COM`, serves a redirect to `/lander` — **parked and listed for sale** |
| `thaidrivinglicence.com` | 200 taken | Same registrant pattern, same day, same Afternic NS — a spelling-pair investor holding |
| `thaidriverlicense.com` | 200 taken | DreamHost, reg. **2026-03-13** (five months ago), DreamHost NS, but the site does not respond at all |
| `thaidriverslicense.com` | 200 taken | GoDaddy parking NS, yet serves a live WordPress 6.3.8 site whose template still says **"France Driving Test"** with "THAILAND DRIVING LICENSE" pasted into it, selling "$20 driving courses" |
| `thailanddrivinglicence.com` | 200 taken | — |
| `thailanddriverlicense.com` | 200 taken | — |
| `drivinglicensethailand.com` | 200 taken | — |
| `thailicense.com`, `thaidriving.com`, `thaidlt.com` | 200 taken | — |
| `getthaidrivinglicense.com`, `mythaidrivinglicense.com`, `thaidrivinglicenseguide.com`, `thaidrivinglicensehub.com`, `thailicenseguide.com` | 404 free | Brandable-plus-keyword fallbacks |
| `thaiqueuescout.com` | 404 free | Current working brand, still unregistered |

Two caveats on this table. `.co` and `.info` variants were queried against the
Verisign endpoint out of habit and their `404`s are **meaningless** — Verisign is
not authoritative for those TLDs, and I did not re-query the correct registries.
And RDAP is a point-in-time technical signal, not a reservation and not a
registrar quote, exactly as the 2026-07-31 recheck established.

The `thaidriverslicense.com` finding is worth pausing on. A near-miss of the
`driver`-family name currently serves scraped-template content on an outdated
WordPress install. Anyone who lands on a confusable variant of our name gets
that experience, and it is the kind of neighbourhood a trust-first product
should not be one typo away from.

## 6. Recommendation

### The question as asked

**Buy `thai-driving-license.com`, not `thai-driver-license.com`.** The margin is
not close:

1. `driving license` is the completion Google offers for the ambiguous prefix
   `thai driving l` — 10 times out of 10. `driver license` requires the user to
   have already committed to the word "driver".
2. The `driving license` tail is deeper and more task-shaped (`test`, `renewal`,
   `for foreigners`, `cost`, `conversion`, `appointment`). The `driver license`
   tail skews to commercial and out-of-market terms (`service`, `in australia`,
   `app`), with `for foreigners` demoted to last of ten.
3. Not one top-ranking competitor titles or slugs a page `thai driver license`.
   Every commercial leader uses `thai-driving-license`.
4. The repo already ships `renew-thai-driving-license` and
   `convert-foreign-driving-license-thailand`. Buying the `driver` domain would
   put the domain at odds with every slug we have written.

### The better answer

If the goal is a keyword domain, **`thailanddrivinglicense.com` beats both** and
is verified free: it is an exact match for a phrasing with its own complete
ten-item tail, it carries **no hyphens**, and it does not require explaining the
punctuation out loud every time someone says the name. `thai-driving-license.com`
matches a stronger phrase but pays for it with two hyphens; the unhyphenated
version of that exact phrase, `thaidrivinglicense.com`, is parked on Afternic and
would have to be bought on the aftermarket at an unknown price.

### The answer I actually believe

**Put the keyword in the titles and slugs, not in the domain, and do not rebrand
yet.** Grounds:

- Section 3 establishes that Google retrieves the same corpus for both spellings.
  Exact-match domains have carried little ranking weight since Google's 2012 EMD
  update. The measurable SEO gain from any of these purchases is close to zero;
  what a keyword domain buys is click-through and recall, which is a marketing
  argument, not a search one.
- A keyword domain makes this product look like the agencies that already own
  that shape of name — `tdl-service.com` and the rest sell paperwork services.
  This product's entire defensibility is that it is **not** an agency, refuses to
  assert procedure, and carries an independence disclaimer from the first page.
  `thai-driving-license.com` actively works against that positioning and raises
  the same affiliation risk that got `dltqueuescout.com` demoted to defensive-only
  on 2026-07-24.
- The pages already shipped capture the head terms in `<title>` and slug without
  spending anything.

**Therefore:** keep `thaiqueuescout.com` as the primary. If budget exists and the
registrar quote is low, buy `thai-driving-license.com` as a **redirect only** —
it is the best of the keyword names and it denies it to a competitor. Do not buy
`thai-driver-license.com` at all. Do not buy both spellings; the UK variant adds
nothing given §3.

And, unchanged from 2026-07-31: **register nothing without explicit
authorization**, and re-run RDAP immediately before any purchase.

## 7. Head terms mapped to the page that should own each

Existing routes: `/`, `/appointments`, `/calendar`, `/compare`, `/map`,
`/history`, `/offices`, `/offices/<city>`, `/guides`, `/guides/<slug>`.
Existing guide slugs: `dlt-smart-queue-for-foreigners`,
`how-to-read-dlt-availability`, `renew-thai-driving-license`,
`convert-foreign-driving-license-thailand`. Existing hubs: `bangkok`,
`chiang-mai`, `pattaya`, `phuket`, `koh-samui`, `krabi`, `hua-hin`,
`udon-thani`.

| Head term | Owning page | Status |
| --- | --- | --- |
| `thai driving license for foreigners` | `/guides/thai-driving-license-for-foreigners` | **New** — the pillar. Nothing currently owns the top-of-funnel term. |
| `how to get thai driving license` | `/guides/how-to-get-thai-driving-license` | **New** — the journey model in `entities/guide/model/journey.ts` already exists to back it. |
| `renew thai driving license` | `/guides/renew-thai-driving-license` | Shipped (015) |
| `convert foreign license thailand` | `/guides/convert-foreign-driving-license-thailand` | Shipped (015) |
| `dlt smart queue` | `/guides/dlt-smart-queue-for-foreigners` | Shipped (014) |
| `thai driving license appointment` | `/appointments` | Shipped (014) — retitle to lead with the phrase; only two autocomplete suggestions exist here, so it is low-competition and the best product fit on the list |
| `dlt office <city>` / `dlt office near me` | `/offices`, `/offices/<city>`, `/map` | Shipped (015); `rayong` and `chatuchak` are evidenced gaps |
| `dlt appointment availability` / slot watching | `/calendar`, `/compare`, `/history` | Shipped |
| `international driving permit thailand` | `/guides/international-driving-permit-thailand` | **New** — boundary page; product has no IDP data |
| `thai driving license test` | `/guides/thai-driving-license-test-what-we-can-verify` | **New** — see the warning in §8 |
| `thai driving license cost` | `/guides/thai-driving-license-cost` | **New** — official fee citation only |

The honest gap: the two deepest demand clusters found — `test questions and
answers` and `cost` — are precisely the two the product's own data says nothing
about. They must be served with cited official sources and an explicit statement
of what we cannot verify, or not served at all.

## 8. Content page ideas

Twenty-five, each with the intent it serves and, critically, **what the product
can actually put on the page**. The repo's claim boundary is not negotiable: a
page that cannot show evidence must say so on its face rather than paraphrase a
competitor.

| # | Slug | Title | Intent | Evidence the product can show |
| --- | --- | --- | --- | --- |
| 1 | `/guides/thai-driving-license-for-foreigners` | Thai Driving License for Foreigners | Informational, top-of-funnel | Count of directory offices flagged open to foreigner booking; links to the renewal and conversion guides; cited official DLT sources |
| 2 | `/guides/how-to-get-thai-driving-license` | How to Get a Thai Driving License | Informational, step sequence | The existing journey model, with the booking step backed by live slot data and every procedural claim marked `reported` with `sourceUrl` and `observedOn` |
| 3 | `/guides/thai-driving-license-appointment-booking` | Booking a Thai Driving License Appointment | Transactional | **Strongest fit on the list.** Live slot counts per office, release-window behaviour from `/history`, direct handoff to the official portal |
| 4 | `/guides/dlt-smart-queue-foreigner-login` | The DLT Smart Queue Foreigner Login | Navigational | Which offices the foreigner portal actually exposes versus the full 218-entry directory; the observed 115 `app_open` split |
| 5 | `/guides/thai-driving-license-test-what-we-can-verify` | The Thai Driving License Test: What We Can and Cannot Verify | Informational, highest volume | **Almost nothing — and the page must say so.** We hold no question bank. Point at DLT e-learning, state the boundary plainly. Publishing a scraped question set would destroy the claim boundary the whole site rests on |
| 6 | `/guides/dlt-e-learning-for-foreigners` | The DLT E-Learning Module in English | Informational | Official URL and what the module gates; whether offices require the completion code before booking |
| 7 | `/guides/thai-driving-license-cost` | What a Thai Driving License Costs | Commercial investigation | Official fee schedule, cited. No product data. Explicitly separate government fee from agency markup |
| 8 | `/guides/thai-driving-license-documents` | Documents for a Thai Driving License | Informational checklist | Cited official requirements only, each with `observedOn`; a standing note that requirements vary by office and we cannot verify per-office variance |
| 9 | `/guides/residence-certificate-for-driving-license` | Residence Certificate for a Thai Driving License | Informational | Confirmed autocomplete term (`residence certificate thailand driving license`). Immigration-issued document; official sources only |
| 10 | `/guides/medical-certificate-thai-driving-license` | Medical Certificate for a Thai Driving License | Informational | Confirmed autocomplete term; official requirement plus validity window |
| 11 | `/guides/thai-driving-license-renewal-online` | Online Thai Driving License Renewal | Informational, time-sensitive | The existing renewal-guide claim about the in-development electronic system, plus whether renewal slots still appear in our own data. Flagged for review at 180 days |
| 12 | `/guides/thai-motorcycle-license` | Thai Motorcycle License | Informational | Which offices' service types cover motorcycle; full autocomplete tail exists (`test`, `age`, `cost`, `on tourist visa`) |
| 13 | `/guides/international-driving-permit-thailand` | International Driving Permit in Thailand | Informational | Official IDP requirements (passport, residence certificate, five-year Thai licence, 505 THB, one-year validity); which offices issue IDPs if the directory flags it |
| 14 | `/guides/driving-in-thailand-on-a-tourist-visa` | Driving in Thailand on a Tourist Visa | Informational, disqualifying | Boundary page. `thai motorcycle license on tourist visa` and `driving in thailand as tourist` both appear in autocomplete; the honest answer is mostly "no", which no agency site wants to write |
| 15 | `/guides/convert-uk-driving-licence-to-thai` | Converting a UK Driving Licence to Thai | Informational, country-specific | `driving in thailand from uk` is a confirmed suggestion. **Deliberately UK-spelled** — the one page where that spelling is correct for the audience |
| 16 | `/guides/convert-australian-license-to-thai` | Converting an Australian Licence to Thai | Country-specific | `driving in thailand australian license`, `thai drivers license australia` |
| 17 | `/guides/convert-us-license-to-thai` | Converting a US License to Thai | Country-specific | Embassy-verification step differs by nationality |
| 18 | `/guides/convert-indian-license-to-thai` | Converting an Indian Licence to Thai | Country-specific | `international driving permit thailand for indian`, `thailand driving license for indian`, `driving in thailand for indians` — three separate confirmed suggestions |
| 19 | `/guides/dlt-appointment-wait-times` | How Far Ahead DLT Slots Are Released | Informational | **The unique-data page.** Nobody else can write this: our own history and compare data on release windows and fill rates. Low search volume, highest differentiation |
| 20 | `/guides/what-to-do-when-there-are-no-dlt-slots` | When There Are No Slots at Your Office | Problem-solving | Nearest alternative offices from geo data, with observed availability. This is the product's core value stated as a page |
| 21 | `/guides/dlt-office-hours-and-holidays` | DLT Office Hours and Public Holidays | Informational | The captured holiday feed and per-office opening data already in `docs/assets` |
| 22 | `/guides/expired-thai-driving-license` | If Your Thai Driving License Has Expired | Problem-solving | The tiered consequence rules (under one year, one to three years, over three years), each cited and dated. Roojai currently ranks for this |
| 23 | `/guides/thai-driving-license-vs-international-permit` | Thai Licence or International Permit: Which Do You Need? | Disambiguation | High-confusion term; a decision table, not a procedure claim |
| 24 | `/guides/thai-digital-driving-license-app` | The DLT QR Licence Digital Licence App | Informational | Confirmed suggestions `thai driving license check` and `dlt e-learning app`; official app is `th.go.dlt.qrlicence` |
| 25 | `/offices/rayong`, `/offices/bangkok/chatuchak` | Area hubs | Local | `dlt office rayong` and `dlt office chatuchak` are both confirmed autocomplete suggestions — the first **query-evidenced** hub additions, which is exactly the bar the 2026-08-01 gap analysis set before adding more hubs |

Sequencing suggestion: 1, 2, 3, 20 first — they are the pillar, the journey, the
best product fit, and the differentiator. The country-conversion set (15–18) is
the cheapest scalable cluster with real evidence behind each one. Item 5 should
be written early precisely because it is the highest-demand term, and shipping a
deliberately restrained page there sets the tone for everything else.

## 9. Risks

**The spelling split is real but small.** §3 shows Google retrieves the same
corpus for both, so the downside of choosing US spelling is confined to snippet
bolding and to the renewal cluster, where UK leads. Mitigation: US spelling in
slugs and titles throughout; UK spelling used naturally in body copy where it
reads better, and deliberately in the UK-audience page (#15). Do not build
duplicate spelling-variant pages — that is thin-content duplication for a
retrieval benefit that §3 says does not exist.

**Brand safety is the strongest argument against the rebrand.** A keyword domain
puts this product in the visual class of the agency sites it is trying not to be
confused with, and the product's entire trust argument is independence from both
DLT and the paperwork agencies. `thaidriverslicense.com` — a one-character
neighbour of the `driver` candidate — currently serves a scraped "France Driving
Test" WordPress template selling $20 courses. That is the neighbourhood.

**Hyphens carry specific, unglamorous costs.** They are lost in speech ("thai
dash driving dash license"), commonly dropped in retyping — which sends the
traffic to a parked Afternic lander in the `driving` case and to a dead
DreamHost host in the `driver` case — and they carry a weak spam association from
the EMD era. Neither hyphenated candidate can ever be said out loud cleanly.
`thailanddrivinglicense.com` is free of all three problems, which is why §6
raises it.

**The registered neighbours matter.** `thaidrivinglicense.com` and
`thaidrivinglicence.com` were registered on the same day by the same registrar
and both sit on Afternic nameservers: a domain investor holds the spelling pair
and is waiting for exactly this purchase. If we buy the hyphenated version and
the site succeeds, the aftermarket price of the unhyphenated one goes up, not
down. `thaidriverlicense.com` was registered five months ago and resolves to
nothing — someone may be circling the same idea.

**What would change the recommendation:**

- **Real volume data.** One month of Search Console after launch, or a single
  Keyword Planner export, replaces every proxy in this document. If it showed
  `driver license` within a factor of two of `driving license`, item 5 in the
  §2 table would need rewriting. Nothing here should survive contact with actual
  query data.
- **Trends becoming fetchable.** Both attempts returned `429`. A working
  geo-segmented comparison would settle the UK/US split by market rather than by
  inference, and specifically test whether the renewal cluster's UK lean is a
  real audience difference or an artefact of one five-item list.
- **`thaidrivinglicense.com` becoming cheaply available.** An unhyphenated exact
  match at a sane aftermarket price beats everything in §6, including
  `thailanddrivinglicense.com`, and would flip the recommendation toward a
  keyword domain.
- **A decision to become an agency.** If the product ever sells a service rather
  than showing availability, the affiliation and positioning objection to a
  keyword domain evaporates and `thai-driving-license.com` becomes the obvious
  primary. That is a product decision, not a search one.
- **DLT changing its English register.** If official pages moved to US spelling,
  the last argument for UK anywhere on the site would disappear.

## 10. Sources

All read 2026-08-01 unless noted.

Autocomplete (all `https://suggestqueries.google.com/complete/search?client=firefox&q=…`),
raw responses quoted inline in §1 and §2: `thai driving lic`, `thai driving l`,
`thai driver lic`, `thai drivers lic`, `thai driving licence`,
`thailand driving lic`, `how to get thai driv`, `renew thai driv`,
`convert foreign driving licence thail`, `international driving permit thail`,
`thai driving license c`, `thai driving license r`, `thai driving license test `,
`thai driving license for `, `thai driving license appoint`,
`thai driving license medical`, `thai motorcycle lic`, `dlt `, `dlt office `,
`dlt e-learning `, `residence certificate thailand `, `driving in thailand `.

Unavailable, recorded rather than guessed:
- `https://trends.google.com/trends/api/explore` — `HTTP 429 Too Many Requests`
  on two attempts, with and without a browser user-agent. No Trends data used.
- `https://www.dlt.go.th/en/driving-license/` — JavaScript shell, returned only
  "Loading…". No official English text read from the DLT site itself.
- `https://gecc.dlt.go.th/dltsmartqueue/foreignerlogin` — 212-byte shell, no text.
- `https://apps.apple.com/th/app/dlt-qr-licence/id1543066297` — 404.

Official and quasi-official:
- `https://play.google.com/store/apps/details?id=th.go.dlt.qrlicence&hl=en` —
  page title "DLT QR LICENCE - Apps on Google Play"; package id `th.go.dlt.qrlicence`
- `https://en.wikipedia.org/wiki/Department_of_Land_Transport_(Thailand)` —
  secondary source, UK spelling

Competitors (marketing claims, cited for URL and title spelling only, not for
procedure): `https://tdl-service.com/thai-driving-license`,
`https://tdl-service.com/convert-license`,
`https://tdl-service.com/thai-driving-license/renewal`,
`https://tdl-service.com/thai-driving-license/dlt-appointment-booking`,
`https://tdl-service.com/book-appointment`,
`https://www.thethailandlife.com/learning-to-drive-in-thailand`,
`https://www.expatden.com/thailand/thai-driving-license/`,
`https://www.forbesandpartners.com/renew-thai-driving-license-foreigner/`,
`https://www.forbesandpartners.com/convert-foreign-driving-license-thailand/`,
`https://www.roojai.com/en/article/driving-guides/how-to-get-thai-driving-licence-for-foreigners/`,
`https://www.roojai.com/en/article/driving-guides/expired-driving-license/`,
`https://thailandknowledge.com/living-in-thailand/driving-license-conversion`,
`https://www.motorist.co.th/en/article/2580/how-to-book-a-driver-s-licence-appointment-through-dlt-smart-queue-2025-update`,
`https://thethaiger.com/travel/thailand-travel/how-to-apply-for-an-online-driving-licence-in-thailand`,
`https://discover.hubpages.com/autos/Renewing-a-Thailand-Drivers-License`,
`https://thailandelitevisa.com/how-to-get-driving-license-thailand/`

Community (qualitative signal only):
`https://aseannow.com/topic/1223057-dlt-smart-queue-app-for-booking-licence-renewal-appointment/`

Registry and host checks: Verisign `.com` RDAP
(`https://rdap.verisign.com/com/v1/domain/<name>`), `dig` NS lookups, and direct
`https://` fetches of `thaidrivinglicense.com`, `thaidriverlicense.com`, and
`thaidriverslicense.com`.

Repository context:
- `docs/research/2026-07-24-market-seo-domain.md`
- `docs/research/2026-07-31-brand-domain-recheck.md`
- `docs/research/2026-08-01-content-surface-gap-analysis.md`
- `apps/web/src/entities/guide/model/guides.ts` (existing slugs)
