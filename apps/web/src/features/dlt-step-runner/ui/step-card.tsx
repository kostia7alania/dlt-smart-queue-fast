"use client";

import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export type DLTStep = {
  id: string;
  title: string;
  description: string;
  endpoint: () => string;
  disabled?: () => boolean;
};

type StepCardProps = {
  step: DLTStep;
  loading: boolean;
  disabled: boolean;
  onRun: (step: DLTStep) => void;
  /** live steps run against upstream, snapshot steps read stored data */
  tone?: "live" | "snapshot";
};

export function StepCard({ step, loading, disabled, onRun, tone = "live" }: StepCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onRun(step)}
      className={cn(
        "dlt-step tw:rounded-xl tw:border tw:border-border tw:bg-card tw:p-4 tw:text-left tw:shadow-sm tw:transition tw:hover:-translate-y-0.5 tw:hover:shadow-md tw:disabled:cursor-not-allowed tw:disabled:opacity-50",
        tone === "snapshot" && "dlt-step--snapshot",
        loading && "dlt-step--loading",
      )}
    >
      <span className="dlt-step__title tw:block tw:font-semibold">{step.title}</span>
      <span className="dlt-step__endpoint tw:mt-2 tw:block tw:break-all tw:font-mono tw:text-xs tw:text-muted-foreground">
        {step.description}
      </span>
      <span
        className={cn(
          buttonVariants({ size: "sm", variant: tone === "snapshot" ? "secondary" : "default" }),
          "dlt-step__run tw:mt-3 tw:rounded-full",
        )}
      >
        {loading ? "Loading..." : tone === "snapshot" ? "Load" : "Run"}
      </span>
    </button>
  );
}
