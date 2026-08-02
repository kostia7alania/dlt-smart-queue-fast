import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CITY_HUBS,
  COMPARE_MAX_OFFICES,
  cityHubBySlug,
  compareSelection,
  coverageOf,
  type DirectoryOffice,
  hasBespokeRoute,
  hasOfficeName,
  isAppointmentOpen,
  type OfficeDirectory,
  officeNameOrNull,
  STATIC_ROUTE_HUB_SLUGS,
  selectOffices,
} from "./office-directory.ts";
import { officeMatchesSearch } from "./office-search.ts";
import type { Office } from "./types.ts";

const DATASET = new URL("../data/office-directory.json", import.meta.url);
const directory = JSON.parse(await readFile(DATASET, "utf8")) as OfficeDirectory;

const office = (
  sit_id: number,
  sit_name: string | null,
  app_open: number,
  geo_precision: DirectoryOffice["geo_precision"] = null,
): DirectoryOffice => ({ sit_id, sit_name, app_open, geo_precision });

test("every published hub references site IDs that exist exactly once", () => {
  const seen = new Map<number, string>();

  for (const hub of CITY_HUBS) {
    assert.ok(hub.siteIDs.length > 0, `${hub.slug} has no offices`);

    for (const siteID of hub.siteIDs) {
      const found = directory.offices.find((entry) => entry.sit_id === siteID);
      assert.ok(found, `${hub.slug} references unknown site ID ${siteID}`);

      const other = seen.get(siteID);
      assert.equal(other, undefined, `site ID ${siteID} is in both ${other} and ${hub.slug}`);
      seen.set(siteID, hub.slug);
    }
  }
});

test("hub slugs are unique, lowercase, and URL-safe", () => {
  const slugs = CITY_HUBS.map((hub) => hub.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const slug of slugs) {
    assert.match(slug, /^[a-z][a-z0-9-]*$/);
  }
});

test("hub copy avoids the forbidden trust words", () => {
  const forbidden = /\b(official|guaranteed|guarantee|reserved|fast track)\b/i;

  for (const hub of CITY_HUBS) {
    for (const field of [hub.title, hub.metaDescription, hub.summary]) {
      assert.doesNotMatch(field, forbidden, `${hub.slug}: "${field}"`);
    }
  }
});

test("each hub's map search term selects exactly that hub's named offices", () => {
  for (const hub of CITY_HUBS) {
    const matched = directory.offices
      .filter(
        (entry) => entry.sit_name !== null && officeMatchesSearch(entry as Office, hub.mapSearch),
      )
      .map((entry) => entry.sit_id);
    const expected = selectOffices(directory.offices, hub.siteIDs)
      .filter(hasOfficeName)
      .map((entry) => entry.sit_id);

    assert.deepEqual(
      matched,
      expected,
      `map search "${hub.mapSearch}" does not select exactly ${hub.slug}`,
    );
  }
});

test("Phuket resolves to the single upstream entry with its upstream name intact", () => {
  const hub = cityHubBySlug("phuket");
  assert.ok(hub);

  const offices = selectOffices(directory.offices, hub.siteIDs);
  assert.equal(offices.length, 1);
  assert.equal(offices[0].sit_name, "Phuket Provincial Land Land Transport Office");
});

test("unknown slugs resolve to undefined", () => {
  // Songkhla has offices in the dataset but is deliberately not published as a
  // hub: none of them were marked open for appointments in the capture.
  assert.equal(cityHubBySlug("songkhla"), undefined);
  assert.equal(cityHubBySlug(""), undefined);
});

test("selection skips unknown IDs and sorts ascending", () => {
  const offices = [office(3, "Three", 1), office(1, "One", 0), office(2, "Two", 1)];

  assert.deepEqual(
    selectOffices(offices, [9, 3, 1]).map((entry) => entry.sit_id),
    [1, 3],
  );
});

test("coverage counts names, appointment flags, and geocodes separately", () => {
  const offices = [
    office(1, "Named Open Geocoded", 1, "office"),
    office(2, "Named Closed", 0),
    office(3, "", 1),
    office(4, null, 0, "province"),
  ];

  assert.deepEqual(coverageOf(offices), {
    offices: 4,
    named: 2,
    appointmentOpen: 2,
    geocoded: 2,
  });
});

test("blank upstream names are reported as blank, never substituted", () => {
  assert.equal(hasOfficeName(office(1, "  ", 1)), false);
  assert.equal(officeNameOrNull(office(1, "  ", 1)), null);
  assert.equal(officeNameOrNull(office(2, null, 1)), null);
  assert.equal(officeNameOrNull(office(3, "-", 0)), "-");
  assert.equal(isAppointmentOpen(office(4, "x", 0)), false);
});

test("compare selection prefers appointment-open offices and reports omissions", () => {
  const offices = [
    office(1, "closed", 0),
    office(2, "open", 1),
    office(3, "closed", 0),
    office(4, "open", 1),
  ];

  assert.deepEqual(compareSelection(offices, 3), { siteIDs: [2, 4, 1], omitted: 1 });
  assert.deepEqual(compareSelection(offices, 4), { siteIDs: [2, 4, 1, 3], omitted: 0 });
  assert.deepEqual(compareSelection(offices, 0), { siteIDs: [], omitted: 4 });
});

test("no published hub is silently truncated by the comparison cap", () => {
  for (const hub of CITY_HUBS) {
    const offices = selectOffices(directory.offices, hub.siteIDs);
    const selection = compareSelection(offices);

    assert.ok(
      selection.siteIDs.length <= COMPARE_MAX_OFFICES,
      `${hub.slug} exceeds the comparison cap`,
    );
    assert.equal(
      selection.omitted,
      Math.max(offices.length - COMPARE_MAX_OFFICES, 0),
      `${hub.slug} omission count must be derivable from the cap`,
    );
  }
});

test("only hubs with a bespoke static route are excluded from the dynamic one", () => {
  for (const hub of CITY_HUBS) {
    const bespoke = new URL(`../../../app/offices/${hub.slug}/page.tsx`, import.meta.url);
    assert.equal(
      hasBespokeRoute(hub),
      existsSync(bespoke),
      `${hub.slug}: exclusion list and app/offices/${hub.slug}/page.tsx disagree`,
    );
  }

  for (const slug of STATIC_ROUTE_HUB_SLUGS) {
    assert.ok(
      CITY_HUBS.some((hub) => hub.slug === slug),
      `${slug} is excluded but is not a published hub`,
    );
  }
});
