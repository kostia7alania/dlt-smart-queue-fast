"use client";

import { useMemo, useState } from "react";

import type { Office, Sourced } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardHeader, CardTitle } from "@/shared/ui/card";
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
    <Card className="office-select tw:gap-3">
      <CardHeader>
        <CardTitle className="office-select__title tw:flex tw:items-center tw:justify-between">
          Offices
          {offices?.source === "snapshot" && (
            <Badge variant="secondary" className="office-select__source-badge">
              stored data
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <div className="office-select__body tw:flex tw:flex-col tw:gap-3 tw:px-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search office name..."
          className="office-select__search"
        />
        <div className="office-select__list tw:max-h-[420px] tw:overflow-auto">
          {loading && (
            <div className="office-select__loading tw:p-3 tw:text-sm tw:text-muted-foreground">
              Loading offices...
            </div>
          )}
          {filtered.map((office) => (
            <button
              key={office.sit_id}
              type="button"
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
          ))}
          {offices && filtered.length === 0 && (
            <div className="office-select__empty tw:p-3 tw:text-sm tw:text-muted-foreground">
              No offices match the search.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
