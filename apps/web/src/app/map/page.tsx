import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPage } from "@/views/map";

export const metadata: Metadata = {
  title: "Office Map | DLT Parser",
  description: "Thai DLT offices on a map with links to appointment calendars.",
};

export default function Page() {
  return (
    <Suspense>
      <MapPage />
    </Suspense>
  );
}
