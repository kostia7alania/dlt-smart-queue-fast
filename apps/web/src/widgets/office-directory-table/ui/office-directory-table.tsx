import Link from "next/link";

import {
  calendarHref,
  type DirectoryOffice,
  type GeoPrecision,
  hasOfficeName,
  isAppointmentOpen,
  mapOfficeHref,
  type WorkKeyword,
} from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { badgeVariants } from "@/shared/ui/badge";
import { buttonVariants } from "@/shared/ui/button";

// Plain table markup on purpose: shared/ui/table is a client component, and this
// widget renders inside statically exported content pages that ship no JS.

const PRECISION_LABEL: Record<GeoPrecision, string> = {
  office: "exact office location",
  district: "district-level position",
  province: "province centroid",
};

type OfficeDirectoryTableProps = {
  offices: readonly DirectoryOffice[];
  keyword: WorkKeyword;
  caption: string;
};

export function OfficeDirectoryTable({ offices, keyword, caption }: OfficeDirectoryTableProps) {
  return (
    <div className="office-directory-table tw:overflow-x-auto">
      <table className="office-directory-table__table tw:w-full tw:caption-bottom tw:text-sm">
        <caption className="office-directory-table__caption tw:mt-3 tw:text-left tw:text-xs tw:text-muted-foreground">
          {caption}
        </caption>
        <thead className="office-directory-table__head tw:[&_tr]:border-b">
          <tr>
            <th scope="col" className="tw:px-2 tw:py-2 tw:text-left tw:font-medium">
              Office as the upstream list names it
            </th>
            <th scope="col" className="tw:px-2 tw:py-2 tw:text-left tw:font-medium">
              Appointment list
            </th>
            <th scope="col" className="tw:px-2 tw:py-2 tw:text-left tw:font-medium">
              Position data
            </th>
            <th scope="col" className="tw:px-2 tw:py-2 tw:text-left tw:font-medium">
              Check availability
            </th>
          </tr>
        </thead>
        <tbody className="office-directory-table__body">
          {offices.map((office) => {
            const open = isAppointmentOpen(office);
            return (
              <tr
                key={office.sit_id}
                className={cn(
                  "office-directory-table__row tw:border-b tw:align-top",
                  open
                    ? "office-directory-table__row--listed-open"
                    : "office-directory-table__row--not-listed-open",
                )}
              >
                <td className="office-directory-table__name tw:px-2 tw:py-3">
                  {hasOfficeName(office) ? (
                    <span className="tw:font-medium">{office.sit_name}</span>
                  ) : (
                    <span className="office-directory-table__name--blank tw:text-muted-foreground tw:italic">
                      No English name in the upstream list
                    </span>
                  )}
                  <span className="office-directory-table__site-id tw:ml-2 tw:font-mono tw:text-xs tw:text-muted-foreground">
                    #{office.sit_id}
                  </span>
                </td>
                <td className="office-directory-table__flag tw:px-2 tw:py-3">
                  <span
                    className={cn(
                      badgeVariants({ variant: open ? "secondary" : "outline" }),
                      "office-directory-table__flag-badge",
                    )}
                  >
                    {open ? "app_open = 1" : `app_open = ${office.app_open}`}
                  </span>
                  <span className="office-directory-table__flag-note tw:mt-1 tw:block tw:text-xs tw:text-muted-foreground">
                    {open
                      ? "Listed for appointments when the list was captured"
                      : "Not listed for appointments when the list was captured"}
                  </span>
                </td>
                <td className="office-directory-table__precision tw:px-2 tw:py-3 tw:text-xs tw:text-muted-foreground">
                  {office.geo_precision
                    ? PRECISION_LABEL[office.geo_precision]
                    : "not mapped in our dataset"}
                </td>
                <td className="office-directory-table__actions tw:px-2 tw:py-3">
                  <span className="tw:flex tw:flex-wrap tw:gap-2">
                    <Link
                      href={calendarHref({ siteID: office.sit_id, keyword })}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "office-directory-table__link office-directory-table__link--calendar",
                      )}
                    >
                      Calendar
                    </Link>
                    {office.geo_precision ? (
                      <Link
                        href={mapOfficeHref({ siteID: office.sit_id, keyword })}
                        className={cn(
                          buttonVariants({ size: "sm", variant: "outline" }),
                          "office-directory-table__link office-directory-table__link--map",
                        )}
                      >
                        Map
                      </Link>
                    ) : null}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
