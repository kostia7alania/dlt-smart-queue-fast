import type { Metadata } from "next";
import { CalendarPage } from "@/views/calendar";

export const metadata: Metadata = {
  title: "Slot Calendar | DLT Parser",
  description: "Browse Thai DLT appointment availability by office and work option.",
};

export default function Page() {
  return <CalendarPage />;
}
