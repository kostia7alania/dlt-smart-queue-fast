import assert from "node:assert/strict";
import test from "node:test";

import {
  changedOfficeIDs,
  parseOfficePayload,
  refreshAllowed,
  type StoredOfficeSnapshot,
} from "./office-snapshot.ts";

test("office payload validation preserves null and exact upstream strings", () => {
  const offices = parseOfficePayload([
    { app_open: 1, sit_id: 7, sit_name: " Office spelling " },
    { app_open: 0, sit_id: 216, sit_name: null },
  ]);

  assert.deepEqual(offices, [
    { app_open: 1, sit_id: 7, sit_name: " Office spelling " },
    { app_open: 0, sit_id: 216, sit_name: null },
  ]);
  assert.throws(
    () =>
      parseOfficePayload([
        { app_open: 1, sit_id: 7, sit_name: "first" },
        { app_open: 0, sit_id: 7, sit_name: "duplicate" },
      ]),
    /repeats sit_id 7/,
  );
});

test("change detection covers additions, removals and field changes", () => {
  assert.deepEqual(
    changedOfficeIDs(
      [
        { app_open: 1, sit_id: 1, sit_name: "same" },
        { app_open: 0, sit_id: 2, sit_name: "removed" },
        { app_open: 0, sit_id: 3, sit_name: "changed" },
      ],
      [
        { app_open: 1, sit_id: 1, sit_name: "same" },
        { app_open: 1, sit_id: 3, sit_name: "changed" },
        { app_open: 0, sit_id: 4, sit_name: null },
      ],
    ),
    [2, 3, 4],
  );
});

test("manual refresh cooldown is based on the last attempt, including failures", () => {
  const snapshot: StoredOfficeSnapshot = {
    schema_version: 1,
    fetched_at: "2026-09-21T10:00:00.000Z",
    last_attempt_at: "2026-09-21T11:00:00.000Z",
    source: "upstream",
    refresh_status: "failed",
    changed_office_ids: [],
    offices: [{ app_open: 1, sit_id: 1, sit_name: "Office" }],
  };

  assert.equal(refreshAllowed(snapshot, new Date("2026-09-21T11:29:59.999Z"), 1_800), false);
  assert.equal(refreshAllowed(snapshot, new Date("2026-09-21T11:30:00.000Z"), 1_800), true);
});
