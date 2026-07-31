import assert from "node:assert/strict";
import test from "node:test";

import { serializeJsonLd } from "./json-ld.ts";

test("JSON-LD serialization escapes opening angle brackets", () => {
  const serialized = serializeJsonLd({ name: "Thai <script>alert(1)</script>" });

  assert.ok(!serialized.includes("<"));
  assert.equal(JSON.parse(serialized).name, "Thai <script>alert(1)</script>");
});
