import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { CITY_HUBS } from "../../entities/dlt/model/office-directory.ts";
// Import the two content files directly: the registry module re-exports them
// with extensionless specifiers, which Next resolves but node --test does not.
import { LICENCE_JOURNEYS } from "../../entities/guide/model/journeys-licence.ts";
import { PROCESS_JOURNEYS } from "../../entities/guide/model/journeys-process.ts";
import { STATIC_ROUTES } from "./static-routes.ts";

const paths = STATIC_ROUTES.map((route) => route.path);

test("routes are unique, rooted, and never end in a slash", () => {
  assert.equal(new Set(paths).size, paths.length);

  for (const path of paths) {
    if (path === "") continue;
    assert.match(path, /^\/[a-z0-9-/]*[a-z0-9]$/, path);
  }
});

test("every published city hub has a sitemap entry", () => {
  for (const hub of CITY_HUBS) {
    assert.ok(paths.includes(`/offices/${hub.slug}`), `missing /offices/${hub.slug}`);
  }
  assert.ok(paths.includes("/offices"));
});

test("no sitemap entry points at content that does not exist", () => {
  const hubSlugs = new Set(CITY_HUBS.map((hub) => hub.slug));
  const journeySlugs = new Set(
    [...LICENCE_JOURNEYS, ...PROCESS_JOURNEYS].map((journey) => journey.slug),
  );
  const appDir = new URL("../../app/", import.meta.url);

  for (const path of paths) {
    // Per-office pages are generated from the committed directory by
    // app/offices/site/[siteId]; only their shape is checked here.
    if (/^\/offices\/site\/\d+$/.test(path)) continue;

    // A hub or guide slug must come from its registry, since one file serves all.
    const hub = path.match(/^\/offices\/(.+)$/)?.[1];
    // A path with its own page file wins over the registry-driven hub route.
    if (hub && !existsSync(new URL(`.${path}/page.tsx`, appDir))) {
      assert.ok(hubSlugs.has(hub), `sitemap lists unknown hub ${hub}`);
      continue;
    }

    const journey = path.match(/^\/licence\/(.+)$/)?.[1];
    if (journey) {
      assert.ok(journeySlugs.has(journey), `sitemap lists unknown journey ${journey}`);
      continue;
    }

    // Anything else must have its own page file, including routes owned by other
    // features (for example /appointments and the foreigner guide).
    const page = new URL(`.${path}/page.tsx`, appDir);
    assert.ok(existsSync(page), `sitemap lists ${path || "/"} but ${page.pathname} is missing`);
  }
});

test("the interactive views stay indexable and the playground stays out", () => {
  for (const path of ["", "/calendar", "/compare", "/map", "/history"]) {
    assert.ok(paths.includes(path), `missing ${path}`);
  }
  assert.equal(paths.includes("/playground"), false);
});

test("priorities and change frequencies are valid sitemap values", () => {
  const allowed = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]);

  for (const route of STATIC_ROUTES) {
    assert.ok(route.priority > 0 && route.priority <= 1, `${route.path}: ${route.priority}`);
    assert.ok(allowed.has(route.changeFrequency), `${route.path}: ${route.changeFrequency}`);
  }
});
