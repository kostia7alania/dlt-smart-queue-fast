import {
  changedOfficeIDs,
  committedOfficeSnapshot,
  MAX_OFFICE_PAYLOAD_BYTES,
  nextRefreshAt,
  OFFICE_SNAPSHOT_KEY,
  parseOfficePayload,
  parseStoredOfficeSnapshot,
  refreshAllowed,
  type StoredOfficeSnapshot,
} from "./office-snapshot";

const API_CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300";
const UPSTREAM_TIMEOUT_MS = 10_000;

type RefreshResult = {
  snapshot: StoredOfficeSnapshot;
  next_refresh_at: string;
  refresh_error?: string;
};

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/healthz") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return methodNotAllowed("GET, HEAD");
      }
      const snapshot = await readSnapshot(env);
      return jsonResponse(
        {
          status: "ok",
          office_snapshot_source: snapshot.source,
          office_snapshot_fetched_at: snapshot.fetched_at,
        },
        200,
        request.method === "HEAD",
      );
    }

    if (url.pathname === "/v1/dlt/offices") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return methodNotAllowed("GET, HEAD");
      }
      const snapshot = await readSnapshot(env);
      return jsonResponse(snapshot.offices, 200, request.method === "HEAD", {
        "Cache-Control": API_CACHE_CONTROL,
        "X-Data-Source": snapshot.source === "upstream" ? "snapshot" : "committed",
        "X-Fetched-At": snapshot.fetched_at,
      });
    }

    if (url.pathname === "/v1/dlt/snapshots/offices") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return methodNotAllowed("GET, HEAD");
      }
      const snapshot = await readSnapshot(env);
      return jsonResponse(
        snapshotResponse(snapshot, env),
        200,
        request.method === "HEAD",
        { "Cache-Control": API_CACHE_CONTROL },
      );
    }

    if (url.pathname === "/v1/dlt/offices/refresh") {
      if (request.method !== "POST") return methodNotAllowed("POST");
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) {
        return jsonResponse({ error: "cross-origin refresh is not allowed" }, 403);
      }

      const result = await refreshSnapshot(env, new Date(), true);
      return jsonResponse(
        {
          ...snapshotResponse(result.snapshot, env),
          refresh_error: result.refresh_error,
        },
        200,
        false,
        { "Cache-Control": "no-store" },
      );
    }

    if (url.pathname.startsWith("/v1/")) {
      return jsonResponse(
        {
          error:
            "This free MVP serves the office snapshot only. Slot and history endpoints require the Go BFF.",
        },
        501,
      );
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(controller, env): Promise<void> {
    const result = await refreshSnapshot(env, new Date(controller.scheduledTime), false);
    console.log(
      JSON.stringify({
        event: "office_snapshot_refresh",
        trigger: "cron",
        cron: controller.cron,
        status: result.snapshot.refresh_status,
        fetched_at: result.snapshot.fetched_at,
        office_count: result.snapshot.offices.length,
        changed_office_count: result.snapshot.changed_office_ids.length,
        error: result.refresh_error,
      }),
    );
  },
} satisfies ExportedHandler<Env>;

async function readSnapshot(env: Env): Promise<StoredOfficeSnapshot> {
  try {
    const value = await env.OFFICE_SNAPSHOTS.get(OFFICE_SNAPSHOT_KEY, "json");
    const stored = parseStoredOfficeSnapshot(value);
    if (stored) return stored;
    if (value !== null) {
      console.warn(JSON.stringify({ event: "invalid_office_snapshot", fallback: "committed" }));
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "office_snapshot_read_failed",
        fallback: "committed",
        error: errorMessage(error),
      }),
    );
  }
  return committedOfficeSnapshot();
}

async function refreshSnapshot(
  env: Env,
  now: Date,
  respectCooldown: boolean,
): Promise<RefreshResult> {
  const current = await readSnapshot(env);
  const cooldownSeconds = parseCooldownSeconds(env.OFFICE_REFRESH_MIN_AGE_SECONDS);

  if (respectCooldown && !refreshAllowed(current, now, cooldownSeconds)) {
    const snapshot = { ...current, refresh_status: "cooldown" as const };
    return {
      snapshot,
      next_refresh_at: nextRefreshAt(current, cooldownSeconds),
      refresh_error:
        current.refresh_status === "failed"
          ? "The last DLT refresh failed; the previous snapshot is still in use."
          : undefined,
    };
  }

  const attemptedAt = now.toISOString();
  try {
    const offices = await fetchOfficePayload(env.OFFICE_SOURCE_URL);
    const changedOfficeIds = changedOfficeIDs(current.offices, offices);
    const snapshot: StoredOfficeSnapshot = {
      schema_version: 1,
      fetched_at: new Date().toISOString(),
      last_attempt_at: attemptedAt,
      source: "upstream",
      refresh_status: changedOfficeIds.length > 0 ? "updated" : "unchanged",
      changed_office_ids: changedOfficeIds,
      offices,
    };
    await env.OFFICE_SNAPSHOTS.put(OFFICE_SNAPSHOT_KEY, JSON.stringify(snapshot));
    return { snapshot, next_refresh_at: nextRefreshAt(snapshot, cooldownSeconds) };
  } catch (error) {
    const snapshot: StoredOfficeSnapshot = {
      ...current,
      last_attempt_at: attemptedAt,
      refresh_status: "failed",
      changed_office_ids: [],
    };
    const refreshError = errorMessage(error);
    try {
      await env.OFFICE_SNAPSHOTS.put(OFFICE_SNAPSHOT_KEY, JSON.stringify(snapshot));
    } catch (writeError) {
      console.error(
        JSON.stringify({
          event: "office_snapshot_failure_state_write_failed",
          error: errorMessage(writeError),
        }),
      );
    }
    console.error(JSON.stringify({ event: "office_snapshot_refresh_failed", error: refreshError }));
    return {
      snapshot,
      next_refresh_at: nextRefreshAt(snapshot, cooldownSeconds),
      refresh_error: "DLT did not return a valid office list; the previous snapshot is still in use.",
    };
  }
}

async function fetchOfficePayload(sourceURL: string): Promise<ReturnType<typeof parseOfficePayload>> {
  const response = await fetch(sourceURL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "thai-driving-license-office-refresh/1.0",
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`DLT office request returned ${response.status}`);
  }

  const contentLength = Number(response.headers.get("Content-Length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_OFFICE_PAYLOAD_BYTES) {
    throw new Error("DLT office payload exceeds the size limit");
  }

  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > MAX_OFFICE_PAYLOAD_BYTES) {
    throw new Error("DLT office payload exceeds the size limit");
  }

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("DLT office payload is not valid JSON");
  }
  return parseOfficePayload(value);
}

function snapshotResponse(snapshot: StoredOfficeSnapshot, env: Env) {
  const cooldownSeconds = parseCooldownSeconds(env.OFFICE_REFRESH_MIN_AGE_SECONDS);
  return {
    fetched_at: snapshot.fetched_at,
    last_attempt_at: snapshot.last_attempt_at,
    source: snapshot.source,
    refresh_status: snapshot.refresh_status,
    next_refresh_at: nextRefreshAt(snapshot, cooldownSeconds),
    changed_office_ids: snapshot.changed_office_ids,
    offices: snapshot.offices,
    refresh_error:
      snapshot.refresh_status === "failed"
        ? "The last DLT refresh failed; the previous snapshot is still in use."
        : undefined,
  };
}

function parseCooldownSeconds(value: string): number {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds >= 60 ? Math.floor(seconds) : 1_800;
}

function methodNotAllowed(allow: string): Response {
  return jsonResponse({ error: "method not allowed" }, 405, false, { Allow: allow });
}

function jsonResponse(
  value: unknown,
  status = 200,
  head = false,
  headers: HeadersInit = {},
): Response {
  return new Response(head ? null : JSON.stringify(value), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
      ...headers,
    },
  });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}
