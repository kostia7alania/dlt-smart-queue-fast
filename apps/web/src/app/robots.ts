import type { MetadataRoute } from "next";
import { PUBLIC_SITE_CONFIGURED, SITE_URL } from "@/shared/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: PUBLIC_SITE_CONFIGURED ? "/" : undefined,
      disallow: PUBLIC_SITE_CONFIGURED ? "/playground" : "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
