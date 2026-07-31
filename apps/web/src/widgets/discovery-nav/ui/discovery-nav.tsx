import Link from "next/link";

import { cn } from "@/shared/lib/utils";

// Minimal in-page navigation for the statically exported content routes. When
// the launch-chrome widget from feature 014 lands, replace this with it rather
// than maintaining two navigations (specs/015-local-hubs-guides/plan.md).

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/offices", label: "Offices by area" },
  { href: "/guides", label: "Guides" },
  { href: "/calendar", label: "Calendar" },
  { href: "/compare", label: "Compare" },
  { href: "/map", label: "Map" },
  { href: "/history", label: "History" },
] as const;

export type DiscoveryNavProps = {
  /** Path of the page rendering the nav, marked with aria-current. */
  current?: string;
};

export function DiscoveryNav({ current }: DiscoveryNavProps) {
  return (
    <nav
      aria-label="Site sections"
      className="discovery-nav tw:flex tw:flex-wrap tw:gap-x-4 tw:gap-y-2 tw:text-sm tw:font-medium"
    >
      {LINKS.map((link) => {
        const active = link.href === current;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "discovery-nav__link",
              active
                ? "discovery-nav__link--current tw:text-muted-foreground"
                : "tw:text-primary tw:underline",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
