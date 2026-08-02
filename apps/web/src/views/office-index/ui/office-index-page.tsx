import Link from "next/link";

import {
  type DirectoryOffice,
  isAppointmentOpen,
  officeDetailPages,
  officeDetailPath,
  officeDirectory,
  officeNameOrNull,
} from "@/entities/dlt";
import { LICENCE_PATH, OFFICES_PATH } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { badgeVariants } from "@/shared/ui/badge";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

// A flat, human-readable index of every generated office page, so no office is
// reachable only from the sitemap. Everything here is read from the committed
// directory at build time: nothing is fetched, and no upstream name is
// corrected, translated, or tidied on its way to the screen.

type IndexRow = {
  siteID: number;
  /** The upstream `sit_name` string, rendered exactly as stored. */
  name: string;
  open: boolean;
};

type LetterGroup = {
  letter: string;
  rows: IndexRow[];
};

/** First character of the upstream name, uppercased only to pick a bucket. */
function groupingLetter(name: string): string {
  return name.trim().slice(0, 1).toUpperCase();
}

function toRow(office: DirectoryOffice): IndexRow | null {
  const name = officeNameOrNull(office);
  if (!name) return null;
  return { siteID: office.sit_id, name, open: isAppointmentOpen(office) };
}

function letterGroups(offices: readonly DirectoryOffice[]): LetterGroup[] {
  const buckets = new Map<string, IndexRow[]>();

  for (const office of offices) {
    const row = toRow(office);
    if (!row) continue;
    const letter = groupingLetter(row.name);
    const bucket = buckets.get(letter);
    if (bucket) bucket.push(row);
    else buckets.set(letter, [row]);
  }

  return [...buckets.entries()]
    .map(([letter, rows]) => ({
      letter,
      rows: rows.toSorted((left, right) => left.name.localeCompare(right.name, "en")),
    }))
    .toSorted((left, right) => left.letter.localeCompare(right.letter, "en"));
}

function groupAnchor(letter: string): string {
  return `office-index-letter-${letter}`;
}

export function OfficeIndexPage() {
  const captured = officeDirectory.generated_at.slice(0, 10);
  const entries = officeDirectory.totals.entries;
  const groups = letterGroups(officeDetailPages);
  const rowCount = groups.reduce((total, group) => total + group.rows.length, 0);
  const openCount = groups.reduce(
    (total, group) => total + group.rows.filter((row) => row.open).length,
    0,
  );
  const withoutPage = entries - rowCount;

  return (
    <div className="office-index tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main className="office-index__container tw:mx-auto tw:flex tw:w-full tw:max-w-5xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
        <header className="office-index__header">
          <p className="office-index__breadcrumb tw:mt-4 tw:text-xs tw:text-stone-600">
            <Link
              href={OFFICES_PATH}
              className="office-index__breadcrumb-link tw:text-stone-950 tw:underline tw:underline-offset-4"
            >
              Offices by area
            </Link>{" "}
            / Every office with a page
          </p>
          <h1 className="office-index__title tw:mt-2 tw:text-3xl tw:font-bold">
            Every Thai DLT office with a page
          </h1>
          <p className="office-index__lead tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            The area pages cover the places most people ask about. This is the rest of the list: one
            line per office that has its own page, sorted by the first letter of the name the
            appointment system returns. Names are reproduced exactly as stored, doubled words and
            missing spaces included, because correcting them would break the match with the
            appointment system.
          </p>
          <p className="office-index__coverage tw:mt-3 tw:max-w-2xl tw:text-sm">
            The captured office list holds <strong className="tw:font-mono">{entries}</strong>{" "}
            entries, and <strong className="tw:font-mono">{rowCount}</strong> of them have a page
            here.{" "}
            <span className="office-index__coverage-gap tw:text-stone-600">
              The remaining {withoutPage} are left out because the upstream name is blank or a
              placeholder, or because our geocode dataset does not place them.
            </span>
          </p>
          <p className="office-index__capture tw:mt-3 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            Every appointment marker below reads the same capture, taken on {captured}, when{" "}
            <span className="tw:font-mono">{openCount}</span> of these{" "}
            <span className="tw:font-mono">{rowCount}</span> offices were returned with{" "}
            <code className="tw:font-mono tw:text-xs">app_open = 1</code>. That was one reading of a
            list on one day. It says nothing about free slots now, so open an office page and check
            availability before you travel.
          </p>
          <p className="office-index__licence tw:mt-3 tw:max-w-2xl tw:text-sm tw:text-stone-600">
            If you are not yet sure which appointment applies to you,{" "}
            <Link
              href={LICENCE_PATH}
              className="office-index__licence-link tw:text-stone-950 tw:underline tw:underline-offset-4"
            >
              start from your licence question
            </Link>{" "}
            instead of from an office.
          </p>
          <nav
            aria-label="Jump to a letter"
            className="office-index__jump tw:mt-5 tw:flex tw:flex-wrap tw:gap-2"
          >
            {groups.map((group) => (
              <a
                key={group.letter}
                href={`#${groupAnchor(group.letter)}`}
                className="office-index__jump-link tw:rounded-sm tw:border tw:border-stone-900/15 tw:px-2 tw:py-1 tw:font-mono tw:text-xs tw:text-stone-950 tw:hover:bg-stone-900/5 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2"
              >
                {group.letter}
                <span className="tw:ml-1 tw:text-stone-600">{group.rows.length}</span>
              </a>
            ))}
          </nav>
        </header>

        {groups.map((group) => (
          <section
            key={group.letter}
            aria-labelledby={groupAnchor(group.letter)}
            className={`office-index__group office-index__group--${group.letter.toLowerCase()}`}
          >
            <h2
              id={groupAnchor(group.letter)}
              className="office-index__group-title tw:scroll-mt-6 tw:border-b tw:border-stone-900/10 tw:pb-2 tw:text-xl tw:font-semibold"
            >
              {group.letter}{" "}
              <span className="office-index__group-count tw:font-mono tw:text-sm tw:font-normal tw:text-stone-600">
                {group.rows.length}
              </span>
            </h2>
            <ul className="office-index__list tw:mt-3 tw:grid tw:gap-2 tw:text-sm">
              {group.rows.map((row) => (
                <li
                  key={row.siteID}
                  className={cn(
                    "office-index__row",
                    row.open ? "office-index__row--open" : "office-index__row--not-open",
                    "tw:flex tw:flex-wrap tw:items-baseline tw:gap-x-3 tw:gap-y-1",
                  )}
                >
                  <Link
                    href={officeDetailPath(row.siteID)}
                    className="office-index__row-link tw:text-stone-950 tw:underline tw:underline-offset-4"
                  >
                    {row.name}
                  </Link>
                  <span className="office-index__row-id tw:font-mono tw:text-xs tw:text-stone-600">
                    #{row.siteID}
                  </span>
                  <span
                    className={cn(
                      badgeVariants({ variant: row.open ? "secondary" : "outline" }),
                      "office-index__row-flag",
                    )}
                  >
                    {row.open ? "listed open" : "not listed open"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="office-index__footnote tw:max-w-2xl tw:text-xs tw:text-stone-600">
          Source: {officeDirectory.source}. Each marker repeats what the office list returned on{" "}
          {captured} and nothing more; it is not a statement about a day, a queue, or a counter, and
          booking always happens on the DLT service.
        </p>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
