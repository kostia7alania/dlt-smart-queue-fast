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

/**
 * Site IDs that have a generated `/offices/site/<id>` page: every office in the
 * committed directory with a real upstream name and a position in the geocode
 * dataset (see `hasOfficeDetailPage` in entities/dlt). The IDs are literals so
 * this module keeps its dataset-free imports; regenerate them whenever
 * `node tools/build-office-directory.mjs` changes the directory.
 */
const OFFICE_DETAIL_SITE_IDS: readonly number[] = [
  1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
  54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77,
  78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
  102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120,
  121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139,
  140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158,
  159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177,
  178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196,
  197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 223, 225,
];

export const STATIC_ROUTES: readonly StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/licence", changeFrequency: "weekly", priority: 0.95 },
  { path: "/licence/new-thai-driving-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/renew-thai-driving-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/convert-foreign-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/motorcycle-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/international-driving-permit", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/lost-or-damaged-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/expired-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/five-year-license", changeFrequency: "monthly", priority: 0.85 },
  { path: "/licence/tests-and-exams", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/theory-test", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/practical-test", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/aptitude-test", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/e-learning-course", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/medical-certificate", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/residence-certificate", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/documents-checklist", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/costs-and-fees", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/processing-time", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/driving-in-thailand-rules", changeFrequency: "monthly", priority: 0.7 },
  { path: "/licence/foreigner-faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/appointments", changeFrequency: "daily", priority: 0.9 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/offices", changeFrequency: "weekly", priority: 0.85 },
  { path: "/offices/all", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/bangkok", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/chiang-mai", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/pattaya", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/phuket", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/koh-samui", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/krabi", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/hua-hin", changeFrequency: "weekly", priority: 0.8 },
  { path: "/offices/udon-thani", changeFrequency: "weekly", priority: 0.8 },
  { path: "/map", changeFrequency: "daily", priority: 0.8 },
  { path: "/compare", changeFrequency: "daily", priority: 0.8 },
  { path: "/guides", changeFrequency: "monthly", priority: 0.75 },
  {
    path: "/guides/dlt-smart-queue-for-foreigners",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  { path: "/history", changeFrequency: "daily", priority: 0.7 },
  ...OFFICE_DETAIL_SITE_IDS.map(
    (siteID): StaticRoute => ({
      path: `/offices/site/${siteID}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  ),
];
