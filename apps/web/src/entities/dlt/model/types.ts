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

export type DataSource = "live" | "snapshot";

export type Sourced<T> = {
  data: T;
  source: DataSource;
  fetchedAt: string | null;
};
