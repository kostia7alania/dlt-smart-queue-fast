export {
  fetchHolidays,
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
  DataSource,
  FetchRecord,
  Holiday,
  Office,
  SlotDay,
  SlotRound,
  Sourced,
  WorkType,
} from "./model/types";
