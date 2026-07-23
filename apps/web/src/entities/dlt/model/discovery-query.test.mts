import assert from "node:assert/strict";
import test from "node:test";

import { parsePositiveSiteID, parseQueryFlag, parseSiteIDs } from "./discovery-query.ts";
import { filterOffices, officeMatchesSearch } from "./office-search.ts";
import { DEFAULT_WORK_KEYWORD, parseWorkKeyword, WORK_KEYWORDS } from "./work-options.ts";

const offices = [
  { app_open: 1, sit_id: 47, sit_name: "Kanchanaburi Provincial Transport Office" },
  { app_open: 1, sit_id: 103, sit_name: "สำนักงานขนส่งกรุงเทพมหานครพื้นที่ 1" },
];

test("work-option parsing preserves only exact upstream strings", () => {
  assert.equal(parseWorkKeyword(" RENEW THAI"), WORK_KEYWORDS[1]);
  assert.equal(parseWorkKeyword("RENEW THAI"), DEFAULT_WORK_KEYWORD);
  assert.equal(parseWorkKeyword(null), DEFAULT_WORK_KEYWORD);
});

test("site-ID parsing rejects invalid values, deduplicates, and enforces its cap", () => {
  assert.equal(parsePositiveSiteID("47", 1), 47);
  assert.equal(parsePositiveSiteID("-2", 1), 1);
  assert.equal(parsePositiveSiteID("47.5", 1), 1);
  assert.deepEqual(parseSiteIDs("47, 47, nope, -1, 103, 48", 2), [47, 103]);
  assert.deepEqual(parseSiteIDs(null, 8), []);
});

test("query flags accept only the canonical enabled value", () => {
  assert.equal(parseQueryFlag("1"), true);
  assert.equal(parseQueryFlag("true"), false);
  assert.equal(parseQueryFlag(null), false);
});

test("office search matches normalized names and numeric site IDs", () => {
  assert.equal(officeMatchesSearch(offices[0], "  KANCHANABURI "), true);
  assert.equal(officeMatchesSearch(offices[0], "#47"), true);
  assert.equal(officeMatchesSearch(offices[1], "กรุงเทพมหานคร"), true);
  assert.deepEqual(
    filterOffices(offices, "103").map((office) => office.sit_id),
    [103],
  );
  assert.deepEqual(filterOffices(offices, "missing"), []);
});
