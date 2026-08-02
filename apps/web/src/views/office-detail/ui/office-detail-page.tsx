import Link from "next/link";

import {
  type CityHub,
  COMPARE_MAX_OFFICES,
  calendarHref,
  cityHubForSiteID,
  cityHubOffices,
  compareHref,
  compareSelection,
  DEFAULT_WORK_KEYWORD,
  type DirectoryOffice,
  directoryOfficeById,
  type GeoPrecision,
  historyHref,
  isAppointmentOpen,
  mapOfficeHref,
  nearestOffices,
  officeDetailPath,
  officeDirectory,
  officeGeoById,
  officeGeoDataset,
  officeNameOrNull,
  WORK_KEYWORDS,
} from "@/entities/dlt";
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

// Everything on this page comes from two committed datasets: the captured
// upstream office list and the derived geocode file. Nothing is fetched, and
// the upstream name is never corrected, translated, or tidied.

const PRECISION_LABEL: Record<GeoPrecision, string> = {
  office: "exact office location",
  district: "district-level position",
  province: "province centroid",
};

const PRECISION_NOTE: Record<GeoPrecision, string> = {
  office:
    "The geocoder resolved this entry to the office itself, so the map pin should be at or beside the building.",
  district:
    "The geocoder only reached the surrounding district, so the map pin marks the district, not the door.",
  province:
    "The geocoder only reached the province, so the map pin is a province centroid and can sit far from the office.",
};

type OfficeDetailPageProps = {
  office: DirectoryOffice;
  hub?: CityHub;
};

export function OfficeDetailPage({ office, hub: hubOverride }: OfficeDetailPageProps) {
  const name = officeNameOrNull(office) ?? `Site ID ${office.sit_id}`;
  const open = isAppointmentOpen(office);
  const captured = officeDirectory.generated_at.slice(0, 10);
  const geo = officeGeoById.get(office.sit_id);
  const geocoded = officeGeoDataset.generated_at.slice(0, 10);

  const hub = hubOverride ?? cityHubForSiteID(office.sit_id);
  const nearby = nearestOffices(office.sit_id, 3);
  // This office is always first so the comparison link keeps its subject; the
  // rest of the hub fills the remaining slots, appointment-open ones first.
  const neighbours = hub
    ? cityHubOffices(hub).filter((entry) => entry.sit_id !== office.sit_id)
    : [];
  const rest = compareSelection(neighbours, COMPARE_MAX_OFFICES - 1);
  const compareSiteIDs = [office.sit_id, ...rest.siteIDs];

  return (
    <div
      className={`office-detail office-detail--site-${office.sit_id} tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950`}
    >
      <PublicSiteHeader />
      <main className="office-detail__container tw:mx-auto tw:flex tw:w-full tw:max-w-3xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
        <header className="office-detail__header">
          <p className="office-detail__breadcrumb tw:mt-4 tw:text-xs tw:text-stone-600">
            <Link href="/offices" className="tw:text-stone-950 tw:underline tw:underline-offset-4">
              Offices by area
            </Link>{" "}
            /{" "}
            {hub ? (
              <>
                <Link
                  href={`/offices/${hub.slug}`}
                  className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  {hub.label}
                </Link>{" "}
                /{" "}
              </>
            ) : null}
            {name}
          </p>
          <h1 className="office-detail__title tw:mt-2 tw:text-3xl tw:font-bold">{name}</h1>
          <p className="office-detail__lead tw:mt-2 tw:text-sm tw:text-stone-600">
            Site ID <span className="tw:font-mono">#{office.sit_id}</span>. The name above is the
            exact string the appointment system returns for this site, including any spelling it
            carries. This page repeats what two committed datasets hold about the office and links
            into the tools that ask the live service.
          </p>
        </header>

        <section aria-labelledby="office-detail-capture" className="office-detail__capture">
          <h2
            id="office-detail-capture"
            className="office-detail__capture-title tw:text-xl tw:font-semibold"
          >
            What the captured list says
          </h2>
          <dl className="office-detail__facts tw:mt-3 tw:grid tw:gap-4 tw:sm:grid-cols-2">
            <div className="office-detail__fact office-detail__fact--name">
              <dt className="tw:text-xs tw:text-stone-600">Upstream name (sit_name)</dt>
              <dd className="office-detail__fact-value tw:mt-1 tw:text-sm tw:font-medium">
                {name}
              </dd>
            </div>
            <div className="office-detail__fact office-detail__fact--site-id">
              <dt className="tw:text-xs tw:text-stone-600">Site ID (sit_id)</dt>
              <dd className="office-detail__fact-value tw:mt-1 tw:font-mono tw:text-sm">
                {office.sit_id}
              </dd>
            </div>
            <div className="office-detail__fact office-detail__fact--flag tw:sm:col-span-2">
              <dt className="tw:text-xs tw:text-stone-600">Appointment flag (app_open)</dt>
              <dd className="office-detail__fact-value tw:mt-1 tw:text-sm">
                <span
                  className={cn(
                    badgeVariants({ variant: open ? "secondary" : "outline" }),
                    "office-detail__flag-badge",
                  )}
                >
                  app_open = {office.app_open}
                </span>
                <span className="office-detail__flag-note tw:mt-2 tw:block tw:text-stone-600">
                  Observed on {captured}:{" "}
                  {open
                    ? "the office list returned this office as listed for appointments."
                    : "the office list did not return this office as listed for appointments."}{" "}
                  That is one reading of a list, not a statement about free slots today.
                </span>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="office-detail-position" className="office-detail__position">
          <h2
            id="office-detail-position"
            className="office-detail__position-title tw:text-xl tw:font-semibold"
          >
            How precisely we can place it
          </h2>
          {office.geo_precision ? (
            <>
              <p className="office-detail__precision tw:mt-2 tw:text-sm">
                <span className="office-detail__precision-label tw:font-medium">
                  {PRECISION_LABEL[office.geo_precision]}
                </span>{" "}
                <span className="tw:text-stone-600">— {PRECISION_NOTE[office.geo_precision]}</span>
              </p>
              {geo ? (
                <p className="office-detail__coordinates tw:mt-2 tw:text-sm tw:text-stone-600">
                  Coordinates <span className="tw:font-mono">{geo.lat.toFixed(5)}</span>,{" "}
                  <span className="tw:font-mono">{geo.lon.toFixed(5)}</span>, resolved from the Thai
                  name <span lang="th">{geo.th_name}</span> and matched against{" "}
                  <span lang="th">{geo.matched}</span>.
                </p>
              ) : null}
              <p className="office-detail__attribution tw:mt-2 tw:text-xs tw:text-stone-600">
                Geocoding &copy; OpenStreetMap contributors (ODbL), generated {geocoded}. It is our
                derived data, not part of the DLT contract, and it is not a postal address.
              </p>
            </>
          ) : (
            <p className="office-detail__precision tw:mt-2 tw:text-sm tw:text-stone-600">
              Our geocode dataset does not place this office, so it has no position here.
            </p>
          )}
        </section>

        <section aria-labelledby="office-detail-check" className="office-detail__check">
          <h2
            id="office-detail-check"
            className="office-detail__check-title tw:text-xl tw:font-semibold"
          >
            Check availability
          </h2>
          <p className="office-detail__check-note tw:mt-2 tw:text-sm tw:text-stone-600">
            These links carry this site ID into the interactive views, which ask the appointment
            service when you open them.
          </p>
          <div className="office-detail__actions tw:mt-3 tw:flex tw:flex-wrap tw:gap-3">
            <Link
              href={calendarHref({ siteID: office.sit_id, keyword: DEFAULT_WORK_KEYWORD })}
              className={cn(buttonVariants({ size: "lg" }), "office-detail__action")}
            >
              Open this office&rsquo;s calendar
            </Link>
            {office.geo_precision ? (
              <Link
                href={mapOfficeHref({ siteID: office.sit_id, keyword: DEFAULT_WORK_KEYWORD })}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "office-detail__action",
                )}
              >
                Find it on the map
              </Link>
            ) : null}
            <Link
              href={historyHref({ siteID: office.sit_id, keyword: DEFAULT_WORK_KEYWORD })}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "office-detail__action",
              )}
            >
              See stored observations
            </Link>
            <Link
              href={compareHref({ siteIDs: compareSiteIDs, keyword: DEFAULT_WORK_KEYWORD })}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "office-detail__action",
              )}
            >
              Compare with alternatives
            </Link>
          </div>
          <p className="office-detail__compare-note tw:mt-3 tw:text-xs tw:text-stone-600">
            {!hub
              ? `The comparison link preselects this office alone: no published area page groups it with alternatives yet, so add them yourself in the comparison view, which holds ${COMPARE_MAX_OFFICES} offices at a time.`
              : neighbours.length === 0
                ? `The comparison link preselects this office alone: it is the only entry ${hub.label} has in the upstream list, so any alternative has to be picked in the comparison view, which holds ${COMPARE_MAX_OFFICES} offices at a time.`
                : rest.omitted > 0
                  ? `The comparison link preselects this office plus ${rest.siteIDs.length} more from ${hub.label}. The view holds ${COMPARE_MAX_OFFICES} offices at a time, so ${rest.omitted} of that group are left out; offices marked open in the captured list go in first.`
                  : `The comparison link preselects this office plus the other ${rest.siteIDs.length} in ${hub.label}, which all fit inside the ${COMPARE_MAX_OFFICES}-office limit.`}
          </p>
        </section>

        <section aria-labelledby="office-detail-work" className="office-detail__work">
          <h2
            id="office-detail-work"
            className="office-detail__work-title tw:text-xl tw:font-semibold"
          >
            Work options
          </h2>
          <p className="office-detail__work-note tw:mt-2 tw:text-sm tw:text-stone-600">
            The appointment system groups services under keywords that this project sends unchanged.
            This office may return days for one keyword and nothing for another — an empty result is
            a real answer, not an error.
          </p>
          <ul className="office-detail__work-list tw:mt-3 tw:flex tw:flex-wrap tw:gap-3 tw:text-sm">
            {WORK_KEYWORDS.map((keyword) => (
              <li key={keyword} className="office-detail__work-item">
                <Link
                  href={calendarHref({ siteID: office.sit_id, keyword })}
                  className="office-detail__work-link tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  Calendar for <span className="tw:font-mono">{keyword.trim()}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="office-detail-area" className="office-detail__area">
          <h2
            id="office-detail-area"
            className="office-detail__area-title tw:text-xl tw:font-semibold"
          >
            Area page
          </h2>
          <p className="office-detail__area-note tw:mt-2 tw:text-sm tw:text-stone-600">
            {hub ? (
              <>
                This office is listed on the{" "}
                <Link
                  href={`/offices/${hub.slug}`}
                  className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  {hub.title}
                </Link>{" "}
                page, together with the alternatives worth checking in the same trip.
              </>
            ) : (
              <>
                No published area page covers this office yet. The{" "}
                <Link
                  href="/offices"
                  className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                >
                  areas we do publish
                </Link>{" "}
                are the ones where the captured list proves usable coverage.
              </>
            )}
          </p>
        </section>

        <section aria-labelledby="office-detail-nearby" className="office-detail__nearby">
          <h2
            id="office-detail-nearby"
            className="office-detail__nearby-title tw:text-xl tw:font-semibold"
          >
            Closest alternatives
          </h2>
          <p className="office-detail__nearby-note tw:mt-2 tw:text-sm tw:text-stone-600">
            Straight-line distance between committed coordinates, not travel time. Several
            coordinates are district or province fallbacks, so treat these as a shortlist to check,
            not as directions.
          </p>
          <ul className="office-detail__nearby-list tw:mt-3 tw:grid tw:gap-2 tw:text-sm">
            {nearby.map((entry) => {
              const neighbour = directoryOfficeById.get(entry.sit_id);
              const neighbourName = neighbour ? officeNameOrNull(neighbour) : null;
              return (
                <li key={entry.sit_id} className="tw:flex tw:flex-wrap tw:items-baseline tw:gap-2">
                  <Link
                    href={officeDetailPath(entry.sit_id)}
                    className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                  >
                    {neighbourName ?? `Site ID ${entry.sit_id}`}
                  </Link>
                  <span className="tw:font-mono tw:text-xs tw:text-stone-600">
                    {entry.km < 1 ? "under 1 km" : `${Math.round(entry.km)} km`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="office-detail-limits" className="office-detail__limits">
          <h2
            id="office-detail-limits"
            className="office-detail__limits-title tw:text-xl tw:font-semibold"
          >
            What this page cannot tell you
          </h2>
          <Card className="office-detail__limits-card tw:mt-3">
            <CardHeader>
              <p className="office-detail__limits-lead tw:text-sm">
                {`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}
              </p>
            </CardHeader>
            <CardContent className="tw:flex tw:flex-col tw:gap-2 tw:text-sm tw:text-stone-600">
              <ul className="office-detail__limits-list tw:list-disc tw:pl-5">
                <li>
                  Whether this office will accept your paperwork, service, or visa type — only DLT
                  can answer that.
                </li>
                <li>
                  Which documents, tests, or fees apply here — those change; see the{" "}
                  <Link
                    href="/guides"
                    className="tw:text-stone-950 tw:underline tw:underline-offset-4"
                  >
                    guides
                  </Link>{" "}
                  for what is verifiable and what is not.
                </li>
                <li>
                  Whether the <span className="tw:font-mono">app_open</span> flag still holds: it is
                  a capture from {captured}, and it never promised free slots.
                </li>
                <li>
                  Whether a day you see here will still exist when you reach the booking flow.
                </li>
                <li>
                  The street address, opening hours, or phone number — the appointment list returns
                  none of them, and this page does not invent them.
                </li>
              </ul>
              <p className="office-detail__limits-official">
                <a
                  href={OFFICIAL_DLT_BOOKING_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="office-detail__official tw:text-stone-950 tw:underline tw:underline-offset-4"
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
