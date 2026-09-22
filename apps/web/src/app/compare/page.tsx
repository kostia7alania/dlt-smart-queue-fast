import type { Metadata } from "next";
import { Suspense } from "react";
import { PUBLIC_SLOT_TOOLS_ENABLED } from "@/shared/config/site";
import { BffRequiredPage } from "@/views/bff-required";
import { ComparePage } from "@/views/compare";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: PUBLIC_SLOT_TOOLS_ENABLED ? "Compare DLT Offices" : "Office Comparison Unavailable",
  description: PUBLIC_SLOT_TOOLS_ENABLED
    ? "Compare Thai DLT appointment availability across offices side by side."
    : "Appointment comparison requires the full Thai Driving License backend.",
  alternates: {
    canonical: "/compare",
  },
  robots: PUBLIC_SLOT_TOOLS_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: true },
};

// useSearchParams (shareable ?siteIds= links) requires a Suspense boundary here.
export default function Page() {
  return (
    <div className="compare-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      {PUBLIC_SLOT_TOOLS_ENABLED ? (
        <Suspense
          fallback={
            <main className="compare-page__body compare-page__body--loading tw:flex-1 tw:p-6 tw:md:p-10">
              <p className="tw:mx-auto tw:max-w-6xl tw:text-sm tw:text-muted-foreground">
                Loading the office comparison…
              </p>
            </main>
          }
        >
          <ComparePage />
        </Suspense>
      ) : (
        <BffRequiredPage toolName="Office comparison" />
      )}
      <PublicSiteFooter />
    </div>
  );
}
