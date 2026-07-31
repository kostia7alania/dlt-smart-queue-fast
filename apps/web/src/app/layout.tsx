import type { Metadata } from "next";
import { PUBLIC_SITE_CONFIGURED, SITE_NAME, SITE_URL } from "@/shared/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Independent read-only explorer for Thai DLT appointment availability, office comparisons, maps, and stored history.",
  robots: PUBLIC_SITE_CONFIGURED ? { index: true, follow: true } : { index: false, follow: false },
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
