import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPage } from "@/views/map";

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
    <Suspense>
      <MapPage />
    </Suspense>
  );
}
