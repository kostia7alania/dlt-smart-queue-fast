import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  CITY_HUBS,
  cityHubBySlug,
  cityHubOffices,
  hasBespokeRoute,
  officeNameOrNull,
} from "@/entities/dlt";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, itemList, serializeJsonLd } from "@/shared/lib/json-ld";
import { OfficeCityHubPage } from "@/views/office-city-hub";

type PageProps = {
  params: Promise<{ city: string }>;
};

export function generateStaticParams() {
  // Slugs with a bespoke static route are skipped so the export does not write
  // the same path twice; they remain in the registry for links and counts.
  return CITY_HUBS.filter((hub) => !hasBespokeRoute(hub)).map((hub) => ({ city: hub.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city } = await params;
  const hub = cityHubBySlug(city);
  if (!hub) return {};

  return {
    title: hub.title,
    description: hub.metaDescription,
    alternates: {
      canonical: `/offices/${hub.slug}`,
    },
    openGraph: {
      title: hub.title,
      description: hub.metaDescription,
      url: `/offices/${hub.slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { city } = await params;
  const hub = cityHubBySlug(city);
  if (!hub) notFound();

  const structuredData = [
    breadcrumbList([
      { name: "Home", item: `${SITE_URL}/` },
      { name: "Offices by area", item: `${SITE_URL}/offices` },
      { name: hub.label, item: `${SITE_URL}/offices/${hub.slug}` },
    ]),
    // Only the offices this page actually renders, named exactly as upstream does.
    itemList(
      hub.title,
      cityHubOffices(hub).map((office) => ({
        name: officeNameOrNull(office) ?? `Site ID ${office.sit_id}`,
      })),
    ),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from committed content and escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <OfficeCityHubPage hub={hub} />
    </>
  );
}
