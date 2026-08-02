import type { Metadata } from "next";

import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, serializeJsonLd } from "@/shared/lib/json-ld";
import { OfficeIndexPage } from "@/views/office-index";

// The literal "all" segment sits beside the dynamic /offices/[city] hub route.
// Next resolves the literal segment first, and no hub slug is "all", so both
// routes keep generating their own pages.

const title = "Every Thai DLT office with a page";
const description =
  "An A-to-Z index of every land transport office that has a page here, named exactly as the DLT appointment list returns it, with its site ID and whether the captured list had it open for appointments.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/offices/all",
  },
  openGraph: {
    title,
    description,
    url: "/offices/all",
  },
};

const structuredData = breadcrumbList([
  { name: "Home", item: `${SITE_URL}/` },
  { name: "Offices by area", item: `${SITE_URL}/offices` },
  { name: "Every office with a page", item: `${SITE_URL}/offices/all` },
]);

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from committed content and escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <OfficeIndexPage />
    </>
  );
}
