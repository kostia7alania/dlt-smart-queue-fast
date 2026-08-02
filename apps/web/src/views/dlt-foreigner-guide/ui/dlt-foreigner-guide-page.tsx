import { ArrowRight, ExternalLink, Info, LockKeyhole, TriangleAlert } from "lucide-react";
import Link from "next/link";

import {
  APPOINTMENTS_PATH,
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_NOTICE,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
  PRODUCT_REVIEWED_ON,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export function DLTForeignerGuidePage() {
  return (
    <div className="dlt-foreigner-guide tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main>
        <article className="tw:mx-auto tw:max-w-5xl tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24">
          <header className="tw:border-b tw:border-stone-900/10 tw:pb-12">
            <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
              FIELD NOTE / REVIEWED{" "}
              <time dateTime={PRODUCT_REVIEWED_ON}>{PRODUCT_REVIEWED_ON}</time>
            </p>
            <h1 className="tw:mt-6 tw:max-w-4xl tw:text-5xl tw:leading-[1] tw:font-semibold tw:tracking-[-0.05em] tw:text-balance tw:sm:text-7xl">
              DLT Smart Queue for foreigners: where this tool helps.
            </h1>
            <p className="tw:mt-7 tw:max-w-3xl tw:text-lg tw:leading-8 tw:text-stone-600">
              A concise guide to using independent availability discovery before you enter the
              official appointment flow — without turning changing office practice into a promise.
            </p>
            <div className="tw:mt-8 tw:flex tw:flex-wrap tw:gap-3">
              <Link
                href="/calendar"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "tw:h-11 tw:rounded-full tw:bg-emerald-700 tw:px-5 tw:text-white tw:hover:bg-emerald-800",
                )}
              >
                Check availability
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href={AVAILABILITY_GUIDE_PATH}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-transparent tw:px-5",
                )}
              >
                How to read results
              </Link>
              <Link
                href={APPOINTMENTS_PATH}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-transparent tw:px-5",
                )}
              >
                Appointment search overview
              </Link>
            </div>
          </header>

          <div className="dlt-foreigner-guide__body tw:grid tw:gap-14 tw:py-12 tw:lg:grid-cols-[15rem_1fr]">
            <aside className="tw:h-fit tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/65 tw:p-5 tw:lg:sticky tw:lg:top-6">
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-stone-500">
                SCOPE
              </p>
              <p className="tw:mt-4 tw:text-sm tw:leading-6 tw:text-stone-700">
                Discovery guidance only. DLT decides eligibility, documents, office procedure, and
                whether a time is still bookable.
              </p>
              <a
                href={OFFICIAL_DLT_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="tw:mt-5 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
              >
                Official Smart Queue
                <ExternalLink aria-hidden="true" className="tw:size-4" />
                <span className="tw:sr-only">(opens in a new tab)</span>
              </a>
            </aside>

            <div className="tw:min-w-0 tw:space-y-14">
              <section aria-labelledby="official-flow-title">
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-800">
                  01 / THE OFFICIAL FLOW
                </p>
                <h2
                  id="official-flow-title"
                  className="tw:mt-4 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
                >
                  Smart Queue is where booking happens.
                </h2>
                <p className="tw:mt-5 tw:text-base tw:leading-8 tw:text-stone-700">
                  Thailand's DLT operates the Smart Queue appointment service and its public web
                  application includes a foreigner entry point. Use the official service to verify
                  the current process, provide any required identity details, and complete an
                  appointment. This project is not part of that service.
                </p>
              </section>

              <section aria-labelledby="scout-title">
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-800">
                  02 / BEFORE BOOKING
                </p>
                <h2
                  id="scout-title"
                  className="tw:mt-4 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
                >
                  Use the scout to reduce blind clicking.
                </h2>
                <ol className="tw:mt-6 tw:grid tw:gap-4">
                  {[
                    "Choose an office and the exact New or Renew work option returned by the public DLT API.",
                    "Inspect one calendar or compare several offices; check whether each result is live or stored.",
                    "Use the map and stored history to understand alternatives and observation freshness.",
                    "Open Smart Queue and confirm the current time, eligibility, and office requirements with DLT.",
                  ].map((step, index) => (
                    <li
                      key={step}
                      className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-4 tw:rounded-xl tw:border tw:border-stone-900/10 tw:bg-white/55 tw:p-5"
                    >
                      <span className="tw:font-mono tw:text-xs tw:text-emerald-800">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="tw:text-sm tw:leading-6 tw:text-stone-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="variable-title">
                <div className="tw:flex tw:items-center tw:gap-3">
                  <TriangleAlert aria-hidden="true" className="tw:size-5 tw:text-amber-700" />
                  <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-amber-800">
                    03 / VARIABLE BY OFFICE
                  </p>
                </div>
                <h2
                  id="variable-title"
                  className="tw:mt-4 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
                >
                  Treat procedure claims as time-sensitive.
                </h2>
                <p className="tw:mt-5 tw:text-base tw:leading-8 tw:text-stone-700">
                  Recent public guides and applicant reports disagree about walk-ins, booking lead
                  times, foreigner handling, and required steps. Those details can change by office
                  and applicant. This guide deliberately does not tell you that a walk-in will work,
                  that a specific document list is complete, or that a displayed slot is reserved.
                </p>
                <div className="tw:mt-6 tw:flex tw:gap-3 tw:rounded-2xl tw:border tw:border-amber-900/15 tw:bg-amber-50/70 tw:p-5">
                  <Info
                    aria-hidden="true"
                    className="tw:mt-0.5 tw:size-5 tw:shrink-0 tw:text-amber-800"
                  />
                  <p className="tw:text-sm tw:leading-6 tw:text-amber-950">
                    Verify eligibility and document requirements with DLT or the office you plan to
                    visit before committing travel or spending money.
                  </p>
                </div>
              </section>

              <section aria-labelledby="privacy-title">
                <div className="tw:flex tw:items-center tw:gap-3">
                  <LockKeyhole aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                  <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-800">
                    04 / PRIVACY BOUNDARY
                  </p>
                </div>
                <h2
                  id="privacy-title"
                  className="tw:mt-4 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
                >
                  Search without handing us your identity.
                </h2>
                <dl className="tw:mt-6 tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10">
                  {[
                    ["Independence", INDEPENDENCE_NOTICE],
                    ["Data collection", PRIVACY_NOTICE],
                    ["Availability", AVAILABILITY_NOTICE],
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
              </section>
            </div>
          </div>
        </article>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
