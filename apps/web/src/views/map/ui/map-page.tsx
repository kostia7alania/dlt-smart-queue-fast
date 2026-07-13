"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { fetchOffices, type Office, type Sourced } from "@/entities/dlt";
import { Button } from "@/shared/ui/button";

// Leaflet touches window at import time; render the map client-side only.
const OfficeMap = dynamic(() => import("@/widgets/office-map").then((m) => m.OfficeMap), {
  ssr: false,
  loading: () => (
    <div className="map-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
      Loading map...
    </div>
  ),
});

export function MapPage() {
  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOffices(await fetchOffices());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load offices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

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

        {error && (
          <div className="map-page__error tw:flex tw:items-center tw:justify-between tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive">
            <span className="tw:break-all">Office list: {error}</span>
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

        {loading && (
          <div className="map-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
            Loading offices...
          </div>
        )}

        {offices && <OfficeMap offices={offices.data} />}
      </div>
    </main>
  );
}
