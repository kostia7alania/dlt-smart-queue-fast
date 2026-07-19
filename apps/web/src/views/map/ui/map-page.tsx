"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  fetchMapAvailability,
  fetchOffices,
  type MapAvailabilityResponse,
  type MapAvailabilityStatus,
  type Office,
  type Sourced,
} from "@/entities/dlt";
import { WorkOptionFilter } from "@/features/work-option-filter";
import { todayISO } from "@/shared/lib/calendar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

// Leaflet touches window at import time; render the map client-side only.
const OfficeMap = dynamic(() => import("@/widgets/office-map").then((m) => m.OfficeMap), {
  ssr: false,
  loading: () => (
    <div className="map-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
      Loading map...
    </div>
  ),
});

const KEYWORDS = [" NEW THAI", " RENEW THAI"] as const;

const STATUS_LABELS: Record<MapAvailabilityStatus, string> = {
  available: "available",
  full: "full",
  no_slots: "no upcoming days",
  not_offered: "not offered",
  unknown: "unknown",
};

export function MapPage() {
  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>(KEYWORDS[0]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [availability, setAvailability] = useState<MapAvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const availabilityRequestRef = useRef(0);

  const loadOffices = useCallback(async () => {
    setOfficesLoading(true);
    setOfficesError(null);
    try {
      setOffices(await fetchOffices());
    } catch (err) {
      setOfficesError(err instanceof Error ? err.message : "Failed to load offices");
    } finally {
      setOfficesLoading(false);
    }
  }, []);

  const loadAvailability = useCallback(async (workKeyword: string) => {
    const requestID = ++availabilityRequestRef.current;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    setAvailability(null);
    try {
      const result = await fetchMapAvailability(workKeyword, todayISO());
      if (availabilityRequestRef.current === requestID) setAvailability(result);
    } catch (err) {
      if (availabilityRequestRef.current !== requestID) return;
      setAvailability(null);
      setAvailabilityError(
        err instanceof Error ? err.message : "Failed to load stored availability",
      );
    } finally {
      if (availabilityRequestRef.current === requestID) setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    loadAvailability(keyword);
  }, [keyword, loadAvailability]);

  const availabilityBySite = useMemo(
    () => new Map(availability?.results.map((result) => [result.sit_id, result]) ?? []),
    [availability],
  );
  const statusCounts = useMemo(() => {
    const counts: Record<MapAvailabilityStatus, number> = {
      available: 0,
      full: 0,
      no_slots: 0,
      not_offered: 0,
      unknown: 0,
    };
    for (const office of offices?.data ?? []) {
      counts[availabilityBySite.get(office.sit_id)?.status ?? "unknown"]++;
    }
    return counts;
  }, [availabilityBySite, offices]);

  return (
    <main className="map-page tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10">
      <div className="map-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
        <div className="map-page__header">
          <nav className="map-page__nav tw:flex tw:gap-4 tw:text-sm tw:font-medium">
            <Link href="/" className="map-page__back tw:text-primary tw:underline">
              &larr; Back to Home
            </Link>
            <Link href="/calendar" className="map-page__to-calendar tw:text-primary tw:underline">
              Slot Calendar
            </Link>
            <Link href="/compare" className="map-page__to-compare tw:text-primary tw:underline">
              Compare Offices
            </Link>
          </nav>
          <h1 className="map-page__title tw:mt-4 tw:text-3xl tw:font-bold">DLT Office Map</h1>
          <p className="map-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
            Every DLT office on one map. Click a marker to open its appointment calendar. Positions
            are geocoded from official Thai office names.
          </p>
        </div>

        {offices?.source === "snapshot" && offices.fetchedAt && (
          <div
            role="status"
            className="map-page__snapshot-notice tw:rounded-md tw:bg-amber-100 tw:p-3 tw:text-sm tw:text-amber-800 tw:dark:bg-amber-950 tw:dark:text-amber-300"
          >
            Live upstream is unavailable — office list stored{" "}
            {new Date(offices.fetchedAt).toLocaleString()}.
          </div>
        )}

        {officesError && (
          <div
            role="alert"
            className="map-page__error tw:flex tw:items-center tw:justify-between tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive"
          >
            <span className="tw:break-all">Office list: {officesError}</span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="map-page__retry tw:ml-4 tw:shrink-0 tw:rounded-full"
              onClick={loadOffices}
            >
              Retry
            </Button>
          </div>
        )}

        {officesLoading && (
          <div className="map-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
            Loading offices...
          </div>
        )}

        {offices && (
          <>
            <WorkOptionFilter
              keywords={KEYWORDS}
              keyword={keyword}
              onKeywordChange={setKeyword}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
            />

            {availabilityError && (
              <div
                role="alert"
                className="map-page__availability-error tw:rounded-md tw:bg-amber-100 tw:p-3 tw:text-sm tw:text-amber-900 tw:dark:bg-amber-950 tw:dark:text-amber-200"
              >
                Stored availability is unavailable ({availabilityError}). The office map still
                works; all statuses are shown as unknown.
              </div>
            )}

            <Card className="map-page__availability-summary tw:gap-2 tw:px-4 tw:py-3">
              <h2 className="map-page__availability-title tw:text-sm tw:font-semibold">
                Last-known {keyword.trim()} availability
              </h2>
              {availabilityLoading ? (
                <p className="map-page__availability-loading tw:text-sm tw:text-muted-foreground">
                  Loading stored availability...
                </p>
              ) : (
                <ul className="map-page__availability-counts tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-1 tw:text-sm">
                  {(Object.keys(STATUS_LABELS) as MapAvailabilityStatus[]).map((status) => (
                    <li key={status}>
                      <strong>{statusCounts[status]}</strong> {STATUS_LABELS[status]}
                    </li>
                  ))}
                </ul>
              )}
              <p className="map-page__availability-note tw:text-xs tw:text-muted-foreground">
                Snapshot-only: opening this page makes no DLT availability requests. Unknown means
                the office has no usable stored lookup yet.
              </p>
            </Card>

            <OfficeMap
              offices={offices.data}
              availabilityBySite={availabilityBySite}
              availabilityLoading={availabilityLoading}
              availableOnly={availableOnly}
              keyword={keyword}
            />
          </>
        )}
      </div>
    </main>
  );
}
