import type { Metadata } from "next";

import {
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_GUIDE_REVIEWED_ON,
  SITE_NAME,
  SITE_URL,
} from "@/shared/config/site";
import { serializeJsonLd } from "@/shared/lib/json-ld";
import { AvailabilityEvidenceGuidePage } from "@/views/availability-evidence-guide";

const title = "How to Read DLT Availability Evidence";
const description = `Understand live and stored DLT data, five availability states, map precision, freshness, and what ${SITE_NAME} results cannot promise.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: AVAILABILITY_GUIDE_PATH,
  },
};

const guideStructuredData = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  dateModified: AVAILABILITY_GUIDE_REVIEWED_ON,
  mainEntityOfPage: `${SITE_URL}${AVAILABILITY_GUIDE_PATH}`,
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
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from visible build-time constants and escapes opening angle brackets.
        dangerouslySetInnerHTML={{ __html: guideStructuredData }}
      />
      <AvailabilityEvidenceGuidePage />
    </>
  );
}
