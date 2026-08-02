import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePage } from "@/views/compare";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: "Compare DLT Offices",
  description: "Compare Thai DLT appointment availability across offices side by side.",
  alternates: {
    canonical: "/compare",
  },
};

// useSearchParams (shareable ?siteIds= links) requires a Suspense boundary here.
export default function Page() {
  return (
    <div className="compare-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
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
      <PublicSiteFooter />
    </div>
  );
}
