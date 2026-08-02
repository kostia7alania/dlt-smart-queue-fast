import assert from "node:assert/strict";
import test from "node:test";

import {
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_GUIDE_REVIEWED_ON,
  AVAILABILITY_NOTICE,
  DISCOVERY_CAPABILITIES,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
} from "./site.ts";

test("public discovery routes are unique local paths", () => {
  const paths: string[] = [
    ...DISCOVERY_CAPABILITIES.map((capability) => capability.href),
    AVAILABILITY_GUIDE_PATH,
  ];

  assert.equal(new Set(paths).size, paths.length);
  assert.ok(paths.every((path) => path.startsWith("/") && !path.startsWith("//")));
  assert.ok(!paths.includes("/playground"));
  assert.equal(AVAILABILITY_GUIDE_PATH, "/guides/how-to-read-dlt-availability");
  assert.match(AVAILABILITY_GUIDE_REVIEWED_ON, /^\d{4}-\d{2}-\d{2}$/);
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
