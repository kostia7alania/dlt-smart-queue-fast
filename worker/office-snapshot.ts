import directory from "../apps/web/src/entities/dlt/data/office-directory.json" with {
  type: "json",
};

export const OFFICE_SNAPSHOT_KEY = "dlt-offices:v1";
export const MAX_OFFICE_COUNT = 1_000;
export const MAX_OFFICE_PAYLOAD_BYTES = 1_048_576;

export type OfficeRecord = {
  app_open: number;
  sit_id: number;
  sit_name: string | null;
};

export type OfficeSnapshotSource = "committed" | "upstream";
export type OfficeRefreshStatus = "seed" | "updated" | "unchanged" | "cooldown" | "failed";

export type StoredOfficeSnapshot = {
  schema_version: 1;
  fetched_at: string;
  last_attempt_at: string;
  source: OfficeSnapshotSource;
  refresh_status: OfficeRefreshStatus;
  changed_office_ids: number[];
  offices: OfficeRecord[];
};

type UnknownRecord = Record<string, unknown>;

export function committedOfficeSnapshot(): StoredOfficeSnapshot {
  return {
    schema_version: 1,
    fetched_at: directory.generated_at,
    last_attempt_at: directory.generated_at,
    source: "committed",
    refresh_status: "seed",
    changed_office_ids: [],
    offices: directory.offices.map(({ app_open, sit_id, sit_name }) => ({
      app_open,
      sit_id,
      sit_name,
    })),
  };
}

export function parseOfficePayload(value: unknown): OfficeRecord[] {
  if (!Array.isArray(value)) {
    throw new Error("DLT office payload must be an array");
  }
  if (value.length === 0 || value.length > MAX_OFFICE_COUNT) {
    throw new Error(`DLT office payload has an invalid entry count: ${value.length}`);
  }

  const siteIDs = new Set<number>();
  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`DLT office entry ${index} must be an object`);
    }

    const siteID = entry.sit_id;
    const appOpen = entry.app_open;
    const siteName = entry.sit_name;

    if (!Number.isInteger(siteID) || (siteID as number) <= 0) {
      throw new Error(`DLT office entry ${index} has an invalid sit_id`);
    }
    if (appOpen !== 0 && appOpen !== 1) {
      throw new Error(`DLT office entry ${index} has an invalid app_open flag`);
    }
    if (typeof siteName !== "string" && siteName !== null) {
      throw new Error(`DLT office entry ${index} has an invalid sit_name`);
    }
    if (siteIDs.has(siteID as number)) {
      throw new Error(`DLT office payload repeats sit_id ${siteID}`);
    }
    siteIDs.add(siteID as number);

    return {
      app_open: appOpen,
      sit_id: siteID as number,
      sit_name: siteName,
    };
  });
}

export function parseStoredOfficeSnapshot(value: unknown): StoredOfficeSnapshot | null {
  if (!isRecord(value) || value.schema_version !== 1) return null;
  if (!isISODate(value.fetched_at) || !isISODate(value.last_attempt_at)) return null;
  if (value.source !== "committed" && value.source !== "upstream") return null;
  if (!isRefreshStatus(value.refresh_status)) return null;
  if (!Array.isArray(value.changed_office_ids)) return null;
  if (!value.changed_office_ids.every((siteID) => Number.isInteger(siteID) && siteID > 0)) {
    return null;
  }

  try {
    return {
      schema_version: 1,
      fetched_at: value.fetched_at,
      last_attempt_at: value.last_attempt_at,
      source: value.source,
      refresh_status: value.refresh_status,
      changed_office_ids: value.changed_office_ids as number[],
      offices: parseOfficePayload(value.offices),
    };
  } catch {
    return null;
  }
}

export function changedOfficeIDs(
  previous: readonly OfficeRecord[],
  next: readonly OfficeRecord[],
): number[] {
  const previousByID = new Map(previous.map((office) => [office.sit_id, office]));
  const nextByID = new Map(next.map((office) => [office.sit_id, office]));
  const allIDs = new Set([...previousByID.keys(), ...nextByID.keys()]);

  return [...allIDs]
    .filter((siteID) => {
      const before = previousByID.get(siteID);
      const after = nextByID.get(siteID);
      return (
        !before ||
        !after ||
        before.app_open !== after.app_open ||
        before.sit_name !== after.sit_name
      );
    })
    .toSorted((left, right) => left - right);
}

export function nextRefreshAt(snapshot: StoredOfficeSnapshot, cooldownSeconds: number): string {
  const attemptedAt = Date.parse(snapshot.last_attempt_at);
  const safeAttemptedAt = Number.isNaN(attemptedAt) ? 0 : attemptedAt;
  return new Date(safeAttemptedAt + cooldownSeconds * 1_000).toISOString();
}

export function refreshAllowed(
  snapshot: StoredOfficeSnapshot,
  now: Date,
  cooldownSeconds: number,
): boolean {
  return now.getTime() >= Date.parse(nextRefreshAt(snapshot, cooldownSeconds));
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isISODate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function isRefreshStatus(value: unknown): value is OfficeRefreshStatus {
  return (
    value === "seed" ||
    value === "updated" ||
    value === "unchanged" ||
    value === "cooldown" ||
    value === "failed"
  );
}
