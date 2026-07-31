# Brand and Domain Recheck

**Date:** 2026-07-31 (one week after the 2026-07-24 decision)
**Purpose:** confirm the working brand and domain candidates are still
technically obtainable before any registration is authorized
**Method:** Verisign `.com` RDAP lookups, GitHub account lookups, one web search
for brand collisions. Read-only; nothing was reserved, registered, or changed.

## Registry recheck

RDAP returns `404` when the registry holds no object for the queried domain and
`200` when it does. Point-in-time technical signal only — not a reservation, and
not a registrar quote.

| Candidate | 2026-07-24 | 2026-07-31 | Reading |
| --- | --- | --- | --- |
| `thaiqueuescout.com` | 404 | **404** | Primary candidate still shows no registry object |
| `thaiqueuewatch.com` | 404 | 404 | Backup unchanged |
| `thaidrivequeue.com` | 404 | 404 | Backup unchanged |
| `dltqueuescout.com` | 404 | 404 | Defensive only (affiliation risk) |
| `dltqueuewatch.com` | 404 | 404 | Defensive only (affiliation risk) |
| `queuewatchthailand.com` | 404 | 404 | Still rejected on length and cadence |
| `queuescout.com` (new check) | not checked | **200** | **Registered.** The unprefixed name is taken, so "Queue Scout" alone is not available as a `.com` identity |

The `queuescout.com` result is the one new fact: the generic form of the name is
already held by someone. That does not block `thaiqueuescout.com`, but it does
mean the brand must always be used with the `Thai` prefix, and that a future
attempt to shorten the name would collide.

## Handle availability

GitHub returned `404` for `thaiqueuescout`, `queuescout`, and
`thai-queue-scout`, so the organization name is free today. Social and app-store
handles were not checked; those require interactive accounts and remain part of
the pre-purchase checklist.

## Collision search

A web search for `"Thai Queue Scout"` and `"queue scout"` combined with
trademark terms returned only generic Thai trademark-registration service pages
and unrelated `SCOUT` marks (a 2004 US filing, Scouting America brand guidance,
Scout Motors). No appointment or queue product using this name surfaced. This is
a weak negative signal, not a trademark clearance: the Thai Department of
Intellectual Property database was not searched, and doing so properly needs
either their portal or counsel.

## Standing recommendation (unchanged)

1. Keep **Thai Queue Scout** as the working brand and `thaiqueuescout.com` as
   the primary domain candidate; always keep the `Thai` prefix.
2. Do not register anything until the user explicitly authorizes registration —
   registration, DNS, analytics, and cloud accounts remain out of scope.
3. Immediately before purchase: repeat RDAP, get a registrar quote, search the
   Thai DIP and a broader trademark database, and check social/app-store handles.
4. Buy at most one defensive redirect, and only if it is inexpensive; prefer
   `thaiqueuewatch.com` over the `dlt*` variants, which imply affiliation.
5. Keep the independence disclaimer visible from the first public page.

## Sources

- Verisign `.com` RDAP service (`https://rdap.verisign.com/com/v1/domain/<name>`)
- GitHub user API (`https://api.github.com/users/<handle>`)
- Brand-collision search results were limited to general Thai trademark
  services, including [Ananda-IP](https://www.ananda-ip.com/services/trademark/)
  and [Nominus Thailand trademark search](https://www.nominus.com/en/tm/thailand-trademark-search),
  plus unrelated [`SCOUT` marks](https://www.trademarkia.com/scout-78105749).
