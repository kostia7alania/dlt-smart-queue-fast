import type { Metadata } from "next";

import {
  FOREIGNER_GUIDE_PATH,
  PRODUCT_REVIEWED_ON,
  SITE_NAME,
  SITE_URL,
} from "@/shared/config/site";
import { serializeJsonLd } from "@/shared/lib/json-ld";
import { DLTForeignerGuidePage } from "@/views/dlt-foreigner-guide";

const title = "DLT Smart Queue for Foreigners: An Availability Guide";
const description =
  "Understand where independent DLT appointment discovery helps, what can vary by office, and when to continue to the official Smart Queue.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: FOREIGNER_GUIDE_PATH,
  },
};

const guideStructuredData = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  dateModified: PRODUCT_REVIEWED_ON,
  mainEntityOfPage: `${SITE_URL}${FOREIGNER_GUIDE_PATH}`,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  },
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from build-time constants and escapes opening angle brackets.
        dangerouslySetInnerHTML={{ __html: guideStructuredData }}
      />
      <DLTForeignerGuidePage />
    </>
  );
}
