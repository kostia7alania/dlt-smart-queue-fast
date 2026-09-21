import type { Office } from "./types";

export function officeMatchesSearch(office: Office, rawQuery: string): boolean {
  const query = normalizeSearch(rawQuery);
  if (!query) return true;

  const siteIDQuery = query.startsWith("#") ? query.slice(1) : query;
  return (
    normalizeSearch(office.sit_name).includes(query) ||
    (/^\d+$/.test(siteIDQuery) && String(office.sit_id).includes(siteIDQuery))
  );
}

export function filterOffices(offices: readonly Office[], query: string): Office[] {
  return offices.filter((office) => officeMatchesSearch(office, query));
}

export function officeLabel(office: Pick<Office, "sit_id" | "sit_name">): string {
  return office.sit_name?.trim() ? office.sit_name : `Office #${office.sit_id}`;
}

function normalizeSearch(value: string | null): string {
  return value?.normalize("NFKC").trim().toLocaleLowerCase() ?? "";
}
