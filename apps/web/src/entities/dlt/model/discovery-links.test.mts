import assert from "node:assert/strict";
import test from "node:test";

import {
  calendarHref,
  compareHref,
  historyHref,
  mapHref,
  mapOfficeHref,
} from "./discovery-links.ts";
import { parsePositiveSiteID, parseQueryFlag, parseSiteIDs } from "./discovery-query.ts";
import { parseWorkKeyword, WORK_KEYWORDS } from "./work-options.ts";

const [NEW_THAI, RENEW_THAI] = WORK_KEYWORDS;

test("the leading space in an upstream keyword survives URL encoding", () => {
  assert.equal(
    calendarHref({ siteID: 84, keyword: RENEW_THAI }),
    "/calendar?siteId=84&keyword=+RENEW+THAI",
  );

  const parsed = new URLSearchParams(
    calendarHref({ siteID: 84, keyword: RENEW_THAI }).split("?")[1],
  );
  assert.equal(parsed.get("keyword"), " RENEW THAI");
  assert.equal(parseWorkKeyword(parsed.get("keyword")), RENEW_THAI);
});

test("calendar links round-trip through the view's own parsers", () => {
  const query = new URLSearchParams(
    calendarHref({ siteID: 47, keyword: NEW_THAI, availableOnly: true }).split("?")[1],
  );

  assert.equal(parsePositiveSiteID(query.get("siteId"), 1), 47);
  assert.equal(parseWorkKeyword(query.get("keyword")), NEW_THAI);
  assert.equal(parseQueryFlag(query.get("available")), true);
});

test("optional flags are omitted rather than sent as falsey values", () => {
  assert.equal(
    calendarHref({ siteID: 1, keyword: NEW_THAI }),
    "/calendar?siteId=1&keyword=+NEW+THAI",
  );
  assert.equal(
    historyHref({ siteID: 1, keyword: NEW_THAI }),
    "/history?siteId=1&keyword=+NEW+THAI",
  );
  assert.equal(mapHref({ keyword: NEW_THAI }), "/map?keyword=+NEW+THAI");
});

test("compare links list site IDs the compare view can parse back", () => {
  const link = compareHref({ siteIDs: [19, 20, 123], keyword: RENEW_THAI });
  assert.equal(link, "/compare?siteIds=19%2C20%2C123&keyword=+RENEW+THAI");

  const query = new URLSearchParams(link.split("?")[1]);
  assert.deepEqual(parseSiteIDs(query.get("siteIds"), 8), [19, 20, 123]);
});

test("an empty compare selection produces no siteIds parameter", () => {
  assert.equal(compareHref({ siteIDs: [], keyword: NEW_THAI }), "/compare?keyword=+NEW+THAI");
});

test("per-office map links use the search contract the map already supports", () => {
  const link = mapOfficeHref({ siteID: 84, keyword: NEW_THAI });
  assert.equal(link, "/map?keyword=+NEW+THAI&search=%2384");

  const query = new URLSearchParams(link.split("?")[1]);
  assert.equal(query.get("search"), "#84");
});

test("history links carry an explicit limit only when asked", () => {
  assert.equal(
    historyHref({ siteID: 84, keyword: NEW_THAI, limit: 20 }),
    "/history?siteId=84&keyword=+NEW+THAI&limit=20",
  );
});
