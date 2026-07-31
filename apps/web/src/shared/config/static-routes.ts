// Indexable route table for the sitemap.
//
// Kept dependency-free so it can be unit tested directly; the tests assert that
// every published city hub and guide slug appears here, so adding content
// without a sitemap entry fails rather than shipping silently.
//
// /playground is intentionally absent: robots.txt disallows it.

export type StaticRoute = {
  /** Path relative to the site root; "" is the home page. */
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/appointments", changeFrequency: "daily", priority: 0.9 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/offices", changeFrequency: "weekly", priority: 0.85 },
  { path: "/offices/bangkok", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/chiang-mai", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/pattaya", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/phuket", changeFrequency: "weekly", priority: 0.8 },
  { path: "/map", changeFrequency: "daily", priority: 0.8 },
  { path: "/compare", changeFrequency: "daily", priority: 0.8 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.75 },
  {
    path: "/guides/dlt-smart-queue-for-foreigners",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/guides/renew-thai-driving-license", changeFrequency: "monthly", priority: 0.7 },
  {
    path: "/guides/convert-foreign-driving-license-thailand",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/history", changeFrequency: "daily", priority: 0.7 },
];
