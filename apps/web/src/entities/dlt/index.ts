export {
  fetchCompare,
  fetchHolidays,
  fetchMapAvailability,
  fetchOffices,
  fetchSlotHistory,
  fetchSlots,
  fetchWithFallback,
  fetchWorkTypes,
  getJSON,
  isAbortError,
} from "./api/client";
export {
  calendarHref,
  compareHref,
  historyHref,
  mapHref,
  mapOfficeHref,
} from "./model/discovery-links";
export {
  parsePositiveSiteID,
  parseQueryFlag,
  parseSiteIDs,
} from "./model/discovery-query";
export {
  type GeoPrecision,
  type OfficeGeo,
  officeGeoById,
  officeGeoDataset,
} from "./model/geo";
export { distanceKm, type NearbyOffice, nearestOffices } from "./model/geo-nearest";
export {
  CITY_HUBS,
  type CityHub,
  COMPARE_MAX_OFFICES,
  type CompareSelection,
  cityHubBySlug,
  cityHubForSiteID,
  compareSelection,
  coverageOf,
  type DirectoryCoverage,
  type DirectoryOffice,
  hasBespokeRoute,
  hasOfficeDetailPage,
  hasOfficeName,
  isAppointmentOpen,
  type OfficeDirectory,
  officeDetailPath,
  officeNameOrNull,
  STATIC_ROUTE_HUB_SLUGS,
  selectOffices,
} from "./model/office-directory";
export {
  cityHubCompareSelection,
  cityHubCoverage,
  cityHubOffices,
  directoryOfficeById,
  officeDetailPages,
  officeDirectory,
} from "./model/office-directory-dataset";
export { filterOffices, officeMatchesSearch } from "./model/office-search";
export type {
  CompareDay,
  CompareOfficeResult,
  CompareResponse,
  DataSource,
  FetchRecord,
  Holiday,
  MapAvailabilityResponse,
  MapAvailabilityResult,
  MapAvailabilityStatus,
  Office,
  SlotDay,
  SlotHistoryComparison,
  SlotHistoryEntry,
  SlotHistoryResponse,
  SlotHistoryStatus,
  SlotRound,
  Sourced,
  WorkType,
} from "./model/types";
export {
  DEFAULT_WORK_KEYWORD,
  parseWorkKeyword,
  WORK_KEYWORDS,
  type WorkKeyword,
} from "./model/work-options";
