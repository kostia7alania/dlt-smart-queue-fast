import { API_BASE } from "@/shared/config/api";
import { officeDirectory } from "../model/office-directory-dataset";
import type {
  CompareResponse,
  Holiday,
  MapAvailabilityResponse,
  Office,
  OfficeSnapshotResponse,
  SlotDay,
  SlotHistoryResponse,
  Sourced,
  WorkType,
} from "../model/types";

export async function getJSON(url: string, signal?: AbortSignal): Promise<unknown> {
  const { body } = await getJSONResponse(url, { signal });
  return body;
}

async function getJSONResponse(
  url: string,
  init?: RequestInit,
): Promise<{ body: unknown; response: Response }> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  return { body: await res.json(), response: res };
}

// Try the live endpoint first; on failure fall back to the snapshot endpoint
// (feature 002) so pages keep working during upstream outages.
export async function fetchWithFallback<T>(
  livePath: string,
  snapshotPath: string | null,
  extractSnapshot: (body: unknown) => { data: T; fetchedAt: string | null },
  signal?: AbortSignal,
): Promise<Sourced<T>> {
  try {
    const data = (await getJSON(`${API_BASE}${livePath}`, signal)) as T;
    return { data, source: "live", fetchedAt: null };
  } catch (liveError) {
    if (isAbortError(liveError)) throw liveError;
    if (!snapshotPath) throw liveError;
    const body = await getJSON(`${API_BASE}${snapshotPath}`, signal);
    const { data, fetchedAt } = extractSnapshot(body);
    return { data, source: "snapshot", fetchedAt };
  }
}

export async function fetchOffices(signal?: AbortSignal): Promise<Sourced<Office[]>> {
  try {
    const { body, response } = await getJSONResponse(`${API_BASE}/v1/dlt/offices`, { signal });
    const stored = response.headers.get("X-Data-Source");
    return {
      data: body as Office[],
      source: stored === "snapshot" || stored === "committed" ? "snapshot" : "live",
      fetchedAt: response.headers.get("X-Fetched-At"),
    };
  } catch (liveError) {
    if (isAbortError(liveError)) throw liveError;
    try {
      const snapshot = normalizeOfficeSnapshot(
        await getJSON(`${API_BASE}/v1/dlt/snapshots/offices`, signal),
      );
      return { data: snapshot.offices, source: "snapshot", fetchedAt: snapshot.fetched_at };
    } catch (snapshotError) {
      if (isAbortError(snapshotError)) throw snapshotError;
      const committed = committedOfficeSnapshot();
      return { data: committed.offices, source: "snapshot", fetchedAt: committed.fetched_at };
    }
  }
}

export async function fetchOfficeSnapshot(signal?: AbortSignal): Promise<OfficeSnapshotResponse> {
  try {
    return normalizeOfficeSnapshot(await getJSON(`${API_BASE}/v1/dlt/snapshots/offices`, signal));
  } catch (error) {
    if (isAbortError(error)) throw error;
    return {
      ...committedOfficeSnapshot(),
      refresh_error: "The live snapshot endpoint is unavailable; showing the committed capture.",
    };
  }
}

export async function refreshOfficeSnapshot(signal?: AbortSignal): Promise<OfficeSnapshotResponse> {
  const { body } = await getJSONResponse(`${API_BASE}/v1/dlt/offices/refresh`, {
    method: "POST",
    signal,
  });
  return normalizeOfficeSnapshot(body);
}

export function fetchWorkTypes(
  siteId: number,
  groupId: number,
  keyword: string,
  signal?: AbortSignal,
): Promise<Sourced<WorkType[]>> {
  const params = `siteId=${siteId}&groupId=${groupId}&keyword=${encodeURIComponent(keyword)}`;
  return fetchWithFallback<WorkType[]>(
    `/v1/dlt/work-types?${params}`,
    `/v1/dlt/snapshots/work-types?${params}`,
    (body) => {
      const snapshot = body as { fetched_at: string; work_types: WorkType[] };
      return { data: snapshot.work_types, fetchedAt: snapshot.fetched_at };
    },
    signal,
  );
}

export function fetchSlots(
  workTypeId: number,
  currentDate: string,
  signal?: AbortSignal,
): Promise<Sourced<SlotDay[]>> {
  return fetchWithFallback<SlotDay[]>(
    `/v1/dlt/work-types/${workTypeId}/slots?currentDate=${encodeURIComponent(currentDate)}`,
    `/v1/dlt/snapshots/slots?workTypeId=${workTypeId}`,
    (body) => {
      const snapshot = body as { fetched_at: string; data: SlotDay[] };
      return { data: snapshot.data, fetchedAt: snapshot.fetched_at };
    },
    signal,
  );
}

// The compare endpoint handles live/snapshot fallback per office server-side,
// so there is no client-side fallback path here.
export function fetchCompare(
  siteIds: number[],
  keyword: string,
  currentDate: string,
  signal?: AbortSignal,
): Promise<CompareResponse> {
  const params = new URLSearchParams({
    siteIds: siteIds.join(","),
    keyword,
    currentDate,
  });
  return getJSON(`${API_BASE}/v1/dlt/compare?${params}`, signal) as Promise<CompareResponse>;
}

// The map overlay is intentionally snapshot-only. A persistence error is
// handled independently by the map view so the base office map still renders.
export function fetchMapAvailability(
  keyword: string,
  currentDate: string,
  signal?: AbortSignal,
): Promise<MapAvailabilityResponse> {
  const params = new URLSearchParams({ keyword, currentDate });
  return getJSON(
    `${API_BASE}/v1/dlt/map-availability?${params}`,
    signal,
  ) as Promise<MapAvailabilityResponse>;
}

// History is snapshot-only: resolving the work type is handled separately by
// the page, while this request never touches the DLT upstream.
export function fetchSlotHistory(
  workTypeId: number,
  limit: number,
  signal?: AbortSignal,
): Promise<SlotHistoryResponse> {
  const params = new URLSearchParams({
    workTypeId: String(workTypeId),
    limit: String(limit),
  });
  return getJSON(
    `${API_BASE}/v1/dlt/history/slots?${params}`,
    signal,
  ) as Promise<SlotHistoryResponse>;
}

// Holidays are best-effort: no snapshot endpoint exists for them.
export async function fetchHolidays(
  workTypeId: number,
  signal?: AbortSignal,
): Promise<Set<string>> {
  try {
    const holidays = (await getJSON(
      `${API_BASE}/v1/dlt/work-types/${workTypeId}/holidays`,
      signal,
    )) as Holiday[];
    return new Set((holidays ?? []).map((holiday) => holiday.hol_date));
  } catch (error) {
    if (isAbortError(error)) throw error;
    return new Set();
  }
}

export function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "name" in error && error.name === "AbortError"
  );
}

export function committedOfficeSnapshot(): OfficeSnapshotResponse {
  return {
    fetched_at: officeDirectory.generated_at,
    last_attempt_at: officeDirectory.generated_at,
    source: "committed",
    refresh_status: "seed",
    next_refresh_at: null,
    changed_office_ids: [],
    offices: officeDirectory.offices.map(({ app_open, sit_id, sit_name }) => ({
      app_open,
      sit_id,
      sit_name,
    })),
  };
}

function normalizeOfficeSnapshot(body: unknown): OfficeSnapshotResponse {
  if (typeof body !== "object" || body === null) {
    throw new Error("Office snapshot response must be an object");
  }
  const value = body as Partial<OfficeSnapshotResponse>;
  if (typeof value.fetched_at !== "string" || !Array.isArray(value.offices)) {
    throw new Error("Office snapshot response is missing required fields");
  }
  return {
    fetched_at: value.fetched_at,
    last_attempt_at:
      typeof value.last_attempt_at === "string" ? value.last_attempt_at : value.fetched_at,
    source: value.source === "committed" ? "committed" : "upstream",
    refresh_status: value.refresh_status ?? "unchanged",
    next_refresh_at: typeof value.next_refresh_at === "string" ? value.next_refresh_at : null,
    changed_office_ids: Array.isArray(value.changed_office_ids)
      ? value.changed_office_ids.filter((siteID): siteID is number => Number.isInteger(siteID))
      : [],
    offices: value.offices,
    refresh_error: typeof value.refresh_error === "string" ? value.refresh_error : undefined,
  };
}
