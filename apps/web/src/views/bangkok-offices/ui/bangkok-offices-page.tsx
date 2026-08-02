import {
  ArrowRight,
  CalendarDays,
  Database,
  History,
  Map as MapIcon,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

import { BANGKOK_GEO_PROVENANCE, BANGKOK_OFFICES } from "../model/bangkok-office-data";
import { BANGKOK_COMPARE_PATH, BANGKOK_MAP_PATH } from "../model/bangkok-offices";

export function BangkokOfficesPage() {
  return (
    <div className="bangkok-offices-page tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main id="main-content">
        <section className="bangkok-offices-page__hero tw:relative tw:overflow-hidden tw:border-b tw:border-stone-900/10">
          <div
            aria-hidden="true"
            className="tw:absolute tw:inset-0 tw:opacity-30 tw:[background-image:linear-gradient(to_right,rgba(28,25,23,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.08)_1px,transparent_1px)] tw:[background-size:48px_48px]"
          />
          <div className="tw:relative tw:mx-auto tw:grid tw:max-w-7xl tw:gap-12 tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24 tw:lg:grid-cols-[1.1fr_0.9fr] tw:lg:items-end">
            <div>
              <Badge
                variant="outline"
                className="tw:border-stone-900/15 tw:bg-[#f5f1e8] tw:px-3 tw:py-1 tw:font-mono tw:text-[0.7rem] tw:tracking-[0.14em]"
              >
                BANGKOK OFFICE DIRECTORY
              </Badge>
              <h1 className="tw:mt-7 tw:max-w-4xl tw:text-5xl tw:leading-[0.98] tw:font-semibold tw:tracking-[-0.055em] tw:text-balance tw:sm:text-7xl">
                Compare Bangkok&apos;s five DLT area offices before you choose a queue.
              </h1>
              <p className="tw:mt-7 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-stone-600 tw:sm:text-lg">
                Start from exact office IDs and committed source names, then inspect appointment
                observations in Calendar, Compare, Map, or History. This directory does not rank
                offices or report today&apos;s opening state.
              </p>
              <div className="tw:mt-9 tw:flex tw:flex-wrap tw:gap-3">
                <Link
                  href={BANGKOK_COMPARE_PATH}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "tw:h-11 tw:rounded-full tw:bg-emerald-700 tw:px-5 tw:text-white tw:hover:bg-emerald-800",
                  )}
                >
                  Compare all five
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link
                  href={BANGKOK_MAP_PATH}
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-[#f5f1e8] tw:px-5",
                  )}
                >
                  Map all five
                  <MapIcon aria-hidden="true" />
                </Link>
              </div>
            </div>

            <aside
              aria-label="Bangkok office index"
              className="tw:overflow-hidden tw:rounded-3xl tw:bg-stone-950 tw:p-2 tw:text-white tw:shadow-2xl tw:shadow-stone-950/10"
            >
              <p className="tw:px-5 tw:pt-5 tw:pb-3 tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-300">
                FIVE ROUTE STARTS
              </p>
              <ol className="tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:bg-white/10">
                {BANGKOK_OFFICES.map((office, index) => (
                  <li key={office.siteId} className="tw:bg-stone-950">
                    <a
                      href={`#office-${office.siteId}`}
                      className="tw:grid tw:grid-cols-[2.5rem_1fr_auto] tw:items-center tw:gap-3 tw:px-5 tw:py-4 tw:hover:bg-white/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-[-2px] tw:focus-visible:outline-white"
                    >
                      <span className="tw:font-mono tw:text-xs tw:text-emerald-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="tw:text-sm tw:font-medium">{office.district}</span>
                      <span className="tw:font-mono tw:text-xs tw:text-stone-500">
                        ID {office.siteId}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <div className="tw:mx-auto tw:flex tw:max-w-7xl tw:flex-col tw:gap-24 tw:px-5 tw:py-20 tw:sm:px-8 tw:sm:py-24">
          <section aria-labelledby="bangkok-directory-title">
            <div className="tw:grid tw:gap-7 tw:border-b tw:border-stone-900/10 tw:pb-10 tw:lg:grid-cols-[1fr_24rem] tw:lg:items-end">
              <div>
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
                  COMMITTED DIRECTORY
                </p>
                <h2
                  id="bangkok-directory-title"
                  className="tw:mt-4 tw:max-w-3xl tw:text-4xl tw:font-semibold tw:tracking-[-0.04em] tw:sm:text-5xl"
                >
                  One factual starting point for each Bangkok area office.
                </h2>
              </div>
              <p className="tw:text-sm tw:leading-6 tw:text-stone-600">
                Office identity comes from the committed DLT response snapshot. Map anchors come
                from a separately generated dataset and are labelled by precision.
              </p>
            </div>

            <ol className="bangkok-offices-page__directory tw:mt-8 tw:grid tw:gap-4">
              {BANGKOK_OFFICES.map((office, index) => (
                <li
                  key={office.siteId}
                  id={`office-${office.siteId}`}
                  className="tw:scroll-mt-6 tw:rounded-3xl tw:border tw:border-stone-900/10 tw:bg-white/55 tw:p-6 tw:sm:p-8"
                >
                  <article className="tw:grid tw:gap-8 tw:lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.85fr)] tw:lg:items-start">
                    <div>
                      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                        <span className="tw:font-mono tw:text-xs tw:text-emerald-800">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Badge
                          variant="outline"
                          className="tw:border-stone-900/15 tw:bg-transparent tw:font-mono tw:text-[0.68rem] tw:tracking-[0.12em]"
                        >
                          SITE ID {office.siteId}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="tw:border-amber-800/20 tw:bg-amber-50 tw:text-amber-900"
                        >
                          District-level map anchor
                        </Badge>
                      </div>
                      <h3 className="tw:mt-5 tw:max-w-3xl tw:text-2xl tw:font-semibold tw:tracking-[-0.025em] tw:sm:text-3xl">
                        {office.name}
                      </h3>
                      <p lang="th" className="tw:mt-3 tw:text-base tw:leading-7 tw:text-stone-600">
                        {office.thaiName}
                      </p>
                      <dl className="tw:mt-7 tw:grid tw:gap-3 tw:text-sm tw:sm:grid-cols-2">
                        <div className="tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-[#f5f1e8] tw:p-4">
                          <dt className="tw:font-mono tw:text-[0.68rem] tw:tracking-[0.12em] tw:text-stone-500">
                            MAP COORDINATE
                          </dt>
                          <dd className="tw:mt-2 tw:font-medium">
                            {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                          </dd>
                        </div>
                        <div className="tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-[#f5f1e8] tw:p-4">
                          <dt className="tw:font-mono tw:text-[0.68rem] tw:tracking-[0.12em] tw:text-stone-500">
                            DIRECTORY AREA
                          </dt>
                          <dd className="tw:mt-2 tw:font-medium">{office.district}, Bangkok</dd>
                        </div>
                      </dl>
                      <p className="tw:mt-4 tw:text-xs tw:leading-5 tw:text-stone-500">
                        Derived map match: <span lang="th">{office.matchedPlace}</span>
                      </p>
                    </div>

                    <div className="tw:rounded-2xl tw:bg-stone-950 tw:p-5 tw:text-white tw:sm:p-6">
                      <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-300">
                        INSPECT THIS OFFICE
                      </p>
                      <p className="tw:mt-4 tw:text-sm tw:leading-6 tw:text-stone-300">
                        The linked tools resolve public live responses or stored observations and
                        keep source and freshness visible.
                      </p>
                      <nav
                        aria-label={`Discovery tools for ${office.name}`}
                        className="tw:mt-6 tw:grid tw:gap-2"
                      >
                        <Link
                          href={office.links.calendar}
                          className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-xl tw:border tw:border-white/15 tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:hover:bg-white tw:hover:text-stone-950 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-white"
                        >
                          <span className="tw:flex tw:items-center tw:gap-3">
                            <CalendarDays aria-hidden="true" className="tw:size-4" />
                            Open Calendar
                          </span>
                          <ArrowRight aria-hidden="true" className="tw:size-4" />
                        </Link>
                        <Link
                          href={office.links.map}
                          className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-xl tw:border tw:border-white/15 tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:hover:bg-white tw:hover:text-stone-950 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-white"
                        >
                          <span className="tw:flex tw:items-center tw:gap-3">
                            <MapPin aria-hidden="true" className="tw:size-4" />
                            Locate on Map
                          </span>
                          <ArrowRight aria-hidden="true" className="tw:size-4" />
                        </Link>
                        <Link
                          href={office.links.history}
                          className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:rounded-xl tw:border tw:border-white/15 tw:px-4 tw:py-3 tw:text-sm tw:font-medium tw:hover:bg-white tw:hover:text-stone-950 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-white"
                        >
                          <span className="tw:flex tw:items-center tw:gap-3">
                            <History aria-hidden="true" className="tw:size-4" />
                            Open History
                          </span>
                          <ArrowRight aria-hidden="true" className="tw:size-4" />
                        </Link>
                      </nav>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="evidence-title" className="bangkok-offices-page__evidence">
            <div className="tw:max-w-3xl">
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
                READ THE LABELS
              </p>
              <h2
                id="evidence-title"
                className="tw:mt-4 tw:text-4xl tw:font-semibold tw:tracking-[-0.04em]"
              >
                Directory fact is not live availability.
              </h2>
            </div>
            <div className="tw:mt-8 tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10 tw:md:grid-cols-3">
              <div className="tw:bg-[#f5f1e8] tw:p-6">
                <Database aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                <h3 className="tw:mt-5 tw:text-lg tw:font-semibold">Office identity</h3>
                <p className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-stone-600">
                  IDs and English names are preserved from a committed DLT office response. Its
                  mutable opening-state field is deliberately not displayed here.
                </p>
              </div>
              <div className="tw:bg-[#f5f1e8] tw:p-6">
                <MapPin aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                <h3 className="tw:mt-5 tw:text-lg tw:font-semibold">Approximate geography</h3>
                <p className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-stone-600">
                  All five pins are district-level anchors generated on 19 July 2026, not verified
                  front-door directions. {BANGKOK_GEO_PROVENANCE.attribution}.
                </p>
              </div>
              <div className="tw:bg-[#f5f1e8] tw:p-6">
                <ShieldCheck aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                <h3 className="tw:mt-5 tw:text-lg tw:font-semibold">Operational state</h3>
                <p className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-stone-600">
                  Opening, eligibility, documents, walk-ins, and current slots can change. Check the
                  linked source-aware tools and confirm final rules with DLT.
                </p>
              </div>
            </div>
            <p className="tw:mt-5 tw:flex tw:items-start tw:gap-2 tw:text-xs tw:leading-5 tw:text-stone-500">
              <Route aria-hidden="true" className="tw:mt-0.5 tw:size-4 tw:shrink-0" />
              Geography source: {BANGKOK_GEO_PROVENANCE.source}. This static directory makes no
              claim that an appointment is available now.
            </p>
          </section>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
