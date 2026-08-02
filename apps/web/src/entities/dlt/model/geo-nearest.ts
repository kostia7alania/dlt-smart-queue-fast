// Nearest-office lookup over the committed geocode dataset.
//
// Distances are straight-line kilometres between committed coordinates, not
// travel distances, and many coordinates are district or province fallbacks —
// so callers must render the precision alongside any distance they show.

import { officeGeoById, officeGeoDataset } from "./geo";
import { hasOfficeDetailPage } from "./office-directory";
import { directoryOfficeById } from "./office-directory-dataset";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceKm(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
): number {
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export type NearbyOffice = {
  sit_id: number;
  km: number;
};

/**
 * Offices closest to the given site, nearest first. Only offices that have their
 * own page are returned, so the caller never links into nothing.
 */
export function nearestOffices(siteID: number, limit = 3): NearbyOffice[] {
  const origin = officeGeoById.get(siteID);
  if (!origin) return [];

  return officeGeoDataset.offices
    .filter((candidate) => candidate.sit_id !== siteID)
    .filter((candidate) => {
      const office = directoryOfficeById.get(candidate.sit_id);
      return office !== undefined && hasOfficeDetailPage(office);
    })
    .map((candidate) => ({ sit_id: candidate.sit_id, km: distanceKm(origin, candidate) }))
    .sort((left, right) => left.km - right.km)
    .slice(0, Math.max(limit, 0));
}
