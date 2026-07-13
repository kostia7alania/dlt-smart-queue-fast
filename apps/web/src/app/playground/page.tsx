import type { Metadata } from "next";
import { PlaygroundPage } from "@/views/playground";

export const metadata: Metadata = {
  title: "API Playground | DLT Parser",
  description: "Inspect live and stored Thai DLT Smart Queue API responses.",
};

export default function Page() {
  return <PlaygroundPage />;
}
