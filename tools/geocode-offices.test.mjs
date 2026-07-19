import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const DATASET = new URL("../apps/web/src/entities/dlt/data/office-geo.json", import.meta.url);
const { offices } = JSON.parse(await readFile(DATASET, "utf8"));

test("Bangkok area offices stay inside Bangkok", () => {
  const areaOffices = offices.filter((office) => office.th_name.startsWith("สำนักงานขนส่งพื้นที่"));
  assert.equal(areaOffices.length, 5);

  for (const office of areaOffices) {
    assert.ok(
      office.matched.includes("กรุงเทพมหานคร"),
      `office ${office.sit_id} matched outside Bangkok`,
    );
    assert.ok(office.lat >= 13.4 && office.lat <= 14.1, `office ${office.sit_id} latitude`);
    assert.ok(office.lon >= 100.3 && office.lon <= 101, `office ${office.sit_id} longitude`);
  }
});

test("head and branch offices stay in their named province", () => {
  for (const office of offices) {
    const headOfficeProvince = office.th_name.match(/^สำนักงานขนส่งจังหวัด([^\s(]+)/)?.[1];
    const branchProvince = office.th_name.match(/^([^\s]+)สาขา/)?.[1];
    const expectedProvince = headOfficeProvince ?? branchProvince;
    if (!expectedProvince) continue;

    assert.ok(
      office.matched.includes(`จังหวัด${expectedProvince}`),
      `office ${office.sit_id} (${office.th_name}) matched outside ${expectedProvince}`,
    );
  }
});
