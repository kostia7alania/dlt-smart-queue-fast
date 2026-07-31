import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { buildDirectory, hasName } from "./build-office-directory.mjs";

const CAPTURE = new URL("../docs/assets/1-get-dlt-offices.json", import.meta.url);
const GEO = new URL("../apps/web/src/entities/dlt/data/office-geo.json", import.meta.url);
const DIRECTORY = new URL(
  "../apps/web/src/entities/dlt/data/office-directory.json",
  import.meta.url,
);

const capture = JSON.parse(await readFile(CAPTURE, "utf8"));
const geo = JSON.parse(await readFile(GEO, "utf8"));
const committed = JSON.parse(await readFile(DIRECTORY, "utf8"));

const rebuild = () =>
  buildDirectory({ offices: capture, geo, source: committed.source, generatedAt: "fixed" });

test("the committed directory matches a rebuild from the committed inputs", () => {
  const { generated_at: committedAt, ...committedRest } = committed;
  const { generated_at: _rebuiltAt, ...rebuiltRest } = rebuild();

  assert.ok(committedAt, "committed dataset records when it was generated");
  assert.deepEqual(rebuiltRest, committedRest);
});

test("upstream names are copied without correction, including the defective ones", () => {
  const byID = new Map(committed.offices.map((office) => [office.sit_id, office.sit_name]));

  assert.equal(byID.get(84), "Phuket Provincial Land Land Transport Office");
  assert.equal(byID.get(187), "Samut PrakanProvincial Land Transport Office Phra Pradaeng Branch");
  assert.equal(byID.get(212), "Site For Test");
  assert.equal(byID.get(224), "-");
  assert.equal(byID.get(216), null);
  assert.equal(byID.get(219), "");

  for (const office of capture) {
    assert.equal(byID.get(office.sit_id), office.sit_name ?? null);
  }
});

test("rows are unique, ordered by site ID, and carry only upstream plus provenance fields", () => {
  const ids = committed.offices.map((office) => office.sit_id);

  assert.deepEqual(ids, [...ids].sort((left, right) => left - right));
  assert.equal(new Set(ids).size, ids.length);

  for (const office of committed.offices) {
    assert.deepEqual(Object.keys(office).sort(), [
      "app_open",
      "geo_precision",
      "sit_id",
      "sit_name",
    ]);
  }
});

test("totals are derived, not asserted", () => {
  const { totals, offices } = committed;

  assert.equal(totals.entries, offices.length);
  assert.equal(totals.named, offices.filter((office) => hasName(office)).length);
  assert.equal(
    totals.appointment_open,
    offices.filter((office) => office.app_open === 1).length,
  );
  assert.equal(
    totals.geocoded,
    offices.filter((office) => office.geo_precision !== null).length,
  );
  assert.equal(
    Object.values(totals.geo_precision).reduce((sum, count) => sum + count, 0),
    totals.geocoded,
  );
});

test("geo precision comes from the geocode dataset and is null when absent", () => {
  const precisionByID = new Map(geo.offices.map((office) => [office.sit_id, office.precision]));

  for (const office of committed.offices) {
    assert.equal(office.geo_precision, precisionByID.get(office.sit_id) ?? null);
  }
});

test("a missing geocode never invents a precision label", () => {
  const dataset = buildDirectory({
    offices: [{ sit_id: 999, sit_name: "Only In The Capture", app_open: 1 }],
    geo: { generated_at: "test", offices: [] },
    source: "test",
    generatedAt: "fixed",
  });

  assert.deepEqual(dataset.offices, [
    { sit_id: 999, sit_name: "Only In The Capture", app_open: 1, geo_precision: null },
  ]);
  assert.deepEqual(dataset.totals, {
    entries: 1,
    named: 1,
    appointment_open: 1,
    geocoded: 0,
    geo_precision: {},
  });
});
