"use client";

import { useMemo, useState } from "react";

import type { SlotDay, Sourced } from "@/entities/dlt";
import {
  daysInMonth,
  firstWeekday,
  monthKey,
  monthLabel,
  monthRange,
  WEEKDAYS,
} from "@/shared/lib/calendar";
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

type SlotCalendarProps = {
  slots: Sourced<SlotDay[]> | null;
  holidays: Set<string>;
  availableOnly: boolean;
};

export function SlotCalendar({ slots, holidays, availableOnly }: SlotCalendarProps) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const boundedIndex = Math.min(monthIndex, Math.max(months.length - 1, 0));
  const currentMonth = months[boundedIndex] ?? null;
  const selectedDay = selectedDate ? slotsByDate.get(selectedDate) : null;

  if (slots && slots.data.length === 0) {
    return (
      <Card className="slot-calendar slot-calendar--empty tw:gap-1 tw:p-5">
        <h2 className="slot-calendar__empty-title tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
          No appointment days returned
        </h2>
        <p className="slot-calendar__empty-copy tw:text-sm tw:text-muted-foreground">
          This lookup completed successfully, but DLT returned no bookable dates. Try another office
          or work option.
        </p>
      </Card>
    );
  }

  if (!currentMonth) return null;

  return (
    <div className="slot-calendar tw:flex tw:flex-col tw:gap-4">
      <Card className="slot-calendar__month tw:gap-3">
        <CardHeader className="tw:flex tw:flex-row tw:items-center tw:justify-between">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="slot-calendar__nav slot-calendar__nav--prev tw:rounded-full"
            aria-label={`Previous month before ${monthLabel(currentMonth)}`}
            disabled={boundedIndex === 0}
            onClick={() => setMonthIndex((index) => Math.max(index - 1, 0))}
          >
            &larr;
          </Button>
          <h2 className="slot-calendar__month-label tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
            {monthLabel(currentMonth)}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="slot-calendar__nav slot-calendar__nav--next tw:rounded-full"
            aria-label={`Next month after ${monthLabel(currentMonth)}`}
            disabled={boundedIndex >= months.length - 1}
            onClick={() => setMonthIndex((index) => Math.min(index + 1, months.length - 1))}
          >
            &rarr;
          </Button>
        </CardHeader>
        <CardContent>
          <div className="slot-calendar__weekdays tw:grid tw:grid-cols-7 tw:gap-1 tw:text-center tw:text-xs tw:text-muted-foreground">
            {WEEKDAYS.map((day) => (
              <div key={day} className="slot-calendar__weekday tw:py-1 tw:font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="slot-calendar__grid tw:grid tw:grid-cols-7 tw:gap-1">
            {WEEKDAYS.slice(0, firstWeekday(currentMonth)).map((weekday) => (
              <div key={`pad-${weekday}`} className="slot-calendar__pad" />
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
                  aria-label={`${date}: ${slotDay?.message ?? "not bookable"}${isHoliday ? ", holiday" : ""}`}
                  aria-pressed={selectedDate === date}
                  disabled={!slotDay}
                  onClick={() => setSelectedDate(date)}
                  style={slotDay ? { backgroundColor: slotDay.color } : undefined}
                  className={cn(
                    "slot-calendar__day tw:flex tw:min-h-16 tw:flex-col tw:items-center tw:justify-center tw:rounded-md tw:border tw:p-1 tw:text-sm tw:transition",
                    slotDay
                      ? "slot-calendar__day--bookable tw:border-transparent tw:text-white tw:hover:opacity-90"
                      : "slot-calendar__day--closed tw:border-border/50 tw:text-muted-foreground",
                    slotDay?.message === "เต็ม" && "slot-calendar__day--full",
                    isHoliday && "slot-calendar__day--holiday",
                    dimmed && "slot-calendar__day--dimmed tw:opacity-25",
                    selectedDate === date &&
                      "slot-calendar__day--selected tw:ring-2 tw:ring-ring tw:ring-offset-1",
                  )}
                >
                  <span className="slot-calendar__day-number tw:font-semibold">{dayNumber}</span>
                  {slotDay && (
                    <span className="slot-calendar__day-status tw:text-[10px] tw:leading-tight">
                      {slotDay.message}
                    </span>
                  )}
                  {isHoliday && (
                    <span className="slot-calendar__day-holiday tw:text-[9px] tw:uppercase tw:tracking-wide tw:opacity-80">
                      holiday
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="slot-calendar__legend tw:mt-3 tw:text-xs tw:text-muted-foreground">
            Colors and statuses come from the DLT API. Days without data are not bookable.
          </p>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card className="slot-calendar__details tw:gap-3">
          <CardHeader>
            <h2 className="slot-calendar__details-title tw:flex tw:items-center tw:gap-3 tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
              {selectedDay.date}
              <Badge
                className="slot-calendar__details-status tw:text-white"
                style={{ backgroundColor: selectedDay.color }}
              >
                {selectedDay.message}
              </Badge>
            </h2>
          </CardHeader>
          <CardContent>
            <Table className="slot-calendar__rounds">
              <TableCaption className="tw:sr-only">
                Appointment rounds for {selectedDay.date}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Round</TableHead>
                  <TableHead scope="col">Count</TableHead>
                  <TableHead scope="col">MaxCount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDay.siteopen.map((round) => (
                  <TableRow key={round.round} className="slot-calendar__round">
                    <TableCell className="tw:font-mono tw:text-xs">{round.round}</TableCell>
                    <TableCell>{String(round.count)}</TableCell>
                    <TableCell>{round.MaxCount}</TableCell>
                  </TableRow>
                ))}
                {selectedDay.siteopen.length === 0 && (
                  <TableRow className="slot-calendar__round slot-calendar__round--empty">
                    <TableCell colSpan={3} className="tw:text-muted-foreground">
                      No rounds returned for this day.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
