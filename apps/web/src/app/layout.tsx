import type { Metadata } from "next";
import { PUBLIC_SITE_CONFIGURED, SITE_NAME, SITE_URL } from "@/shared/config/site";
import "./globals.css";

const SHARE_DESCRIPTION =
  "Independent read-only explorer for Thai DLT appointment availability, office comparisons, maps, and stored history.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SHARE_DESCRIPTION,
  robots: PUBLIC_SITE_CONFIGURED ? { index: true, follow: true } : { index: false, follow: false },
  // Sharing defaults. No image is declared because none exists yet: a shared
  // link should show the real site name and description, not a placeholder.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: `${SITE_URL}/`,
    title: SITE_NAME,
    description: SHARE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SHARE_DESCRIPTION,
  },
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
