// JSON-LD helpers for the statically exported content routes.
//
// Next's own guidance is to render structured data as a <script> tag and to
// replace "<" with its unicode escape after JSON.stringify, because
// JSON.stringify does not sanitize HTML (node_modules/next/dist/docs/01-app/
// 02-guides/json-ld.md). Every payload here is built from committed content, but
// the escape stays unconditional so a future data source cannot break out.

export function serializeJsonLd(payload: unknown): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
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
