import assert from "node:assert/strict";
import test from "node:test";

import type { SlotHistoryEntry } from "../../../entities/dlt/model/types.ts";
import { summarizeHistoryChanges } from "./history-change.ts";

function entry(
  observationId: number,
  status: SlotHistoryEntry["status"],
  comparison: SlotHistoryEntry["comparison"],
  overrides: Partial<SlotHistoryEntry> = {},
): SlotHistoryEntry {
  return {
    observation_id: observationId,
    fetched_at: `2026-08-02T0${observationId}:00:00Z`,
    current_date: "2026-08-02",
    status,
    comparison,
    total_days: status === "no_slots" ? 0 : 1,
    available_days: status === "available" ? 1 : 0,
    ...overrides,
  };
}

test("empty and single-row windows have honest baselines", () => {
  assert.deepEqual(summarizeHistoryChanges([]), {
    comparableRunLength: 0,
    counts: { no_baseline: 0, unchanged: 0, changed: 0, not_comparable: 0 },
    latestChange: null,
  });

  const single = summarizeHistoryChanges([entry(1, "full", "no_baseline")]);
  assert.equal(single.comparableRunLength, 1);
  assert.equal(single.counts.no_baseline, 1);
  assert.equal(single.latestChange, null);
});

test("the newest comparable run stops at its first changed boundary", () => {
  const insight = summarizeHistoryChanges([
    entry(4, "available", "unchanged"),
    entry(3, "available", "changed", { previous_status: "full" }),
    entry(2, "full", "unchanged"),
    entry(1, "full", "no_baseline"),
  ]);

  assert.equal(insight.comparableRunLength, 2);
  assert.deepEqual(insight.counts, {
    no_baseline: 1,
    unchanged: 2,
    changed: 1,
    not_comparable: 0,
  });
  assert.deepEqual(insight.latestChange, {
    fromStatus: "full",
    toStatus: "available",
    olderObservedAt: "2026-08-02T02:00:00Z",
    newerObservedAt: "2026-08-02T03:00:00Z",
    currentDate: "2026-08-02",
  });
});

test("an incomparable boundary stops the newest run but does not invent a change", () => {
  const insight = summarizeHistoryChanges([
    entry(3, "available", "not_comparable", { current_date: "2026-08-02" }),
    entry(2, "full", "no_baseline", { current_date: "2026-08-01" }),
  ]);

  assert.equal(insight.comparableRunLength, 1);
  assert.equal(insight.counts.not_comparable, 1);
  assert.equal(insight.latestChange, null);
});
