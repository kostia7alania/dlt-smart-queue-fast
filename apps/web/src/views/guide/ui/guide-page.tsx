import Link from "next/link";

import {
  CITY_HUBS,
  cityHubCompareSelection,
  compareHref,
  mapHref,
  parseWorkKeyword,
} from "@/entities/dlt";
import { CLAIM_LABEL, type Guide, type GuideClaim } from "@/entities/guide";
import {
  AVAILABILITY_NOTICE,
  INDEPENDENCE_NOTICE,
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

/**
 * A single-kind section is labelled once in its header, so the badge marks the
 * evidence boundary without repeating on every line. Mixed sections label each
 * claim individually.
 */
function ClaimItem({ claim, labelled }: { claim: GuideClaim; labelled: boolean }) {
  return (
    <li
      className={`guide-page__claim guide-page__claim--${claim.kind} tw:flex tw:flex-col tw:gap-1`}
    >
      {labelled ? (
        <ClaimBadge kind={claim.kind} className="guide-page__claim-label tw:self-start" />
      ) : null}
      <span className="guide-page__claim-text tw:text-sm">{claim.text}</span>
      {claim.kind === "reported" ? (
        <span className="guide-page__claim-source tw:text-xs tw:text-stone-600">
          {claim.source} —{" "}
          <a
            href={claim.sourceUrl}
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="guide-page__claim-link tw:text-stone-950 tw:underline tw:underline-offset-4"
          >
            source
          </a>
          , read {claim.observedOn}
        </span>
      ) : null}
    </li>
  );
}

export function GuidePage({ guide }: { guide: Guide }) {
  const keyword = parseWorkKeyword(guide.keyword);
  const bangkok = CITY_HUBS[0];

  return (
    <div
      className={`guide-page guide-page--${guide.slug} tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950`}
    >
      <PublicSiteHeader />
      <main className="guide-page__main">
        <article className="guide-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-3xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
          <header className="guide-page__header">
            <p className="guide-page__breadcrumb tw:mt-4 tw:text-xs tw:text-stone-600">
              <Link href="/guides" className="tw:text-stone-950 tw:underline tw:underline-offset-4">
                Guides
              </Link>{" "}
              / {guide.slug}
            </p>
            <h1 className="guide-page__title tw:mt-2 tw:text-3xl tw:font-bold">{guide.title}</h1>
            <p className="guide-page__intro tw:mt-3 tw:text-sm tw:text-stone-600">{guide.intro}</p>
            <p className="guide-page__updated tw:mt-2 tw:font-mono tw:text-xs tw:text-stone-600">
              Reviewed {guide.updatedOn}
            </p>
          </header>

          {guide.sections.map((section) => {
            const kinds = new Set(section.claims.map((claim) => claim.kind));
            const sectionKind = kinds.size === 1 ? [...kinds][0] : null;
            const sectionID = `guide-section-${section.heading.replace(/\W+/g, "-").toLowerCase()}`;

            return (
              <section
                key={section.heading}
                className="guide-page__section"
                aria-labelledby={sectionID}
              >
                <div className="guide-page__section-head tw:flex tw:flex-wrap tw:items-center tw:gap-3">
                  <h2
                    id={sectionID}
                    className="guide-page__section-title tw:text-xl tw:font-semibold"
                  >
                    {section.heading}
                  </h2>
                  {sectionKind ? (
                    <ClaimBadge kind={sectionKind} className="guide-page__section-label" />
                  ) : null}
                </div>
                {section.lead ? (
                  <p className="guide-page__section-lead tw:mt-2 tw:text-sm tw:text-stone-600">
                    {section.lead}
                  </p>
                ) : null}
                <ul className="guide-page__claims tw:mt-4 tw:flex tw:flex-col tw:gap-4">
                  {section.claims.map((claim) => (
                    <ClaimItem key={claim.text} claim={claim} labelled={sectionKind === null} />
                  ))}
                </ul>
              </section>
            );
          })}

          <section aria-labelledby="guide-page-next" className="guide-page__next">
            <h2 id="guide-page-next" className="guide-page__next-title tw:text-xl tw:font-semibold">
              Check availability now
            </h2>
            <div className="guide-page__actions tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
              <Link
                href={compareHref({
                  siteIDs: cityHubCompareSelection(bangkok).siteIDs,
                  keyword,
                })}
                className={cn(buttonVariants({ size: "lg" }), "guide-page__action")}
              >
                Compare {bangkok.label} offices
              </Link>
              <Link
                href="/offices"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "guide-page__action",
                )}
              >
                Pick another area
              </Link>
              <Link
                href={mapHref({ keyword })}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "guide-page__action",
                )}
              >
                Open the office map
              </Link>
            </div>
          </section>

          <Card className="guide-page__disclosure">
            <CardHeader>
              <h2 className="guide-page__disclosure-title tw:font-heading tw:text-base tw:font-medium">
                Before you book
              </h2>
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-2 tw:text-sm tw:text-stone-600">
              <p className="guide-page__disclosure-text">{`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}</p>
              <p className="guide-page__disclosure-handoff">
                <a
                  href={OFFICIAL_DLT_BOOKING_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="guide-page__official tw:text-stone-950 tw:underline tw:underline-offset-4"
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
