import type { MetadataRoute } from "next";
import { PUBLIC_SLOT_TOOLS_ENABLED, SITE_URL } from "@/shared/config/site";
// The route table lives in shared/config so it can be unit tested against the
// published capability, city-hub, and guide registries
// (shared/config/static-routes.test.mts).
import { STATIC_ROUTES } from "@/shared/config/static-routes";

export const dynamic = "force-static";

const FULL_BFF_ONLY_PATHS = new Set(["/calendar", "/compare", "/history"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.filter(
    (route) => PUBLIC_SLOT_TOOLS_ENABLED || !FULL_BFF_ONLY_PATHS.has(route.path),
  ).map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
