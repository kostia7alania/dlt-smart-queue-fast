import {
  ArrowUpRight,
  CalendarDays,
  GitCompareArrows,
  History,
  Map as MapIcon,
} from "lucide-react";
import Link from "next/link";

import { DISCOVERY_CAPABILITIES, type DiscoveryCapability } from "@/shared/config/site";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

const CAPABILITY_ICONS = {
  calendar: CalendarDays,
  compare: GitCompareArrows,
  map: MapIcon,
  history: History,
} satisfies Record<DiscoveryCapability["id"], typeof CalendarDays>;

type DiscoveryCapabilitiesProps = {
  heading?: string;
  intro?: string;
};

export function DiscoveryCapabilities({
  heading = "Four ways to scout the queue",
  intro = "Start narrow or scan widely. Every view keeps the source and freshness visible.",
}: DiscoveryCapabilitiesProps) {
  return (
    <section aria-labelledby="capabilities-title" className="discovery-capabilities">
      <div className="discovery-capabilities__heading tw:grid tw:gap-3 tw:md:grid-cols-[1fr_1fr] tw:md:items-end">
        <h2
          id="capabilities-title"
          className="discovery-capabilities__title tw:max-w-xl tw:text-3xl tw:font-semibold tw:tracking-[-0.03em] tw:text-stone-950 tw:sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="discovery-capabilities__intro tw:max-w-xl tw:text-sm tw:leading-6 tw:text-stone-600 tw:md:justify-self-end">
          {intro}
        </p>
      </div>
      <div className="discovery-capabilities__grid tw:mt-8 tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        {DISCOVERY_CAPABILITIES.map((capability) => {
          const Icon = CAPABILITY_ICONS[capability.id];
          return (
            <Card
              key={capability.id}
              className="discovery-capabilities__card tw:min-h-64 tw:justify-between tw:border tw:border-stone-900/10 tw:bg-white/75 tw:shadow-none tw:ring-0"
            >
              <CardHeader>
                <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
                  <span className="tw:font-mono tw:text-xs tw:text-stone-500">
                    {capability.number} / {capability.label.toUpperCase()}
                  </span>
                  <Icon aria-hidden="true" className="tw:size-5 tw:text-emerald-700" />
                </div>
              </CardHeader>
              <CardContent className="tw:flex tw:flex-1 tw:flex-col tw:justify-end">
                <h3 className="tw:text-xl tw:font-semibold tw:tracking-tight tw:text-stone-950">
                  {capability.title}
                </h3>
                <p className="tw:mt-3 tw:text-sm tw:leading-6 tw:text-stone-600">
                  {capability.description}
                </p>
                <Link
                  href={capability.href}
                  className="discovery-capabilities__link tw:mt-6 tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-stone-950 tw:underline tw:decoration-emerald-600 tw:decoration-2 tw:underline-offset-4"
                >
                  Open {capability.label}
                  <ArrowUpRight aria-hidden="true" className="tw:size-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
