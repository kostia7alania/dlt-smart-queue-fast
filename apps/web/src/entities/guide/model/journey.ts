// Licence-journey model.
//
// A journey answers "how do I close this licence question", where a guide
// answers "how do I read the evidence". Both use the same claim kinds so the
// evidence boundary is identical everywhere on the site:
//
//   proven         — observed in the appointment data this project reads
//   official-only  — only the Department of Land Transport can confirm it
//   reported       — dated, attributed third-party statement, never our claim
//
// Journeys add routing metadata: who the page is for, what has to be true
// before it, and which page comes next.

import type { GuideSection } from "./guide";

/** URL segment for the cluster: /licence/<slug>. */
export const LICENCE_PATH_SEGMENT = "licence";

export type JourneyGroup = "licence" | "process";

export type Journey = {
  slug: string;
  group: JourneyGroup;
  /** H1 and the name used in navigation and structured data. */
  title: string;
  metaDescription: string;
  /** One or two sentences answering "is this page for me". */
  intro: string;
  /** Short label for cards and cross-links, e.g. "Renew a licence". */
  cardTitle: string;
  /** Who this page is for, in plain language. */
  audience: string;
  /** What the reader should be able to do after reading it. */
  outcome: string;
  /** Slugs of journeys that usually come first. */
  prerequisites: readonly string[];
  /** Slugs of journeys that usually come next. */
  nextSteps: readonly string[];
  /**
   * Upstream work-option keyword this journey maps to, or null when the
   * appointment contract cannot express it. Kept as a plain string so this
   * layer stays independent of the DLT entity; views normalize it.
   */
  keyword: string | null;
  /** Why the keyword is null, rendered on the page when it is. */
  keywordNote?: string;
  updatedOn: string;
  sections: readonly GuideSection[];
};

export function journeysOfGroup(journeys: readonly Journey[], group: JourneyGroup): Journey[] {
  return journeys.filter((journey) => journey.group === group);
}

export function journeyBySlugIn(journeys: readonly Journey[], slug: string): Journey | undefined {
  return journeys.find((journey) => journey.slug === slug);
}
