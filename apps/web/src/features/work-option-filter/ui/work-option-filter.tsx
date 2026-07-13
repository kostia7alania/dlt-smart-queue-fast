"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";

type WorkOptionFilterProps = {
  keywords: readonly string[];
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (value: boolean) => void;
  officeName?: string;
};

export function WorkOptionFilter({
  keywords,
  keyword,
  onKeywordChange,
  availableOnly,
  onAvailableOnlyChange,
  officeName,
}: WorkOptionFilterProps) {
  return (
    <Card className="work-option-filter tw:flex-row tw:flex-wrap tw:items-center tw:gap-3 tw:px-4 tw:py-3">
      <fieldset className="work-option-filter__keywords tw:flex tw:gap-1 tw:rounded-full tw:border tw:border-border tw:p-1">
        <legend className="work-option-filter__legend tw:sr-only">Work option</legend>
        {keywords.map((option) => (
          <Button
            key={option}
            type="button"
            aria-pressed={keyword === option}
            size="sm"
            variant={keyword === option ? "default" : "ghost"}
            onClick={() => onKeywordChange(option)}
            className={cn(
              "work-option-filter__keyword tw:rounded-full",
              keyword === option && "work-option-filter__keyword--active",
            )}
          >
            {option.trim()}
          </Button>
        ))}
      </fieldset>
      <label
        htmlFor="available-only"
        className="work-option-filter__available tw:flex tw:items-center tw:gap-2 tw:text-sm"
      >
        <Checkbox
          id="available-only"
          checked={availableOnly}
          onCheckedChange={(checked) => onAvailableOnlyChange(checked === true)}
        />
        Available only
      </label>
      {officeName && (
        <span className="work-option-filter__office tw:ml-auto tw:text-xs tw:text-muted-foreground">
          {officeName}
        </span>
      )}
    </Card>
  );
}
