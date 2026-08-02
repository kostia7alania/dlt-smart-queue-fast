import type { MapAvailabilityStatus } from "@/entities/dlt";

export const MAP_STATUS_ORDER = [
  "available",
  "full",
  "no_slots",
  "not_offered",
  "unknown",
] as const satisfies readonly MapAvailabilityStatus[];

const MAP_STATUS_VALUES = new Set<string>(MAP_STATUS_ORDER);

export function parseMapStatuses(
  rawStatuses: string | null,
  legacyAvailableOnly: boolean,
): Set<MapAvailabilityStatus> {
  if (rawStatuses === null) {
    return new Set(legacyAvailableOnly ? ["available"] : MAP_STATUS_ORDER);
  }
  if (rawStatuses === "none") return new Set();

  const selected = new Set<MapAvailabilityStatus>();
  for (const rawStatus of rawStatuses.split(",")) {
    if (MAP_STATUS_VALUES.has(rawStatus)) {
      selected.add(rawStatus as MapAvailabilityStatus);
    }
  }

  return selected.size > 0 ? selected : new Set(MAP_STATUS_ORDER);
}

export function serializeMapStatuses(selected: ReadonlySet<MapAvailabilityStatus>): string | null {
  if (selected.size === 0) return "none";

  const canonical = MAP_STATUS_ORDER.filter((status) => selected.has(status));
  return canonical.length === MAP_STATUS_ORDER.length ? null : canonical.join(",");
}

export function toggleMapStatus(
  selected: ReadonlySet<MapAvailabilityStatus>,
  status: MapAvailabilityStatus,
): Set<MapAvailabilityStatus> {
  const next = new Set(selected);
  if (next.has(status)) next.delete(status);
  else next.add(status);
  return next;
}
