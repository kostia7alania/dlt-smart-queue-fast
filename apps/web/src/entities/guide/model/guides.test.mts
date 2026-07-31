import assert from "node:assert/strict";
import test from "node:test";

import { WORK_KEYWORDS } from "../../dlt/model/work-options.ts";
import { claimsOfKind } from "./guide.ts";
import { GUIDES, guideBySlug } from "./guides.ts";

const FORBIDDEN_WORDS = /\b(guaranteed|guarantee|fast track|reserved)\b/i;
// Requirement phrasing is only allowed inside attributed `reported` claims.
const REQUIREMENT_PHRASING = /\b(you must|you need to|is required|are required|you have to)\b/i;

test("guides are uniquely slugged, dated, and mapped to an upstream keyword", () => {
  const slugs = GUIDES.map((guide) => guide.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(GUIDES.length > 0);

  for (const guide of GUIDES) {
    assert.match(guide.slug, /^[a-z][a-z0-9-]*$/);
    assert.match(guide.updatedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(
      WORK_KEYWORDS.includes(guide.keyword as (typeof WORK_KEYWORDS)[number]),
      `${guide.slug} keyword "${guide.keyword}" is not an upstream keyword`,
    );
    assert.equal(guideBySlug(guide.slug), guide);
  }
});

test("unknown guide slugs resolve to undefined", () => {
  assert.equal(guideBySlug("walk-in-rules"), undefined);
});

test("every guide carries all three claim kinds", () => {
  for (const guide of GUIDES) {
    for (const kind of ["proven", "official-only", "reported"] as const) {
      assert.ok(
        claimsOfKind(guide, kind).length > 0,
        `${guide.slug} has no ${kind} claims, which hides the evidence boundary`,
      );
    }
  }
});

test("reported claims are attributed to an HTTPS source with a read date", () => {
  for (const guide of GUIDES) {
    for (const claim of claimsOfKind(guide, "reported")) {
      assert.ok(claim.source.trim().length > 10, `${guide.slug}: weak source label`);
      assert.match(claim.sourceUrl, /^https:\/\//, `${guide.slug}: ${claim.sourceUrl}`);
      assert.match(claim.observedOn, /^\d{4}-\d{2}-\d{2}$/, `${guide.slug}: ${claim.observedOn}`);
    }
  }
});

test("no guide links a host with a known certificate-chain failure", () => {
  for (const guide of GUIDES) {
    for (const claim of claimsOfKind(guide, "reported")) {
      assert.doesNotMatch(claim.sourceUrl, /ttms\.dlt\.go\.th/);
    }
  }
});

test("our own claims never use requirement phrasing or trust superlatives", () => {
  for (const guide of GUIDES) {
    const ourText = [
      guide.title,
      guide.metaDescription,
      guide.intro,
      ...guide.sections.flatMap((section) => [section.heading, section.lead ?? ""]),
      ...claimsOfKind(guide, "proven").map((claim) => claim.text),
      ...claimsOfKind(guide, "official-only").map((claim) => claim.text),
    ];

    for (const text of ourText) {
      assert.doesNotMatch(text, FORBIDDEN_WORDS, `${guide.slug}: "${text}"`);
      assert.doesNotMatch(text, REQUIREMENT_PHRASING, `${guide.slug}: "${text}"`);
    }
  }
});

test("guides describe themselves as unaffiliated by never calling this service official", () => {
  for (const guide of GUIDES) {
    const ourClaims = [
      ...claimsOfKind(guide, "proven").map((claim) => claim.text),
      guide.intro,
      guide.metaDescription,
    ];

    for (const text of ourClaims) {
      assert.doesNotMatch(text, /\bthis (service|site|page) is official\b/i);
    }
  }
});
