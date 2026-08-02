// The published licence-journey cluster: the licence questions themselves, and
// the process steps that appear inside several of them. Content lives in two
// files so they can be maintained independently; this module is the registry
// every route reads.

import type { Journey } from "./journey";
import { LICENCE_JOURNEYS } from "./journeys-licence";
import { PROCESS_JOURNEYS } from "./journeys-process";

export const JOURNEYS: readonly Journey[] = [...LICENCE_JOURNEYS, ...PROCESS_JOURNEYS];

export function journeyBySlug(slug: string): Journey | undefined {
  return JOURNEYS.find((journey) => journey.slug === slug);
}

export function journeyTitle(slug: string): string {
  return journeyBySlug(slug)?.cardTitle ?? slug;
}

/** Slugs referenced as a prerequisite or next step that have no page yet. */
export function danglingJourneyLinks(): string[] {
  const known = new Set(JOURNEYS.map((journey) => journey.slug));
  const referenced = JOURNEYS.flatMap((journey) => [
    ...journey.prerequisites,
    ...journey.nextSteps,
  ]);
  return [...new Set(referenced.filter((slug) => !known.has(slug)))];
}
