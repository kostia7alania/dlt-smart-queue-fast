import type { Metadata } from "next";
import "./globals.css";

const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  applicationName: "DLT Smart Queue Fast",
  title: {
    default: "DLT Smart Queue Fast",
    template: "%s | DLT Smart Queue Fast",
  },
  description:
    "Unofficial read-only explorer for Thai DLT offices, appointment availability, maps, comparisons, and slot history.",
  alternates: {
    canonical: "/",
  },
  robots: process.env.NEXT_PUBLIC_SITE_URL
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="tw:h-full tw:antialiased">
      <body className="tw:flex tw:min-h-full tw:flex-col">{children}</body>
    </html>
  );
}
