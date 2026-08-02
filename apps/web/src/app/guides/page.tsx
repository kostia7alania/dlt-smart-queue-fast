import type { Metadata } from "next";

import { AVAILABILITY_GUIDE_PATH, FOREIGNER_GUIDE_PATH, SITE_URL } from "@/shared/config/site";
import { breadcrumbList, itemList, serializeJsonLd } from "@/shared/lib/json-ld";
import { GuidesPage } from "@/views/guides";

export const metadata: Metadata = {
  title: "Thai DLT licence guides",
  description:
    "Guides that mark every statement as observed appointment data, a Department of Land Transport decision, or a dated third-party report.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Thai DLT licence guides",
    description:
      "Guides that mark every statement as observed appointment data, a Department of Land Transport decision, or a dated third-party report.",
    url: "/guides",
  },
};

const structuredData = [
  breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Guides", item: `${SITE_URL}/guides` },
  ]),
  itemList("Published guides", [
    {
      name: "How to read DLT availability",
      url: `${SITE_URL}${AVAILABILITY_GUIDE_PATH}`,
    },
    {
      name: "DLT Smart Queue for foreigners",
      url: `${SITE_URL}${FOREIGNER_GUIDE_PATH}`,
    },
  ]),
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
