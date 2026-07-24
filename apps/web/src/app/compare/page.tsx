import type { Metadata } from "next";
import { Suspense } from "react";
import { ComparePage } from "@/views/compare";

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
    <Suspense>
      <ComparePage />
    </Suspense>
  );
}
