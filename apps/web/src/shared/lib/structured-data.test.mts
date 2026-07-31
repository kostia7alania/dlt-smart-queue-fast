import assert from "node:assert/strict";
import test from "node:test";

import { breadcrumbList, itemList, serializeJsonLd } from "./structured-data.ts";

test("serialization escapes opening angle brackets", () => {
  const payload = { name: "</script><img src=x onerror=alert(1)>" };
  const serialized = serializeJsonLd(payload);

  assert.ok(!serialized.includes("<"), serialized);
  assert.ok(serialized.includes("\\u003c/script"));
  assert.deepEqual(JSON.parse(serialized), payload);
});

test("breadcrumbs are positioned from one in the given order", () => {
  const payload = breadcrumbList([
    { name: "Home", item: "https://example.com/" },
    { name: "Offices", item: "https://example.com/offices" },
  ]);

  assert.equal(payload["@type"], "BreadcrumbList");
  assert.deepEqual(
    payload.itemListElement.map((entry) => [entry.position, entry.name, entry.item]),
    [
      [1, "Home", "https://example.com/"],
      [2, "Offices", "https://example.com/offices"],
    ],
  );
});

test("item lists report the rendered count and omit missing URLs", () => {
  const payload = itemList("Offices", [
    { name: "First", url: "https://example.com/1" },
    { name: "Second" },
  ]);

  assert.equal(payload.numberOfItems, 2);
  assert.equal(payload.itemListElement[0].url, "https://example.com/1");
  assert.equal("url" in payload.itemListElement[1], false);
});
