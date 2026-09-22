import type { Metadata } from "next";

import {
  APPOINTMENTS_PATH,
  PUBLIC_SLOT_TOOLS_ENABLED,
  SITE_NAME,
  SITE_URL,
} from "@/shared/config/site";
import { serializeJsonLd } from "@/shared/lib/json-ld";
import { AppointmentsPage } from "@/views/appointments";

const description = PUBLIC_SLOT_TOOLS_ENABLED
  ? "Search observed Thai DLT driving-licence appointment availability by calendar, office comparison, map, and stored history."
  : "Choose a Thai driving-licence journey, find a DLT office, and continue to the official booking service.";

export const metadata: Metadata = {
  title: PUBLIC_SLOT_TOOLS_ENABLED
    ? "Thai Driving-Licence Appointment Availability"
    : "Find a DLT Office Before Booking",
  description,
  alternates: {
    canonical: APPOINTMENTS_PATH,
  },
};

const appointmentsStructuredData = serializeJsonLd({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `Thai driving-licence appointment availability | ${SITE_NAME}`,
  description,
  url: `${SITE_URL}${APPOINTMENTS_PATH}`,
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
        dangerouslySetInnerHTML={{ __html: appointmentsStructuredData }}
      />
      <AppointmentsPage />
    </>
  );
}
