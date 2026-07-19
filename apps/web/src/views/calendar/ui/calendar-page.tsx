"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchHolidays,
  fetchOffices,
  fetchSlots,
  fetchWorkTypes,
  type Office,
  type SlotDay,
  type Sourced,
  type WorkType,
} from "@/entities/dlt";
import { OfficeSelect } from "@/features/office-select";
import { WorkOptionFilter } from "@/features/work-option-filter";
import { todayISO } from "@/shared/lib/calendar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { SlotCalendar } from "@/widgets/slot-calendar";

const KEYWORDS = [" NEW THAI", " RENEW THAI"] as const;
const DEFAULT_SITE_ID = 47;
const GROUP_ID = 4;

export function CalendarPage() {
  // Deep links from the office map preselect an office via ?siteId=.
  const searchParams = useSearchParams();
  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [siteId, setSiteId] = useState(() => {
    const fromQuery = Number(searchParams.get("siteId"));
    return Number.isInteger(fromQuery) && fromQuery > 0 ? fromQuery : DEFAULT_SITE_ID;
  });
  const [keyword, setKeyword] = useState<string>(KEYWORDS[0]);
  const [workTypes, setWorkTypes] = useState<Sourced<WorkType[]> | null>(null);
  const [workTypeId, setWorkTypeId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Sourced<SlotDay[]> | null>(null);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [availableOnly, setAvailableOnly] = useState(false);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  // Guards against a slow response for a previously selected office/keyword
  // overwriting the state of a newer selection.
  const calendarRequestRef = useRef(0);

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

  const loadCalendar = useCallback(async (site: number, kw: string) => {
    const requestId = ++calendarRequestRef.current;
    const isStale = () => calendarRequestRef.current !== requestId;

    setCalendarLoading(true);
    setCalendarError(null);
    setSlots(null);
    setWorkTypes(null);
    setWorkTypeId(null);
    setHolidays(new Set());
    try {
      const workTypesResult = await fetchWorkTypes(site, GROUP_ID, kw);
      if (isStale()) return;
      setWorkTypes(workTypesResult);

      const first = workTypesResult.data?.[0];
      if (!first) {
        return;
      }
      setWorkTypeId(first.tyw_id);

      const slotsResult = await fetchSlots(first.tyw_id, todayISO());
      if (isStale()) return;
      setSlots(slotsResult);

      const holidaysResult = await fetchHolidays(first.tyw_id);
      if (!isStale()) setHolidays(holidaysResult);
    } catch (err) {
      if (isStale()) return;
      setCalendarError(err instanceof Error ? err.message : "Failed to load calendar");
    } finally {
      if (!isStale()) setCalendarLoading(false);
    }
  }, []);

  // Initial fetch-on-mount without a data library: the loaders own their
  // loading/error state transitions.
  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    loadCalendar(siteId, keyword);
  }, [siteId, keyword, loadCalendar]);

  const selectedOffice = offices?.data.find((office) => office.sit_id === siteId) ?? null;
  const snapshotSources = [
    offices?.source === "snapshot" ? { label: "Offices", fetchedAt: offices.fetchedAt } : null,
    workTypes?.source === "snapshot"
      ? { label: "Work types", fetchedAt: workTypes.fetchedAt }
      : null,
    slots?.source === "snapshot" ? { label: "Slots", fetchedAt: slots.fetchedAt } : null,
  ].filter((source): source is { label: string; fetchedAt: string | null } => source !== null);

  return (
    <main className="calendar-page tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10">
      <div className="calendar-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
        <div className="calendar-page__header">
          <nav className="calendar-page__nav tw:flex tw:gap-4 tw:text-sm tw:font-medium">
            <Link href="/" className="calendar-page__back tw:text-primary tw:underline">
              &larr; Back to Home
            </Link>
            <Link href="/map" className="calendar-page__to-map tw:text-primary tw:underline">
              Office Map
            </Link>
            <Link
              href="/compare"
              className="calendar-page__to-compare tw:text-primary tw:underline"
            >
              Compare Offices
            </Link>
          </nav>
          <h1 className="calendar-page__title tw:mt-4 tw:text-3xl tw:font-bold">
            DLT Slot Calendar
          </h1>
          <p className="calendar-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
            Pick an office and work option to see appointment availability. Day colors and statuses
            come from the DLT API unchanged.
          </p>
        </div>

        {officesError && (
          <LoadError label="Office list" message={officesError} onRetry={loadOffices} />
        )}
        {calendarError && (
          <LoadError
            label="Calendar"
            message={calendarError}
            onRetry={() => loadCalendar(siteId, keyword)}
          />
        )}

        <div className="calendar-page__layout tw:grid tw:gap-6 tw:lg:grid-cols-[320px_1fr]">
          <OfficeSelect
            offices={offices}
            loading={officesLoading}
            selectedSiteId={siteId}
            onSelect={setSiteId}
          />

          <section
            aria-busy={calendarLoading}
            className="calendar-page__content tw:flex tw:flex-col tw:gap-4"
          >
            <WorkOptionFilter
              keywords={KEYWORDS}
              keyword={keyword}
              onKeywordChange={setKeyword}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
              officeName={selectedOffice?.sit_name}
            />

            {workTypes && workTypes.data.length > 0 && workTypeId && (
              <Card className="calendar-page__work-type tw:gap-1 tw:px-4 tw:py-3 tw:text-sm">
                <span className="tw:text-xs tw:uppercase tw:tracking-wide tw:text-muted-foreground">
                  Work type
                </span>
                <div className="tw:font-medium">
                  {workTypes.data[0].tyw_name}
                  <span className="tw:ml-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
                    tyw_id {workTypeId}
                  </span>
                </div>
              </Card>
            )}

            {workTypes && workTypes.data.length === 0 && !calendarLoading && (
              <div className="calendar-page__empty tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                No work types found for this office and option. Try another office or switch between
                NEW and RENEW.
              </div>
            )}

            {snapshotSources.length > 0 && (
              <div
                role="status"
                className="calendar-page__snapshot-notice tw:rounded-md tw:bg-amber-100 tw:p-3 tw:text-sm tw:text-amber-800 tw:dark:bg-amber-950 tw:dark:text-amber-300"
              >
                <p>Live upstream is unavailable for part of this view. Showing stored data:</p>
                <ul className="calendar-page__snapshot-list tw:mt-1 tw:list-disc tw:pl-5">
                  {snapshotSources.map((source) => (
                    <li key={source.label}>
                      {source.label}: {formatFreshness(source.fetchedAt)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {calendarLoading && (
              <div className="calendar-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                Loading calendar...
              </div>
            )}

            <SlotCalendar
              key={workTypeId ?? "none"}
              slots={slots}
              holidays={holidays}
              availableOnly={availableOnly}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

type LoadErrorProps = {
  label: string;
  message: string;
  onRetry: () => void;
};

function LoadError({ label, message, onRetry }: LoadErrorProps) {
  return (
    <div
      role="alert"
      className="calendar-page__error tw:flex tw:items-center tw:justify-between tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive"
    >
      <span className="tw:break-all">
        <strong>{label}:</strong> {message}
      </span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="calendar-page__retry tw:ml-4 tw:shrink-0 tw:rounded-full"
        onClick={onRetry}
      >
        Retry {label.toLowerCase()}
      </Button>
    </div>
  );
}

function formatFreshness(value: string | null): string {
  if (!value) return "fetch time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
