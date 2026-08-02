import assert from "node:assert/strict";
import test from "node:test";

import {
  AVAILABILITY_STATES,
  EVIDENCE_SOURCES,
  EVIDENCE_WORKFLOW,
  MAP_PRECISIONS,
  TOOL_EVIDENCE,
} from "./availability-evidence.ts";

test("guide keeps the exact source, status, precision, and tool keys", () => {
  assert.deepEqual(
    EVIDENCE_SOURCES.map((source) => source.key),
    ["live", "stored"],
  );
  assert.deepEqual(
    AVAILABILITY_STATES.map((state) => state.key),
    ["available", "full", "no_slots", "not_offered", "unknown"],
  );
  assert.deepEqual(
    MAP_PRECISIONS.map((precision) => precision.key),
    ["office", "district", "province"],
  );
  assert.deepEqual(
    TOOL_EVIDENCE.map((tool) => tool.key),
    ["calendar", "compare", "map", "history"],
  );
});

test("status definitions preserve the backend predicates and interpretation guardrails", () => {
  const available = AVAILABILITY_STATES.find((state) => state.key === "available");
  const full = AVAILABILITY_STATES.find((state) => state.key === "full");
  const noSlots = AVAILABILITY_STATES.find((state) => state.key === "no_slots");
  const notOffered = AVAILABILITY_STATES.find((state) => state.key === "not_offered");
  const unknown = AVAILABILITY_STATES.find((state) => state.key === "unknown");

  assert.match(available?.condition ?? "", /different from เต็ม/);
  assert.match(full?.condition ?? "", /every exact DLT message is เต็ม/);
  assert.match(noSlots?.condition ?? "", /no days in scope/);
  assert.match(notOffered?.condition ?? "", /work-type lookup is empty/);
  assert.match(unknown?.condition ?? "", /no usable stored slot payload/);

  for (const state of AVAILABILITY_STATES) {
    assert.ok(state.safeConclusion.length > 30);
    assert.ok(state.unsafeConclusion.length > 20);
  }
});

test("tool behaviour makes stored-only reads and live boundaries explicit", () => {
  const calendar = TOOL_EVIDENCE.find((tool) => tool.key === "calendar");
  const compare = TOOL_EVIDENCE.find((tool) => tool.key === "compare");
  const map = TOOL_EVIDENCE.find((tool) => tool.key === "map");
  const history = TOOL_EVIDENCE.find((tool) => tool.key === "history");

  assert.match(calendar?.behaviour ?? "", /stored fallback/);
  assert.match(compare?.behaviour ?? "", /ten minutes/);
  assert.match(map?.behaviour ?? "", /stored-only/);
  assert.match(history?.behaviour ?? "", /only from PostgreSQL/);
  assert.equal(new Set(TOOL_EVIDENCE.map((tool) => tool.href)).size, TOOL_EVIDENCE.length);
});

test("anchors and workflow steps remain unique and complete", () => {
  assert.equal(
    new Set(AVAILABILITY_STATES.map((state) => state.anchor)).size,
    AVAILABILITY_STATES.length,
  );
  assert.equal(EVIDENCE_WORKFLOW.length, 5);
  assert.equal(EVIDENCE_WORKFLOW.at(-1)?.title, "Confirm with DLT");
});
