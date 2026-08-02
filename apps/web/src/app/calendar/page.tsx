import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarPage } from "@/views/calendar";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: "DLT Appointment Calendar",
  description: "Browse Thai DLT appointment availability by office and work option.",
  alternates: {
    canonical: "/calendar",
  },
};

// useSearchParams (deep links via ?siteId=) requires a Suspense boundary here.
export default function Page() {
  return (
    <div className="calendar-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
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
      <PublicSiteFooter />
    </div>
  );
}
