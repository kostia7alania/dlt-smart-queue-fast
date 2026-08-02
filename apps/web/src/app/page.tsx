import type { Metadata } from "next";
import { LICENCE_PATH, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/shared/config/site";
import { serializeJsonLd } from "@/shared/lib/json-ld";
import { HomePage } from "@/views/home";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
  },
  alternates: {
    canonical: "/",
  },
  description:
    "Work out which Thai driving licence applies to you, what only DLT can confirm, and where appointments are actually open — then book on the official service.",
};

const websiteStructuredData = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: SITE_TAGLINE,
  // The licence cluster is the entry point a search visitor should land on.
  mainEntity: {
    "@type": "WebPage",
    name: "Thai driving licence questions",
    url: `${SITE_URL}${LICENCE_PATH}`,
  },
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from build-time configuration and escapes opening angle brackets.
        dangerouslySetInnerHTML={{ __html: websiteStructuredData }}
      />
      <HomePage />
    </>
  );
}
