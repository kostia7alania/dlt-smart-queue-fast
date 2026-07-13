#!/usr/bin/env node
// One-time (re-runnable) geocoder for DLT offices.
//
// Joins English (getSite/2) and Thai (getSite/1) office names, then resolves
// coordinates through a cascading Nominatim search honoring the OSM usage
// policy (1 req/s, descriptive User-Agent). Results are written to
// apps/web/src/entities/dlt/data/office-geo.json with a `precision` field:
//   office   — the exact office POI matched
//   district — a district-level fallback matched
//   province — the province centroid (worst case)
//
// Data © OpenStreetMap contributors (ODbL). Attribution is rendered on the map.

import { readFile, writeFile } from "node:fs/promises";

const UPSTREAM = "https://app-gecc.theassistech.co.th";
const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const USER_AGENT = "dtl-parser-pet-project/1.0 (one-time batch; kostia7alania@gmail.com)";
const OUT = new URL("../apps/web/src/entities/dlt/data/office-geo.json", import.meta.url);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

let lastRequest = 0;
async function nominatim(query) {
  const wait = 1100 - (Date.now() - lastRequest);
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();
  const url = `${NOMINATIM}?format=json&limit=1&countrycodes=th&q=${encodeURIComponent(query)}`;
  try {
    const results = await getJSON(url, { "User-Agent": USER_AGENT });
    if (results.length === 0) return null;
    return { lat: Number(results[0].lat), lon: Number(results[0].lon), matched: results[0].display_name };
  } catch (error) {
    console.error(`  ! ${query}: ${error.message}`);
    return null;
  }
}

// Upstream Thai names come in two shapes:
//   "สำนักงานขนส่งจังหวัดกาญจนบุรี"        (head office, prefixed)
//   "พัทลุงสาขาควนขนุน"                    (branch: <province>สาขา<district>, no prefix)
function parseThaiName(thName) {
  const clean = thName
    .replace(/\s*\([^)]*\)/g, "")
    .replace(/\s*แห่งที่\s*\d+/g, "")
    .trim();
  const base = clean.replace(/^สำนักงานขนส่ง(จังหวัด)?/, "").trim();
  const branchMatch = base.match(/^(.+?)สาขา\s*(?:อำเภอ|กิ่งอำเภอ)?\s*(.+)$/);
  if (thName.includes("กรุงเทพ")) {
    return { province: "กรุงเทพมหานคร", branch: branchMatch?.[2]?.trim() ?? null };
  }
  if (branchMatch) {
    return { province: branchMatch[1].trim(), branch: branchMatch[2].trim() };
  }
  return { province: base || null, branch: null };
}

// Ordered [query, precision] attempts for one office.
function buildAttempts(thName, enName) {
  const attempts = [];
  attempts.push([thName, "office"]);

  const noParens = thName.replace(/\s*\([^)]*\)/g, "").replace(/\s*แห่งที่\s*\d+/g, "").trim();
  if (noParens !== thName) attempts.push([noParens, "office"]);

  const paren = thName.match(/\(([^)]+)\)/)?.[1];
  const { province, branch } = parseThaiName(thName);

  if (branch && province) {
    attempts.push([`สำนักงานขนส่งจังหวัด${province} สาขา${branch}`, "office"]);
    attempts.push([`สำนักงานขนส่ง ${branch}`, "office"]);
    attempts.push([`อำเภอ${branch} จังหวัด${province}`, "district"]);
    attempts.push([`${branch} ${province}`, "district"]);
  }
  if (paren && !branch) {
    attempts.push([`สำนักงานขนส่ง ${paren}`, "office"]);
    const area =
      province === "กรุงเทพมหานคร" ? `เขต${paren} กรุงเทพมหานคร` : `${paren} จังหวัด${province ?? ""}`;
    attempts.push([area.trim(), "district"]);
  }
  // Special venue shapes: malls, hospitals, driving schools ("<province> โรงเรียนสอนขับรถ...").
  const mall = thName.match(/ห้างสรรพสินค้า\s*(.+)$/)?.[1];
  if (mall) attempts.push([mall, "office"]);
  const hospital = thName.match(/(โรงพยาบาล\S+)/)?.[1];
  if (hospital) attempts.push([hospital, "office"]);
  const school = thName.match(/^(\S+)\s+(โรงเรียนสอนขับรถ\S*)/);
  if (school) {
    attempts.push([`${school[2]} จังหวัด${school[1]}`, "office"]);
    attempts.push([`จังหวัด${school[1]}`, "province"]);
  }

  if (enName) attempts.push([enName, "office"]);
  if (province) attempts.push([`จังหวัด${province}`, "province"]);
  // Last resort: first token is often a bare province name.
  const firstToken = thName.split(/\s+/)[0];
  if (firstToken && firstToken !== thName && !firstToken.startsWith("--")) {
    attempts.push([`จังหวัด${firstToken}`, "province"]);
  }
  return attempts;
}

const refine = process.argv.includes("--refine");

const [en, th] = await Promise.all([
  getJSON(`${UPSTREAM}/dlt-api1/getSite/2`),
  getJSON(`${UPSTREAM}/dlt-api1/getSite/1`),
]);
const thById = new Map(th.map((office) => [office.sit_id, office.sit_name]));
console.log(`offices: ${en.length} (thai names: ${th.length})${refine ? " [refine mode]" : ""}`);

// In refine mode keep good rows and re-query only missing/province ones.
const keep = new Map();
if (refine) {
  try {
    const existing = JSON.parse(await readFile(OUT, "utf8"));
    for (const row of existing.offices) {
      if (row.precision === "office" || row.precision === "district") keep.set(row.sit_id, row);
    }
    console.log(`keeping ${keep.size} office/district rows`);
  } catch {
    console.log("no existing dataset; running full batch");
  }
}

const offices = [];
const counts = { office: 0, district: 0, province: 0, missing: 0 };

for (const [index, office] of en.entries()) {
  const kept = keep.get(office.sit_id);
  if (kept) {
    counts[kept.precision]++;
    offices.push(kept);
    continue;
  }

  // A few offices exist only in the English list; geocode by English name then.
  const thName = thById.get(office.sit_id) ?? office.sit_name;
  // Placeholder/test entries ("-", "--สำหรับการทดสอบระบบ--", "Site For Test")
  // must not be geocoded into garbage matches.
  if (thName.length < 3 || thName.startsWith("--") || /site for test/i.test(thName)) {
    counts.missing++;
    console.log(`${index + 1}/${en.length} #${office.sit_id} SKIPPED placeholder "${thName}"`);
    continue;
  }

  let hit = null;
  let precision = null;
  for (const [query, tier] of buildAttempts(thName, office.sit_name)) {
    hit = await nominatim(query);
    if (hit) {
      precision = tier;
      break;
    }
  }

  if (!hit) {
    counts.missing++;
    console.log(`${index + 1}/${en.length} #${office.sit_id} MISSING ${thName}`);
    continue;
  }
  counts[precision]++;
  offices.push({
    sit_id: office.sit_id,
    lat: hit.lat,
    lon: hit.lon,
    precision,
    th_name: thName,
    matched: hit.matched,
  });
  console.log(`${index + 1}/${en.length} #${office.sit_id} ${precision} ${thName}`);
}

const payload = {
  generated_at: new Date().toISOString(),
  source: "Nominatim search over DLT getSite/1 Thai office names (cascading fallback)",
  attribution: "Geocoding data (c) OpenStreetMap contributors, ODbL",
  precision_legend: {
    office: "exact office POI",
    district: "district-level fallback",
    province: "province centroid fallback",
  },
  offices,
};
await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
console.log("summary:", JSON.stringify(counts), "->", OUT.pathname);
