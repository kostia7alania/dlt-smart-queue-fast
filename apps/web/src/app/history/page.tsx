import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryPage } from "@/views/history";

export const metadata: Metadata = {
  title: "Slot History | DLT Parser",
  description: "Inspect recent stored Thai DLT appointment availability observations.",
};

function HistoryFallback() {
  return (
    <main className="history-page history-page--fallback tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10">
      <p className="tw:mx-auto tw:max-w-6xl tw:text-sm tw:text-muted-foreground">
        Loading stored slot history...
      </p>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<HistoryFallback />}>
      <HistoryPage />
    </Suspense>
  );
}
