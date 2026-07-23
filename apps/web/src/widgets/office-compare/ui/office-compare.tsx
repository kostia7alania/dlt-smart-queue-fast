"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { CompareOfficeResult, Office } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
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

type OfficeCompareProps = {
  results: CompareOfficeResult[];
  offices: Office[];
  currentDate: string;
  keyword: string;
};

// Sort: earliest first available date wins; rows without availability follow,
// then rows without data (error) at the bottom. Ties keep request order.
function rank(result: CompareOfficeResult): number {
  if (result.error) return 2;
  if (!result.first_available) return 1;
  return 0;
}

export function OfficeCompare({ results, offices, currentDate, keyword }: OfficeCompareProps) {
  const officeNameById = useMemo(() => {
    const map = new Map<number, string>();
    for (const office of offices) {
      map.set(office.sit_id, office.sit_name);
    }
    return map;
  }, [offices]);

  const sorted = useMemo(() => {
    return [...results].sort((a, b) => {
      const rankDelta = rank(a) - rank(b);
      if (rankDelta !== 0) return rankDelta;
      if (a.first_available && b.first_available) {
        return a.first_available.date.localeCompare(b.first_available.date);
      }
      return 0;
    });
  }, [results]);

  return (
    <Card className="office-compare tw:gap-3">
      <CardHeader>
        <h2 className="office-compare__title tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
          Comparison for {currentDate}
        </h2>
        <p className="office-compare__hint tw:text-xs tw:text-muted-foreground">
          Sorted by earliest available day. Day statuses and colors come from the DLT API unchanged.
        </p>
      </CardHeader>
      <CardContent>
        <div className="office-compare__scroll tw:overflow-x-auto">
          <Table className="office-compare__table">
            <TableCaption className="tw:sr-only">
              Availability comparison across selected offices
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Office</TableHead>
                <TableHead scope="col">First available</TableHead>
                <TableHead scope="col">Days</TableHead>
                <TableHead scope="col">Work type</TableHead>
                <TableHead scope="col">Data</TableHead>
                <TableHead scope="col">
                  <span className="tw:sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((result) => (
                <TableRow
                  key={result.sit_id}
                  className={cn(
                    "office-compare__row",
                    result.error && "office-compare__row--error tw:opacity-70",
                  )}
                >
                  <TableCell className="office-compare__office tw:max-w-64 tw:whitespace-normal tw:font-medium">
                    {officeNameById.get(result.sit_id) ?? `Office #${result.sit_id}`}
                    <span className="tw:ml-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
                      #{result.sit_id}
                    </span>
                  </TableCell>
                  <TableCell className="office-compare__first">
                    {result.first_available ? (
                      <span className="tw:flex tw:items-center tw:gap-2">
                        <span className="tw:font-mono">{result.first_available.date}</span>
                        <Badge
                          className="office-compare__day-status tw:text-white"
                          style={{ backgroundColor: result.first_available.color }}
                        >
                          {result.first_available.message}
                        </Badge>
                      </span>
                    ) : (
                      <span className="tw:text-muted-foreground">{statusText(result)}</span>
                    )}
                  </TableCell>
                  <TableCell className="office-compare__days tw:font-mono tw:text-sm">
                    {result.error ? "—" : `${result.available_days} / ${result.total_days}`}
                  </TableCell>
                  <TableCell className="office-compare__work-type tw:max-w-56 tw:whitespace-normal tw:text-xs">
                    {result.work_type ? (
                      <>
                        {result.work_type.tyw_name}
                        <span className="tw:ml-1 tw:font-mono tw:text-muted-foreground">
                          tyw_id {result.work_type.tyw_id}
                        </span>
                      </>
                    ) : (
                      <span className="tw:text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="office-compare__source tw:text-xs">
                    {result.source === "snapshot" ? (
                      <Badge variant="secondary" className="office-compare__source-badge">
                        stored {formatFreshness(result.fetched_at)}
                      </Badge>
                    ) : result.source === "live" ? (
                      <Badge variant="outline" className="office-compare__source-badge">
                        live
                      </Badge>
                    ) : (
                      <span className="tw:text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="office-compare__actions">
                    <Link
                      href={`/calendar?siteId=${result.sit_id}&keyword=${encodeURIComponent(keyword)}`}
                      className={cn(
                        buttonVariants({ size: "sm", variant: "outline" }),
                        "office-compare__calendar-link",
                      )}
                    >
                      Open calendar
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function statusText(result: CompareOfficeResult): string {
  if (result.error) return `No data: ${result.error}`;
  if (!result.work_type) return "No work types for this option";
  if (result.total_days === 0) return "No bookable days returned";
  return "No available days";
}

function formatFreshness(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}
