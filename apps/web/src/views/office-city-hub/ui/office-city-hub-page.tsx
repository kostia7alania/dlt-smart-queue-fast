import Link from "next/link";

import {
  type CityHub,
  COMPARE_MAX_OFFICES,
  calendarHref,
  cityHubCompareSelection,
  cityHubCoverage,
  cityHubOffices,
  compareHref,
  DEFAULT_WORK_KEYWORD,
  historyHref,
  isAppointmentOpen,
  mapHref,
  officeDirectory,
  WORK_KEYWORDS,
} from "@/entities/dlt";
import {
  AVAILABILITY_NOTICE,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  PRIVACY_NOTICE,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { OfficeDirectoryTable } from "@/widgets/office-directory-table";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

type OfficeCityHubPageProps = {
  hub: CityHub;
};

export function OfficeCityHubPage({ hub }: OfficeCityHubPageProps) {
  const offices = cityHubOffices(hub);
  const coverage = cityHubCoverage(hub);
  const selection = cityHubCompareSelection(hub);
  const firstOpen = offices.find(isAppointmentOpen) ?? offices[0];
  const captured = officeDirectory.generated_at.slice(0, 10);

  return (
    <div
      className={`office-city-hub office-city-hub--${hub.slug} tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950`}
    >
      <PublicSiteHeader />
      <main className="office-city-hub__container tw:mx-auto tw:flex tw:w-full tw:max-w-5xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
        <header className="office-city-hub__header">
          <p className="office-city-hub__breadcrumb tw:mt-4 tw:text-xs tw:text-stone-600">
            <Link href="/offices" className="tw:text-stone-950 tw:underline tw:underline-offset-4">
              Offices by area
            </Link>{" "}
            / {hub.label}
          </p>
          <h1 className="office-city-hub__title tw:mt-2 tw:text-3xl tw:font-bold">{hub.title}</h1>
          <p className="office-city-hub__summary tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            {hub.summary}
          </p>
        </header>

        <section aria-labelledby="office-city-hub-start" className="office-city-hub__start">
          <h2
            id="office-city-hub-start"
            className="office-city-hub__start-title tw:text-xl tw:font-semibold"
          >
            Start here
          </h2>
          <div className="office-city-hub__actions tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
            <Link
              href={compareHref({ siteIDs: selection.siteIDs, keyword: DEFAULT_WORK_KEYWORD })}
              className={cn(buttonVariants({ size: "lg" }), "office-city-hub__action")}
            >
              Compare these offices
            </Link>
            {firstOpen ? (
              <Link
                href={calendarHref({ siteID: firstOpen.sit_id, keyword: DEFAULT_WORK_KEYWORD })}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "office-city-hub__action",
                )}
              >
                Open a calendar
              </Link>
            ) : null}
            <Link
              href={mapHref({ keyword: DEFAULT_WORK_KEYWORD, search: hub.mapSearch })}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "office-city-hub__action",
              )}
            >
              See them on the map
            </Link>
          </div>
          <p className="office-city-hub__cap tw:mt-3 tw:text-xs tw:text-stone-600">
            {selection.omitted > 0
              ? `The comparison view accepts ${COMPARE_MAX_OFFICES} offices at a time, so ${selection.omitted} of ${coverage.offices} are left out of that link. Offices marked open in the captured list are included first.`
              : `All ${coverage.offices} offices fit inside the ${COMPARE_MAX_OFFICES}-office comparison limit.`}
          </p>
        </section>

        <section aria-labelledby="office-city-hub-offices" className="office-city-hub__offices">
          <h2
            id="office-city-hub-offices"
            className="office-city-hub__offices-title tw:text-xl tw:font-semibold"
          >
            Offices in the appointment list
          </h2>
          <p className="office-city-hub__offices-note tw:mt-2 tw:text-sm tw:text-stone-600">
            {coverage.appointmentOpen} of {coverage.offices} were marked open for appointments when
            the list was captured on {captured}. That flag is not a promise of free slots: open the
            calendar to see the day-level messages the appointment system returns right now.
          </p>
          <div className="office-city-hub__table tw:mt-4">
            <OfficeDirectoryTable
              offices={offices}
              keyword={DEFAULT_WORK_KEYWORD}
              caption={`Land transport offices associated with ${hub.label}, named exactly as the appointment system returns them.`}
            />
          </div>
        </section>

        <section aria-labelledby="office-city-hub-work" className="office-city-hub__work">
          <h2
            id="office-city-hub-work"
            className="office-city-hub__work-title tw:text-xl tw:font-semibold"
          >
            Work options
          </h2>
          <p className="office-city-hub__work-note tw:mt-2 tw:text-sm tw:text-stone-600">
            The appointment system groups services under keywords that this project sends unchanged.
            Not every office returns every keyword — an empty result is a real answer, not an error.
          </p>
          <ul className="office-city-hub__work-list tw:mt-3 tw:flex tw:flex-wrap tw:gap-3 tw:text-sm">
            {WORK_KEYWORDS.map((keyword) => (
              <li key={keyword} className="office-city-hub__work-item">
                <Link
                  href={compareHref({ siteIDs: selection.siteIDs, keyword })}
                  className="office-city-hub__work-link tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  Compare <span className="tw:font-mono">{keyword.trim()}</span>
                </Link>
              </li>
            ))}
            {firstOpen ? (
              <li className="office-city-hub__work-item">
                <Link
                  href={historyHref({ siteID: firstOpen.sit_id, keyword: DEFAULT_WORK_KEYWORD })}
                  className="office-city-hub__work-link tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  Recent stored observations
                </Link>
              </li>
            ) : null}
          </ul>
        </section>

        <section aria-labelledby="office-city-hub-limits" className="office-city-hub__limits">
          <h2
            id="office-city-hub-limits"
            className="office-city-hub__limits-title tw:text-xl tw:font-semibold"
          >
            What this page cannot tell you
          </h2>
          <Card className="office-city-hub__limits-card tw:mt-3">
            <CardHeader>
              <p className="office-city-hub__limits-lead tw:text-sm">
                {`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}
              </p>
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-2 tw:text-sm tw:text-stone-600">
              <ul className="office-city-hub__limits-list tw:list-disc tw:pl-5">
                <li>
                  Whether a specific office will accept your paperwork, service, or visa type — only
                  DLT can answer that.
                </li>
                <li>
                  Which documents, tests, or fees apply — those change; see the{" "}
                  <Link
                    href="/guides"
                    className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                  >
                    guides
                  </Link>{" "}
                  for what is verifiable and what is not.
                </li>
                <li>Whether a slot you see will still exist when you reach the booking flow.</li>
                <li>
                  {coverage.offices - coverage.named > 0
                    ? `Names for ${coverage.offices - coverage.named} of these entries — the upstream list returns them blank, and this page does not invent one.`
                    : "Anything the upstream list does not return for these offices."}
                </li>
              </ul>
              <p className="office-city-hub__limits-official">
                <a
                  href={OFFICIAL_DLT_BOOKING_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="office-city-hub__official tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  Continue to the DLT Smart Queue booking service
                </a>{" "}
                when you have chosen an office and date.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
