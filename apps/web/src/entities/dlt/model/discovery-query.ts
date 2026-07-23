export function parsePositiveSiteID(raw: string | null, fallback: number): number {
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function parseSiteIDs(raw: string | null, limit: number): number[] {
  if (!raw || limit <= 0) return [];

  const siteIDs: number[] = [];
  for (const part of raw.split(",")) {
    const parsed = Number(part.trim());
    if (Number.isInteger(parsed) && parsed > 0 && !siteIDs.includes(parsed)) {
      siteIDs.push(parsed);
      if (siteIDs.length === limit) break;
    }
  }
  return siteIDs;
}

export function parseQueryFlag(raw: string | null): boolean {
  return raw === "1";
}
