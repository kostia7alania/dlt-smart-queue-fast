import Link from "next/link";

import { CITY_HUBS, cityHubCompareSelection, compareHref, parseWorkKeyword } from "@/entities/dlt";
import {
  CLAIM_LABEL,
  type GuideClaim,
  type Journey,
  journeyBySlug,
  LICENCE_PATH_SEGMENT,
} from "@/entities/guide";
import {
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_NOTICE,
  INDEPENDENCE_NOTICE,
  OFFICES_PATH,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { badgeVariants } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

const CLAIM_BADGE_VARIANT: Record<GuideClaim["kind"], "secondary" | "outline"> = {
  proven: "secondary",
  "official-only": "outline",
  reported: "outline",
};

function ClaimBadge({ kind, className }: { kind: GuideClaim["kind"]; className?: string }) {
  return (
    <span className={cn(badgeVariants({ variant: CLAIM_BADGE_VARIANT[kind] }), className)}>
      {CLAIM_LABEL[kind]}
    </span>
  );
}

function ClaimItem({ claim, labelled }: { claim: GuideClaim; labelled: boolean }) {
  return (
    <li
      className={`licence-journey__claim licence-journey__claim--${claim.kind} tw:flex tw:flex-col tw:gap-1`}
    >
      {labelled ? (
        <ClaimBadge kind={claim.kind} className="licence-journey__claim-label tw:self-start" />
      ) : null}
      <span className="licence-journey__claim-text tw:text-sm">{claim.text}</span>
      {claim.kind === "reported" ? (
        <span className="licence-journey__claim-source tw:text-xs tw:text-stone-600">
          {claim.source} —{" "}
          <a
            href={claim.sourceUrl}
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="tw:text-stone-950 tw:underline tw:underline-offset-4"
          >
            source
          </a>
          , read {claim.observedOn}
        </span>
      ) : null}
    </li>
  );
}

function JourneyLinks({ slugs, label }: { slugs: readonly string[]; label: string }) {
  const resolved = slugs.map((slug) => journeyBySlug(slug)).filter((entry) => entry !== undefined);
  if (resolved.length === 0) return null;

  return (
    <div className="licence-journey__chain tw:flex tw:flex-wrap tw:items-baseline tw:gap-2 tw:text-sm">
      <span className="licence-journey__chain-label tw:text-stone-600">{label}</span>
      {resolved.map((entry) => (
        <Link
          key={entry.slug}
          href={`/${LICENCE_PATH_SEGMENT}/${entry.slug}`}
          className="licence-journey__chain-link tw:text-stone-950 tw:underline tw:underline-offset-4"
        >
          {entry.cardTitle}
        </Link>
      ))}
    </div>
  );
}

export function LicenceJourneyPage({ journey }: { journey: Journey }) {
  const keyword = journey.keyword ? parseWorkKeyword(journey.keyword) : null;
  const bangkok = CITY_HUBS[0];

  return (
    <div
      className={`licence-journey licence-journey--${journey.slug} tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950`}
    >
      <PublicSiteHeader />
      <main className="licence-journey__main">
        <article className="licence-journey__container tw:mx-auto tw:flex tw:w-full tw:max-w-3xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
          <header className="licence-journey__header">
            <p className="licence-journey__breadcrumb tw:text-xs tw:text-stone-600">
              <Link
                href={`/${LICENCE_PATH_SEGMENT}`}
                className="tw:text-stone-950 tw:underline tw:underline-offset-4"
              >
                Licence questions
              </Link>{" "}
              / {journey.cardTitle}
            </p>
            <h1 className="licence-journey__title tw:mt-2 tw:text-3xl tw:font-bold tw:tracking-tight">
              {journey.title}
            </h1>
            <p className="licence-journey__intro tw:mt-3 tw:text-base tw:leading-7 tw:text-stone-600">
              {journey.intro}
            </p>
            <dl className="licence-journey__meta tw:mt-4 tw:grid tw:gap-2 tw:text-sm tw:sm:grid-cols-2">
              <div>
                <dt className="tw:font-medium">Who this is for</dt>
                <dd className="tw:text-stone-600">{journey.audience}</dd>
              </div>
              <div>
                <dt className="tw:font-medium">What you get from this page</dt>
                <dd className="tw:text-stone-600">{journey.outcome}</dd>
              </div>
            </dl>
            <p className="licence-journey__updated tw:mt-3 tw:font-mono tw:text-xs tw:text-stone-600">
              Reviewed {journey.updatedOn}
            </p>
          </header>

          <JourneyLinks slugs={journey.prerequisites} label="Usually first:" />

          {journey.sections.map((section) => {
            const kinds = new Set(section.claims.map((claim) => claim.kind));
            const sectionKind = kinds.size === 1 ? [...kinds][0] : null;
            const sectionID = `journey-${section.heading.replace(/\W+/g, "-").toLowerCase()}`;

            return (
              <section
                key={section.heading}
                className="licence-journey__section"
                aria-labelledby={sectionID}
              >
                <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                  <h2 id={sectionID} className="tw:text-xl tw:font-semibold">
                    {section.heading}
                  </h2>
                  {sectionKind ? <ClaimBadge kind={sectionKind} /> : null}
                </div>
                {section.lead ? (
                  <p className="tw:mt-2 tw:text-sm tw:text-stone-600">{section.lead}</p>
                ) : null}
                <ul className="licence-journey__claims tw:mt-4 tw:flex tw:flex-col tw:gap-4">
                  {section.claims.map((claim) => (
                    <ClaimItem key={claim.text} claim={claim} labelled={sectionKind === null} />
                  ))}
                </ul>
              </section>
            );
          })}

          <section aria-labelledby="journey-evidence" className="licence-journey__evidence">
            <h2 id="journey-evidence" className="tw:text-xl tw:font-semibold">
              Check real availability
            </h2>
            {keyword ? (
              <>
                <p className="tw:mt-2 tw:text-sm tw:text-stone-600">
                  This journey maps to the upstream work option{" "}
                  <span className="tw:font-mono">{keyword.trim()}</span>, which the discovery tools
                  send unchanged.
                </p>
                <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
                  <Link
                    href={compareHref({
                      siteIDs: cityHubCompareSelection(bangkok).siteIDs,
                      keyword,
                    })}
                    className={cn(buttonVariants({ size: "lg" }))}
                  >
                    Compare {bangkok.label} offices
                  </Link>
                  <Link
                    href={OFFICES_PATH}
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    Pick another area
                  </Link>
                  <Link
                    href={AVAILABILITY_GUIDE_PATH}
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    How to read the results
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="tw:mt-2 tw:text-sm tw:text-stone-600">
                  {journey.keywordNote ??
                    "The appointment system does not expose this step, so there is no availability view for it."}
                </p>
                <div className="tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
                  <Link
                    href={OFFICES_PATH}
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    Find the office that serves your area
                  </Link>
                  <Link
                    href={AVAILABILITY_GUIDE_PATH}
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    How to read availability evidence
                  </Link>
                </div>
              </>
            )}
          </section>

          <JourneyLinks slugs={journey.nextSteps} label="Usually next:" />

          <Card className="licence-journey__disclosure">
            <CardHeader>
              <h2 className="tw:font-heading tw:text-base tw:font-medium">
                Before you act on this
              </h2>
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-2 tw:text-sm tw:text-stone-600">
              <p>{`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}</p>
              <p>
                <a
                  href={OFFICIAL_DLT_BOOKING_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  Continue to the DLT Smart Queue booking service
                </a>
              </p>
            </CardContent>
          </Card>
        </article>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
