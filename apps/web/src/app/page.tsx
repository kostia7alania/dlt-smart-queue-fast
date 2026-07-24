import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/shared/config/site";
import { HomePage } from "@/views/home";

export const metadata: Metadata = {
  title: {
    absolute: SITE_NAME,
  },
  alternates: {
    canonical: "/",
  },
};

const websiteStructuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
}).replaceAll("<", "\\u003c");

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
