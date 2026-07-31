#!/usr/bin/env node
// Builds the committed office directory used by the static /offices hub pages.
//
// Inputs (no upstream call by default):
//   docs/assets/1-get-dlt-offices.json                     captured getSite/2 list
//   apps/web/src/entities/dlt/data/office-geo.json         committed geocodes
//
// Output:
//   apps/web/src/entities/dlt/data/office-directory.json
//
// Upstream `sit_name` values are copied byte-for-byte, including the known
// defects (`Phuket Provincial Land Land Transport Office`,
// `SamutPrakan…Phra Pradaeng Branch`, `Site For Test`, `-`, `""`, `null`).
// Coordinates stay in office-geo.json; only the precision label is carried here
// so the two datasets cannot drift.
//
// Usage:
//   node tools/build-office-directory.mjs                  regenerate from the capture
//   node tools/build-office-directory.mjs --check          fail if the committed file is stale
//   node tools/build-office-directory.mjs --from-api=http://localhost:8080
//                                                         refresh from a running local API

import { readFile, writeFile } from "node:fs/promises";

const CAPTURE = new URL("../docs/assets/1-get-dlt-offices.json", import.meta.url);
const GEO = new URL("../apps/web/src/entities/dlt/data/office-geo.json", import.meta.url);
const OUT = new URL("../apps/web/src/entities/dlt/data/office-directory.json", import.meta.url);

const CAPTURE_SOURCE = "docs/assets/1-get-dlt-offices.json (captured upstream getSite/2 list)";
const GEO_SOURCE = "apps/web/src/entities/dlt/data/office-geo.json";

export function hasName(office) {
  return typeof office.sit_name === "string" && office.sit_name.trim().length > 0;
}

export function buildDirectory({ offices, geo, source, generatedAt }) {
  const geoById = new Map(geo.offices.map((office) => [office.sit_id, office]));

  const rows = offices
    .map((office) => ({
      sit_id: office.sit_id,
      // Preserved exactly as returned upstream, including empty and null names.
      sit_name: office.sit_name ?? null,
      app_open: office.app_open,
      geo_precision: geoById.get(office.sit_id)?.precision ?? null,
    }))
    .sort((left, right) => left.sit_id - right.sit_id);

  const precision = {};
  for (const row of rows) {
    if (row.geo_precision === null) continue;
    precision[row.geo_precision] = (precision[row.geo_precision] ?? 0) + 1;
  }

  return {
    generated_at: generatedAt,
    source,
    geo_source: `${GEO_SOURCE} (generated ${geo.generated_at})`,
    generator: "node tools/build-office-directory.mjs",
    contract_note:
      "sit_name and app_open are upstream values copied without correction; geo_precision is derived provenance, not an upstream field.",
    totals: {
      entries: rows.length,
      named: rows.filter((row) => hasName(row)).length,
      appointment_open: rows.filter((row) => row.app_open === 1).length,
      geocoded: rows.filter((row) => row.geo_precision !== null).length,
      geo_precision: precision,
    },
    offices: rows,
  };
}

async function readOffices(fromApi) {
  if (!fromApi) {
    return { offices: JSON.parse(await readFile(CAPTURE, "utf8")), source: CAPTURE_SOURCE };
  }
  const base = fromApi.replace(/\/+$/, "");
  const url = `${base}/v1/dlt/offices`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return { offices: await response.json(), source: `${url} (live API read on request)` };
}

function withoutTimestamp(dataset) {
  const { generated_at: _ignored, ...rest } = dataset;
  return rest;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const fromApi = args.find((arg) => arg.startsWith("--from-api="))?.split("=")[1] ?? null;

  const [{ offices, source }, geo] = await Promise.all([
    readOffices(fromApi),
    readFile(GEO, "utf8").then(JSON.parse),
  ]);

  const next = buildDirectory({
    offices,
    geo,
    source,
    generatedAt: new Date().toISOString(),
  });

  if (check) {
    const committed = JSON.parse(await readFile(OUT, "utf8"));
    const same =
      JSON.stringify(withoutTimestamp(committed)) === JSON.stringify(withoutTimestamp(next));
    if (!same) {
      console.error("office-directory.json is stale; run node tools/build-office-directory.mjs");
      process.exitCode = 1;
      return;
    }
    console.log(`office-directory.json is current (${next.totals.entries} entries)`);
    return;
  }

  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
  const { entries, named, appointment_open, geocoded } = next.totals;
  console.log(
    `wrote ${entries} entries (named ${named}, app_open=1 ${appointment_open}, geocoded ${geocoded})`,
  );
}

if (import.meta.main) await main();
