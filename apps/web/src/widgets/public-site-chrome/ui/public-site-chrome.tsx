import { ExternalLink } from "lucide-react";
import Link from "next/link";

import {
  APPOINTMENTS_PATH,
  AVAILABILITY_GUIDE_PATH,
  BANGKOK_OFFICES_PATH,
  FOREIGNER_GUIDE_PATH,
  INDEPENDENCE_NOTICE,
  OFFICIAL_DLT_BOOKING_URL,
  SITE_NAME,
} from "@/shared/config/site";

const PUBLIC_NAVIGATION = [
  { href: APPOINTMENTS_PATH, label: "Appointments" },
  { href: BANGKOK_OFFICES_PATH, label: "Bangkok" },
  { href: AVAILABILITY_GUIDE_PATH, label: "Read the data" },
  { href: "/calendar", label: "Calendar" },
  { href: "/compare", label: "Compare" },
  { href: FOREIGNER_GUIDE_PATH, label: "Foreigner guide" },
] as const;

export function PublicSiteHeader() {
  return (
    <header className="public-site-header tw:border-b tw:border-stone-900/10 tw:bg-[#f5f1e8]/95">
      <div className="public-site-header__inner tw:mx-auto tw:flex tw:max-w-7xl tw:flex-wrap tw:items-center tw:justify-between tw:gap-4 tw:px-5 tw:py-4 tw:sm:px-8">
        <Link
          href="/"
          className="public-site-header__brand tw:flex tw:items-center tw:gap-3 tw:font-semibold tw:tracking-tight tw:text-stone-950"
        >
          <span
            aria-hidden="true"
            className="public-site-header__signal tw:size-2.5 tw:rounded-full tw:bg-emerald-600 tw:ring-4 tw:ring-emerald-600/15"
          />
          {SITE_NAME}
        </Link>
        <nav
          aria-label="Public navigation"
          className="public-site-header__nav tw:flex tw:flex-wrap tw:items-center tw:gap-x-5 tw:gap-y-2 tw:text-sm tw:font-medium tw:text-stone-600"
        >
          {PUBLIC_NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="public-site-header__link tw:rounded-sm tw:underline-offset-4 tw:hover:text-stone-950 tw:hover:underline tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PublicSiteFooter() {
  return (
    <footer className="public-site-footer tw:border-t tw:border-stone-900/10 tw:bg-stone-950 tw:text-stone-300">
      <div className="public-site-footer__inner tw:mx-auto tw:grid tw:max-w-7xl tw:gap-8 tw:px-5 tw:py-10 tw:sm:px-8 tw:md:grid-cols-[1fr_auto] tw:md:items-end">
        <div>
          <p className="public-site-footer__brand tw:text-sm tw:font-semibold tw:text-white">
            {SITE_NAME}
          </p>
          <p className="public-site-footer__notice tw:mt-3 tw:max-w-2xl tw:text-sm tw:leading-6">
            {INDEPENDENCE_NOTICE} We show public availability signals and stored observations; we do
            not book appointments.
          </p>
        </div>
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          <Link
            href={AVAILABILITY_GUIDE_PATH}
            className="public-site-footer__evidence-guide tw:text-sm tw:font-semibold tw:text-white tw:underline tw:decoration-emerald-300 tw:decoration-2 tw:underline-offset-4"
          >
            How to read the data
          </Link>
          <a
            href={OFFICIAL_DLT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the official DLT Smart Queue in a new tab"
            className="public-site-footer__official tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-white/25 tw:px-4 tw:py-2 tw:text-sm tw:font-medium tw:text-white tw:hover:bg-white tw:hover:text-stone-950 tw:focus-visible:outline-2 tw:focus-visible:outline-offset-4 tw:focus-visible:outline-white"
          >
            Official DLT Smart Queue
            <ExternalLink aria-hidden="true" className="tw:size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
