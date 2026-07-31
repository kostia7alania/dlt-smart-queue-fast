// Guide content model.
//
// Guides exist to separate three very different kinds of statement, because the
// research showed that official DLT pages are not machine-readable and that
// third-party procedural advice conflicts between sources
// (docs/research/2026-07-31-dlt-source-and-process-evidence.md):
//
//   proven         — something this project observes in the data it fetches
//   official-only  — something only the Department of Land Transport can confirm
//   reported       — a dated, attributed third-party statement, never our claim
//
// The types force attribution on `reported` claims, and the tests forbid
// requirement phrasing outside them.

export type GuideClaim =
  | { kind: "proven"; text: string }
  | { kind: "official-only"; text: string }
  | {
      kind: "reported";
      text: string;
      source: string;
      /** HTTPS URL of the source that was actually read. */
      sourceUrl: string;
      /** ISO date the source was read. */
      observedOn: string;
    };

export type GuideSection = {
  heading: string;
  lead?: string;
  claims: readonly GuideClaim[];
};

export type Guide = {
  slug: string;
  title: string;
  metaDescription: string;
  /** Short answer to "what is this page for", in one or two sentences. */
  intro: string;
  /**
   * Upstream work-option keyword this guide maps to, kept as a plain string so
   * this layer stays independent of the DLT entity. Views normalize it through
   * `parseWorkKeyword`, and the tests assert it is one of `WORK_KEYWORDS`.
   */
  keyword: string;
  updatedOn: string;
  sections: readonly GuideSection[];
};

export const CLAIM_LABEL: Record<GuideClaim["kind"], string> = {
  proven: "We can show this",
  "official-only": "Only DLT can confirm this",
  reported: "Reported elsewhere",
};

export function claimsOfKind<K extends GuideClaim["kind"]>(
  guide: Guide,
  kind: K,
): Extract<GuideClaim, { kind: K }>[] {
  return guide.sections
    .flatMap((section) => section.claims)
    .filter((claim): claim is Extract<GuideClaim, { kind: K }> => claim.kind === kind);
}
