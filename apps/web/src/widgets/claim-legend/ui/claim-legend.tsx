import { CLAIM_LABEL, type GuideClaim } from "@/entities/guide";
import { cn } from "@/shared/lib/utils";
import { badgeVariants } from "@/shared/ui/badge";

// One legend, used wherever claim badges appear, so a reader learns the
// evidence boundary once instead of inferring it from badge colours.

const CLAIM_MEANING: Record<GuideClaim["kind"], string> = {
  proven: "observed in the appointment data this site reads",
  "official-only": "only the Department of Land Transport can confirm it",
  reported: "someone else reported it — source and read date are shown",
};

const CLAIM_VARIANT: Record<GuideClaim["kind"], "secondary" | "outline"> = {
  proven: "secondary",
  "official-only": "outline",
  reported: "outline",
};

const KINDS: readonly GuideClaim["kind"][] = ["proven", "official-only", "reported"];

export function ClaimLegend({ className }: { className?: string }) {
  return (
    <aside
      aria-label="How statements on this page are labelled"
      className={cn(
        "claim-legend tw:rounded-xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-4",
        className,
      )}
    >
      <p className="claim-legend__title tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-800">
        HOW TO READ THIS PAGE
      </p>
      <dl className="claim-legend__list tw:mt-3 tw:grid tw:gap-2 tw:text-sm">
        {KINDS.map((kind) => (
          <div key={kind} className="tw:flex tw:flex-wrap tw:items-baseline tw:gap-2">
            <dt>
              <span className={cn(badgeVariants({ variant: CLAIM_VARIANT[kind] }))}>
                {CLAIM_LABEL[kind]}
              </span>
            </dt>
            <dd className="tw:text-stone-600">{CLAIM_MEANING[kind]}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
