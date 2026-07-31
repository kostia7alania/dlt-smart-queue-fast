import assert from "node:assert/strict";
import test from "node:test";

import {
  AVAILABILITY_NOTICE,
  DISCOVERY_CAPABILITIES,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
} from "./site.ts";

test("public discovery routes are unique local paths", () => {
  const paths: string[] = DISCOVERY_CAPABILITIES.map((capability) => capability.href);

  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every((path) => path.startsWith("/") && !path.startsWith("//")));
  assert.ok(!paths.includes("/playground"));
});

test("official hand-off and trust notices preserve the public contract", () => {
  const officialURL = new URL(OFFICIAL_DLT_BOOKING_URL);

  assert.equal(officialURL.protocol, "https:");
  assert.equal(officialURL.hostname, "gecc.dlt.go.th");
  assert.match(INDEPENDENCE_NOTICE, /not affiliated/i);
  assert.match(PRIVACY_NOTICE, /no account/i);
  assert.match(PRIVACY_NOTICE, /credentials/i);
  assert.match(AVAILABILITY_NOTICE, /may change/i);
});
