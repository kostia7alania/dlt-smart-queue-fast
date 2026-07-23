"use client";

import { useId, useMemo, useState } from "react";

import { filterOffices, type Office, type Sourced } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardHeader } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";

type OfficeMultiSelectProps = {
  offices: Sourced<Office[]> | null;
  loading: boolean;
  selectedSiteIds: number[];
  maxSelected: number;
  onToggle: (siteId: number) => void;
};

export function OfficeMultiSelect({
  offices,
  loading,
  selectedSiteIds,
  maxSelected,
  onToggle,
}: OfficeMultiSelectProps) {
  const [search, setSearch] = useState("");
  const searchId = useId();
  const allOffices = offices?.data ?? [];

  const filtered = useMemo(() => filterOffices(allOffices, search), [allOffices, search]);

  const atCap = selectedSiteIds.length >= maxSelected;

  return (
    <Card aria-busy={loading} className="office-multi-select tw:gap-3">
      <CardHeader>
        <h2 className="office-multi-select__title tw:flex tw:items-center tw:justify-between tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
          Offices
          {offices?.source === "snapshot" && (
            <Badge variant="secondary" className="office-multi-select__source-badge">
              stored data
            </Badge>
          )}
        </h2>
        <p className="office-multi-select__hint tw:text-xs tw:text-muted-foreground">
          Pick up to {maxSelected} offices to compare ({selectedSiteIds.length} selected).
        </p>
      </CardHeader>
      <div className="office-multi-select__body tw:flex tw:flex-col tw:gap-3 tw:px-4">
        <label htmlFor={searchId} className="office-multi-select__search-label tw:sr-only">
          Search offices
        </label>
        <Input
          id={searchId}
          type="search"
          value={search}
          aria-describedby={`${searchId}-count`}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search office name..."
          className="office-multi-select__search"
        />
        <p
          id={`${searchId}-count`}
          className="office-multi-select__count tw:text-xs tw:text-muted-foreground"
        >
          Showing {filtered.length} of {allOffices.length} offices
        </p>
        {atCap && (
          <p role="status" className="office-multi-select__cap tw:text-xs tw:text-amber-600">
            Selection limit reached — unselect an office to add another.
          </p>
        )}
        {/* biome-ignore lint/a11y/noRedundantRoles: Tailwind preflight strips list-style, so Safari/VoiceOver drops list semantics without an explicit role. */}
        <ul role="list" className="office-multi-select__list tw:max-h-[420px] tw:overflow-auto">
          {loading && (
            <li className="office-multi-select__loading tw:p-3 tw:text-sm tw:text-muted-foreground">
              Loading offices...
            </li>
          )}
          {filtered.map((office) => {
            const checked = selectedSiteIds.includes(office.sit_id);
            const disabled = !checked && atCap;
            return (
              <li key={office.sit_id}>
                <label
                  htmlFor={`${searchId}-office-${office.sit_id}`}
                  className={cn(
                    "office-multi-select__item tw:flex tw:w-full tw:cursor-pointer tw:items-center tw:gap-2 tw:rounded-md tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:transition tw:hover:bg-muted",
                    checked &&
                      "office-multi-select__item--selected tw:bg-primary/10 tw:font-semibold tw:text-primary",
                    disabled &&
                      "office-multi-select__item--disabled tw:cursor-not-allowed tw:opacity-50",
                  )}
                >
                  <Checkbox
                    id={`${searchId}-office-${office.sit_id}`}
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => onToggle(office.sit_id)}
                    className="office-multi-select__checkbox"
                  />
                  <span className="office-multi-select__name">
                    {office.sit_name}
                    <span className="office-multi-select__id tw:ml-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
                      #{office.sit_id}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
          {offices && filtered.length === 0 && (
            <li className="office-multi-select__empty tw:p-3 tw:text-sm tw:text-muted-foreground">
              No offices match the search.
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
