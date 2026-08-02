import {
  ArrowRight,
  Check,
  Database,
  ExternalLink,
  LockKeyhole,
  MapPin,
  Radar,
  Route,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

import {
  APPOINTMENTS_PATH,
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_NOTICE,
  BANGKOK_OFFICES_PATH,
  FOREIGNER_GUIDE_PATH,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
  SITE_NAME,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { DiscoveryCapabilities } from "@/widgets/discovery-capabilities";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

const DISCOVERY_STEPS = [
  {
    number: "01",
    title: "Set your search",
    description: "Choose an office and the exact New or Renew work option returned by DLT.",
  },
  {
    number: "02",
    title: "Scout alternatives",
    description: "Read the source and freshness, then compare dates across offices or on the map.",
  },
  {
    number: "03",
    title: "Book with DLT",
    description: "Open the government service to confirm eligibility and complete the appointment.",
  },
] as const;

export function HomePage() {
  return (
    <div className="home-page tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main id="main-content">
        <section className="home-page__hero tw:relative tw:overflow-hidden tw:border-b tw:border-stone-900/10">
          <div
            aria-hidden="true"
            className="home-page__hero-grid tw:absolute tw:inset-0 tw:opacity-35 tw:[background-image:linear-gradient(to_right,rgba(28,25,23,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.08)_1px,transparent_1px)] tw:[background-size:48px_48px]"
          />
          <div className="home-page__hero-inner tw:relative tw:mx-auto tw:grid tw:max-w-7xl tw:gap-10 tw:px-5 tw:py-16 tw:sm:px-8 tw:sm:py-24 tw:lg:grid-cols-[1.15fr_0.85fr] tw:lg:items-end tw:lg:py-28">
            <div>
              <Badge
                variant="outline"
                className="home-page__eyebrow tw:border-stone-900/15 tw:bg-[#f5f1e8] tw:px-3 tw:py-1 tw:font-mono tw:text-[0.7rem] tw:tracking-[0.14em] tw:text-stone-700"
              >
                INDEPENDENT DLT AVAILABILITY SCOUT
              </Badge>
              <h1 className="home-page__title tw:mt-7 tw:max-w-4xl tw:text-5xl tw:leading-[0.98] tw:font-semibold tw:tracking-[-0.055em] tw:text-balance tw:sm:text-7xl">
                Find a Thai DLT appointment that fits your route.
              </h1>
              <p className="home-page__subtitle tw:mt-7 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-stone-600 tw:sm:text-lg">
                {SITE_NAME} turns public DLT availability into a calendar, office comparison, map,
                and stored history — so you can choose where to try before opening the official
                booking service.
              </p>
              <div className="home-page__actions tw:mt-9 tw:flex tw:flex-wrap tw:gap-3">
                <Link
                  href="/calendar"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "home-page__primary tw:h-11 tw:rounded-full tw:bg-emerald-700 tw:px-5 tw:text-white tw:hover:bg-emerald-800",
                  )}
                >
                  Check appointment availability
                  <ArrowRight aria-hidden="true" />
                </Link>
                <Link
                  href="/compare"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "home-page__secondary tw:h-11 tw:rounded-full tw:border-stone-900/20 tw:bg-[#f5f1e8] tw:px-5",
                  )}
                >
                  Compare nearby offices
                </Link>
              </div>
              <p className="home-page__microcopy tw:mt-5 tw:flex tw:items-center tw:gap-2 tw:text-xs tw:font-medium tw:text-stone-500">
                <LockKeyhole aria-hidden="true" className="tw:size-4" />
                No login, identity documents, or DLT credentials needed here.
              </p>
            </div>

            <Card className="home-page__boundary tw:border tw:border-stone-900/15 tw:bg-stone-950 tw:py-0 tw:text-stone-100 tw:shadow-2xl tw:shadow-stone-950/10 tw:ring-0">
              <CardContent className="tw:p-6 tw:sm:p-8">
                <div className="tw:flex tw:items-center tw:justify-between tw:gap-4">
                  <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-300">
                    SERVICE BOUNDARY
                  </p>
                  <span className="tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-stone-400">
                    <span
                      aria-hidden="true"
                      className="tw:size-2 tw:rounded-full tw:bg-emerald-400"
                    />
                    Read-only
                  </span>
                </div>
                <h2 className="tw:mt-8 tw:max-w-sm tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]">
                  Scout here. Confirm and book there.
                </h2>
                <ul className="tw:mt-8 tw:grid tw:gap-4 tw:text-sm tw:leading-6 tw:text-stone-300">
                  <li className="tw:flex tw:gap-3">
                    <Check
                      aria-hidden="true"
                      className="tw:mt-1 tw:size-4 tw:shrink-0 tw:text-emerald-300"
                    />
                    Live responses and stored observations stay visibly labelled.
                  </li>
                  <li className="tw:flex tw:gap-3">
                    <Check
                      aria-hidden="true"
                      className="tw:mt-1 tw:size-4 tw:shrink-0 tw:text-emerald-300"
                    />
                    We never reserve a time or ask for your DLT account.
                  </li>
                  <li className="tw:flex tw:gap-3">
                    <Check
                      aria-hidden="true"
                      className="tw:mt-1 tw:size-4 tw:shrink-0 tw:text-emerald-300"
                    />
                    DLT remains the source of truth for rules and final availability.
                  </li>
                </ul>
                <a
                  href={OFFICIAL_DLT_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-page__official tw:mt-8 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-white tw:underline tw:decoration-emerald-400 tw:decoration-2 tw:underline-offset-4"
                >
                  Open official DLT Smart Queue
                  <ExternalLink aria-hidden="true" className="tw:size-4" />
                  <span className="tw:sr-only">(opens in a new tab)</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="home-page__content tw:mx-auto tw:flex tw:max-w-7xl tw:flex-col tw:gap-24 tw:px-5 tw:py-20 tw:sm:px-8 tw:sm:py-24">
          <DiscoveryCapabilities />

          <section
            aria-labelledby="bangkok-start-title"
            className="home-page__bangkok-start tw:grid tw:gap-7 tw:rounded-3xl tw:border tw:border-stone-900/10 tw:bg-emerald-950 tw:p-7 tw:text-white tw:sm:p-10 tw:lg:grid-cols-[auto_1fr_auto] tw:lg:items-center"
          >
            <MapPin aria-hidden="true" className="tw:size-7 tw:text-emerald-300" />
            <div>
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-300">
                BANGKOK STARTING POINT
              </p>
              <h2
                id="bangkok-start-title"
                className="tw:mt-3 tw:text-3xl tw:font-semibold tw:tracking-[-0.035em]"
              >
                Begin with the five Bangkok area offices.
              </h2>
              <p className="tw:mt-3 tw:max-w-2xl tw:text-sm tw:leading-6 tw:text-emerald-50/75">
                Use exact site IDs, source names, and labelled map anchors before opening live or
                stored appointment observations.
              </p>
            </div>
            <Link
              href={BANGKOK_OFFICES_PATH}
              className="tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-300 tw:decoration-2 tw:underline-offset-4"
            >
              Open Bangkok office hub
              <ArrowRight aria-hidden="true" className="tw:size-4" />
            </Link>
          </section>

          <section
            aria-labelledby="how-it-works-title"
            className="home-page__process tw:grid tw:gap-10 tw:border-y tw:border-stone-900/10 tw:py-16 tw:lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
                A SHORTER ROUTE
              </p>
              <h2
                id="how-it-works-title"
                className="tw:mt-4 tw:max-w-md tw:text-4xl tw:font-semibold tw:tracking-[-0.04em]"
              >
                Three steps, one honest hand-off.
              </h2>
              <p className="tw:mt-5 tw:max-w-md tw:text-sm tw:leading-6 tw:text-stone-600">
                This service helps with the search. Eligibility, documents, and the appointment
                itself stay with DLT and can vary by office.
              </p>
              <Link
                href={FOREIGNER_GUIDE_PATH}
                className="tw:mt-6 tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
              >
                Read the foreigner guide
                <ArrowRight aria-hidden="true" className="tw:size-4" />
              </Link>
            </div>
            <ol className="home-page__steps tw:grid tw:gap-3">
              {DISCOVERY_STEPS.map((step) => (
                <li
                  key={step.number}
                  className="home-page__step tw:grid tw:grid-cols-[auto_1fr] tw:gap-5 tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-white/60 tw:p-5"
                >
                  <span className="tw:font-mono tw:text-xs tw:text-emerald-800">{step.number}</span>
                  <div>
                    <h3 className="tw:text-lg tw:font-semibold">{step.title}</h3>
                    <p className="tw:mt-1 tw:text-sm tw:leading-6 tw:text-stone-600">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="trust-title" className="home-page__trust">
            <div className="tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-6">
              <div>
                <p className="tw:font-mono tw:text-xs tw:tracking-[0.16em] tw:text-emerald-800">
                  BUILT FOR TRUST
                </p>
                <h2
                  id="trust-title"
                  className="tw:mt-4 tw:text-4xl tw:font-semibold tw:tracking-[-0.04em]"
                >
                  Useful without becoming the middleman.
                </h2>
              </div>
              <div className="tw:flex tw:flex-wrap tw:gap-x-6 tw:gap-y-3">
                <Link
                  href={AVAILABILITY_GUIDE_PATH}
                  className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                >
                  How to read the data
                  <ArrowRight aria-hidden="true" className="tw:size-4" />
                </Link>
                <Link
                  href={APPOINTMENTS_PATH}
                  className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                >
                  How discovery works
                </Link>
              </div>
            </div>
            <div className="tw:mt-8 tw:grid tw:gap-px tw:overflow-hidden tw:rounded-2xl tw:border tw:border-stone-900/10 tw:bg-stone-900/10 tw:md:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Independent", body: INDEPENDENCE_NOTICE },
                { icon: Database, title: "Source-aware", body: AVAILABILITY_NOTICE },
                { icon: Radar, title: "Privacy-light", body: PRIVACY_NOTICE },
              ].map((item) => (
                <div key={item.title} className="tw:bg-[#f5f1e8] tw:p-6">
                  <item.icon aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                  <h3 className="tw:mt-5 tw:text-lg tw:font-semibold">{item.title}</h3>
                  <p className="tw:mt-2 tw:text-sm tw:leading-6 tw:text-stone-600">{item.body}</p>
                </div>
              ))}
            </div>
            <p className="tw:mt-5 tw:flex tw:items-center tw:gap-2 tw:text-xs tw:text-stone-500">
              <Route aria-hidden="true" className="tw:size-4" />
              The product ends where identity, eligibility, and booking begin.
            </p>
          </section>
        </div>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
