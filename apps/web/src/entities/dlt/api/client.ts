import { API_BASE } from "@/shared/config/api";
import type {
  CompareResponse,
  Holiday,
  MapAvailabilityResponse,
  Office,
  SlotDay,
  Sourced,
  WorkType,
} from "../model/types";

export async function getJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Try the live endpoint first; on failure fall back to the snapshot endpoint
// (feature 002) so pages keep working during upstream outages.
export async function fetchWithFallback<T>(
  livePath: string,
  snapshotPath: string | null,
  extractSnapshot: (body: unknown) => { data: T; fetchedAt: string | null },
): Promise<Sourced<T>> {
  try {
    const data = (await getJSON(`${API_BASE}${livePath}`)) as T;
    return { data, source: "live", fetchedAt: null };
  } catch (liveError) {
    if (!snapshotPath) throw liveError;
    const body = await getJSON(`${API_BASE}${snapshotPath}`);
    const { data, fetchedAt } = extractSnapshot(body);
    return { data, source: "snapshot", fetchedAt };
  }
}

export function fetchOffices(): Promise<Sourced<Office[]>> {
  return fetchWithFallback<Office[]>("/v1/dlt/offices", "/v1/dlt/snapshots/offices", (body) => {
    const snapshot = body as { fetched_at: string; offices: Office[] };
    return { data: snapshot.offices, fetchedAt: snapshot.fetched_at };
  });
}

export function fetchWorkTypes(
  siteId: number,
  groupId: number,
  keyword: string,
): Promise<Sourced<WorkType[]>> {
  const params = `siteId=${siteId}&groupId=${groupId}&keyword=${encodeURIComponent(keyword)}`;
  return fetchWithFallback<WorkType[]>(
    `/v1/dlt/work-types?${params}`,
    `/v1/dlt/snapshots/work-types?${params}`,
    (body) => {
      const snapshot = body as { fetched_at: string; work_types: WorkType[] };
      return { data: snapshot.work_types, fetchedAt: snapshot.fetched_at };
    },
  );
}

export function fetchSlots(workTypeId: number, currentDate: string): Promise<Sourced<SlotDay[]>> {
  return fetchWithFallback<SlotDay[]>(
    `/v1/dlt/work-types/${workTypeId}/slots?currentDate=${encodeURIComponent(currentDate)}`,
    `/v1/dlt/snapshots/slots?workTypeId=${workTypeId}`,
    (body) => {
      const snapshot = body as { fetched_at: string; data: SlotDay[] };
      return { data: snapshot.data, fetchedAt: snapshot.fetched_at };
    },
  );
}

// The compare endpoint handles live/snapshot fallback per office server-side,
// so there is no client-side fallback path here.
export function fetchCompare(
  siteIds: number[],
  keyword: string,
  currentDate: string,
): Promise<CompareResponse> {
  const params = new URLSearchParams({
    siteIds: siteIds.join(","),
    keyword,
    currentDate,
  });
  return getJSON(`${API_BASE}/v1/dlt/compare?${params}`) as Promise<CompareResponse>;
}

// The map overlay is intentionally snapshot-only. A persistence error is
// handled independently by the map view so the base office map still renders.
export function fetchMapAvailability(
  keyword: string,
  currentDate: string,
): Promise<MapAvailabilityResponse> {
  const params = new URLSearchParams({ keyword, currentDate });
  return getJSON(
    `${API_BASE}/v1/dlt/map-availability?${params}`,
  ) as Promise<MapAvailabilityResponse>;
}

// Holidays are best-effort: no snapshot endpoint exists for them.
export async function fetchHolidays(workTypeId: number): Promise<Set<string>> {
  try {
    const holidays = (await getJSON(
      `${API_BASE}/v1/dlt/work-types/${workTypeId}/holidays`,
    )) as Holiday[];
    return new Set((holidays ?? []).map((holiday) => holiday.hol_date));
  } catch {
    return new Set();
  }
}
