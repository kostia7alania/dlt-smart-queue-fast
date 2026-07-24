import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPage } from "@/views/map";

export const metadata: Metadata = {
  title: "Thai DLT Office Map",
  description: "Thai DLT offices on a map with links to appointment calendars.",
  alternates: {
    canonical: "/map",
  },
};

export default function Page() {
  return (
    <Suspense>
      <MapPage />
    </Suspense>
  );
}
