// Deep links into the interactive discovery views. Centralized so static
// content pages cannot drift from the query contract the views parse
// (see model/discovery-query.ts and the view implementations).
//
// Work-option keywords carry a leading space upstream (" NEW THAI"), so every
// keyword MUST go through URLSearchParams encoding rather than string templates.

import type { WorkKeyword } from "./work-options";

function href(path: string, params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(name, value);
  }
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

export function calendarHref(options: {
  siteID: number;
  keyword: WorkKeyword;
  availableOnly?: boolean;
}): string {
  return href("/calendar", {
    siteId: String(options.siteID),
    keyword: options.keyword,
    available: options.availableOnly ? "1" : undefined,
  });
}

export function compareHref(options: { siteIDs: readonly number[]; keyword: WorkKeyword }): string {
  return href("/compare", {
    siteIds: options.siteIDs.join(","),
    keyword: options.keyword,
  });
}

/** Map has no site filter; it uses the same search box contract as the UI. */
export function mapHref(options: {
  keyword: WorkKeyword;
  search?: string;
  availableOnly?: boolean;
}): string {
  return href("/map", {
    keyword: options.keyword,
    search: options.search,
    available: options.availableOnly ? "1" : undefined,
  });
}

export function mapOfficeHref(options: { siteID: number; keyword: WorkKeyword }): string {
  return mapHref({ keyword: options.keyword, search: `#${options.siteID}` });
}

export function historyHref(options: {
  siteID: number;
  keyword: WorkKeyword;
  limit?: number;
}): string {
  return href("/history", {
    siteId: String(options.siteID),
    keyword: options.keyword,
    limit: options.limit === undefined ? undefined : String(options.limit),
  });
}
