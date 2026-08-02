"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  type CompareResponse,
  DEFAULT_WORK_KEYWORD,
  fetchCompare,
  fetchOffices,
  isAbortError,
  type Office,
  parseSiteIDs,
  parseWorkKeyword,
  type Sourced,
  WORK_KEYWORDS,
} from "@/entities/dlt";
import { OfficeMultiSelect } from "@/features/office-multi-select";
import { todayISO } from "@/shared/lib/calendar";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { OfficeCompare } from "@/widgets/office-compare";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

// Mirrors the backend cap (specs/009-availability-comparison/spec.md).
const MAX_OFFICES = 8;

export function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [offices, setOffices] = useState<Sourced<Office[]> | null>(null);
  const [officesLoading, setOfficesLoading] = useState(true);
  const [officesError, setOfficesError] = useState<string | null>(null);

  const selectedSiteIds = useMemo(
    () => parseSiteIDs(searchParams.get("siteIds"), MAX_OFFICES),
    [searchParams],
  );
  const selectedSiteIDsKey = selectedSiteIds.join(",");
  const keyword = parseWorkKeyword(searchParams.get("keyword"));
  const comparisonInput = `${selectedSiteIDsKey}\u0000${keyword}`;

  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [comparing, setComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  // Guards a slow comparison for a previous selection from overwriting a newer one.
  const compareRequestRef = useRef(0);
  const compareAbortRef = useRef<AbortController | null>(null);
  const previousComparisonInputRef = useRef<string | null>(null);

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

  useEffect(() => {
    const controller = new AbortController();
    loadOffices(controller.signal);
    return () => controller.abort();
  }, [loadOffices]);

  const runComparison = useCallback(async (siteIds: number[], kw: string) => {
    if (siteIds.length === 0) return;
    compareAbortRef.current?.abort();
    const controller = new AbortController();
    compareAbortRef.current = controller;
    const requestId = ++compareRequestRef.current;
    const isStale = () => compareRequestRef.current !== requestId;

    setComparing(true);
    setCompareError(null);
    try {
      const result = await fetchCompare(siteIds, kw, todayISO(), controller.signal);
      if (!isStale()) setComparison(result);
    } catch (err) {
      if (isAbortError(err)) return;
      if (!isStale()) {
        setCompareError(err instanceof Error ? err.message : "Comparison failed");
      }
    } finally {
      if (!isStale()) setComparing(false);
    }
  }, []);

  useEffect(() => {
    if (previousComparisonInputRef.current === comparisonInput) return;
    previousComparisonInputRef.current = comparisonInput;
    compareRequestRef.current++;
    compareAbortRef.current?.abort();
    setComparing(false);
    setComparison(null);
    setCompareError(null);
  }, [comparisonInput]);

  useEffect(
    () => () => {
      compareRequestRef.current++;
      compareAbortRef.current?.abort();
    },
    [],
  );

  // Deep links (?siteIds=) run the comparison once on mount.
  const autoRanRef = useRef(false);
  useEffect(() => {
    if (autoRanRef.current) return;
    autoRanRef.current = true;
    if (selectedSiteIds.length > 0) {
      runComparison(selectedSiteIds, keyword);
    }
  }, [keyword, runComparison, selectedSiteIds]);

  const toggleOffice = (siteId: number) => {
    const nextSiteIDs = selectedSiteIds.includes(siteId)
      ? selectedSiteIds.filter((id) => id !== siteId)
      : selectedSiteIds.length < MAX_OFFICES
        ? [...selectedSiteIds, siteId]
        : selectedSiteIds;
    updateQuery({ siteIds: nextSiteIDs.length > 0 ? nextSiteIDs.join(",") : null });
  };

  return (
    <div className="compare-page tw:flex tw:min-h-screen tw:flex-col tw:bg-background tw:text-foreground">
      <PublicSiteHeader />
      <main className="compare-page__body tw:flex-1 tw:p-6 tw:md:p-10">
        <div className="compare-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-6">
          <div className="compare-page__header">
            <h1 className="compare-page__title tw:mt-4 tw:text-3xl tw:font-bold">
              Compare Office Availability
            </h1>
            <p className="compare-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
              Pick up to {MAX_OFFICES} offices and one work option to see which office has the
              earliest available appointment day. Recent stored data is reused to keep upstream
              traffic polite.
            </p>
          </div>

          {officesError && (
            <div
              role="alert"
              className="compare-page__error tw:flex tw:items-center tw:justify-between tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive"
            >
              <span className="tw:break-all">Office list: {officesError}</span>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="compare-page__retry tw:ml-4 tw:shrink-0 tw:rounded-full"
                onClick={() => loadOffices()}
              >
                Retry office list
              </Button>
            </div>
          )}

          <div className="compare-page__layout tw:grid tw:gap-6 tw:lg:grid-cols-[320px_1fr]">
            <OfficeMultiSelect
              offices={offices}
              loading={officesLoading}
              selectedSiteIds={selectedSiteIds}
              maxSelected={MAX_OFFICES}
              onToggle={toggleOffice}
            />

            <section
              aria-busy={comparing}
              className="compare-page__content tw:flex tw:flex-col tw:gap-4"
            >
              <Card className="compare-page__controls tw:flex-row tw:flex-wrap tw:items-center tw:gap-3 tw:px-4 tw:py-3">
                <fieldset className="compare-page__keywords tw:flex tw:gap-1 tw:rounded-full tw:border tw:border-border tw:p-1">
                  <legend className="compare-page__keywords-legend tw:sr-only">Work option</legend>
                  {WORK_KEYWORDS.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      aria-pressed={keyword === option}
                      size="sm"
                      variant={keyword === option ? "default" : "ghost"}
                      onClick={() =>
                        updateQuery({
                          keyword: option === DEFAULT_WORK_KEYWORD ? null : option,
                        })
                      }
                      className={cn(
                        "compare-page__keyword tw:rounded-full",
                        keyword === option && "compare-page__keyword--active",
                      )}
                    >
                      {option.trim()}
                    </Button>
                  ))}
                </fieldset>
                <Button
                  type="button"
                  disabled={selectedSiteIds.length === 0 || comparing}
                  onClick={() => runComparison(selectedSiteIds, keyword)}
                  className="compare-page__run tw:ml-auto"
                >
                  {comparing
                    ? "Comparing..."
                    : `Compare ${selectedSiteIds.length || ""} office${selectedSiteIds.length === 1 ? "" : "s"}`}
                </Button>
              </Card>

              {compareError && (
                <div
                  role="alert"
                  className="compare-page__compare-error tw:flex tw:items-center tw:justify-between tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive"
                >
                  <span className="tw:break-all">Comparison: {compareError}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="compare-page__compare-retry tw:ml-4 tw:shrink-0 tw:rounded-full"
                    onClick={() => runComparison(selectedSiteIds, keyword)}
                  >
                    Retry comparison
                  </Button>
                </div>
              )}

              {comparing && (
                <div className="compare-page__loading tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                  Comparing offices one by one (politeness pause between live lookups)...
                </div>
              )}

              {!comparing && !comparison && !compareError && (
                <div className="compare-page__empty tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
                  Select offices on the left and press Compare.
                </div>
              )}

              {comparison && !comparing && (
                <OfficeCompare
                  results={comparison.results}
                  offices={offices?.data ?? []}
                  currentDate={comparison.current_date}
                  keyword={comparison.keyword}
                />
              )}
            </section>
          </div>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
