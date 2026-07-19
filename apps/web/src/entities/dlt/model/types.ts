// Upstream DLT contract types. Field names and string values are preserved
// exactly as the API returns them (see docs/CONSTITUTION.md principle IV).

export type Office = {
  app_open: number;
  sit_id: number;
  sit_name: string;
};

export type WorkType = {
  tyw_name: string;
  tyw_id: number;
  tyw_status: number;
  tyw_datestart: string;
};

export type SlotRound = {
  round: string;
  count: string | number;
  MaxCount: number;
};

export type SlotDay = {
  date: string;
  message: string;
  color: string;
  siteopen: SlotRound[];
};

export type Holiday = {
  hol_date: string;
};

export type FetchRecord = {
  kind: string;
  params: Record<string, unknown>;
  ok: boolean;
  error?: string;
  duration_ms: number;
  fetched_at: string;
};

export type CompareDay = {
  date: string;
  message: string;
  color: string;
};

export type CompareOfficeResult = {
  sit_id: number;
  work_type?: WorkType;
  source?: DataSource;
  fetched_at?: string;
  total_days: number;
  available_days: number;
  first_available?: CompareDay;
  error?: string;
};

export type CompareResponse = {
  keyword: string;
  group_id: number;
  current_date: string;
  results: CompareOfficeResult[];
};

export type MapAvailabilityStatus = "available" | "full" | "no_slots" | "not_offered" | "unknown";

export type MapAvailabilityResult = {
  sit_id: number;
  status: MapAvailabilityStatus;
  work_type?: WorkType;
  work_types_fetched_at: string;
  slots_fetched_at?: string;
  snapshot_current_date?: string;
  total_days: number;
  available_days: number;
  first_available?: CompareDay;
};

export type MapAvailabilityResponse = {
  keyword: string;
  group_id: number;
  current_date: string;
  results: MapAvailabilityResult[];
};

export type DataSource = "live" | "snapshot";

export type Sourced<T> = {
  data: T;
  source: DataSource;
  fetchedAt: string | null;
};
