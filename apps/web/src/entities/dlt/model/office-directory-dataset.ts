// Dataset-bound office directory selectors. Regenerate the JSON with
// `node tools/build-office-directory.mjs` (or `--check` to detect staleness).

import dataset from "../data/office-directory.json";
import {
  type CityHub,
  type CompareSelection,
  compareSelection,
  coverageOf,
  type DirectoryCoverage,
  type DirectoryOffice,
  type OfficeDirectory,
  selectOffices,
} from "./office-directory";

export const officeDirectory = dataset as OfficeDirectory;

export const directoryOfficeById = new Map(
  officeDirectory.offices.map((office) => [office.sit_id, office]),
);

export function cityHubOffices(hub: CityHub): DirectoryOffice[] {
  return selectOffices(officeDirectory.offices, hub.siteIDs);
}

export function cityHubCoverage(hub: CityHub): DirectoryCoverage {
  return coverageOf(cityHubOffices(hub));
}

export function cityHubCompareSelection(hub: CityHub): CompareSelection {
  return compareSelection(cityHubOffices(hub));
}
