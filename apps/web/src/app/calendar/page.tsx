import type { Metadata } from "next";
import { Suspense } from "react";
import { PUBLIC_SLOT_TOOLS_ENABLED } from "@/shared/config/site";
import { BffRequiredPage } from "@/views/bff-required";
import { CalendarPage } from "@/views/calendar";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: PUBLIC_SLOT_TOOLS_ENABLED
    ? "DLT Appointment Calendar"
    : "Appointment Calendar Unavailable",
  description: PUBLIC_SLOT_TOOLS_ENABLED
    ? "Browse Thai DLT appointment availability by office and work option."
    : "The appointment calendar requires the full Thai Driving License backend.",
  alternates: {
    canonical: "/calendar",
  },
  robots: PUBLIC_SLOT_TOOLS_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: true },
};

// useSearchParams (deep links via ?siteId=) requires a Suspense boundary here.
export default function Page() {
  return (
    <div className="calendar-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      {PUBLIC_SLOT_TOOLS_ENABLED ? (
        <Suspense
          fallback={
            <main className="calendar-page__body calendar-page__body--loading tw:flex-1 tw:p-6 tw:md:p-10">
              <p className="tw:mx-auto tw:max-w-6xl tw:text-sm tw:text-muted-foreground">
                Loading the appointment calendar…
              </p>
            </main>
          }
        >
          <CalendarPage />
        </Suspense>
      ) : (
        <BffRequiredPage toolName="The appointment calendar" />
      )}
      <PublicSiteFooter />
    </div>
  );
}
