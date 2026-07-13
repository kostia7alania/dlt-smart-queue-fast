"use client";

import { useMemo, useState } from "react";

import type { Office, Sourced } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type OfficeSelectProps = {
  offices: Sourced<Office[]> | null;
  loading: boolean;
  selectedSiteId: number;
  onSelect: (siteId: number) => void;
};

export function OfficeSelect({ offices, loading, selectedSiteId, onSelect }: OfficeSelectProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const all = offices?.data ?? [];
    if (!query) return all;
    return all.filter((office) => office.sit_name.toLowerCase().includes(query));
  }, [offices, search]);

  return (
    <Card aria-busy={loading} className="office-select tw:gap-3">
      <CardHeader>
        <h2 className="office-select__title tw:flex tw:items-center tw:justify-between tw:font-heading tw:text-base tw:leading-snug tw:font-medium">
          Offices
          {offices?.source === "snapshot" && (
            <Badge variant="secondary" className="office-select__source-badge">
              stored data
            </Badge>
          )}
        </h2>
      </CardHeader>
      <div className="office-select__body tw:flex tw:flex-col tw:gap-3 tw:px-4">
        <label htmlFor="office-search" className="office-select__search-label tw:sr-only">
          Search offices
        </label>
        <Input
          id="office-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search office name..."
          className="office-select__search"
        />
        {/* biome-ignore lint/a11y/noRedundantRoles: Tailwind preflight strips list-style, so Safari/VoiceOver drops list semantics without an explicit role. */}
        <ul role="list" className="office-select__list tw:max-h-[420px] tw:overflow-auto">
          {loading && (
            <li className="office-select__loading tw:p-3 tw:text-sm tw:text-muted-foreground">
              Loading offices...
            </li>
          )}
          {filtered.map((office) => (
            <li key={office.sit_id}>
              <button
                type="button"
                aria-pressed={office.sit_id === selectedSiteId}
                onClick={() => onSelect(office.sit_id)}
                className={cn(
                  "office-select__item tw:block tw:w-full tw:rounded-md tw:px-3 tw:py-2 tw:text-left tw:text-sm tw:transition tw:hover:bg-muted",
                  office.sit_id === selectedSiteId &&
                    "office-select__item--active tw:bg-primary/10 tw:font-semibold tw:text-primary",
                )}
              >
                {office.sit_name}
                <span className="office-select__id tw:ml-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
                  #{office.sit_id}
                </span>
              </button>
            </li>
          ))}
          {offices && filtered.length === 0 && (
            <li className="office-select__empty tw:p-3 tw:text-sm tw:text-muted-foreground">
              No offices match the search.
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
