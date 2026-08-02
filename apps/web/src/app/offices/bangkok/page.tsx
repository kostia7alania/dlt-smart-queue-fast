import type { Metadata } from "next";

import { BANGKOK_OFFICES_PATH, SITE_NAME, SITE_URL } from "@/shared/config/site";
import { serializeJsonLd } from "@/shared/lib/json-ld";
import { BangkokOfficesPage } from "@/views/bangkok-offices";
import { BANGKOK_OFFICES } from "@/views/bangkok-offices/model/bangkok-office-data";

const description =
  "Compare Bangkok's five DLT area offices by exact site ID, committed source name, approximate map anchor, and appointment-discovery links.";

export const metadata: Metadata = {
  title: "Bangkok DLT Offices",
  description,
  alternates: {
    canonical: BANGKOK_OFFICES_PATH,
  },
};

const bangkokOfficesStructuredData = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Bangkok DLT area offices | ${SITE_NAME}`,
  description,
  url: `${SITE_URL}${BANGKOK_OFFICES_PATH}`,
  numberOfItems: BANGKOK_OFFICES.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: BANGKOK_OFFICES.map((office, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: office.name,
    url: `${SITE_URL}${BANGKOK_OFFICES_PATH}#office-${office.siteId}`,
  })),
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from committed build-time data and escapes opening angle brackets.
        dangerouslySetInnerHTML={{ __html: bangkokOfficesStructuredData }}
      />
      <BangkokOfficesPage />
    </>
  );
}
