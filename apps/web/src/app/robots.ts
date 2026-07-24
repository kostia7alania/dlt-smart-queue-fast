import type { MetadataRoute } from "next";

const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const publicSiteConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  return {
    rules: {
      userAgent: "*",
      allow: publicSiteConfigured ? "/" : undefined,
      disallow: publicSiteConfigured ? undefined : "/",
    },
    sitemap: `${siteURL}/sitemap.xml`,
  };
}
