import type { SlotHistoryComparison, SlotHistoryEntry, SlotHistoryStatus } from "@/entities/dlt";

export type HistoryChange = {
  fromStatus: SlotHistoryStatus;
  toStatus: SlotHistoryStatus;
  olderObservedAt: string;
  newerObservedAt: string;
  currentDate: string;
};

export type HistoryChangeInsight = {
  comparableRunLength: number;
  counts: Record<SlotHistoryComparison, number>;
  latestChange: HistoryChange | null;
};

const EMPTY_COUNTS: Record<SlotHistoryComparison, number> = {
  no_baseline: 0,
  unchanged: 0,
  changed: 0,
  not_comparable: 0,
};

export function summarizeHistoryChanges(
  snapshots: readonly SlotHistoryEntry[],
): HistoryChangeInsight {
  const counts = { ...EMPTY_COUNTS };
  for (const snapshot of snapshots) counts[snapshot.comparison]++;

  let comparableRunLength = snapshots.length > 0 ? 1 : 0;
  for (let index = 0; index < snapshots.length - 1; index++) {
    if (snapshots[index].comparison !== "unchanged") break;
    comparableRunLength++;
  }

  let latestChange: HistoryChange | null = null;
  for (let index = 0; index < snapshots.length - 1; index++) {
    const newer = snapshots[index];
    const older = snapshots[index + 1];
    if (newer.comparison !== "changed") continue;

    latestChange = {
      fromStatus: newer.previous_status ?? older.status,
      toStatus: newer.status,
      olderObservedAt: older.fetched_at,
      newerObservedAt: newer.fetched_at,
      currentDate: newer.current_date,
    };
    break;
  }

  return { comparableRunLength, counts, latestChange };
}
