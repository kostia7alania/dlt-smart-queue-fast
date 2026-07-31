import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GUIDES, guideBySlug } from "@/entities/guide";
import { SITE_URL } from "@/shared/config/site";
import { breadcrumbList, serializeJsonLd } from "@/shared/lib/structured-data";
import { GuidePage } from "@/views/guide";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();

  const structuredData = breadcrumbList([
    { name: "Home", item: `${SITE_URL}/` },
    { name: "Guides", item: `${SITE_URL}/guides` },
    { name: guide.title, item: `${SITE_URL}/guides/${guide.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is built from committed content and escaped by serializeJsonLd
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <GuidePage guide={guide} />
    </>
  );
}
