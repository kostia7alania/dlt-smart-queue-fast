import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JOURNEYS, journeyBySlug, LICENCE_PATH_SEGMENT } from "@/entities/guide";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, serializeJsonLd } from "@/shared/lib/json-ld";
import { LicenceJourneyPage } from "@/views/licence-journey";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return JOURNEYS.map((journey) => ({ slug: journey.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = journeyBySlug(slug);
  if (!journey) return {};

  return {
    title: journey.title,
    description: journey.metaDescription,
    alternates: {
      canonical: `/${LICENCE_PATH_SEGMENT}/${journey.slug}`,
    },
    openGraph: {
      type: "article",
      title: journey.title,
      description: journey.metaDescription,
      url: `/${LICENCE_PATH_SEGMENT}/${journey.slug}`,
      modifiedTime: journey.updatedOn,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const journey = journeyBySlug(slug);
  if (!journey) notFound();

  const structuredData = breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Licence questions", item: `${SITE_URL}/${LICENCE_PATH_SEGMENT}` },
    { name: journey.cardTitle, item: `${SITE_URL}/${LICENCE_PATH_SEGMENT}/${journey.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: committed content, escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <LicenceJourneyPage journey={journey} />
    </>
  );
}
