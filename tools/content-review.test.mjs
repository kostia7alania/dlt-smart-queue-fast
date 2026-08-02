import assert from "node:assert/strict";
import test from "node:test";

import { ageInDays, reviewDue } from "./content-review.mjs";
import { LICENCE_JOURNEYS } from "../apps/web/src/entities/guide/model/journeys-licence.ts";
import { PROCESS_JOURNEYS } from "../apps/web/src/entities/guide/model/journeys-process.ts";

const CONTENT = [...LICENCE_JOURNEYS, ...PROCESS_JOURNEYS];

const guide = (slug, updatedOn, claims) => ({
  slug,
  updatedOn,
  sections: [{ heading: "s", claims }],
});

const reported = (observedOn) => ({
  kind: "reported",
  text: "something a third party said",
  source: "Someone (published 2025-01-01)",
  sourceUrl: "https://example.com/",
  observedOn,
});

test("age is counted in whole days from the read date", () => {
  assert.equal(ageInDays("2026-01-01", "2026-01-01"), 0);
  assert.equal(ageInDays("2026-01-01", "2026-07-01"), 181);
});

test("only reported claims past the threshold are listed, oldest first", () => {
  const { guidesDue, claimsDue } = reviewDue(
    [
      guide("fresh", "2026-06-01", [reported("2026-06-01"), { kind: "proven", text: "ours" }]),
      guide("stale", "2025-01-01", [reported("2025-03-01"), reported("2024-12-01")]),
    ],
    "2026-08-01",
    180,
  );

  assert.deepEqual(
    guidesDue.map((entry) => entry.slug),
    ["stale"],
  );
  assert.deepEqual(
    claimsDue.map((entry) => entry.observedOn),
    ["2024-12-01", "2025-03-01"],
  );
});

test("proven and official-only claims are never listed for re-reading", () => {
  const { claimsDue } = reviewDue(
    [
      guide("old", "2020-01-01", [
        { kind: "proven", text: "we observe this" },
        { kind: "official-only", text: "DLT decides this" },
      ]),
    ],
    "2026-08-01",
    180,
  );

  assert.deepEqual(claimsDue, []);
});

test("the published guides are readable by the reviewer and currently fresh", () => {
  const { guidesDue, claimsDue } = reviewDue(CONTENT, "2026-08-01", 180);

  assert.ok(CONTENT.length > 0);
  assert.deepEqual(guidesDue, []);
  assert.deepEqual(claimsDue, []);
});
