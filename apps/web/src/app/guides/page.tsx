import type { Metadata } from "next";

import { GUIDES } from "@/entities/guide";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, itemList, serializeJsonLd } from "@/shared/lib/json-ld";
import { GuidesPage } from "@/views/guides";

export const metadata: Metadata = {
  title: "Thai DLT licence guides",
  description:
    "Guides that mark every statement as observed appointment data, a Department of Land Transport decision, or a dated third-party report.",
  alternates: {
    canonical: "/guides",
  },
};

const structuredData = [
  breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Guides", item: `${SITE_URL}/guides` },
  ]),
  itemList(
    "Published guides",
    GUIDES.map((guide) => ({ name: guide.title, url: `${SITE_URL}/guides/${guide.slug}` })),
  ),
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from committed content and escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <GuidesPage />
    </>
  );
}
