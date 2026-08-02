import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  BANGKOK_COMPARE_PATH,
  BANGKOK_MAP_PATH,
  type BangkokOfficeGeo,
  buildBangkokOffices,
} from "./bangkok-offices.ts";

type UpstreamOffice = {
  sit_id: number;
  sit_name: string;
};

type GeoFixture = {
  generated_at: string;
  source: string;
  attribution: string;
  offices: BangkokOfficeGeo[];
};

async function loadEvidence() {
  const upstreamURL = new URL(
    "../../../../../../docs/assets/1-get-dlt-offices.json",
    import.meta.url,
  );
  const geoURL = new URL("../../../entities/dlt/data/office-geo.json", import.meta.url);
  const [upstreamJSON, geoJSON] = await Promise.all([
    readFile(upstreamURL, "utf8"),
    readFile(geoURL, "utf8"),
  ]);

  const upstream = JSON.parse(upstreamJSON) as UpstreamOffice[];
  const geo = JSON.parse(geoJSON) as GeoFixture;
  const offices = buildBangkokOffices(
    new Map(geo.offices.map((office) => [office.sit_id, office])),
  );

  return { upstream, geo, offices };
}

test("Bangkok directory preserves the five committed upstream IDs and names", async () => {
  const { upstream, offices } = await loadEvidence();
  const expected = upstream
    .filter((office) => office.sit_id >= 1 && office.sit_id <= 5)
    .map(({ sit_id, sit_name }) => ({ siteId: sit_id, name: sit_name }));

  assert.deepEqual(
    offices.map(({ siteId, name }) => ({ siteId, name })),
    expected,
  );
  assert.deepEqual(
    offices.map((office) => office.siteId),
    [1, 2, 3, 4, 5],
  );
});

test("every Bangkok office has bounded district geography and contextual links", async () => {
  const { offices } = await loadEvidence();

  for (const office of offices) {
    assert.equal(office.precision, "district");
    assert.match(office.thaiName, /^สำนักงานขนส่งพื้นที่/);
    assert.match(office.matchedPlace, /กรุงเทพมหานคร/);
    assert.equal(office.links.calendar, `/calendar?siteId=${office.siteId}`);
    assert.equal(office.links.map, `/map?search=%23${office.siteId}`);
    assert.equal(office.links.history, `/history?siteId=${office.siteId}`);
  }
});

test("directory-wide actions and provenance remain stable", async () => {
  const { geo } = await loadEvidence();

  assert.equal(BANGKOK_COMPARE_PATH, "/compare?siteIds=1,2,3,4,5");
  assert.equal(BANGKOK_MAP_PATH, "/map?search=Area%20Land%20Transport%20Office");
  assert.equal(geo.generated_at, "2026-07-19T20:44:43.051Z");
  assert.match(geo.source, /Nominatim/);
  assert.match(geo.attribution, /OpenStreetMap/);
});
