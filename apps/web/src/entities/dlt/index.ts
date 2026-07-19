export {
  fetchCompare,
  fetchHolidays,
  fetchMapAvailability,
  fetchOffices,
  fetchSlots,
  fetchWithFallback,
  fetchWorkTypes,
  getJSON,
} from "./api/client";
export {
  type GeoPrecision,
  type OfficeGeo,
  officeGeoById,
  officeGeoDataset,
} from "./model/geo";
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
