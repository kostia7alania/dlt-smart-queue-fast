# Domain and Handle Availability — Rebrand Check

**Date:** 2026-08-01
**Purpose:** establish which rebrand domains are technically obtainable, and
which are already held (and by what), before any registration is authorized
**Method:** Verisign `.com`/`.net` RDAP, Google Registry `.app` RDAP, Identity
Digital `.io` RDAP, `.co` registry whois, HTTP resolution checks, GitHub user
API, and brand-collision web searches
**Scope:** read-only. **No domain was registered, reserved, purchased, or
placed in any cart. Nothing was added to a wishlist or a registrar account.**

---

## 1. Method note: RDAP is a point-in-time signal, not a reservation

RDAP returns `404` when the registry holds no object for the queried name and
`200` when it does. That is a *technical observation at the moment of the
query*, nothing more. It is **not** a hold, **not** a reservation, **not** a
price quote, and it does not stop anyone else from registering the same name
one second later. Descriptive keyword domains in an active commercial niche are
exactly the names that get taken between research and checkout.

Two further caveats apply to the results below:

- **A `404` can mean "premium" or "reserved", not "cheap".** Registry-reserved
  and premium-tier names also return `404`. Only a registrar quote reveals
  actual price and eligibility.
- **`rdap.org` gave false negatives for `.co` and `.io`.** IANA's bootstrap file
  (`https://data.iana.org/rdap/dns.json`) has **no entry for `co` or `io`**, so
  `https://rdap.org/domain/<name>.co` returns `404` from rdap.org itself without
  ever contacting a registry. Control queries proved this: `google.co` and
  `github.io` — both plainly registered — **also returned `404`** with the final
  URL still on `rdap.org`. Those 404s were bootstrap misses, not availability.
  All `.co` and `.io` results in this document were therefore re-derived from
  authoritative sources (see §3), and every TLD was validated with a
  known-registered control before its results were trusted.

| TLD | Source used | Control | Control result | Trustworthy? |
| --- | --- | --- | --- | --- |
| `.com` | `rdap.verisign.com/com/v1` | `google.com` (whois) | registered | Yes |
| `.net` | `rdap.verisign.com/net/v1` (via rdap.org redirect) | `google.net` | `200` | Yes |
| `.app` | `pubapi.registry.google/rdap` (via rdap.org redirect) | `google.app` | `200` | Yes |
| `.io` | `rdap.identitydigital.services/rdap` (direct) | `github.io` | `200` | Yes |
| `.co` | `whois.registry.co` (direct) | `google.co` | full record | Yes (whois, not RDAP) |
| `.co` / `.io` | `rdap.org` | `google.co` / `github.io` | `404` | **No — discarded** |

---

## 2. Decision table — `.com` candidates

| Candidate | RDAP | Resolves? | What is actually there | Verdict |
| --- | --- | --- | --- | --- |
| `thai-driving-license.com` | **404** | n/a | Nothing | **Available — recommended primary** |
| `thai-driving-licence.com` | **404** | n/a | Nothing | **Available — recommended defensive** |
| `thai-driver-license.com` | **404** | n/a | Nothing | Available |
| `thai-drivers-license.com` | **404** | n/a | Nothing | Available |
| `thailanddrivinglicense.com` | **404** | n/a | Nothing | Available |
| `getthaidrivinglicense.com` | **404** | n/a | Nothing | Available |
| `thaidrivinglicensehelp.com` | **404** | n/a | Nothing | Available, but weak ("help" suffix reads like a support desk) |
| `thaiqueuescout.com` (outgoing brand) | **404** | n/a | Nothing | **Still unregistered — the current brand was never actually secured** |
| `thaidrivinglicense.com` | 200 | `200` | **Parked, for sale.** 307-redirects to `forsale.godaddy.com/forsale/thaidrivinglicense.com`. Registrar: NameCheap | Taken, but *not a competitor* — potentially purchasable |
| `thaidrivinglicence.com` | 200 | `200` | **Parked, for sale.** 307-redirects to `forsale.godaddy.com/forsale/thaidrivinglicence.com` | Taken, not a competitor |
| `drivethailand.com` | 200 | redirect | **Broker listing.** 302-redirects to `hugedomains.com/domain_profile.cfm?d=drivethailand.com`. NS: `namebrightdns.com` | Taken, listed for resale at broker pricing |
| `thaidriverlicense.com` | 200 | **no** | Registered but **no A record** (NS: `ns1/2/3.dreamhost.com`). No live site at all | Taken and dormant |
| `thaidriverslicense.com` | 200 | `200` | **Active site** — generic driving-theory mock tests and courses from ~$20; content skews to France, operator not identified. Registrar: GoDaddy | Taken; live but low-quality and only loosely in-niche |
| `thailicense.com` | 200 | `200` | Returns 200 but the page is effectively **empty** — a single base64 image, no text. Registrar: RegistryGate GmbH | Taken and content-free |
| `thaidlt.com` | 200 | `200` | **Thai state research center.** "Site Under Construction" page of NECTEC (National Electronics and Computer Technology Center), Language and Semantic Technology team — their "DLT" means *distance learning technology*. Registrar: DotArai (Thai) | **Taken — and reject the name outright, see §5** |

**Key read:** of the seven registered `.com` names, **four are parked, for sale,
or dormant**, one is empty, one is a weak off-target site, and one is
government-adjacent. There is **no strong incumbent sitting on an exact-match
domain** in this niche. That is a favorable position.

---

## 3. Non-`.com` results

All controls passed for each endpoint listed (see §1 table).

| Name | TLD source | Status | errorCode / title | Verdict |
| --- | --- | --- | --- | --- |
| `thai-driving-license.net` | Verisign `.net` RDAP | `404` | — | Available |
| `thaidrivinglicense.net` | Verisign `.net` RDAP | `404` | — | Available |
| `thai-driver-license.net` | Verisign `.net` RDAP | `404` | — | Available |
| `getthaidrivinglicense.net` | Verisign `.net` RDAP | `404` | — | Available |
| `thaidlt.net` | Verisign `.net` RDAP | `404` | — | Available (name rejected anyway) |
| `thai-driving-license.app` | Google Registry RDAP | `404` | `errorCode=404`, `title="Not Found"`, `description=["thai-driving-license.app not found"]` | Available |
| `thaidrivinglicense.app` | Google Registry RDAP | `404` | `errorCode=404`, `title="Not Found"`, `description=["thaidrivinglicense.app not found"]` | Available |
| `thaidlt.app` | Google Registry RDAP | `404` | `errorCode=404`, `title="Not Found"`, `description=["thaidlt.app not found"]` | Available (name rejected anyway) |
| `thai-driving-license.io` | Identity Digital RDAP | `404` | — | Available |
| `thaidrivinglicense.io` | Identity Digital RDAP | `404` | — | Available |
| `thaidlt.io` | Identity Digital RDAP | `404` | — | Available (name rejected anyway) |
| `thaiqueuescout.io` | Identity Digital RDAP | `404` | — | Available |
| `thai-driving-license.co` | `whois.registry.co` | — | `The queried object does not exist: DOMAIN NOT FOUND` | Available (whois evidence) |
| `thaidrivinglicense.co` | `whois.registry.co` | — | `The queried object does not exist: DOMAIN NOT FOUND` | Available (whois evidence) |
| `thaidlt.co` | `whois.registry.co` | — | `The queried object does not exist: DOMAIN NOT FOUND` | Available (whois evidence) |

The full `.com` / `.net` / `.io` / `.app` / `.co` set is free for
`thai-driving-license`, which means the primary recommendation can hold a
coherent namespace rather than a scattered one.

---

## 4. GitHub handles

`https://api.github.com/users/<handle>` — `404` means no such account.

| Handle | Status | Verdict |
| --- | --- | --- |
| `thaidrivinglicense` | `404` | Free |
| `thai-driving-license` | `404` | Free |
| `thaidriverlicense` | `404` | Free |
| `thaidlt` | `404` | Free (name rejected anyway) |

All four are unclaimed. Social and app-store handles were **not** checked —
those need interactive accounts and stay on the pre-purchase checklist.

---

## 5. Brand-collision findings

Two collisions matter, and one of them is disqualifying.

**"DLT" is a Thai government agency — do not build a brand on it.**
DLT is the **Department of Land Transport**, the state body that actually issues
Thai driving licenses, and it operates the official *DLT Smart Queue* booking
app (`gecc.dlt.go.th`, `com.DLT.SmartQueue`). A private service named "ThaiDLT"
would imply official affiliation with the regulator it is not affiliated with —
a real impersonation and consumer-confusion risk, independent of trademark law.
Separately, `thaidlt.com` is already held by **NECTEC**, a Thai state research
center. **Recommendation: drop `thaidlt` entirely, including as a defensive
buy.** This matches the standing guidance in the 2026-07-31 recheck, which
already flagged `dlt*` variants as affiliation risks.

**There is a direct incumbent competitor: TDL Service.**
`tdl-service.com` ("TDL Service" / "TDLS Bangkok") is an active, established
Bangkok operator in exactly this niche — Thai license conversion, new licenses,
renewals, IDP, DLT appointment booking for foreigners, claiming 10+ years and a
"98% pass rate", with a substantial SEO content footprint (`/services`,
`/blog`, `/faq`, `/convert-license`, dated 2026 pages). Note the initialism
collision: **TDL vs DLT is a one-letter transposition.** A "ThaiDLT" brand would
sit one character away from the leading competitor's name *and* one character
away from the government agency's name. Third reason to reject it.

`thaidriverslicense.com` is live but is a generic driving-theory-test upsell
with France-oriented content and no identified operator — not a serious
competitive threat, though it does occupy a near-miss spelling of the primary.

**This is not trademark clearance.** No search was run against the Thai
Department of Intellectual Property database, WIPO, or USPTO. Descriptive names
like "Thai Driving License" are weak as trademarks — they are hard for anyone
(including us) to own exclusively. That is an acceptable trade for SEO clarity,
but it means the brand identity must live in a distinctive *wordmark and
presentation*, not in the domain string.

---

## 6. Recommendation

**Primary: `thai-driving-license.com`**

- Free on both independent signals (RDAP `404`, whois `NO MATCH`).
- Exact descriptive match for what users actually search for.
- The hyphenated, spelled-out form reads as a *description*, not as an agency
  initialism — it carries none of the `DLT` affiliation risk.
- The matching `.net`, `.io`, `.app`, `.co` and the `thai-driving-license`
  GitHub org are all free, so the namespace can be consistent.
- Known trade-offs: hyphens are slightly worse for word-of-mouth, and the
  unhyphenated `thaidrivinglicense.com` is taken (parked for sale) and will
  absorb some direct-navigation traffic.

**Defensive (one): `thai-driving-licence.com`** — the British/Commonwealth
spelling. The target audience is heavily British, Australian, and Irish expats
who spell it *licence*; this is by far the most probable misspelling of the
primary, and it is free. Register and 301-redirect it to the primary. Do **not**
buy it as a second content site.

**Explicitly rejected:** `thaidlt.*` in every TLD — government-agency
initialism, NECTEC already holds the `.com`, and a one-letter collision with the
incumbent competitor TDL Service.

**Optional, owner's call only:** `thaidrivinglicense.com` (unhyphenated) is
parked on a GoDaddy for-sale page, and `drivethailand.com` is listed at
HugeDomains. Both are aftermarket purchases at broker pricing, not standard
registration fees. **No price was requested and no offer was made.** Treat these
as a possible later acquisition, never as a launch dependency.

**Also worth noting:** `thaiqueuescout.com`, the outgoing brand, is *still
unregistered*. If any public material, documentation, or link already uses that
name, it is currently unprotected and anyone could take it.

---

## 7. Pre-purchase checklist

Nothing below has been done. Every item requires the owner to act.

1. **Re-run RDAP immediately before checkout.** These results are from
   2026-08-01 and decay. Availability at research time does not survive to
   purchase time.
2. **Get an actual registrar quote** for `thai-driving-license.com` and
   `thai-driving-licence.com`. Confirm they are standard-tier, not premium, and
   confirm renewal price (not just the discounted first year).
3. **Search trademarks properly** — Thai DIP (`dip.go.th`), WIPO Global Brand
   Database, and USPTO — for the wordmark actually intended for the logo. The
   web search in §5 is a weak negative signal, not clearance.
4. **Check social and app-store handles** (Facebook, Instagram, X, LINE
   Official Account, TikTok, Google Play, App Store). LINE matters most for the
   Thailand market and was not checked here.
5. **Decide the affiliation disclaimer before launch.** Because the service sits
   next to a government process, the first public page must state plainly that
   it is independent and not affiliated with the Department of Land Transport.
   Confirm the primary domain choice does not undercut that statement.
6. **Enable registrar lock and WHOIS privacy** at purchase; use a role mailbox,
   not a personal address, as registrant contact.
7. **Buy at most the two names above.** Do not defensively bulk-register the
   remaining free variants — recurring renewal cost outweighs the typo traffic.
8. **Do not buy any `dlt*` name**, including as a redirect.
9. **Confirm who owns the registrar account** before purchase, so the domain is
   not stranded in a personal account.

---

## 8. Status

**No purchase, registration, reservation, transfer, or offer was made.** All
checks in this document were read-only HTTP GET requests to public RDAP, whois,
GitHub, and web endpoints. **Registering any of these domains requires the owner
to do it personally**, through a registrar of their choice, using their own
payment method. This document is research input for that decision and nothing
more.

## Sources

- Verisign `.com` / `.net` RDAP — `https://rdap.verisign.com/com/v1/domain/<name>`
- Google Registry `.app` RDAP — `https://pubapi.registry.google/rdap/domain/<name>`
- Identity Digital `.io` RDAP — `https://rdap.identitydigital.services/rdap/domain/<name>`
- `.co` registry whois — `whois -h whois.registry.co <name>`
- IANA RDAP bootstrap — `https://data.iana.org/rdap/dns.json`
- GitHub user API — `https://api.github.com/users/<handle>`
- Competitor: [TDL Service](https://tdl-service.com/)
- Official system: [DLT Smart Queue](https://play.google.com/store/apps/details?id=com.DLT.SmartQueue),
  [Motorist Thailand booking guide](https://www.motorist.co.th/en/article/2580/how-to-book-a-driver-s-licence-appointment-through-dlt-smart-queue-2025-update)
- Prior decision context: `docs/research/2026-07-31-brand-domain-recheck.md`
