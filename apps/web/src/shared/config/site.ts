export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "Thai Queue Scout";

export const PUBLIC_SITE_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "http://localhost:3000";

export const OFFICIAL_DLT_BOOKING_URL = "https://gecc.dlt.go.th/dltsmartqueue/";

export const APPOINTMENTS_PATH = "/appointments";
export const AVAILABILITY_GUIDE_PATH = "/guides/how-to-read-dlt-availability";
export const BANGKOK_OFFICES_PATH = "/offices/bangkok";
export const FOREIGNER_GUIDE_PATH = "/guides/dlt-smart-queue-for-foreigners";
export const AVAILABILITY_GUIDE_REVIEWED_ON = "2026-08-02";
export const PRODUCT_REVIEWED_ON = "2026-07-31";

export const INDEPENDENCE_NOTICE =
  "Independent and not affiliated with Thailand's Department of Land Transport.";

export const PRIVACY_NOTICE =
  "Read-only discovery with no account, DLT credentials, or identity documents collected.";

export const AVAILABILITY_NOTICE =
  "Availability is informational and may change before you complete booking with DLT.";

export const DISCOVERY_CAPABILITIES = [
  {
    id: "calendar",
    number: "01",
    label: "Calendar",
    title: "Inspect one office",
    description:
      "See returned appointment days, rounds, source, and freshness for one work option.",
    href: "/calendar",
  },
  {
    id: "compare",
    number: "02",
    label: "Compare",
    title: "Check up to eight offices",
    description: "Put practical alternatives side by side and sort by the earliest observed day.",
    href: "/compare",
  },
  {
    id: "map",
    number: "03",
    label: "Map",
    title: "Explore another route",
    description:
      "Scan last-known availability geographically, with text and precision alternatives.",
    href: "/map",
  },
  {
    id: "history",
    number: "04",
    label: "History",
    title: "Check what changed",
    description:
      "Review stored observations without triggering another request to the DLT service.",
    href: "/history",
  },
] as const;

export type DiscoveryCapability = (typeof DISCOVERY_CAPABILITIES)[number];
