"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import {
  DEFAULT_WORK_KEYWORD,
  fetchOffices,
  fetchSlotHistory,
  fetchWorkTypes,
  isAbortError,
  type Office,
  parsePositiveSiteID,
  parseWorkKeyword,
  type SlotHistoryEntry,
  type SlotHistoryResponse,
  type SlotHistoryStatus,
  type Sourced,
  WORK_KEYWORDS,
  type WorkType,
} from "@/entities/dlt";
import { OfficeSelect } from "@/features/office-select";
import { AVAILABILITY_GUIDE_PATH } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";
import { type HistoryChangeInsight, summarizeHistoryChanges } from "../model/history-change";

const DEFAULT_SITE_ID = 47;
const GROUP_ID = 4;
const HISTORY_LIMITS = [20, 50, 100] as const;
type HistoryLimit = (typeof HISTORY_LIMITS)[number];

const STATUS_LABELS: Record<SlotHistoryStatus, string> = {
  available: "Available slots",
  full: "All returned days full",
  no_slots: "No slot days returned",
};

function parseHistoryLimit(value: string | null): HistoryLimit {
  const parsed = Number(value);
  return HISTORY_LIMITS.includes(parsed as HistoryLimit) ? (parsed as HistoryLimit) : 20;
}

export function HistoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const limitID = useId();

  const siteID = parsePositiveSiteID(searchParams.get("siteId"), DEFAULT_SITE_ID);
  const keyword = parseWorkKeyword(searchParams.get("keyword"));
  const limit = parseHistoryLimit(searchParams.get("limit"));

  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);
  const [workTypes, setWorkTypes] = useState<Sourced<WorkType[]> | null>(null);
  const [history, setHistory] = useState<SlotHistoryResponse | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const historyRequestRef = useRef(0);
  const historyAbortRef = useRef<AbortController | null>(null);

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [name, value] of Object.entries(updates)) {
        if (value === null) params.delete(name);
        else params.set(name, value);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const loadOffices = useCallback(async (signal?: AbortSignal) => {
    setOfficesLoading(true);
    setOfficesError(null);
    try {
      setOffices(await fetchOffices(signal));
    } catch (error) {
      if (isAbortError(error)) return;
      setOfficesError(error instanceof Error ? error.message : "Failed to load offices");
    } finally {
      if (!signal?.aborted) setOfficesLoading(false);
    }
  }, []);

  const loadHistory = useCallback(
    async (selectedSiteID: number, selectedKeyword: string, selectedLimit: number) => {
      historyAbortRef.current?.abort();
      const controller = new AbortController();
      historyAbortRef.current = controller;
      const requestID = ++historyRequestRef.current;
      const isStale = () => historyRequestRef.current !== requestID;

      setHistoryLoading(true);
      setHistoryError(null);
      setWorkTypes(null);
      setHistory(null);
      try {
        const workTypeResult = await fetchWorkTypes(
          selectedSiteID,
          GROUP_ID,
          selectedKeyword,
          controller.signal,
        );
        if (isStale()) return;
        setWorkTypes(workTypeResult);

        const workType = workTypeResult.data[0];
        if (!workType) return;

        const historyResult = await fetchSlotHistory(
          workType.tyw_id,
          selectedLimit,
          controller.signal,
        );
        if (!isStale()) setHistory(historyResult);
      } catch (error) {
        if (isStale() || isAbortError(error)) return;
        setHistoryError(error instanceof Error ? error.message : "Failed to load stored history");
      } finally {
        if (!isStale()) setHistoryLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadOffices(controller.signal);
    return () => controller.abort();
  }, [loadOffices]);

  useEffect(() => {
    loadHistory(siteID, keyword, limit);
    return () => {
      historyRequestRef.current++;
      historyAbortRef.current?.abort();
    };
  }, [keyword, limit, loadHistory, siteID]);

  const selectedOffice = offices?.data.find((office) => office.sit_id === siteID) ?? null;
  const selectedWorkType = workTypes?.data[0] ?? null;
  const snapshots = history?.snapshots ?? [];
  const statusCounts = useMemo(() => {
    const counts: Record<SlotHistoryStatus, number> = {
      available: 0,
      full: 0,
      no_slots: 0,
    };
    for (const snapshot of snapshots) counts[snapshot.status]++;
    return counts;
  }, [snapshots]);
  const changeInsight = useMemo(() => summarizeHistoryChanges(snapshots), [snapshots]);
  const latest = snapshots[0];

  return (
    <div className="history-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      <main className="history-page__body tw:flex-1 tw:p-6 tw:md:p-10">
        <div className="history-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
          <header className="history-page__header">
            <h1 className="history-page__title tw:mt-4 tw:text-3xl tw:font-bold">
              Stored Slot History
            </h1>
            <p className="history-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
              Inspect recent PostgreSQL observations for one office and work option. Reading history
              never requests slot data from the DLT upstream.
            </p>
            <p className="history-page__evidence tw:mt-3 tw:text-sm">
              <Link
                href={AVAILABILITY_GUIDE_PATH}
                className="history-page__evidence-guide tw:text-primary tw:underline"
              >
                How to read this data
              </Link>
            </p>
          </header>

          {officesError && (
            <ErrorNotice label="Office list" message={officesError} onRetry={() => loadOffices()} />
          )}
          {historyError && (
            <ErrorNotice
              label="Slot history"
              message={historyError}
              onRetry={() => loadHistory(siteID, keyword, limit)}
            />
          )}

          <div className="history-page__layout tw:grid tw:gap-6 tw:lg:grid-cols-[320px_1fr]">
            <OfficeSelect
              offices={offices}
              loading={officesLoading}
              selectedSiteId={siteID}
              onSelect={(nextSiteID) =>
                updateQuery({ siteId: nextSiteID === DEFAULT_SITE_ID ? null : String(nextSiteID) })
              }
            />

            <section
              aria-busy={historyLoading}
              className="history-page__content tw:flex tw:min-w-0 tw:flex-col tw:gap-4"
            >
              <Card className="history-page__controls tw:grid tw:gap-4 tw:px-4 tw:py-3 tw:md:grid-cols-[1fr_auto] tw:md:items-end">
                <fieldset className="history-page__keywords">
                  <legend className="tw:mb-2 tw:text-sm tw:font-medium">Work option</legend>
                  <div className="history-page__keyword-buttons tw:flex tw:flex-wrap tw:gap-1 tw:rounded-full tw:border tw:border-border tw:p-1">
                    {WORK_KEYWORDS.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        size="sm"
                        variant={keyword === option ? "default" : "ghost"}
                        aria-pressed={keyword === option}
                        className={cn(
                          "history-page__keyword tw:rounded-full",
                          keyword === option && "history-page__keyword--active",
                        )}
                        onClick={() =>
                          updateQuery({
                            keyword: option === DEFAULT_WORK_KEYWORD ? null : option,
                          })
                        }
                      >
                        {option.trim()}
                      </Button>
                    ))}
                  </div>
                </fieldset>

                <div className="history-page__limit tw:flex tw:flex-col tw:gap-2">
                  <label htmlFor={limitID} className="tw:text-sm tw:font-medium">
                    Observations
                  </label>
                  <select
                    id={limitID}
                    value={limit}
                    onChange={(event) => {
                      const nextLimit = parseHistoryLimit(event.target.value);
                      updateQuery({ limit: nextLimit === 20 ? null : String(nextLimit) });
                    }}
                    className="tw:min-h-9 tw:rounded-md tw:border tw:border-input tw:bg-background tw:px-3 tw:text-sm tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring"
                  >
                    {HISTORY_LIMITS.map((option) => (
                      <option key={option} value={option}>
                        Latest {option}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              {workTypes?.source === "snapshot" && (
                <div className="history-page__work-type-source tw:rounded-md tw:bg-amber-100 tw:p-3 tw:text-sm tw:text-amber-900 tw:dark:bg-amber-950 tw:dark:text-amber-200">
                  Live work-type resolution was unavailable. Using the stored result from{" "}
                  {formatObservedAt(workTypes.fetchedAt)}.
                </div>
              )}

              {selectedWorkType && (
                <Card className="history-page__selection tw:gap-1 tw:px-4 tw:py-3">
                  <span className="tw:text-xs tw:uppercase tw:tracking-wide tw:text-muted-foreground">
                    Selected history
                  </span>
                  <p className="tw:text-sm tw:font-medium">
                    {selectedOffice?.sit_name ?? `Office #${siteID}`}
                  </p>
                  <p className="tw:text-xs tw:text-muted-foreground">
                    {selectedWorkType.tyw_name} · tyw_id {selectedWorkType.tyw_id}
                  </p>
                </Card>
              )}

              {historyLoading && (
                <div className="history-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                  Loading stored observations...
                </div>
              )}

              {!historyLoading && workTypes && workTypes.data.length === 0 && !historyError && (
                <div className="history-page__no-work-type tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                  This office has no work type for {keyword.trim()}. Choose another office or work
                  option.
                </div>
              )}

              {!historyLoading &&
                selectedWorkType &&
                history &&
                snapshots.length === 0 &&
                !historyError && (
                  <div className="history-page__empty tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                    No stored slot observations exist for this work type yet. Opening the calendar
                    once will store a successful live slot response.
                  </div>
                )}

              {!historyLoading && snapshots.length > 0 && (
                <>
                  <HistorySummary
                    snapshots={snapshots}
                    statusCounts={statusCounts}
                    latest={latest}
                  />
                  <HistoryChangeSignal snapshots={snapshots} insight={changeInsight} />
                  <HistoryTable snapshots={snapshots} />
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
}

type HistorySummaryProps = {
  snapshots: SlotHistoryEntry[];
  statusCounts: Record<SlotHistoryStatus, number>;
  latest: SlotHistoryEntry;
};

function HistorySummary({ snapshots, statusCounts, latest }: HistorySummaryProps) {
  return (
    <section aria-labelledby="history-summary-title" className="history-page__summary">
      <h2 id="history-summary-title" className="tw:mb-3 tw:text-lg tw:font-semibold">
        Observation summary
      </h2>
      <div className="history-page__summary-grid tw:grid tw:gap-3 tw:sm:grid-cols-3">
        <SummaryCard label="Stored observations" value={String(snapshots.length)} />
        <SummaryCard label="Latest state" value={STATUS_LABELS[latest.status]} />
        <SummaryCard
          label="Availability observed"
          value={`${statusCounts.available} of ${snapshots.length} fetches`}
        />
      </div>
      <p className="history-page__summary-note tw:mt-2 tw:text-xs tw:text-muted-foreground">
        Rows are stored fetches, not scheduled monitoring. Repeated observations are kept
        intentionally.
      </p>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="history-page__summary-card tw:gap-1 tw:px-4 tw:py-3">
      <span className="tw:text-xs tw:text-muted-foreground">{label}</span>
      <strong className="tw:text-sm">{value}</strong>
    </Card>
  );
}

function HistoryChangeSignal({
  snapshots,
  insight,
}: {
  snapshots: SlotHistoryEntry[];
  insight: HistoryChangeInsight;
}) {
  const latestChange = insight.latestChange;
  const loadedBoundaries =
    insight.counts.changed + insight.counts.unchanged + insight.counts.not_comparable;

  return (
    <section
      aria-labelledby="history-change-title"
      className="history-page__change-signal tw:flex tw:flex-col tw:gap-3"
    >
      <div>
        <h2 id="history-change-title" className="tw:text-lg tw:font-semibold">
          Stored status change
        </h2>
        <p className="tw:mt-1 tw:max-w-3xl tw:text-xs tw:text-muted-foreground">
          Neighboring rows are comparable only when they used the same request date. This avoids
          describing a changed search horizon as changed availability.
        </p>
      </div>

      <dl className="history-page__change-grid tw:grid tw:gap-3 tw:lg:grid-cols-3">
        <Card className="history-page__change-card tw:gap-1 tw:px-4 tw:py-3">
          <dt className="tw:text-xs tw:text-muted-foreground">Newest comparable run</dt>
          <dd className="tw:text-sm tw:font-semibold">
            {insight.comparableRunLength} {pluralizeObservation(insight.comparableRunLength)} with{" "}
            {STATUS_LABELS[snapshots[0].status]}
          </dd>
        </Card>

        <Card className="history-page__change-card tw:gap-1 tw:px-4 tw:py-3">
          <dt className="tw:text-xs tw:text-muted-foreground">Latest comparable change</dt>
          <dd className="tw:text-sm">
            {latestChange ? (
              <>
                <strong>
                  {STATUS_LABELS[latestChange.fromStatus]} &rarr;{" "}
                  {STATUS_LABELS[latestChange.toStatus]}
                </strong>
                <span className="tw:mt-1 tw:block tw:text-xs tw:text-muted-foreground">
                  Observed after{" "}
                  <time dateTime={latestChange.olderObservedAt}>
                    {formatObservedAt(latestChange.olderObservedAt)}
                  </time>{" "}
                  and by{" "}
                  <time dateTime={latestChange.newerObservedAt}>
                    {formatObservedAt(latestChange.newerObservedAt)}
                  </time>
                  . Both used request date{" "}
                  <code className="tw:font-mono">{latestChange.currentDate}</code>.
                </span>
              </>
            ) : snapshots.length === 1 ? (
              "Not enough loaded observations to compare."
            ) : (
              "No comparable state change appears in this loaded window."
            )}
          </dd>
        </Card>

        <Card className="history-page__change-card tw:gap-1 tw:px-4 tw:py-3">
          <dt className="tw:text-xs tw:text-muted-foreground">Loaded row boundaries</dt>
          <dd className="tw:text-sm tw:font-semibold">
            {insight.counts.changed} changed · {insight.counts.unchanged} unchanged ·{" "}
            {insight.counts.not_comparable} different request date
          </dd>
          <dd className="tw:text-xs tw:text-muted-foreground">
            {loadedBoundaries} of {Math.max(0, snapshots.length - 1)} possible comparisons
            classified.
          </dd>
        </Card>
      </dl>

      <p className="history-page__change-note tw:text-xs tw:text-muted-foreground">
        A changed label means two stored fetches bracket different summarized states; the exact
        change time is unknown. This selected window is not continuous monitoring, a forecast, or
        proof of current availability.
      </p>
    </section>
  );
}

function HistoryTable({ snapshots }: { snapshots: SlotHistoryEntry[] }) {
  return (
    <Card className="history-page__table-card tw:gap-3">
      <CardHeader>
        <h2 id="history-table-title" className="tw:text-lg tw:font-semibold">
          Recent observations
        </h2>
        <p id="history-table-hint" className="tw:text-xs tw:text-muted-foreground">
          Newest first. On narrow screens, scroll the table horizontally to reach every column.
        </p>
      </CardHeader>
      <CardContent>
        <section
          aria-labelledby="history-table-title"
          aria-describedby="history-table-hint"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: The labeled horizontal scroll region must be keyboard-focusable so keyboard users can reach every column.
          tabIndex={0}
          className="history-page__table-scroll tw:overflow-x-auto tw:rounded-md tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring"
        >
          <Table className="history-page__table">
            <TableCaption className="tw:sr-only">
              Stored slot availability observations, newest first
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Observed</TableHead>
                <TableHead scope="col">Request date</TableHead>
                <TableHead scope="col">State</TableHead>
                <TableHead scope="col">Compared with older row</TableHead>
                <TableHead scope="col">Available days</TableHead>
                <TableHead scope="col">First available</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map((snapshot) => (
                <TableRow key={snapshot.observation_id}>
                  <TableCell className="tw:whitespace-nowrap">
                    <time dateTime={snapshot.fetched_at}>
                      {formatObservedAt(snapshot.fetched_at)}
                    </time>
                  </TableCell>
                  <TableCell className="tw:whitespace-nowrap tw:font-mono tw:text-xs">
                    {snapshot.current_date}
                  </TableCell>
                  <TableCell>
                    <HistoryStatus status={snapshot.status} />
                  </TableCell>
                  <TableCell className="tw:min-w-52 tw:text-xs tw:text-muted-foreground">
                    {historyComparisonLabel(snapshot)}
                  </TableCell>
                  <TableCell className="tw:whitespace-nowrap tw:font-mono tw:text-sm">
                    {snapshot.available_days} / {snapshot.total_days}
                  </TableCell>
                  <TableCell className="tw:min-w-52">
                    {snapshot.first_available ? (
                      <span className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                        <span className="tw:font-mono tw:text-sm">
                          {snapshot.first_available.date}
                        </span>
                        <Badge
                          className="history-page__upstream-status tw:text-white"
                          style={{ backgroundColor: snapshot.first_available.color }}
                        >
                          {snapshot.first_available.message}
                        </Badge>
                      </span>
                    ) : (
                      <span className="tw:text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </CardContent>
    </Card>
  );
}

function HistoryStatus({ status }: { status: SlotHistoryStatus }) {
  return (
    <Badge
      variant={status === "available" ? "default" : status === "full" ? "destructive" : "secondary"}
      className={`history-page__status history-page__status--${status}`}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}

function historyComparisonLabel(snapshot: SlotHistoryEntry): string {
  switch (snapshot.comparison) {
    case "changed":
      return snapshot.previous_status
        ? `Changed from ${STATUS_LABELS[snapshot.previous_status]}`
        : "Changed from the older stored state";
    case "unchanged":
      return "Same as the preceding stored fetch";
    case "not_comparable":
      return "Different request date; not compared";
    case "no_baseline":
      return "Oldest loaded row; no baseline in this window";
  }
}

function pluralizeObservation(count: number): string {
  return count === 1 ? "observation" : "observations";
}

function ErrorNotice({
  label,
  message,
  onRetry,
}: {
  label: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="history-page__error tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive"
    >
      <span className="tw:break-all">
        <strong>{label}:</strong> {message}
      </span>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="tw:shrink-0"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

function formatObservedAt(value: string | null): string {
  if (!value) return "unknown time";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
