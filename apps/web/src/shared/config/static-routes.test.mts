import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

import { CITY_HUBS } from "../../entities/dlt/model/office-directory.ts";
import { GUIDES } from "../../entities/guide/model/guides.ts";
import { JOURNEYS } from "../../entities/guide/model/journeys.ts";
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

test("every published guide has a sitemap entry", () => {
  for (const guide of GUIDES) {
    assert.ok(paths.includes(`/guides/${guide.slug}`), `missing /guides/${guide.slug}`);
  }
  assert.ok(paths.includes("/guides"));
});

test("no sitemap entry points at content that does not exist", () => {
  const hubSlugs = new Set(CITY_HUBS.map((hub) => hub.slug));
  const guideSlugs = new Set(GUIDES.map((guide) => guide.slug));
  const journeySlugs = new Set(JOURNEYS.map((journey) => journey.slug));
  const appDir = new URL("../../app/", import.meta.url);

  for (const path of paths) {
    // Per-office pages are generated from the committed directory by
    // app/offices/site/[siteId]; only their shape is checked here.
    if (/^\/offices\/site\/\d+$/.test(path)) continue;

    // A hub or guide slug must come from its registry, since one file serves all.
    const hub = path.match(/^\/offices\/(.+)$/)?.[1];
    if (hub) {
      assert.ok(hubSlugs.has(hub), `sitemap lists unknown hub ${hub}`);
      continue;
    }

    const journey = path.match(/^\/licence\/(.+)$/)?.[1];
    if (journey) {
      assert.ok(journeySlugs.has(journey), `sitemap lists unknown journey ${journey}`);
      continue;
    }

    const guide = path.match(/^\/guides\/(.+)$/)?.[1];
    if (guide && guideSlugs.has(guide)) continue;

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
