# DLT Source Reachability, Crawl Policy, and Process-Claim Evidence

**Date:** 2026-07-31
**Scope:** what a plain HTTP client can actually read from official DLT
properties, what those hosts say about crawling, what this repository can prove
from its own data, and which licence-process statements are only third-party
reports
**Method:** unauthenticated HTTPS GET requests with no JavaScript execution
(`curl` and a fetch-and-extract tool), one request per URL, plus one
search-engine query per topic. No form was submitted and no credential was used.

## 1. Official properties do not serve readable content without JavaScript

| URL | Result on 2026-07-31 |
| --- | --- |
| `https://www.dlt.go.th/en/` | HTML shell only: the header `กรมการขนส่งทางบก` and the text `Loading...`. No English content rendered. |
| `https://www.dlt.go.th/th/driving-license/81?embed=true` | Same loading shell. No renewal conditions, durations, or booking text present in the response. |
| `https://www.dlt-elearning.com/` | Thai-only shell that identifies itself as `ระบบการอบรมใบอนุญาตขับรถ` (driving-licence training system) and shows a DLT logo asset, then an error/reload state. No course list or validity window in the response. |
| `https://ttms.dlt.go.th/ttms-eservice/public/news/detail?newsId=13` | TLS failure: `unable to verify the first certificate` (incomplete chain). Not read. |
| `https://gecc.dlt.go.th/dltsmartqueue/` | Confirmed in earlier research as a JavaScript-only booking application. |

### Consequences for this product

1. We cannot quote deep official page text as verified fact. Official URLs are
   linkable **destinations**, not citable **content**.
2. `ttms.dlt.go.th` must not be linked from the product while its certificate
   chain is incomplete; a broken-certificate warning on a page that tells people
   to trust an official flow is the worst possible trust outcome.
3. Any procedural statement we publish must be attributed to a named source with
   the date it was read, or left to DLT.
4. This also explains why the product exists: the only practical machine-readable
   view of appointment availability is the JSON API behind the booking app.

## 2. Crawl policy and politeness posture

| Host | `robots.txt` on 2026-07-31 |
| --- | --- |
| `gecc.dlt.go.th` | HTTP 200, 67 bytes, three lines: a comment pointing at `robotstxt.org`, then `User-agent: *` and `Disallow:` — an explicit allow-all with no restricted paths. |
| `app-gecc.theassistech.co.th` (upstream JSON API host) | HTTP 200, 1248 bytes. Contains **only** the Cloudflare "content signals" preamble: definitions of `search`, `ai-input`, `ai-train`, the statement that an omitted signal "neither grants nor restricts permission", and an EU DSM Directive Article 4 reservation notice. No `User-agent` group, no `Disallow` rule, and no signal is actually set to `yes` or `no`. |

Findings:

- No crawl restriction applies to either host today.
- The upstream API host expresses no position on AI training or AI input, so
  nothing observed authorizes broader use than we already make: bounded,
  read-only, user-triggered requests for appointment discovery.
- The preamble is a managed default that can change without notice. Re-read both
  files before any change to fetch volume, and keep the existing politeness
  controls unchanged: sequential per-office fetching, the 300 ms inter-office
  pause, the 10-minute snapshot reuse window, the live-failure circuit, and no
  background polling.
- The API host is a contractor domain (`theassistech.co.th`), not a `go.th`
  government host. Treat its availability as third-party infrastructure.

## 3. What this repository can prove from its own data

From `docs/assets/1-get-dlt-offices.json` (captured upstream office list) and
`apps/web/src/entities/dlt/data/office-geo.json` (committed geocodes generated
2026-07-19):

| Fact | Value |
| --- | --- |
| Captured office entries | 218 |
| Entries with a non-empty `sit_name` | 212 |
| Entries with `app_open = 1` | 115 |
| Site IDs with a committed geocode | 210 |
| Geocode precision split | 59 `office`, 88 `district`, 63 `province` |
| Named entries with no geocode | 8 → `208 Aek Udon Thani Hospital Sub Branch`, `209 Area Land Transport Office 5 (Transport Vehicle Registration Section)`, `210 Central Plaza Khon Kaen Department Store`, `211 CentralPlaza Udon Thani Department Store`, `212 Site For Test`, `216 null`, `219 ""`, `224 "-"` |
| Geocoded IDs whose English name is empty in the capture | 4 → 217, 218, 220, 221 |

Two upstream oddities to preserve, not fix:

- The English capture and the Thai `getSite` capture disagree: site IDs 217,
  218, 220, and 221 have Thai names (they were geocodable) but empty English
  names. Any English-name UI will show blanks for them, and that is the honest
  rendering of the upstream contract.
- Names contain upstream defects that must stay byte-for-byte:
  `Phuket Provincial Land Land Transport Office`,
  `Samut PrakanProvincial Land Transport Office Phra Pradaeng Branch`,
  `ChaiyaphumProvincial Land Transport Office  Phu Khiao Branch`,
  `Site For Test`, and `-`.

Coverage claims on public pages must therefore be phrased as "the captured list
contains N entries, of which M report `app_open = 1`", never as "N offices are
available".

## 4. Licence-process claims: proven, official-only, reported

### 4.1 Proven by this product

- Which offices the upstream list contains, and each office's `app_open` flag as
  captured.
- Which work options an office returns for the exact upstream keywords
  ` NEW THAI` and ` RENEW THAI`, including offices that return none.
- The day-level slot messages the upstream returns, including the exact full
  marker `เต็ม`.
- Whether a given result is live or stored, and when it was fetched.
- That booking happens on the official DLT service, not here.

### 4.2 Official-only (never asserted by us)

Documents, translations, residence certificates, medical certificates, aptitude
and theory tests, fees, licence validity, walk-in acceptance, eligibility by
visa type, e-learning obligations, and whether a fully online renewal exists
today. These change by year, office, and applicant, and no official page text
was machine-readable in section 1.

### 4.3 Search-index text attributed to the official site (indirect)

A search engine's index of `dlt.go.th` surfaced renewal text stating that
renewal training is taken through the DLT e-learning system, that it applies to
licences expired by no more than one year or renewed no more than 90 days early,
that private/transport/public course durations are 1/2/3 hours, and that after
training the applicant has 90 days to complete the physical-fitness test at any
land transport office, booking in advance through the DLT Smart Queue
application.

This is consistent with the product's own model of the world, but it was read
from a search index rather than from a rendered official page. Publish it only
as "the official site's indexed text states …", or better, link to DLT and let
the user read it there.

### 4.4 Third-party reports (dated, attributed, not our claims)

| Source | Read on | Reports |
| --- | --- | --- |
| [Nation Thailand, "DLT eases 2026 driving licence renewal rules"](https://www.nationthailand.com/news/general/40067483), published 2026-06-16, quoting DLT spokesman Titiphat Thaijongrak | 2026-07-31 | Colour-vision testing removed for renewals and kept for first-time applicants; the brake/foot-reaction test waived for drivers aged 55 or under whose licence expired within one year, who then take only peripheral-vision and depth-perception tests; drivers over 55, and anyone expired more than one year, take the full battery; a fully electronic renewal system is *under development* with the Public Health Ministry and the Medical Council under regulations effective 2025-03-05, with **no announced launch date**; DLT hotline 1584. |
| [Forbes & Partners, foreign-licence conversion guide](https://www.forbesandpartners.com/convert-foreign-driving-license-thailand/), published 2025-10-04, updated 2025-12-19 | 2026-07-31 | Conversion requires passport with a non-immigrant visa, a residence certificate or embassy letter, a medical certificate no older than 30 days, the valid foreign licence plus certified translation, and a form obtained at the office; the practical driving test is waived for conversions; four aptitude tests are taken; a 50-question theory exam with a 45/50 pass mark applies; indicative fees ~205 THB (car) and ~155 THB (motorcycle); a tourist visa is stated not to be accepted; appointments are booked through the DLT Smart Queue app. The page cites no direct DLT document. |

### 4.5 Conflicts observed — publish neither side as fact

1. **Online renewal.** One search summary asserted online renewal "from June
   2026" for drivers under 55; the Nation article from the same month says the
   electronic system is still in development with no launch date. Treat online
   renewal as unconfirmed.
2. **Colour-vision testing.** The 2026 renewal change removes it for renewals,
   while the 2025 conversion guide lists colour blindness among conversion
   aptitude tests. These are different procedures at different dates; do not
   merge them into one rule.
3. **Theory test for conversions.** Third-party guides disagree about whether a
   written theory test is mandatory for holders of a valid foreign licence.
   Attribute, date, and defer to DLT.

## 5. Editorial rules derived from this research

1. Every procedural sentence on a public page must be one of: *what we observed
   in the data*, *what a named dated source reports*, or *a link to DLT*.
2. Never publish a number of "available appointments" — publish the observed
   flag or message and its freshness.
3. Never link a host whose certificate chain fails to verify.
4. Re-read both `robots.txt` files and re-run this reachability table before any
   change to request volume or before publishing procedural content again.
5. Prefer sending the user to the official service over explaining the official
   service.

## Sources

Accessed 2026-07-31 unless noted:

- `https://www.dlt.go.th/en/`, `https://www.dlt.go.th/th/driving-license/81?embed=true`
- `https://www.dlt-elearning.com/`
- `https://gecc.dlt.go.th/robots.txt`, `https://app-gecc.theassistech.co.th/robots.txt`
- `https://ttms.dlt.go.th/ttms-eservice/public/news/detail?newsId=13` (TLS chain failure)
- [Nation Thailand, DLT eases 2026 driving licence renewal rules](https://www.nationthailand.com/news/general/40067483)
- [Forbes & Partners, converting a foreign driving licence in Thailand](https://www.forbesandpartners.com/convert-foreign-driving-license-thailand/)
- Repository data: `docs/assets/1-get-dlt-offices.json`,
  `apps/web/src/entities/dlt/data/office-geo.json`
