import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  cityHubForSiteID,
  type DirectoryOffice,
  directoryOfficeById,
  hasOfficeDetailPage,
  officeDetailPages,
  officeDetailPath,
  officeNameOrNull,
} from "@/entities/dlt";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, serializeJsonLd } from "@/shared/lib/json-ld";
import { OfficeDetailPage } from "@/views/office-detail";

// The static "site" segment sits beside the dynamic /offices/[city] hub route.
// Next resolves the literal segment first, and no hub slug is "site", so both
// routes keep generating their own pages.

type PageProps = {
  params: Promise<{ siteId: string }>;
};

export function generateStaticParams() {
  return officeDetailPages.map((office) => ({ siteId: String(office.sit_id) }));
}

/** Only offices the directory can describe honestly resolve to a page. */
function officeFor(siteId: string): DirectoryOffice | undefined {
  const parsed = Number(siteId);
  if (!Number.isInteger(parsed) || parsed <= 0) return undefined;

  const office = directoryOfficeById.get(parsed);
  return office && hasOfficeDetailPage(office) ? office : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { siteId } = await params;
  const office = officeFor(siteId);
  if (!office) return {};

  const name = officeNameOrNull(office) ?? `Site ID ${office.sit_id}`;
  const title = `${name} — appointment availability`;
  const description = `What the captured DLT appointment list holds for ${name} (site ID ${office.sit_id}): the appointment-open flag with its capture date, how precisely we can place it, and links into the calendar, map, history, and comparison views.`;
  const path = officeDetailPath(office.sit_id);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { siteId } = await params;
  const office = officeFor(siteId);
  if (!office) notFound();

  const name = officeNameOrNull(office) ?? `Site ID ${office.sit_id}`;
  const hub = cityHubForSiteID(office.sit_id);

  const structuredData = breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Offices by area", item: `${SITE_URL}/offices` },
    ...(hub ? [{ name: hub.label, item: `${SITE_URL}/offices/${hub.slug}` }] : []),
    { name, item: `${SITE_URL}${officeDetailPath(office.sit_id)}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from committed content and escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <OfficeDetailPage office={office} hub={hub} />
    </>
  );
}
