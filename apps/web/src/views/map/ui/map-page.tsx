"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
  DEFAULT_WORK_KEYWORD,
  fetchMapAvailability,
  fetchOffices,
  filterOffices,
  isAbortError,
  type MapAvailabilityResponse,
  type MapAvailabilityStatus,
  type Office,
  parseQueryFlag,
  parseWorkKeyword,
  type Sourced,
  WORK_KEYWORDS,
} from "@/entities/dlt";
import { WorkOptionFilter } from "@/features/work-option-filter";
import { AVAILABILITY_GUIDE_PATH } from "@/shared/config/site";
import { todayISO } from "@/shared/lib/calendar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  MAP_STATUS_ORDER,
  parseMapStatuses,
  serializeMapStatuses,
  toggleMapStatus,
} from "../model/map-status-filter";

// Leaflet touches window at import time; render the map client-side only.
const OfficeMap = dynamic(() => import("@/widgets/office-map").then((m) => m.OfficeMap), {
  ssr: false,
  loading: () => (
    <div className="map-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
      Loading map...
    </div>
  ),
});

const STATUS_LABELS: Record<MapAvailabilityStatus, string> = {
  available: "available",
  full: "full",
  no_slots: "no upcoming days",
  not_offered: "not offered",
  unknown: "unknown",
};

export function MapPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchID = useId();
  const keyword = parseWorkKeyword(searchParams.get("keyword"));
  const statusesParam = searchParams.get("statuses");
  const legacyAvailableOnly = parseQueryFlag(searchParams.get("available"));
  const selectedStatuses = useMemo(
    () => parseMapStatuses(statusesParam, legacyAvailableOnly),
    [legacyAvailableOnly, statusesParam],
  );
  const availableOnly = selectedStatuses.size === 1 && selectedStatuses.has("available");
  const statusFilterActive = selectedStatuses.size !== MAP_STATUS_ORDER.length;
  const search = searchParams.get("search") ?? "";

  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<MapAvailabilityResponse | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const availabilityRequestRef = useRef(0);
  const availabilityAbortRef = useRef<AbortController | null>(null);

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(updates)) {
        if (value === null) params.delete(name);
        else params.set(name, value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadOffices = useCallback(async (signal?: AbortSignal) => {
    setOfficesLoading(true);
    setOfficesError(null);
    try {
      setOffices(await fetchOffices(signal));
    } catch (err) {
      if (isAbortError(err)) return;
      setOfficesError(err instanceof Error ? err.message : "Failed to load offices");
    } finally {
      if (!signal?.aborted) setOfficesLoading(false);
    }
  }, []);

  const loadAvailability = useCallback(async (workKeyword: string) => {
    availabilityAbortRef.current?.abort();
    const controller = new AbortController();
    availabilityAbortRef.current = controller;
    const requestID = ++availabilityRequestRef.current;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    setAvailability(null);
    try {
      const result = await fetchMapAvailability(workKeyword, todayISO(), controller.signal);
      if (availabilityRequestRef.current === requestID) setAvailability(result);
    } catch (err) {
      if (availabilityRequestRef.current !== requestID) return;
      if (isAbortError(err)) return;
      setAvailability(null);
      setAvailabilityError(
        err instanceof Error ? err.message : "Failed to load stored availability",
      );
    } finally {
      if (availabilityRequestRef.current === requestID) setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadOffices(controller.signal);
    return () => controller.abort();
  }, [loadOffices]);

  useEffect(() => {
    loadAvailability(keyword);
    return () => {
      availabilityRequestRef.current++;
      availabilityAbortRef.current?.abort();
    };
  }, [keyword, loadAvailability]);

  const availabilityBySite = useMemo(
    () => new Map(availability?.results.map((result) => [result.sit_id, result]) ?? []),
    [availability],
  );
  const searchedOffices = useMemo(
    () => filterOffices(offices?.data ?? [], search),
    [offices, search],
  );
  const visibleOffices = useMemo(
    () =>
      searchedOffices.filter((office) =>
        selectedStatuses.has(availabilityBySite.get(office.sit_id)?.status ?? "unknown"),
      ),
    [availabilityBySite, searchedOffices, selectedStatuses],
  );
  const statusCounts = useMemo(() => {
    const counts: Record<MapAvailabilityStatus, number> = {
      available: 0,
      full: 0,
      no_slots: 0,
      not_offered: 0,
      unknown: 0,
    };
    for (const office of searchedOffices) {
      counts[availabilityBySite.get(office.sit_id)?.status ?? "unknown"]++;
    }
    return counts;
  }, [availabilityBySite, searchedOffices]);

  return (
    <main className="map-page__body tw:flex-1 tw:p-6 tw:md:p-10">
      <div className="map-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
        <div className="map-page__header">
          <h1 className="map-page__title tw:mt-4 tw:text-3xl tw:font-bold">DLT Office Map</h1>
          <p className="map-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
            Scan every DLT office and filter five last-known stored evidence states. Click a marker
            to open its appointment calendar. Positions are geocoded from official Thai office
            names.
          </p>
          <p className="map-page__evidence tw:mt-3 tw:text-sm">
            <Link
              href={AVAILABILITY_GUIDE_PATH}
              className="map-page__evidence-guide tw:text-primary tw:underline"
            >
              How to read this data
            </Link>
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
              onClick={() => loadOffices()}
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
              keywords={WORK_KEYWORDS}
              keyword={keyword}
              onKeywordChange={(nextKeyword) =>
                updateQuery({
                  keyword:
                    parseWorkKeyword(nextKeyword) === DEFAULT_WORK_KEYWORD ? null : nextKeyword,
                })
              }
              availableOnly={availableOnly}
              onAvailableOnlyChange={(enabled) =>
                updateQuery({
                  available: enabled ? "1" : null,
                  statuses: null,
                })
              }
            />

            <Card className="map-page__search tw:flex-row tw:flex-wrap tw:items-end tw:gap-3 tw:px-4 tw:py-3">
              <div className="map-page__search-field tw:flex tw:min-w-64 tw:flex-1 tw:flex-col tw:gap-1.5">
                <label htmlFor={searchID} className="tw:text-sm tw:font-medium">
                  Search offices
                </label>
                <Input
                  id={searchID}
                  type="search"
                  value={search}
                  aria-describedby={`${searchID}-count`}
                  placeholder="Office name or site ID..."
                  onChange={(event) =>
                    updateQuery({
                      search: event.target.value.length > 0 ? event.target.value : null,
                    })
                  }
                />
              </div>
              <p
                id={`${searchID}-count`}
                aria-live="polite"
                className="map-page__search-count tw:text-sm tw:text-muted-foreground"
              >
                Showing {visibleOffices.length} of {searchedOffices.length} matching offices (
                {offices.data.length} total)
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={!search && !statusFilterActive && keyword === DEFAULT_WORK_KEYWORD}
                onClick={() =>
                  updateQuery({
                    search: null,
                    available: null,
                    statuses: null,
                    keyword: null,
                  })
                }
              >
                Reset filters
              </Button>
            </Card>

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
                <fieldset className="map-page__status-radar tw:flex tw:flex-col tw:gap-3">
                  <legend className="map-page__status-radar-legend tw:sr-only">
                    Filter offices by last-known availability status
                  </legend>
                  <div className="map-page__availability-counts tw:flex tw:flex-wrap tw:gap-2">
                    {MAP_STATUS_ORDER.map((status) => {
                      const selected = selectedStatuses.has(status);
                      return (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={selected ? "secondary" : "outline"}
                          aria-pressed={selected}
                          className={`map-page__status-toggle map-page__status-toggle--${status}`}
                          onClick={() => {
                            const next = toggleMapStatus(selectedStatuses, status);
                            updateQuery({
                              statuses: serializeMapStatuses(next),
                              available: null,
                            });
                          }}
                        >
                          <strong>{statusCounts[status]}</strong> {STATUS_LABELS[status]}
                        </Button>
                      );
                    })}
                    <Button
                      type="button"
                      size="sm"
                      variant={!statusFilterActive ? "default" : "outline"}
                      aria-pressed={!statusFilterActive}
                      onClick={() => updateQuery({ statuses: null, available: null })}
                    >
                      All statuses
                    </Button>
                  </div>
                  <p className="tw:text-xs tw:text-muted-foreground">
                    {selectedStatuses.size} of {MAP_STATUS_ORDER.length} statuses selected;{" "}
                    {visibleOffices.length} offices visible after status filtering.
                  </p>
                </fieldset>
              )}
              <p className="map-page__availability-note tw:text-xs tw:text-muted-foreground">
                Snapshot-only: opening this page makes no DLT availability requests. Unknown means
                the office has no usable stored lookup yet. Status counts cover the{" "}
                {searchedOffices.length} offices matching the current search before status
                filtering.
              </p>
            </Card>

            <OfficeMap
              offices={visibleOffices}
              availabilityBySite={availabilityBySite}
              availabilityLoading={availabilityLoading}
              keyword={keyword}
            />
          </>
        )}
      </div>
    </main>
  );
}
