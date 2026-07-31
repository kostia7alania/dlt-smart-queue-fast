import Link from "next/link";

import {
  CITY_HUBS,
  cityHubCoverage,
  compareHref,
  DEFAULT_WORK_KEYWORD,
  officeDirectory,
} from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { DiscoveryNav } from "@/widgets/discovery-nav";

export function OfficesPage() {
  const { totals, generated_at, source } = officeDirectory;
  const captured = generated_at.slice(0, 10);

  return (
    <main className="offices-page tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10">
      <div className="offices-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-5xl tw:flex-col tw:gap-8">
        <header className="offices-page__header">
          <DiscoveryNav current="/offices" />
          <h1 className="offices-page__title tw:mt-4 tw:text-3xl tw:font-bold">
            Thai DLT offices by area
          </h1>
          <p className="offices-page__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
            Each area page lists the land transport offices exactly as the appointment system names
            them, shows whether the captured list marked them as open for appointments, and links
            straight into live availability. Booking itself always happens on the DLT service.
          </p>
        </header>

        <section aria-labelledby="offices-page-areas" className="offices-page__areas">
          <h2
            id="offices-page-areas"
            className="offices-page__areas-title tw:text-xl tw:font-semibold"
          >
            Published areas
          </h2>
          <ul className="offices-page__list tw:mt-4 tw:grid tw:gap-4 tw:sm:grid-cols-2">
            {CITY_HUBS.map((hub) => {
              const coverage = cityHubCoverage(hub);
              return (
                <li key={hub.slug} className="offices-page__item">
                  <Card className={`offices-page__card offices-page__card--${hub.slug} tw:h-full`}>
                    <CardHeader>
                      <h3 className="offices-page__card-title tw:font-heading tw:text-base tw:font-medium">
                        {hub.label}
                      </h3>
                      <p className="offices-page__card-counts tw:font-mono tw:text-xs tw:text-muted-foreground">
                        {coverage.offices} in the list · {coverage.appointmentOpen} marked open ·{" "}
                        {coverage.geocoded} mapped
                      </p>
                    </CardHeader>
                    <CardContent className="tw:flex tw:flex-col tw:gap-3">
                      <p className="offices-page__card-summary tw:text-sm tw:text-muted-foreground">
                        {hub.summary}
                      </p>
                      <Link
                        href={`/offices/${hub.slug}`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "offices-page__card-link tw:self-start",
                        )}
                      >
                        Open {hub.label}
                      </Link>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="offices-page-coverage" className="offices-page__coverage">
          <h2
            id="offices-page-coverage"
            className="offices-page__coverage-title tw:text-xl tw:font-semibold"
          >
            What the dataset covers
          </h2>
          <Card className="offices-page__coverage-card tw:mt-4">
            <CardContent className="tw:flex tw:flex-col tw:gap-3 tw:text-sm">
              <p className="offices-page__coverage-totals">
                The captured office list contains{" "}
                <strong className="tw:font-mono">{totals.entries}</strong> entries.{" "}
                <strong className="tw:font-mono">{totals.named}</strong> have an English name,{" "}
                <strong className="tw:font-mono">{totals.appointment_open}</strong> were marked
                <code className="tw:mx-1 tw:font-mono tw:text-xs">app_open = 1</code>
                when captured, and <strong className="tw:font-mono">{totals.geocoded}</strong> have
                a position in our geocode dataset.
              </p>
              <p className="offices-page__coverage-note tw:text-muted-foreground">
                Entries without a position are shopping-mall and hospital sub-branches, a
                registration section, an upstream test entry, and placeholder rows. They are kept
                because the appointment system returns them, and they are not corrected here.
              </p>
              <p className="offices-page__coverage-source tw:text-xs tw:text-muted-foreground">
                Source: {source}. Directory generated {captured} by
                <code className="tw:mx-1 tw:font-mono">node tools/build-office-directory.mjs</code>.
                The appointment flag reflects that capture, not this minute — open a linked view for
                current data.
              </p>
              <p className="offices-page__coverage-links tw:flex tw:flex-wrap tw:gap-3 tw:text-sm">
                <Link
                  href="/map"
                  className="offices-page__coverage-link tw:text-primary tw:underline"
                >
                  See every mapped office
                </Link>
                <Link
                  href={compareHref({ siteIDs: [], keyword: DEFAULT_WORK_KEYWORD })}
                  className="offices-page__coverage-link tw:text-primary tw:underline"
                >
                  Compare offices yourself
                </Link>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
