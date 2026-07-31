// Office directory model: types, the published city registry, and pure
// selectors. This module deliberately imports no dataset so it can be unit
// tested with `node --test`; the bound dataset lives in
// ./office-directory-dataset.ts.
//
// `sit_name` and `app_open` are upstream values (docs/CONSTITUTION.md principle
// IV) and may be empty, null, or defective. `geo_precision` is derived
// provenance from the committed geocode dataset, not an upstream field.

import type { GeoPrecision } from "./geo";

export type DirectoryOffice = {
  sit_id: number;
  sit_name: string | null;
  app_open: number;
  geo_precision: GeoPrecision | null;
};

export type OfficeDirectory = {
  generated_at: string;
  source: string;
  geo_source: string;
  generator: string;
  contract_note: string;
  totals: {
    entries: number;
    named: number;
    appointment_open: number;
    geocoded: number;
    geo_precision: Record<string, number>;
  };
  offices: DirectoryOffice[];
};

// Mirrors the backend comparison cap (specs/009-availability-comparison).
export const COMPARE_MAX_OFFICES = 8;

export type CityHub = {
  slug: string;
  label: string;
  title: string;
  metaDescription: string;
  summary: string;
  siteIDs: readonly number[];
  /** Search term that selects this hub's offices in the map view's own filter. */
  mapSearch: string;
};

// Published hubs. Only cities where the captured office list proves coverage and
// the market research names a real audience (docs/research/2026-07-24-market-seo-domain.md).
export const CITY_HUBS: readonly CityHub[] = [
  {
    slug: "bangkok",
    label: "Bangkok",
    title: "DLT offices in Bangkok",
    metaDescription:
      "Bangkok land transport offices in the DLT appointment list, with the appointment-open flag as captured and direct links into availability tools.",
    summary:
      "Bangkok is served by numbered area land transport offices. The upstream list also contains a separate vehicle-registration entry for area 5, which is kept here because the appointment system returns it.",
    siteIDs: [1, 2, 3, 4, 5, 209],
    mapSearch: "Area Land Transport Office",
  },
  {
    slug: "chiang-mai",
    label: "Chiang Mai",
    title: "DLT offices in Chiang Mai",
    metaDescription:
      "Chiang Mai province land transport offices in the DLT appointment list, including the Fang, Chom Thong, and Mae Taeng branches.",
    summary:
      "Chiang Mai province has two city offices plus district branches. Branches are often quieter than the city offices, which is exactly what the comparison view is for.",
    siteIDs: [19, 20, 123, 124, 125],
    mapSearch: "Chiang Mai",
  },
  {
    slug: "pattaya",
    label: "Pattaya and Chonburi",
    title: "DLT offices for Pattaya and Chonburi",
    metaDescription:
      "Chonburi province land transport offices in the DLT appointment list, including the Bang Lamung branch that serves the Pattaya area.",
    summary:
      "There is no office named Pattaya in the upstream list. The Pattaya area is served from Chonburi province offices, where the Bang Lamung branch is the closest one.",
    siteIDs: [33, 113, 114, 115],
    mapSearch: "Chonburi",
  },
  {
    slug: "phuket",
    label: "Phuket",
    title: "DLT offices in Phuket",
    metaDescription:
      "The Phuket land transport office in the DLT appointment list, with its appointment-open flag as captured and links into availability tools.",
    summary:
      "Phuket has a single entry in the upstream list, so there is no in-province alternative to compare against. Mainland Phang Nga and Krabi offices are the nearest fallbacks to check manually.",
    siteIDs: [84],
    mapSearch: "Phuket",
  },
];

export type DirectoryCoverage = {
  offices: number;
  named: number;
  appointmentOpen: number;
  geocoded: number;
};

export function hasOfficeName(office: DirectoryOffice): boolean {
  return typeof office.sit_name === "string" && office.sit_name.trim().length > 0;
}

/** Upstream name when it exists; null keeps the caller honest about blanks. */
export function officeNameOrNull(office: DirectoryOffice): string | null {
  return hasOfficeName(office) ? office.sit_name : null;
}

export function isAppointmentOpen(office: DirectoryOffice): boolean {
  return office.app_open === 1;
}

/** Offices for the requested IDs, in ascending site-ID order, skipping unknown IDs. */
export function selectOffices(
  offices: readonly DirectoryOffice[],
  siteIDs: readonly number[],
): DirectoryOffice[] {
  const wanted = new Set(siteIDs);
  return offices
    .filter((office) => wanted.has(office.sit_id))
    .sort((left, right) => left.sit_id - right.sit_id);
}

export function coverageOf(offices: readonly DirectoryOffice[]): DirectoryCoverage {
  return {
    offices: offices.length,
    named: offices.filter(hasOfficeName).length,
    appointmentOpen: offices.filter(isAppointmentOpen).length,
    geocoded: offices.filter((office) => office.geo_precision !== null).length,
  };
}

export type CompareSelection = {
  siteIDs: number[];
  omitted: number;
};

/**
 * Site IDs for a Compare deep link. Offices the capture reports as open come
 * first so a truncated selection stays useful, and the omitted count is
 * returned so the page can say what was left out.
 */
export function compareSelection(
  offices: readonly DirectoryOffice[],
  cap: number = COMPARE_MAX_OFFICES,
): CompareSelection {
  const ordered = [
    ...offices.filter(isAppointmentOpen),
    ...offices.filter((office) => !isAppointmentOpen(office)),
  ];
  const siteIDs = ordered.slice(0, Math.max(cap, 0)).map((office) => office.sit_id);
  return { siteIDs, omitted: offices.length - siteIDs.length };
}

export function cityHubBySlug(slug: string): CityHub | undefined {
  return CITY_HUBS.find((hub) => hub.slug === slug);
}
