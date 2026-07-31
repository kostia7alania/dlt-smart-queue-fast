import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";
// The route table lives in shared/config so it can be unit tested against the
// published capability, city-hub, and guide registries
// (shared/config/static-routes.test.mts).
import { STATIC_ROUTES } from "@/shared/config/static-routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
