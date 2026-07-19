import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePage } from "@/views/compare";

export const metadata: Metadata = {
  title: "Compare Offices | DLT Parser",
  description: "Compare Thai DLT appointment availability across offices side by side.",
};

// useSearchParams (shareable ?siteIds= links) requires a Suspense boundary here.
export default function Page() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  );
}
