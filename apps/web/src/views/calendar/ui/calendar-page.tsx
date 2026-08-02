"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_WORK_KEYWORD,
  fetchHolidays,
  fetchOffices,
  fetchSlots,
  fetchWorkTypes,
  isAbortError,
  type Office,
  parsePositiveSiteID,
  parseQueryFlag,
  parseWorkKeyword,
  type SlotDay,
  type Sourced,
  WORK_KEYWORDS,
  type WorkType,
} from "@/entities/dlt";
import { OfficeSelect } from "@/features/office-select";
import { WorkOptionFilter } from "@/features/work-option-filter";
import { AVAILABILITY_GUIDE_PATH } from "@/shared/config/site";
import { todayISO } from "@/shared/lib/calendar";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";
import { SlotCalendar } from "@/widgets/slot-calendar";

const DEFAULT_SITE_ID = 47;
const GROUP_ID = 4;

export function CalendarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const siteId = parsePositiveSiteID(searchParams.get("siteId"), DEFAULT_SITE_ID);
  const keyword = parseWorkKeyword(searchParams.get("keyword"));
  const availableOnly = parseQueryFlag(searchParams.get("available"));

  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [workTypes, setWorkTypes] = useState<Sourced<WorkType[]> | null>(null);
  const [workTypeId, setWorkTypeId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Sourced<SlotDay[]> | null>(null);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [officesLoading, setOfficesLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  // Guards against a slow response for a previously selected office/keyword
  // overwriting the state of a newer selection.
  const calendarRequestRef = useRef(0);
  const calendarAbortRef = useRef<AbortController | null>(null);

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

  const loadCalendar = useCallback(async (site: number, kw: string) => {
    calendarAbortRef.current?.abort();
    const controller = new AbortController();
    calendarAbortRef.current = controller;
    const requestId = ++calendarRequestRef.current;
    const isStale = () => calendarRequestRef.current !== requestId;

    setCalendarLoading(true);
    setCalendarError(null);
    setSlots(null);
    setWorkTypes(null);
    setWorkTypeId(null);
    setHolidays(new Set());
    try {
      const workTypesResult = await fetchWorkTypes(site, GROUP_ID, kw, controller.signal);
      if (isStale()) return;
      setWorkTypes(workTypesResult);

      const first = workTypesResult.data?.[0];
      if (!first) {
        return;
      }
      setWorkTypeId(first.tyw_id);

      const slotsResult = await fetchSlots(first.tyw_id, todayISO(), controller.signal);
      if (isStale()) return;
      setSlots(slotsResult);

      const holidaysResult = await fetchHolidays(first.tyw_id, controller.signal);
      if (!isStale()) setHolidays(holidaysResult);
    } catch (err) {
      if (isStale()) return;
      if (isAbortError(err)) return;
      setCalendarError(err instanceof Error ? err.message : "Failed to load calendar");
    } finally {
      if (!isStale()) setCalendarLoading(false);
    }
  }, []);

  // Initial fetch-on-mount without a data library: the loaders own their
  // loading/error state transitions.
  useEffect(() => {
    const controller = new AbortController();
    loadOffices(controller.signal);
    return () => controller.abort();
  }, [loadOffices]);

  useEffect(() => {
    loadCalendar(siteId, keyword);
    return () => {
      calendarRequestRef.current++;
      calendarAbortRef.current?.abort();
    };
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
    <div className="calendar-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      <main className="calendar-page__body tw:flex-1 tw:p-6 tw:md:p-10">
        <div className="calendar-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
          <div className="calendar-page__header">
            <h1 className="calendar-page__title tw:mt-4 tw:text-3xl tw:font-bold">
              DLT Slot Calendar
            </h1>
            <p className="calendar-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
              Pick an office and work option to see appointment availability. Day colors and
              statuses come from the DLT API unchanged.
            </p>
            <p className="calendar-page__evidence tw:mt-3 tw:text-sm">
              <Link
                href={AVAILABILITY_GUIDE_PATH}
                className="calendar-page__evidence-guide tw:text-primary tw:underline"
              >
                How to read this data
              </Link>
            </p>
          </div>

          {officesError && (
            <LoadError label="Office list" message={officesError} onRetry={() => loadOffices()} />
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
              onSelect={(nextSiteID) => updateQuery({ siteId: String(nextSiteID) })}
            />

            <section
              aria-busy={calendarLoading}
              className="calendar-page__content tw:flex tw:flex-col tw:gap-4"
            >
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
                  updateQuery({ available: enabled ? "1" : null })
                }
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
                  <Link
                    href={`/history?siteId=${siteId}&keyword=${encodeURIComponent(keyword)}`}
                    className="calendar-page__history-link tw:mt-1 tw:self-start tw:text-xs tw:font-medium tw:text-primary tw:underline"
                  >
                    View stored history
                  </Link>
                </Card>
              )}

              {workTypes && workTypes.data.length === 0 && !calendarLoading && (
                <div className="calendar-page__empty tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                  No work types found for this office and option. Try another office or switch
                  between NEW and RENEW.
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
      <PublicSiteFooter />
    </div>
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
