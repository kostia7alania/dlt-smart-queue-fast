import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export function HomePage() {
  return (
    <main className="home-page tw:flex tw:min-h-screen tw:flex-col tw:items-center tw:justify-center tw:gap-10 tw:bg-background tw:p-8 tw:text-foreground">
      <div className="home-page__hero tw:text-center">
        <p className="home-page__eyebrow tw:font-mono tw:text-sm tw:text-muted-foreground">
          DLT Parser &amp; Visualizer
        </p>
        <h1 className="home-page__title tw:mt-3 tw:text-4xl tw:font-bold">
          Thai DLT Smart Queue,
          <br />
          without the clicking
        </h1>
        <p className="home-page__subtitle tw:mx-auto tw:mt-4 tw:max-w-xl tw:text-sm tw:text-muted-foreground">
          Browse offices, resolve work types, and compare appointment availability from the official
          DLT API — with stored snapshots when the upstream is down.
        </p>
      </div>
      <nav className="home-page__nav tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-4">
        <Link href="/calendar" className={cn(buttonVariants({ size: "lg" }), "home-page__link")}>
          Slot Calendar
        </Link>
        <Link
          href="/map"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }), "home-page__link")}
        >
          Office Map
        </Link>
        <Link
          href="/playground"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }), "home-page__link")}
        >
          API Playground
        </Link>
      </nav>
    </main>
  );
}
