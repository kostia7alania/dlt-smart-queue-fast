import {
  ArrowRight,
  BookOpenCheck,
  Database,
  ExternalLink,
  MapPin,
  Radar,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import Link from "next/link";

import {
  AVAILABILITY_GUIDE_REVIEWED_ON,
  BANGKOK_OFFICES_PATH,
  FOREIGNER_GUIDE_PATH,
  OFFICIAL_DLT_BOOKING_URL,
} from "@/shared/config/site";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

import {
  AVAILABILITY_STATES,
  EVIDENCE_SOURCES,
  EVIDENCE_WORKFLOW,
  MAP_PRECISIONS,
  TOOL_EVIDENCE,
} from "../model/availability-evidence";

const GUIDE_SECTIONS = [
  { href: "#sources", label: "Source and time" },
  { href: "#statuses", label: "Five statuses" },
  { href: "#tools", label: "Tool behaviour" },
  { href: "#map-precision", label: "Map precision" },
  { href: "#workflow", label: "Reading workflow" },
] as const;

export function AvailabilityEvidenceGuidePage() {
  return (
    <div className="availability-evidence-guide tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main id="main-content">
        <article>
          <header className="availability-evidence-guide__hero tw:relative tw:overflow-hidden tw:border-b tw:border-stone-900/10 tw:bg-stone-950 tw:text-white">
            <div
              aria-hidden="true"
              className="tw:absolute tw:inset-0 tw:opacity-20 tw:[background-image:radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.45),transparent_34%),radial-gradient(circle_at_85%_75%,rgba(45,212,191,0.25),transparent_32%)]"
            />
            <div className="tw:relative tw:mx-auto tw:grid tw:max-w-7xl tw:gap-10 tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24 tw:lg:grid-cols-[1fr_20rem] tw:lg:items-end">
              <div>
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-300">
                  EVIDENCE FIELD MANUAL / REVIEWED{" "}
                  <time dateTime={AVAILABILITY_GUIDE_REVIEWED_ON} className="tw:whitespace-nowrap">
                    {AVAILABILITY_GUIDE_REVIEWED_ON}
                  </time>
                </p>
                <h1 className="tw:mt-7 tw:max-w-5xl tw:text-5xl tw:leading-[0.98] tw:font-semibold tw:tracking-[-0.055em] tw:text-balance tw:sm:text-7xl">
                  Read the evidence before you chase a date.
                </h1>
                <p className="tw:mt-7 tw:max-w-3xl tw:text-base tw:leading-7 tw:text-stone-300 tw:sm:text-lg">
                  Live, stored, full, unknown — each label answers a narrow question. This guide
                  shows what Thai Queue Scout observed, how old that evidence is, and where the
                  product must stop short of a booking promise.
                </p>
                <div className="tw:mt-9 tw:flex tw:flex-wrap tw:gap-3">
                  <Link
                    href="/calendar"
                    className="tw:inline-flex tw:h-11 tw:items-center tw:gap-2 tw:rounded-full tw:bg-emerald-400 tw:px-5 tw:text-sm tw:font-semibold tw:text-stone-950 tw:hover:bg-emerald-300 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-white"
                  >
                    Open Calendar
                    <ArrowRight aria-hidden="true" className="tw:size-4" />
                  </Link>
                  <Link
                    href="#sources"
                    className="tw:inline-flex tw:h-11 tw:items-center tw:rounded-full tw:border tw:border-white/30 tw:px-5 tw:text-sm tw:font-semibold tw:text-white tw:hover:bg-white/10 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-white"
                  >
                    Start with source
                  </Link>
                </div>
              </div>

              <div className="tw:border-l tw:border-emerald-300/35 tw:pl-6">
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-300">
                  THE BOUNDARY
                </p>
                <p className="tw:mt-4 tw:text-lg tw:leading-7 tw:text-stone-200">
                  An observation can help you decide where to look. It never holds, reserves, or
                  guarantees an appointment.
                </p>
              </div>
            </div>
          </header>

          <div className="tw:mx-auto tw:grid tw:max-w-7xl tw:gap-12 tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24 tw:lg:grid-cols-[15rem_minmax(0,1fr)]">
            <aside className="tw:h-fit tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-5 tw:lg:sticky tw:lg:top-6">
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-stone-500">
                IN THIS GUIDE
              </p>
              <nav aria-label="Evidence guide sections" className="tw:mt-5">
                <ol className="tw:grid tw:gap-3">
                  {GUIDE_SECTIONS.map((section, index) => (
                    <li key={section.href}>
                      <Link
                        href={section.href}
                        className="tw:flex tw:items-baseline tw:gap-3 tw:rounded-sm tw:text-sm tw:font-medium tw:text-stone-700 tw:underline-offset-4 tw:hover:text-emerald-800 tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4"
                      >
                        <span className="tw:font-mono tw:text-[0.65rem] tw:text-stone-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {section.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
              <p className="tw:mt-6 tw:border-t tw:border-stone-900/10 tw:pt-5 tw:text-xs tw:leading-5 tw:text-stone-500">
                Product definitions only. DLT remains the source of truth for current rules,
                eligibility, and booking.
              </p>
            </aside>

            <div className="tw:min-w-0 tw:space-y-24">
              <section id="sources" aria-labelledby="sources-title" className="tw:scroll-mt-6">
                <SectionIntro
                  id="sources-title"
                  number="01"
                  eyebrow="SOURCE AND TIME"
                  title="Live tells you when it was asked. Stored tells you when it was seen."
                  description="Always read the source before the status. A fresh-looking label without its observation context can lead to the wrong decision."
                />
                <div className="tw:mt-8 tw:grid tw:gap-4 tw:md:grid-cols-2">
                  {EVIDENCE_SOURCES.map((source) => (
                    <Card
                      key={source.key}
                      className="availability-evidence-guide__source tw:bg-white/65 tw:py-0 tw:ring-stone-900/10"
                    >
                      <CardContent className="tw:p-6">
                        <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                          {source.key === "live" ? (
                            <Radar aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                          ) : (
                            <Database
                              aria-hidden="true"
                              className="tw:size-5 tw:text-emerald-700"
                            />
                          )}
                          <Badge variant="outline" className="tw:font-mono tw:text-[0.65rem]">
                            {source.key}
                          </Badge>
                        </div>
                        <h3 className="tw:mt-6 tw:text-2xl tw:font-semibold tw:tracking-[-0.025em]">
                          {source.label}
                        </h3>
                        <p className="tw:mt-3 tw:text-sm tw:leading-6 tw:text-stone-700">
                          {source.summary}
                        </p>
                        <p className="tw:mt-5 tw:border-t tw:border-stone-900/10 tw:pt-4 tw:text-xs tw:leading-5 tw:text-stone-500">
                          {source.boundary}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section id="statuses" aria-labelledby="statuses-title" className="tw:scroll-mt-6">
                <SectionIntro
                  id="statuses-title"
                  number="02"
                  eyebrow="FIVE LAST-KNOWN STATES"
                  title="Missing evidence is not negative evidence."
                  description="Map exposes all five states. History summarizes stored slot rows with available, full, or no upcoming days."
                />
                <div className="availability-evidence-guide__states tw:mt-8 tw:grid tw:gap-3">
                  {AVAILABILITY_STATES.map((state, index) => (
                    <article
                      key={state.key}
                      id={state.anchor}
                      className="tw:scroll-mt-6 tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-6"
                    >
                      <div className="tw:grid tw:gap-6 tw:lg:grid-cols-[10rem_minmax(0,1fr)]">
                        <div>
                          <span className="tw:font-mono tw:text-xs tw:text-stone-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="tw:mt-3 tw:text-xl tw:font-semibold">{state.label}</h3>
                          <code className="tw:mt-2 tw:block tw:text-xs tw:text-emerald-800">
                            {state.key}
                          </code>
                          <p className="tw:mt-3 tw:text-xs tw:text-stone-500">{state.appearsIn}</p>
                        </div>
                        <div>
                          <p className="tw:text-sm tw:leading-6 tw:text-stone-700">
                            {state.condition}
                          </p>
                          <dl className="tw:mt-5 tw:grid tw:gap-px tw:overflow-hidden tw:rounded-xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10 tw:md:grid-cols-2">
                            <div className="tw:bg-emerald-50/80 tw:p-4">
                              <dt className="tw:text-xs tw:font-semibold tw:tracking-wide tw:text-emerald-900 tw:uppercase">
                                Safe conclusion
                              </dt>
                              <dd className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-emerald-950">
                                {state.safeConclusion}
                              </dd>
                            </div>
                            <div className="tw:bg-amber-50/80 tw:p-4">
                              <dt className="tw:text-xs tw:font-semibold tw:tracking-wide tw:text-amber-900 tw:uppercase">
                                Do not conclude
                              </dt>
                              <dd className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-amber-950">
                                {state.unsafeConclusion}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section id="tools" aria-labelledby="tools-title" className="tw:scroll-mt-6">
                <SectionIntro
                  id="tools-title"
                  number="03"
                  eyebrow="TOOL BEHAVIOUR"
                  title="Four views, four evidence jobs."
                  description="Choose the view for the question you have. The product deliberately avoids one hidden refresh policy for every surface."
                />
                <div className="tw:mt-8 tw:overflow-x-auto tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/60">
                  <table className="availability-evidence-guide__tool-table tw:w-full tw:min-w-[48rem] tw:border-collapse tw:text-left tw:text-sm">
                    <caption className="tw:sr-only">
                      Live and stored data behaviour of Thai Queue Scout discovery tools
                    </caption>
                    <thead className="tw:border-b tw:border-stone-900/10 tw:bg-stone-950 tw:text-white">
                      <tr>
                        <th scope="col" className="tw:px-5 tw:py-4 tw:font-semibold">
                          Tool
                        </th>
                        <th scope="col" className="tw:px-5 tw:py-4 tw:font-semibold">
                          Best question
                        </th>
                        <th scope="col" className="tw:px-5 tw:py-4 tw:font-semibold">
                          Evidence behaviour
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOOL_EVIDENCE.map((tool) => (
                        <tr
                          key={tool.key}
                          className="tw:border-b tw:border-stone-900/10 tw:last:border-0"
                        >
                          <th scope="row" className="tw:px-5 tw:py-5 tw:align-top tw:font-semibold">
                            <Link
                              href={tool.href}
                              className="tw:text-emerald-800 tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                            >
                              {tool.label}
                            </Link>
                          </th>
                          <td className="tw:px-5 tw:py-5 tw:align-top tw:leading-6 tw:text-stone-700">
                            {tool.question}
                          </td>
                          <td className="tw:px-5 tw:py-5 tw:align-top tw:leading-6 tw:text-stone-700">
                            {tool.behaviour}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section
                id="map-precision"
                aria-labelledby="map-precision-title"
                className="tw:scroll-mt-6"
              >
                <SectionIntro
                  id="map-precision-title"
                  number="04"
                  eyebrow="MAP PRECISION"
                  title="A marker can be an anchor, not an entrance."
                  description="Marker fill describes last-known availability. Border pattern and the precision label describe how closely the committed place match identifies the office."
                />
                <dl className="tw:mt-8 tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10">
                  {MAP_PRECISIONS.map((precision) => (
                    <div
                      key={precision.key}
                      className="tw:grid tw:gap-3 tw:bg-[#f5f1e8] tw:p-5 tw:sm:grid-cols-[11rem_1fr]"
                    >
                      <dt className="tw:flex tw:items-center tw:gap-3 tw:text-sm tw:font-semibold">
                        <MapPin aria-hidden="true" className="tw:size-4 tw:text-emerald-700" />
                        {precision.label}
                      </dt>
                      <dd className="tw:text-sm tw:leading-6 tw:text-stone-600">
                        {precision.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="tw:mt-5 tw:flex tw:gap-3 tw:text-sm tw:leading-6 tw:text-stone-600">
                  <ShieldCheck
                    aria-hidden="true"
                    className="tw:mt-0.5 tw:size-5 tw:shrink-0 tw:text-emerald-700"
                  />
                  District and province fallbacks are geographic orientation, not door-level
                  directions, route guidance, or proof that the office is at the exact marker.
                </p>
              </section>

              <section id="workflow" aria-labelledby="workflow-title" className="tw:scroll-mt-6">
                <SectionIntro
                  id="workflow-title"
                  number="05"
                  eyebrow="A SAFER READING ORDER"
                  title="Five checks before the official hand-off."
                  description="The sequence is intentionally short: establish evidence quality, widen the search if needed, then verify the real appointment with DLT."
                />
                <ol className="tw:mt-8 tw:grid tw:gap-3">
                  {EVIDENCE_WORKFLOW.map((step) => (
                    <li
                      key={step.number}
                      className="tw:grid tw:grid-cols-[auto_1fr] tw:gap-5 tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-5"
                    >
                      <span className="tw:font-mono tw:text-xs tw:text-emerald-800">
                        {step.number}
                      </span>
                      <div>
                        <h3 className="tw:text-lg tw:font-semibold">{step.title}</h3>
                        <p className="tw:mt-1 tw:text-sm tw:leading-6 tw:text-stone-600">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="tw:mt-10 tw:grid tw:gap-6 tw:rounded-3xl tw:bg-emerald-950 tw:p-7 tw:text-white tw:sm:p-10 tw:lg:grid-cols-[1fr_auto] tw:lg:items-end">
                  <div>
                    <div className="tw:flex tw:items-center tw:gap-3">
                      <BookOpenCheck aria-hidden="true" className="tw:size-5 tw:text-emerald-300" />
                      <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-300">
                        RELATED CONTEXT
                      </p>
                    </div>
                    <h2 className="tw:mt-5 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]">
                      Choose an office here. Complete the appointment there.
                    </h2>
                    <div className="tw:mt-6 tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-3 tw:text-sm">
                      <Link
                        href={BANGKOK_OFFICES_PATH}
                        className="tw:font-semibold tw:underline tw:decoration-emerald-300 tw:decoration-2 tw:underline-offset-4"
                      >
                        Bangkok office hub
                      </Link>
                      <Link
                        href={FOREIGNER_GUIDE_PATH}
                        className="tw:font-semibold tw:underline tw:decoration-emerald-300 tw:decoration-2 tw:underline-offset-4"
                      >
                        Foreigner guide
                      </Link>
                    </div>
                  </div>
                  <a
                    href={OFFICIAL_DLT_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw:inline-flex tw:h-11 tw:w-fit tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-5 tw:text-sm tw:font-semibold tw:text-emerald-950 tw:hover:bg-emerald-50 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-white"
                  >
                    Official DLT Smart Queue
                    <ExternalLink aria-hidden="true" className="tw:size-4" />
                    <span className="tw:sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </article>
      </main>
      <PublicSiteFooter />
    </div>
  );
}

type SectionIntroProps = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
};

function SectionIntro({ id, number, eyebrow, title, description }: SectionIntroProps) {
  return (
    <div>
      <div className="tw:flex tw:items-center tw:gap-3">
        {number === "01" ? (
          <TimerReset aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
        ) : null}
        <p className="tw:font-mono tw:text-xs tw:tracking-[0.14em] tw:text-emerald-800">
          {number} / {eyebrow}
        </p>
      </div>
      <h2
        id={id}
        className="tw:mt-4 tw:max-w-4xl tw:text-4xl tw:font-semibold tw:tracking-[-0.04em] tw:text-balance"
      >
        {title}
      </h2>
      <p className="tw:mt-5 tw:max-w-3xl tw:text-base tw:leading-8 tw:text-stone-600">
        {description}
      </p>
    </div>
  );
}
