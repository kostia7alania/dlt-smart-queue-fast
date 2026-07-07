"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Office = {
  app_open: number;
  sit_id: number;
  sit_name: string;
};

type WorkType = {
  tyw_name: string;
  tyw_id: number;
  tyw_status: number;
  tyw_datestart: string;
};

type SlotRound = {
  round: string;
  count: string | number;
  MaxCount: number;
};

type SlotDay = {
  date: string;
  message: string;
  color: string;
  siteopen: SlotRound[];
};

type Holiday = {
  hol_date: string;
};

type DataSource = "live" | "snapshot";

type Sourced<T> = {
  data: T;
  source: DataSource;
  fetchedAt: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const KEYWORDS = [" NEW THAI", " RENEW THAI"] as const;
const DEFAULT_SITE_ID = 47;
const GROUP_ID = 4;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function getJSON(url: string): Promise<unknown> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Try the live endpoint first; on failure fall back to the feature 002
// snapshot endpoint so the page keeps working during upstream outages.
async function fetchWithFallback<T>(
  livePath: string,
  snapshotPath: string | null,
  extractSnapshot: (body: unknown) => { data: T; fetchedAt: string | null },
): Promise<Sourced<T>> {
  try {
    const data = (await getJSON(`${API_BASE}${livePath}`)) as T;
    return { data, source: "live", fetchedAt: null };
  } catch (liveError) {
    if (!snapshotPath) throw liveError;
    const body = await getJSON(`${API_BASE}${snapshotPath}`);
    const { data, fetchedAt } = extractSnapshot(body);
    return { data, source: "snapshot", fetchedAt };
  }
}

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Month key "YYYY-MM" -> label + day math, all on plain date strings to avoid
// timezone shifts.
function monthKey(date: string): string {
  return date.slice(0, 7);
}

function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function daysInMonth(key: string): number {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function firstWeekday(key: string): number {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).getDay();
}

function monthRange(fromKey: string, toKey: string): string[] {
  const keys: string[] = [];
  let [year, month] = fromKey.split("-").map(Number);
  const [toYear, toMonth] = toKey.split("-").map(Number);
  while (year < toYear || (year === toYear && month <= toMonth)) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return keys;
}

export default function CalendarPage() {
  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [officeSearch, setOfficeSearch] = useState("");
  const [siteId, setSiteId] = useState(DEFAULT_SITE_ID);
  const [keyword, setKeyword] = useState<(typeof KEYWORDS)[number]>(KEYWORDS[0]);
  const [workTypes, setWorkTypes] = useState<Sourced<WorkType[]> | null>(null);
  const [workTypeId, setWorkTypeId] = useState<number | null>(null);
  const [slots, setSlots] = useState<Sourced<SlotDay[]> | null>(null);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState<string | null>("offices");
  const [error, setError] = useState<string | null>(null);
  // Guards against a slow response for a previously selected office/keyword
  // overwriting the state of a newer selection.
  const calendarRequestRef = useRef(0);

  const loadOffices = useCallback(async () => {
    setLoading("offices");
    setError(null);
    try {
      const result = await fetchWithFallback<Office[]>(
        "/v1/dlt/offices",
        "/v1/dlt/snapshots/offices",
        (body) => {
          const snapshot = body as { fetched_at: string; offices: Office[] };
          return { data: snapshot.offices, fetchedAt: snapshot.fetched_at };
        },
      );
      setOffices(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load offices");
    } finally {
      setLoading(null);
    }
  }, []);

  const loadCalendar = useCallback(async (site: number, kw: string) => {
    const requestId = ++calendarRequestRef.current;
    const isStale = () => calendarRequestRef.current !== requestId;

    setLoading("calendar");
    setError(null);
    setSlots(null);
    setWorkTypes(null);
    setWorkTypeId(null);
    setSelectedDate(null);
    setHolidays(new Set());
    try {
      const workTypesResult = await fetchWithFallback<WorkType[]>(
        `/v1/dlt/work-types?siteId=${site}&groupId=${GROUP_ID}&keyword=${encodeURIComponent(kw)}`,
        `/v1/dlt/snapshots/work-types?siteId=${site}&groupId=${GROUP_ID}&keyword=${encodeURIComponent(kw)}`,
        (body) => {
          const snapshot = body as { fetched_at: string; work_types: WorkType[] };
          return { data: snapshot.work_types, fetchedAt: snapshot.fetched_at };
        },
      );
      if (isStale()) return;
      setWorkTypes(workTypesResult);

      const first = workTypesResult.data?.[0];
      if (!first) {
        setLoading(null);
        return;
      }
      setWorkTypeId(first.tyw_id);

      const slotsResult = await fetchWithFallback<SlotDay[]>(
        `/v1/dlt/work-types/${first.tyw_id}/slots?currentDate=${todayISO()}`,
        `/v1/dlt/snapshots/slots?workTypeId=${first.tyw_id}`,
        (body) => {
          const snapshot = body as { fetched_at: string; data: SlotDay[] };
          return { data: snapshot.data, fetchedAt: snapshot.fetched_at };
        },
      );
      if (isStale()) return;
      setSlots(slotsResult);
      setMonthIndex(0);

      // Holidays are best-effort: no snapshot endpoint exists for them.
      try {
        const holidayData = (await getJSON(
          `${API_BASE}/v1/dlt/work-types/${first.tyw_id}/holidays`,
        )) as Holiday[];
        if (isStale()) return;
        setHolidays(new Set((holidayData ?? []).map((h) => h.hol_date)));
      } catch {
        if (!isStale()) setHolidays(new Set());
      }
    } catch (err) {
      if (isStale()) return;
      setError(err instanceof Error ? err.message : "Failed to load calendar");
    } finally {
      if (!isStale()) setLoading(null);
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

  const slotsByDate = useMemo(() => {
    const map = new Map<string, SlotDay>();
    for (const day of slots?.data ?? []) {
      map.set(day.date, day);
    }
    return map;
  }, [slots]);

  const months = useMemo(() => {
    const dates = [...slotsByDate.keys()].sort();
    if (dates.length === 0) return [];
    return monthRange(monthKey(dates[0]), monthKey(dates[dates.length - 1]));
  }, [slotsByDate]);

  const currentMonth = months[monthIndex] ?? null;
  const selectedDay = selectedDate ? slotsByDate.get(selectedDate) : null;
  const selectedOffice = offices?.data.find((o) => o.sit_id === siteId) ?? null;

  const filteredOffices = useMemo(() => {
    const query = officeSearch.trim().toLowerCase();
    const all = offices?.data ?? [];
    if (!query) return all;
    return all.filter((office) => office.sit_name.toLowerCase().includes(query));
  }, [offices, officeSearch]);

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 md:p-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div>
          <Link href="/" className="text-sm font-medium text-blue-600 underline dark:text-blue-400">
            &larr; Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold">DLT Slot Calendar</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            Pick an office and work option to see appointment availability. Day colors and statuses
            come from the DLT API unchanged.
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md bg-red-100 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            <span className="break-all">{error}</span>
            <button
              type="button"
              onClick={() => {
                if (!offices) loadOffices();
                loadCalendar(siteId, keyword);
              }}
              className="ml-4 shrink-0 rounded-full bg-red-600 px-4 py-1 text-xs font-semibold text-white"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <section className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Offices</h2>
              {offices?.source === "snapshot" && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  stored data
                </span>
              )}
            </div>
            <input
              value={officeSearch}
              onChange={(event) => setOfficeSearch(event.target.value)}
              placeholder="Search office name..."
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
            />
            <div className="max-h-[420px] overflow-auto">
              {loading === "offices" && (
                <div className="p-3 text-sm text-zinc-500">Loading offices...</div>
              )}
              {filteredOffices.map((office) => (
                <button
                  key={office.sit_id}
                  type="button"
                  onClick={() => setSiteId(office.sit_id)}
                  className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    office.sit_id === siteId
                      ? "bg-blue-50 font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      : ""
                  }`}
                >
                  {office.sit_name}
                  <span className="ml-2 font-mono text-xs text-zinc-400">#{office.sit_id}</span>
                </button>
              ))}
              {offices && filteredOffices.length === 0 && (
                <div className="p-3 text-sm text-zinc-500">No offices match the search.</div>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex overflow-hidden rounded-full border border-zinc-300 text-sm dark:border-zinc-700">
                {KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setKeyword(kw)}
                    className={`px-4 py-1.5 font-medium transition ${
                      keyword === kw
                        ? "bg-blue-600 text-white"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {kw.trim()}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(event) => setAvailableOnly(event.target.checked)}
                />
                Available only
              </label>
              {selectedOffice && (
                <span className="ml-auto text-xs text-zinc-500">{selectedOffice.sit_name}</span>
              )}
            </div>

            {workTypes && workTypes.data?.length > 0 && workTypeId && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-xs uppercase tracking-wide text-zinc-500">Work type</span>
                <div className="mt-1 font-medium">
                  {workTypes.data[0].tyw_name}
                  <span className="ml-2 font-mono text-xs text-zinc-400">tyw_id {workTypeId}</span>
                </div>
              </div>
            )}

            {workTypes && (workTypes.data ?? []).length === 0 && loading === null && (
              <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                No work types found for this office and option. Try another office or switch between
                NEW and RENEW.
              </div>
            )}

            {slots?.source === "snapshot" && slots.fetchedAt && (
              <div className="rounded-md bg-amber-100 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Live upstream is unavailable — showing stored data from{" "}
                {new Date(slots.fetchedAt).toLocaleString()}.
              </div>
            )}

            {loading === "calendar" && (
              <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Loading calendar...
              </div>
            )}

            {currentMonth && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={monthIndex === 0}
                    onClick={() => setMonthIndex((index) => index - 1)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-zinc-700"
                  >
                    &larr;
                  </button>
                  <h3 className="font-semibold">{monthLabel(currentMonth)}</h3>
                  <button
                    type="button"
                    disabled={monthIndex >= months.length - 1}
                    onClick={() => setMonthIndex((index) => index + 1)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-sm disabled:opacity-40 dark:border-zinc-700"
                  >
                    &rarr;
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="py-1 font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {WEEKDAYS.slice(0, firstWeekday(currentMonth)).map((weekday) => (
                    <div key={`pad-${weekday}`} />
                  ))}
                  {Array.from({ length: daysInMonth(currentMonth) }).map((_, index) => {
                    const dayNumber = index + 1;
                    const date = `${currentMonth}-${String(dayNumber).padStart(2, "0")}`;
                    const slotDay = slotsByDate.get(date);
                    const isHoliday = holidays.has(date);
                    const dimmed = availableOnly && slotDay?.message === "เต็ม";
                    return (
                      <button
                        key={date}
                        type="button"
                        disabled={!slotDay}
                        onClick={() => setSelectedDate(date)}
                        style={slotDay ? { backgroundColor: slotDay.color } : undefined}
                        className={`flex min-h-16 flex-col items-center justify-center rounded-md border p-1 text-sm transition ${
                          slotDay
                            ? "border-transparent text-white hover:opacity-90"
                            : "border-zinc-100 text-zinc-400 dark:border-zinc-800"
                        } ${dimmed ? "opacity-25" : ""} ${
                          selectedDate === date ? "ring-2 ring-blue-500 ring-offset-1" : ""
                        }`}
                      >
                        <span className="font-semibold">{dayNumber}</span>
                        {slotDay && (
                          <span className="text-[10px] leading-tight">{slotDay.message}</span>
                        )}
                        {isHoliday && (
                          <span className="text-[9px] uppercase tracking-wide opacity-80">
                            holiday
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-zinc-500">
                  Colors and statuses come from the DLT API. Days without data are not bookable.
                </p>
              </div>
            )}

            {selectedDay && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-semibold">
                  {selectedDay.date}
                  <span
                    className="ml-3 rounded-full px-3 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: selectedDay.color }}
                  >
                    {selectedDay.message}
                  </span>
                </h3>
                <table className="mt-3 w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase tracking-wide text-zinc-500">
                      <th className="py-1 pr-4">Round</th>
                      <th className="py-1 pr-4">Count</th>
                      <th className="py-1">MaxCount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDay.siteopen.map((round) => (
                      <tr
                        key={round.round}
                        className="border-t border-zinc-100 dark:border-zinc-800"
                      >
                        <td className="py-1.5 pr-4 font-mono text-xs">{round.round}</td>
                        <td className="py-1.5 pr-4">{String(round.count)}</td>
                        <td className="py-1.5">{round.MaxCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
