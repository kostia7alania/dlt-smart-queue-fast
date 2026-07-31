// Official destinations, centralized so no page hard-codes a government URL.
//
// Feature 014 introduces an equivalent constant in shared/config/site.ts. When
// that branch lands, delete this file and import from there instead of keeping
// two sources (specs/015-local-hubs-guides/plan.md, "Merge Contract").
//
// Verified on 2026-07-31: both URLs answered HTTP 200 without a redirect. The
// pages themselves are JavaScript-only, so they are linked as destinations and
// never quoted as content. `ttms.dlt.go.th` is deliberately absent — its
// certificate chain failed to verify on the same date.

export const OFFICIAL_DLT_BOOKING_URL = "https://gecc.dlt.go.th/dltsmartqueue/";
export const OFFICIAL_DLT_BOOKING_LABEL = "DLT Smart Queue booking service";
export const OFFICIAL_DLT_HOME_URL = "https://www.dlt.go.th/";
export const OFFICIAL_DLT_HOME_LABEL = "Department of Land Transport";
export const INDEPENDENCE_STATEMENT =
  "Independent and not affiliated with Thailand's Department of Land Transport. Availability is informational and may change before you book. We do not book appointments and never ask for DLT account credentials.";
