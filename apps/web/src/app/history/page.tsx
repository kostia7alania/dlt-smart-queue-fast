import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryPage } from "@/views/history";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: "DLT Slot History",
  description:
    "Inspect recent stored Thai DLT appointment observations and comparable status changes.",
  alternates: {
    canonical: "/history",
  },
};

export default function Page() {
  return (
    <div className="history-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      <Suspense
        fallback={
          <main className="history-page__body history-page__body--loading tw:flex-1 tw:p-6 tw:md:p-10">
            <p className="tw:mx-auto tw:max-w-6xl tw:text-sm tw:text-muted-foreground">
              Loading stored slot history…
            </p>
          </main>
        }
      >
        <HistoryPage />
      </Suspense>
      <PublicSiteFooter />
    </div>
  );
}
