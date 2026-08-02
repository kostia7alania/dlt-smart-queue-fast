import Link from "next/link";

import { JOURNEYS, journeysOfGroup, LICENCE_PATH_SEGMENT } from "@/entities/guide";
import {
  AVAILABILITY_NOTICE,
  GUIDES_PATH,
  INDEPENDENCE_NOTICE,
  OFFICES_PATH,
  PRIVACY_NOTICE,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { ClaimLegend } from "@/widgets/claim-legend";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

function JourneyGrid({ slugsGroup }: { slugsGroup: "licence" | "process" }) {
  const journeys = journeysOfGroup(JOURNEYS, slugsGroup);

  return (
    <ul className="licence-index__list tw:mt-4 tw:grid tw:gap-4 tw:sm:grid-cols-2">
      {journeys.map((journey) => (
        <li key={journey.slug} className="licence-index__item">
          <Card className={`licence-index__card licence-index__card--${journey.slug} tw:h-full`}>
            <CardHeader>
              <h3 className="tw:font-heading tw:text-base tw:font-medium">{journey.cardTitle}</h3>
              <p className="tw:text-xs tw:text-stone-600">{journey.audience}</p>
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-3">
              <p className="tw:text-sm tw:text-stone-600">{journey.outcome}</p>
              <Link
                href={`/${LICENCE_PATH_SEGMENT}/${journey.slug}`}
                className={cn(buttonVariants({ size: "sm" }), "tw:self-start")}
              >
                Open
              </Link>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function LicenceIndexPage() {
  return (
    <div className="licence-index tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main className="licence-index__container tw:mx-auto tw:flex tw:w-full tw:max-w-5xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
        <header className="licence-index__header">
          <h1 className="tw:text-3xl tw:font-bold tw:tracking-tight">
            Every Thai driving licence question, in one place
          </h1>
          <p className="tw:mt-3 tw:max-w-2xl tw:text-base tw:leading-7 tw:text-stone-600">
            Start from the question you actually have — a first licence, a renewal, a conversion, a
            replacement — and follow it through to a real appointment. Every statement on these
            pages is labelled: what we observe in the appointment data, what only the Department of
            Land Transport can confirm, and what someone else reported and when.
          </p>
          <ClaimLegend className="tw:mt-6 tw:max-w-2xl" />
        </header>

        <section aria-labelledby="licence-index-journeys">
          <h2 id="licence-index-journeys" className="tw:text-xl tw:font-semibold">
            Which licence do you need?
          </h2>
          <JourneyGrid slugsGroup="licence" />
        </section>

        <section aria-labelledby="licence-index-process">
          <h2 id="licence-index-process" className="tw:text-xl tw:font-semibold">
            The steps inside those journeys
          </h2>
          <p className="tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            Tests, certificates, paperwork, money, and time. These pages are mostly other people's
            reports and DLT's decisions — they are marked that way, with dates and sources.
          </p>
          <JourneyGrid slugsGroup="process" />
        </section>

        <section aria-labelledby="licence-index-evidence">
          <h2 id="licence-index-evidence" className="tw:text-xl tw:font-semibold">
            Then check what is actually bookable
          </h2>
          <p className="tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            The appointment data is the part we can prove. Pick your area, compare offices, and see
            whether the day you want is open before you spend a morning on it.
          </p>
          <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
            <Link href={OFFICES_PATH} className={cn(buttonVariants({ size: "lg" }))}>
              Offices by area
            </Link>
            <Link
              href={GUIDES_PATH}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              How to read the evidence
            </Link>
          </div>
          <p className="tw:mt-6 tw:text-xs tw:text-stone-600">
            {`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}
          </p>
        </section>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
