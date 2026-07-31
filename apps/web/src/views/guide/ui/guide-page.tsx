import Link from "next/link";

import {
  CITY_HUBS,
  cityHubCompareSelection,
  compareHref,
  mapHref,
  parseWorkKeyword,
} from "@/entities/dlt";
import { CLAIM_LABEL, type Guide, type GuideClaim } from "@/entities/guide";
import { INDEPENDENCE_STATEMENT, OFFICIAL_DLT_BOOKING_URL } from "@/shared/config/official-links";
import { cn } from "@/shared/lib/utils";
import { badgeVariants } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { DiscoveryNav } from "@/widgets/discovery-nav";

const CLAIM_BADGE_VARIANT: Record<GuideClaim["kind"], "secondary" | "outline"> = {
  proven: "secondary",
  "official-only": "outline",
  reported: "outline",
};

function ClaimItem({ claim }: { claim: GuideClaim }) {
  return (
    <li
      className={`guide-page__claim guide-page__claim--${claim.kind} tw:flex tw:flex-col tw:gap-1`}
    >
      <span
        className={cn(
          badgeVariants({ variant: CLAIM_BADGE_VARIANT[claim.kind] }),
          "guide-page__claim-label tw:self-start",
        )}
      >
        {CLAIM_LABEL[claim.kind]}
      </span>
      <span className="guide-page__claim-text tw:text-sm">{claim.text}</span>
      {claim.kind === "reported" ? (
        <span className="guide-page__claim-source tw:text-xs tw:text-muted-foreground">
          {claim.source} —{" "}
          <a
            href={claim.sourceUrl}
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="guide-page__claim-link tw:text-primary tw:underline"
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
    <main
      className={`guide-page guide-page--${guide.slug} tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10`}
    >
      <article className="guide-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-3xl tw:flex-col tw:gap-8">
        <header className="guide-page__header">
          <DiscoveryNav current="/guides" />
          <p className="guide-page__breadcrumb tw:mt-4 tw:text-xs tw:text-muted-foreground">
            <Link href="/guides" className="tw:text-primary tw:underline">
              Guides
            </Link>{" "}
            / {guide.slug}
          </p>
          <h1 className="guide-page__title tw:mt-2 tw:text-3xl tw:font-bold">{guide.title}</h1>
          <p className="guide-page__intro tw:mt-3 tw:text-sm tw:text-muted-foreground">
            {guide.intro}
          </p>
          <p className="guide-page__updated tw:mt-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
            Reviewed {guide.updatedOn}
          </p>
        </header>

        {guide.sections.map((section) => (
          <section
            key={section.heading}
            className="guide-page__section"
            aria-labelledby={`guide-section-${section.heading.replace(/\W+/g, "-").toLowerCase()}`}
          >
            <h2
              id={`guide-section-${section.heading.replace(/\W+/g, "-").toLowerCase()}`}
              className="guide-page__section-title tw:text-xl tw:font-semibold"
            >
              {section.heading}
            </h2>
            {section.lead ? (
              <p className="guide-page__section-lead tw:mt-2 tw:text-sm tw:text-muted-foreground">
                {section.lead}
              </p>
            ) : null}
            <ul className="guide-page__claims tw:mt-4 tw:flex tw:flex-col tw:gap-4">
              {section.claims.map((claim) => (
                <ClaimItem key={claim.text} claim={claim} />
              ))}
            </ul>
          </section>
        ))}

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
          <CardContent className="tw:flex tw:flex-col tw:gap-2 tw:text-sm tw:text-muted-foreground">
            <p className="guide-page__disclosure-text">{INDEPENDENCE_STATEMENT}</p>
            <p className="guide-page__disclosure-handoff">
              <a
                href={OFFICIAL_DLT_BOOKING_URL}
                rel="noopener noreferrer"
                target="_blank"
                className="guide-page__official tw:text-primary tw:underline"
              >
                Continue to the DLT Smart Queue booking service
              </a>
            </p>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}
