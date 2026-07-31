import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/config/site";

export const dynamic = "force-static";

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/appointments", changeFrequency: "daily", priority: 0.9 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/map", changeFrequency: "daily", priority: 0.8 },
  { path: "/compare", changeFrequency: "daily", priority: 0.8 },
  { path: "/history", changeFrequency: "daily", priority: 0.7 },
  {
    path: "/guides/dlt-smart-queue-for-foreigners",
    changeFrequency: "monthly",
    priority: 0.7,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
