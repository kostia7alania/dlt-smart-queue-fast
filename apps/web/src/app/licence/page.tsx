import type { Metadata } from "next";

import { JOURNEYS, LICENCE_PATH_SEGMENT } from "@/entities/guide";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, itemList, serializeJsonLd } from "@/shared/lib/json-ld";
import { LicenceIndexPage } from "@/views/licence";

export const metadata: Metadata = {
  title: "Thai driving licence: every question in one place",
  description:
    "First licence, renewal, conversion, replacement, tests, documents, and costs — each statement labelled as observed appointment data, a DLT decision, or a dated third-party report.",
  alternates: {
    canonical: `/${LICENCE_PATH_SEGMENT}`,
  },
};

const structuredData = [
  breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Licence questions", item: `${SITE_URL}/${LICENCE_PATH_SEGMENT}` },
  ]),
  itemList(
    "Thai driving licence journeys",
    JOURNEYS.map((journey) => ({
      name: journey.cardTitle,
      url: `${SITE_URL}/${LICENCE_PATH_SEGMENT}/${journey.slug}`,
    })),
  ),
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: committed content, escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <LicenceIndexPage />
    </>
  );
}
