# Launch Trust and Official Hand-off Research

**Date:** 2026-07-31
**Scope:** public launch messaging, official booking boundary, and the next safe
product slice after Feature 013
**Evidence policy:** DLT pages define the official destination; commercial
pages indicate positioning; community posts are unverified signals and are used
only to identify uncertainty.

## Decision

Ship a product-led public home page, an `/appointments` intent page, and a
bounded foreigner guide before adding more backend surface.

The launch contract is:

> Scout observed availability here. Verify current rules and complete the
> appointment with DLT.

Every public page should state that Thai Queue Scout is independent, read-only,
does not collect DLT credentials or identity documents, does not book, and
cannot guarantee that an observed time remains available.

## Current Evidence

### Official destination

The [DLT Smart Queue web application](https://gecc.dlt.go.th/dltsmartqueue/)
and its [foreigner entry route](https://gecc.dlt.go.th/dltsmartqueue/DocumentaryForeigner)
were reachable on 2026-07-31. Both expose a JavaScript application shell rather
than indexable procedural content. They are suitable as the final hand-off, not
as evidence for claims about documents, eligibility, or office practice.

### Demand and uncertainty

A current commercial guide is actively targeting
[DLT Smart Queue booking for foreigners in 2026](https://tdl-service.com/thai-driving-license/dlt-appointment-booking).
That supports continuing search and service-provider interest, but its office,
timing, and process claims are marketing content rather than official policy.

Recent community reports also conflict. One Chiang Mai discussion describes an
[in-person appointment after distant online availability](https://www.reddit.com/r/chiangmai/comments/1uythak/is_it_still_possible_to_walk_in_for_converting/),
while a Thailand discussion reports
[office-specific difficulty booking foreigners online](https://www.reddit.com/r/Thailand/comments/1somiia/driving_license_appointment_in_a_different/).
These anecdotes support the product's comparison problem, but they also show why
the site must not generalize walk-in acceptance or foreigner procedure.

### Brand signal

Verisign `.com` RDAP returned HTTP `404` for `thaiqueuescout.com` on
2026-07-31. This remains only a point-in-time absence of a registry object, not
a reservation or registrar guarantee. No domain, social handle, analytics
property, or cloud resource was created or changed.

## Claim Boundary

### The product can prove

- which office and work-option responses it received;
- the returned appointment days and rounds;
- whether the UI is showing live or stored data;
- when a stored observation was fetched;
- that History reads stored observations without starting another slot fetch;
- that the local discovery surface asks for no DLT account or identity document.

### The product must not claim

- that a displayed time is reserved or still bookable;
- that an office will accept a walk-in or every foreign applicant;
- that a document list or eligibility rule is complete;
- that booking, payment, or identity handling happens in this application;
- official affiliation, guaranteed access, or a faster lane through DLT.

## Implementation Consequences

1. Lead with the user outcome and retain Calendar as the primary action.
2. Keep Compare as the clearest alternative when the first office is impractical.
3. Explain Calendar, Compare, Map, and History in one scannable capability grid.
4. Put the service boundary beside the hero instead of hiding it in a footer.
5. Centralize the official URL and trust statements so pages cannot drift.
6. Keep all launch pages static, with no form, cookie, analytics script, or new
   dependency.
7. Use unique canonicals and only visible, escaped build-time structured data.

Implementation and validation are tracked in
`specs/014-launch-trust-handoff/`.
