import type { Metadata } from "next";
import { Suspense } from "react";
import { CalendarPage } from "@/views/calendar";

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
    <Suspense>
      <CalendarPage />
    </Suspense>
  );
}
