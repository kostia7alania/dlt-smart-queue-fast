import type { Metadata } from "next";
import { Suspense } from "react";
import { PUBLIC_SLOT_TOOLS_ENABLED } from "@/shared/config/site";
import { BffRequiredPage } from "@/views/bff-required";
import { HistoryPage } from "@/views/history";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: PUBLIC_SLOT_TOOLS_ENABLED ? "DLT Slot History" : "Slot History Unavailable",
  description: PUBLIC_SLOT_TOOLS_ENABLED
    ? "Inspect recent stored Thai DLT appointment observations and comparable status changes."
    : "Stored slot history requires the full Thai Driving License backend.",
  alternates: {
    canonical: "/history",
  },
  robots: PUBLIC_SLOT_TOOLS_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: true },
};

export default function Page() {
  return (
    <div className="history-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      {PUBLIC_SLOT_TOOLS_ENABLED ? (
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
      ) : (
        <BffRequiredPage toolName="Stored slot history" />
      )}
      <PublicSiteFooter />
    </div>
  );
}
