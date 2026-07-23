export {
  fetchCompare,
  fetchHolidays,
  fetchMapAvailability,
  fetchOffices,
  fetchSlots,
  fetchWithFallback,
  fetchWorkTypes,
  getJSON,
  isAbortError,
} from "./api/client";
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
