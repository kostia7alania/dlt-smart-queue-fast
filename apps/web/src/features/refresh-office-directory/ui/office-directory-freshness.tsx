"use client";

import { useEffect, useState } from "react";

import {
  committedOfficeSnapshot,
  fetchOfficeSnapshot,
  isAbortError,
  type OfficeSnapshotResponse,
  refreshOfficeSnapshot,
} from "@/entities/dlt";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

export function OfficeDirectoryFreshness() {
  const [snapshot, setSnapshot] = useState<OfficeSnapshotResponse>(committedOfficeSnapshot);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchOfficeSnapshot(controller.signal)
      .then((result) => {
        setSnapshot(result);
        if (result.refresh_error) setMessage(result.refresh_error);
      })
      .catch((error: unknown) => {
        if (!isAbortError(error)) {
          setMessage("The live snapshot could not be loaded; showing the committed capture.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function refresh() {
    setRefreshing(true);
    setMessage(null);
    try {
      const result = await refreshOfficeSnapshot();
      setSnapshot(result);
      setMessage(refreshMessage(result));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The office refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  const appointmentOpen = snapshot.offices.filter((office) => office.app_open === 1).length;
  const warning = Boolean(snapshot.refresh_error) || message?.includes("failed") === true;

  return (
    <section aria-labelledby="office-freshness-title" className="office-freshness">
      <Card className="office-freshness__card tw:border tw:border-stone-300 tw:bg-white/80">
        <CardHeader className="tw:gap-2">
          <div className="office-freshness__heading tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3">
            <h2 id="office-freshness-title" className="tw:text-xl tw:font-semibold">
              Latest office list
            </h2>
            <Badge variant={snapshot.source === "upstream" ? "default" : "secondary"}>
              {snapshot.source === "upstream" ? "Cloudflare snapshot" : "committed fallback"}
            </Badge>
          </div>
          <p className="office-freshness__summary tw:text-sm tw:text-stone-600">
            {snapshot.offices.length} entries in the latest list. {appointmentOpen} are marked open
            for appointments. Captured {formatUTC(snapshot.fetched_at)}.
          </p>
        </CardHeader>
        <CardContent className="tw:flex tw:flex-col tw:items-start tw:gap-3">
          <p className="office-freshness__boundary tw:max-w-3xl tw:text-sm tw:text-stone-600">
            The flag comes from DLT&apos;s public office list. It does not promise a free slot or
            confirm that an office can handle your licence case.
          </p>
          <div className="office-freshness__actions tw:flex tw:flex-wrap tw:items-center tw:gap-3">
            <Button type="button" onClick={refresh} disabled={refreshing} aria-busy={refreshing}>
              {refreshing ? "Checking DLT…" : "Refresh office list"}
            </Button>
            <span className="office-freshness__schedule tw:text-xs tw:text-stone-600">
              Automatic check every six hours. Manual checks are limited to one per 30 minutes.
            </span>
          </div>
          <p
            aria-live="polite"
            role={warning ? "alert" : "status"}
            className={`office-freshness__status tw:min-h-5 tw:text-sm ${warning ? "tw:text-amber-800" : "tw:text-stone-600"}`}
          >
            {loading ? "Loading the latest stored snapshot…" : message}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function refreshMessage(snapshot: OfficeSnapshotResponse): string {
  if (snapshot.refresh_error) return snapshot.refresh_error;
  if (snapshot.refresh_status === "cooldown") {
    return snapshot.next_refresh_at
      ? `A recent check is already stored. The next live check is available after ${formatUTC(snapshot.next_refresh_at)}.`
      : "A recent check is already stored; no extra DLT request was made.";
  }
  if (snapshot.refresh_status === "updated") {
    return `Updated from DLT. ${snapshot.changed_office_ids.length} office entries changed.`;
  }
  if (snapshot.refresh_status === "unchanged") {
    return "Checked DLT successfully. The office list is unchanged.";
  }
  if (snapshot.refresh_status === "failed") {
    return "The DLT refresh failed. The previous office snapshot is still in use.";
  }
  return "The committed office capture is in use.";
}

function formatUTC(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}
