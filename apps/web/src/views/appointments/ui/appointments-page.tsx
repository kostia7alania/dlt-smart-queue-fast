import { ArrowRight, ExternalLink, MapPin, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

import {
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_NOTICE,
  BANGKOK_OFFICES_PATH,
  FOREIGNER_GUIDE_PATH,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { DiscoveryCapabilities } from "@/widgets/discovery-capabilities";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export function AppointmentsPage() {
  return (
    <div className="appointments-page tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main>
        <section className="appointments-page__hero tw:border-b tw:border-stone-900/10">
          <div className="tw:mx-auto tw:grid tw:max-w-7xl tw:gap-12 tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24 tw:lg:grid-cols-[1.15fr_0.85fr] tw:lg:items-end">
            <div>
              <Badge
                variant="outline"
                className="tw:border-stone-900/15 tw:bg-transparent tw:px-3 tw:py-1 tw:font-mono tw:text-[0.7rem] tw:tracking-[0.14em]"
              >
                THAI DRIVING-LICENCE APPOINTMENTS
              </Badge>
              <h1 className="tw:mt-7 tw:max-w-4xl tw:text-5xl tw:leading-[1] tw:font-semibold tw:tracking-[-0.05em] tw:text-balance tw:sm:text-7xl">
                Search more than one DLT office before you settle for a date.
              </h1>
            </div>
            <div className="tw:lg:pb-2">
              <p className="tw:text-base tw:leading-7 tw:text-stone-600">
                Start with a calendar, compare practical alternatives, or scan the map. Results show
                whether data is live or stored; the appointment is completed on the official DLT
                service.
              </p>
              <div className="tw:mt-7 tw:flex tw:flex-wrap tw:gap-3">
                <Link
                  href="/calendar"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "tw:h-11 tw:rounded-full tw:bg-emerald-700 tw:px-5 tw:text-white tw:hover:bg-emerald-800",
                  )}
                >
                  Start with Calendar
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link
                  href="/compare"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-transparent tw:px-5",
                  )}
                >
                  Compare Offices
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="tw:mx-auto tw:flex tw:max-w-7xl tw:flex-col tw:gap-24 tw:px-5 tw:py-20 tw:sm:px-8 tw:sm:py-24">
          <DiscoveryCapabilities
            heading="Choose the view that answers your question"
            intro="The same public DLT signals are presented at different scales, without hiding stored-data fallbacks."
          />

          <section
            aria-labelledby="bangkok-directory-title"
            className="appointments-page__bangkok tw:grid tw:gap-6 tw:rounded-3xl tw:border tw:border-stone-900/10 tw:bg-white/55 tw:p-7 tw:sm:p-9 tw:lg:grid-cols-[auto_1fr_auto] tw:lg:items-center"
          >
            <MapPin aria-hidden="true" className="tw:size-6 tw:text-emerald-700" />
            <div>
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
                IN BANGKOK?
              </p>
              <h2
                id="bangkok-directory-title"
                className="tw:mt-3 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
              >
                Start with all five area offices in one directory.
              </h2>
              <p className="tw:mt-3 tw:max-w-2xl tw:text-sm tw:leading-6 tw:text-stone-600">
                See exact site IDs and labelled map anchors, then continue to the discovery view
                that answers your question.
              </p>
            </div>
            <Link
              href={BANGKOK_OFFICES_PATH}
              className="tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
            >
              Browse Bangkok offices
              <ArrowRight aria-hidden="true" className="tw:size-4" />
            </Link>
          </section>

          <section
            aria-labelledby="search-order-title"
            className="tw:grid tw:overflow-hidden tw:rounded-3xl tw:bg-stone-950 tw:text-white tw:lg:grid-cols-2"
          >
            <div className="tw:p-7 tw:sm:p-10">
              <Search aria-hidden="true" className="tw:size-6 tw:text-emerald-300" />
              <h2
                id="search-order-title"
                className="tw:mt-7 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
              >
                A practical search order
              </h2>
              <ol className="tw:mt-8 tw:grid tw:gap-5 tw:text-sm tw:leading-6 tw:text-stone-300">
                <li>
                  <strong className="tw:text-white">1. Calendar:</strong> check the office you
                  already know.
                </li>
                <li>
                  <strong className="tw:text-white">2. Compare or Map:</strong> look for a workable
                  alternative.
                </li>
                <li>
                  <strong className="tw:text-white">3. History:</strong> judge the observation in
                  context.
                </li>
                <li>
                  <strong className="tw:text-white">4. DLT:</strong> verify the current rules and
                  book there.
                </li>
              </ol>
            </div>
            <div className="tw:border-t tw:border-white/10 tw:bg-emerald-950 tw:p-7 tw:sm:p-10 tw:lg:border-t-0 tw:lg:border-l">
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-300">
                FINAL STEP
              </p>
              <h2 className="tw:mt-7 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]">
                Booking remains an official DLT action.
              </h2>
              <p className="tw:mt-5 tw:text-sm tw:leading-6 tw:text-emerald-50/75">
                We do not reserve, hold, or guarantee a displayed time. Confirm the office's current
                eligibility and document requirements in the government flow.
              </p>
              <a
                href={OFFICIAL_DLT_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="tw:mt-7 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-white tw:underline tw:decoration-emerald-300 tw:decoration-2 tw:underline-offset-4"
              >
                Continue to official DLT Smart Queue
                <ExternalLink aria-hidden="true" className="tw:size-4" />
                <span className="tw:sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </section>

          <section aria-labelledby="before-title">
            <div className="tw:grid tw:gap-8 tw:lg:grid-cols-[0.7fr_1.3fr]">
              <div>
                <ShieldCheck aria-hidden="true" className="tw:size-6 tw:text-emerald-700" />
                <h2
                  id="before-title"
                  className="tw:mt-5 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
                >
                  Before you continue
                </h2>
                <Link
                  href={AVAILABILITY_GUIDE_PATH}
                  className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                >
                  Learn how to read the evidence
                  <ArrowRight aria-hidden="true" className="tw:size-4" />
                </Link>
                <Link
                  href={FOREIGNER_GUIDE_PATH}
                  className="tw:mt-3 tw:flex tw:w-fit tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                >
                  Read the bounded foreigner guide
                  <ArrowRight aria-hidden="true" className="tw:size-4" />
                </Link>
              </div>
              <dl className="tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10">
                {[
                  ["Independent", INDEPENDENCE_NOTICE],
                  ["Privacy-light", PRIVACY_NOTICE],
                  ["Informational", AVAILABILITY_NOTICE],
                ].map(([term, description]) => (
                  <div
                    key={term}
                    className="tw:grid tw:gap-2 tw:bg-[#f5f1e8] tw:p-5 tw:sm:grid-cols-[10rem_1fr]"
                  >
                    <dt className="tw:text-sm tw:font-semibold">{term}</dt>
                    <dd className="tw:text-sm tw:leading-6 tw:text-stone-600">{description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
