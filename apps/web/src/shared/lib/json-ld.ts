export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export type BreadcrumbStep = {
  name: string;
  /** Absolute URL. */
  item: string;
};

export function breadcrumbList(steps: readonly BreadcrumbStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: step.item,
    })),
  };
}

export type ItemListEntry = {
  name: string;
  url?: string;
};

/** Only entries that are actually rendered on the page belong here. */
export function itemList(name: string, entries: readonly ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      ...(entry.url ? { url: entry.url } : {}),
    })),
  };
}
