import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPage } from "@/views/map";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export const metadata: Metadata = {
  title: "Thai DLT Office Map",
  description:
    "Filter Thai DLT offices by five last-known stored availability states, with map and text views.",
  alternates: {
    canonical: "/map",
  },
};

export default function Page() {
  return (
    <div className="map-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      <Suspense
        fallback={
          <main className="map-page__body map-page__body--loading tw:flex-1 tw:p-6 tw:md:p-10">
            <p className="tw:mx-auto tw:max-w-6xl tw:text-sm tw:text-muted-foreground">
              Loading the office map…
            </p>
          </main>
        }
      >
        <MapPage />
      </Suspense>
      <PublicSiteFooter />
    </div>
  );
}
