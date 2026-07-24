import type { Metadata } from "next";
import { PlaygroundPage } from "@/views/playground";

export const metadata: Metadata = {
  title: "API Playground",
  description: "Inspect live and stored Thai DLT Smart Queue API responses.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <PlaygroundPage />;
}
