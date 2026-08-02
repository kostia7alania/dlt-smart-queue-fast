import { officeGeoById, officeGeoDataset } from "@/entities/dlt";

import { buildBangkokOffices } from "./bangkok-offices";

export const BANGKOK_OFFICES = buildBangkokOffices(officeGeoById);

export const BANGKOK_GEO_PROVENANCE = {
  generatedAt: officeGeoDataset.generated_at,
  source: officeGeoDataset.source,
  attribution: officeGeoDataset.attribution,
} as const;
