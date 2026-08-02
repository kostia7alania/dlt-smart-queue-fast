import Link from "next/link";

import {
  AVAILABILITY_GUIDE_PATH,
  AVAILABILITY_NOTICE,
  FOREIGNER_GUIDE_PATH,
  INDEPENDENCE_NOTICE,
  LICENCE_PATH,
  PRIVACY_NOTICE,
} from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { PublicSiteFooter, PublicSiteHeader } from "@/widgets/public-site-chrome";

export function GuidesPage() {
  return (
    <div className="guides-page tw:min-h-screen tw:bg-[#f5f1e8] tw:text-stone-950">
      <PublicSiteHeader />
      <main className="guides-page__container tw:mx-auto tw:flex tw:w-full tw:max-w-3xl tw:flex-col tw:gap-10 tw:px-5 tw:py-14 tw:sm:px-8">
        <header className="guides-page__header">
          <h1 className="guides-page__title tw:mt-4 tw:text-3xl tw:font-bold">
            Guides that separate evidence from advice
          </h1>
          <p className="guides-page__subtitle tw:mt-2 tw:text-sm tw:text-stone-600">
            These guides are about how to read the evidence — what a day message, a source label,
            and an observation time actually mean — while the licence pages cover what to do about
            your licence. Each page here marks every statement as something we observe in the
            appointment data, something only the Department of Land Transport can confirm, or a
            dated report by someone else.
          </p>
          <p className="guides-page__licence tw:mt-3 tw:text-sm tw:text-stone-600">
            Looking for the steps rather than the reading?{" "}
            <Link
              href={LICENCE_PATH}
              className="guides-page__licence-link tw:text-stone-950 tw:underline tw:underline-offset-4"
            >
              Go to the licence journeys
            </Link>
            .
          </p>
        </header>

        <section aria-labelledby="guides-page-list" className="guides-page__list-section">
          <h2 id="guides-page-list" className="guides-page__list-title tw:text-xl tw:font-semibold">
            Available guides
          </h2>
          <ul className="guides-page__list tw:mt-4 tw:flex tw:flex-col tw:gap-4">
            {/* Owned by other features rather than the guide registry, but they
                belong in this index so no guide is reachable only from the nav. */}
            <li className="guides-page__item">
              <Card className="guides-page__card guides-page__card--availability">
                <CardHeader>
                  <h3 className="guides-page__card-title tw:font-heading tw:text-base tw:font-medium">
                    How to read DLT availability
                  </h3>
                  <p className="guides-page__card-counts tw:font-mono tw:text-xs tw:text-stone-600">
                    what a day message, a source label, and a freshness stamp actually mean
                  </p>
                </CardHeader>
                <CardContent className="tw:flex tw:flex-col tw:gap-3">
                  <p className="guides-page__card-intro tw:text-sm tw:text-stone-600">
                    How to interpret the evidence this service shows before you act on it.
                  </p>
                  <Link
                    href={AVAILABILITY_GUIDE_PATH}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "guides-page__card-link tw:self-start",
                    )}
                  >
                    Read the guide
                  </Link>
                </CardContent>
              </Card>
            </li>
            <li className="guides-page__item">
              <Card className="guides-page__card guides-page__card--foreigner">
                <CardHeader>
                  <h3 className="guides-page__card-title tw:font-heading tw:text-base tw:font-medium">
                    DLT Smart Queue for foreigners
                  </h3>
                  <p className="guides-page__card-counts tw:font-mono tw:text-xs tw:text-stone-600">
                    how this service fits around the official booking flow
                  </p>
                </CardHeader>
                <CardContent className="tw:flex tw:flex-col tw:gap-3">
                  <p className="guides-page__card-intro tw:text-sm tw:text-stone-600">
                    What the official Smart Queue service is, what this project can and cannot show
                    about it, and where the hand-off happens.
                  </p>
                  <Link
                    href={FOREIGNER_GUIDE_PATH}
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" }),
                      "guides-page__card-link tw:self-start",
                    )}
                  >
                    Read the guide
                  </Link>
                </CardContent>
              </Card>
            </li>
          </ul>
        </section>

        <section aria-labelledby="guides-page-limits" className="guides-page__limits">
          <h2
            id="guides-page-limits"
            className="guides-page__limits-title tw:text-xl tw:font-semibold"
          >
            Why there is no step-by-step procedure here
          </h2>
          <p className="guides-page__limits-text tw:mt-2 tw:text-sm tw:text-stone-600">
            On 2026-07-31 every DLT web property we checked returned a JavaScript-only shell to a
            plain request, so no official page text could be quoted as verified. Publishing a
            confident checklist from second-hand sources would be the fastest way to send someone to
            an office with the wrong documents. Instead, these pages point at the appointment
            evidence we do have and hand the procedure question to DLT.
          </p>
          <p className="guides-page__limits-disclosure tw:mt-3 tw:text-xs tw:text-stone-600">
            {`${INDEPENDENCE_NOTICE} ${AVAILABILITY_NOTICE} ${PRIVACY_NOTICE}`}
          </p>
        </section>
      </main>
      <PublicSiteFooter />
    </div>
  );
}
