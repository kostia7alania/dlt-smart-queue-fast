import type { MetadataRoute } from "next";

const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const dynamic = "force-static";

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/map", changeFrequency: "daily", priority: 0.8 },
  { path: "/compare", changeFrequency: "daily", priority: 0.8 },
  { path: "/history", changeFrequency: "daily", priority: 0.7 },
  { path: "/playground", changeFrequency: "monthly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteURL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
