#!/usr/bin/env node
// Lists guide content that is due for a source re-read.
//
// Guides state what third parties reported and when we read them. Those reports
// age (see docs/research/2026-08-01-content-surface-gap-analysis.md): rules
// change, and "in development" becomes "launched" without notice. This script
// reports what to re-check; it never edits content and never fails CI on a
// calendar date.
//
// Usage:
//   node tools/content-review.mjs                  claims older than 180 days
//   node tools/content-review.mjs --days=90
//   node tools/content-review.mjs --today=2027-01-01   (deterministic runs)

import { LICENCE_JOURNEYS } from "../apps/web/src/entities/guide/model/journeys-licence.ts";
import { PROCESS_JOURNEYS } from "../apps/web/src/entities/guide/model/journeys-process.ts";

const CONTENT = [...LICENCE_JOURNEYS, ...PROCESS_JOURNEYS];

const DAY_MS = 24 * 60 * 60 * 1000;

export function ageInDays(isoDate, today) {
  return Math.floor((Date.parse(today) - Date.parse(isoDate)) / DAY_MS);
}

/** Guides and reported claims whose read date is at least maxAgeDays old. */
export function reviewDue(guides, today, maxAgeDays) {
  const guidesDue = [];
  const claimsDue = [];

  for (const guide of guides) {
    const guideAge = ageInDays(guide.updatedOn, today);
    if (guideAge >= maxAgeDays) {
      guidesDue.push({ slug: guide.slug, updatedOn: guide.updatedOn, age: guideAge });
    }

    for (const section of guide.sections) {
      for (const claim of section.claims) {
        if (claim.kind !== "reported") continue;
        const age = ageInDays(claim.observedOn, today);
        if (age < maxAgeDays) continue;
        claimsDue.push({
          slug: guide.slug,
          age,
          observedOn: claim.observedOn,
          source: claim.source,
          sourceUrl: claim.sourceUrl,
          text: claim.text,
        });
      }
    }
  }

  claimsDue.sort((left, right) => right.age - left.age);
  return { guidesDue, claimsDue };
}

function main() {
  const args = process.argv.slice(2);
  const days = Number(args.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 180);
  const today = args.find((a) => a.startsWith("--today="))?.split("=")[1] ?? new Date().toISOString().slice(0, 10);

  const { guidesDue, claimsDue } = reviewDue(CONTENT, today, days);

  console.log(`Content review as of ${today}, threshold ${days} days\n`);

  if (guidesDue.length === 0 && claimsDue.length === 0) {
    const youngest = Math.min(
      ...CONTENT.map((guide) => ageInDays(guide.updatedOn, today)),
    );
    console.log(`Nothing due. Oldest guide review is ${youngest} days old.`);
    return;
  }

  for (const guide of guidesDue) {
    console.log(`GUIDE  ${guide.slug} — reviewed ${guide.updatedOn} (${guide.age} days ago)`);
  }
  for (const claim of claimsDue) {
    console.log(`CLAIM  ${claim.slug} — read ${claim.observedOn} (${claim.age} days ago)`);
    console.log(`       ${claim.source}`);
    console.log(`       ${claim.sourceUrl}`);
    console.log(`       "${claim.text.slice(0, 96)}${claim.text.length > 96 ? "…" : ""}"`);
  }
  console.log(
    `\n${claimsDue.length} claim(s) and ${guidesDue.length} guide(s) due. Re-read the sources, then update observedOn/updatedOn or the text.`,
  );
}

if (import.meta.main) main();
