import { ArrowRight, ExternalLink, ServerOff } from "lucide-react";
import Link from "next/link";

import {
  OFFICES_PATH,
  OFFICIAL_DLT_BOOKING_LABEL,
  OFFICIAL_DLT_BOOKING_URL,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";

type BffRequiredPageProps = {
  toolName: string;
};

export function BffRequiredPage({ toolName }: BffRequiredPageProps) {
  return (
    <main className="bff-required-page tw:flex tw:flex-1 tw:items-center tw:bg-[#f5f1e8] tw:px-5 tw:py-16 tw:text-stone-950 tw:sm:px-8 tw:sm:py-24">
      <section
        aria-labelledby="bff-required-title"
        className="tw:mx-auto tw:grid tw:w-full tw:max-w-5xl tw:gap-10 tw:rounded-3xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-7 tw:sm:p-10 tw:lg:grid-cols-[auto_1fr]"
      >
        <ServerOff aria-hidden="true" className="tw:size-8 tw:text-emerald-700" />
        <div>
          <Badge
            variant="outline"
            className="tw:border-stone-900/15 tw:bg-transparent tw:px-3 tw:py-1 tw:font-mono tw:text-[0.7rem] tw:tracking-[0.14em]"
          >
            FULL BACKEND REQUIRED
          </Badge>
          <h1
            id="bff-required-title"
            className="tw:mt-6 tw:max-w-3xl tw:text-4xl tw:font-semibold tw:tracking-[-0.04em] tw:text-balance tw:sm:text-5xl"
          >
            {toolName} is not active in this free release.
          </h1>
          <p className="tw:mt-5 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-stone-600">
            The free site keeps the licence guides, refreshed office directory, and office map
            online. Slot dates, office comparison, and stored slot history need the Go BFF and are
            not shown as if they were available.
          </p>
          <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
            <Link
              href={OFFICES_PATH}
              className={cn(
                buttonVariants({ size: "lg" }),
                "tw:h-11 tw:rounded-full tw:bg-emerald-700 tw:px-5 tw:text-white tw:hover:bg-emerald-800",
              )}
            >
              Browse DLT offices
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/map"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-transparent tw:px-5",
              )}
            >
              Open the office map
            </Link>
          </div>
          <a
            href={OFFICIAL_DLT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tw:mt-7 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
          >
            Check live availability with {OFFICIAL_DLT_BOOKING_LABEL}
            <ExternalLink aria-hidden="true" className="tw:size-4" />
            <span className="tw:sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </section>
    </main>
  );
}
