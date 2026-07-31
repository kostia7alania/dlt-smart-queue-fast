import type { Metadata } from "next";

import { CITY_HUBS } from "@/entities/dlt";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, itemList, serializeJsonLd } from "@/shared/lib/json-ld";
import { OfficesPage } from "@/views/offices";

export const metadata: Metadata = {
  title: "Thai DLT offices by area",
  description:
    "Land transport offices in the Thai DLT appointment list, grouped by area, with the appointment-open flag as captured and links into availability tools.",
  alternates: {
    canonical: "/offices",
  },
};

const structuredData = [
  breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Offices by area", item: `${SITE_URL}/offices` },
  ]),
  itemList(
    "Published DLT office areas",
    CITY_HUBS.map((hub) => ({ name: hub.label, url: `${SITE_URL}/offices/${hub.slug}` })),
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
      <OfficesPage />
    </>
  );
}
