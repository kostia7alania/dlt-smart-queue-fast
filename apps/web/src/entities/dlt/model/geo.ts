import dataset from "../data/office-geo.json";

// Derived provenance data (not part of the upstream DLT contract): coordinates
// resolved from Thai office names via Nominatim. Regenerate with
// `node tools/geocode-offices.mjs`. Data © OpenStreetMap contributors (ODbL).

export type GeoPrecision = "office" | "district" | "province";

export type OfficeGeo = {
  sit_id: number;
  lat: number;
  lon: number;
  precision: GeoPrecision;
  th_name: string;
  matched: string;
};

export type OfficeGeoDataset = {
  generated_at: string;
  source: string;
  attribution: string;
  offices: OfficeGeo[];
};

export const officeGeoDataset = dataset as OfficeGeoDataset;

export const officeGeoById = new Map(
  officeGeoDataset.offices.map((office) => [office.sit_id, office]),
);
