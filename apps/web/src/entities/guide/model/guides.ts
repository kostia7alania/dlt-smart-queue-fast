// Published guides. Every `reported` claim names the source and the date it was
// read; nothing in `proven` or `official-only` may be phrased as a requirement.
// Evidence and the observed conflicts between sources are recorded in
// docs/research/2026-07-31-dlt-source-and-process-evidence.md.

import type { Guide } from "./guide";

const NATION_2026 = {
  source: "Nation Thailand, quoting DLT spokesman Titiphat Thaijongrak (published 2026-06-16)",
  sourceUrl: "https://www.nationthailand.com/news/general/40067483",
  observedOn: "2026-07-31",
} as const;

const FORBES_2025 = {
  source: "Forbes & Partners licence-conversion guide (published 2025-10-04, updated 2025-12-19)",
  sourceUrl: "https://www.forbesandpartners.com/convert-foreign-driving-license-thailand/",
  observedOn: "2026-07-31",
} as const;

const RENEW_GUIDE: Guide = {
  slug: "renew-thai-driving-license",
  title: "Renewing a Thai driving licence: what this service can and cannot tell you",
  metaDescription:
    "How to use appointment availability data when renewing a Thai driving licence, what only the Department of Land Transport can confirm, and what other sources report.",
  intro:
    "This page is about finding a workable renewal appointment, not about the renewal procedure itself. It states plainly which parts we observe in the appointment data, which parts belong to DLT, and which parts are only third-party reports.",
  keyword: " RENEW THAI",
  updatedOn: "2026-07-31",
  sections: [
    {
      heading: "What we observe in the appointment data",
      lead: "Everything in this section comes from the public appointment endpoints this project reads, and is visible in the interactive views.",
      claims: [
        {
          kind: "proven",
          text: "The appointment list contains 218 office entries; 115 of them were marked open for appointments when we captured it, and every entry keeps its upstream name unchanged.",
        },
        {
          kind: "proven",
          text: 'For a chosen office, the system returns work options under the exact keyword " RENEW THAI", and the calendar shows the day-level message it returns for each date, including the full marker "เต็ม".',
        },
        {
          kind: "proven",
          text: "Comparison across up to eight offices is computed from the same day messages, so an office with an earlier first open day is visible without opening eight calendars.",
        },
        {
          kind: "proven",
          text: "Every result says whether it came from a live read or from stored data, and when it was fetched, so a stale answer is recognizable as stale.",
        },
        {
          kind: "proven",
          text: "Stored history shows how availability for one office and work option changed across recent observations, without contacting the upstream service again.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      lead: "These decisions belong to the Department of Land Transport and vary by office, applicant, and year. We link you there instead of guessing.",
      claims: [
        {
          kind: "official-only",
          text: "Whether a particular licence is eligible for renewal, and how far before or after expiry a renewal is accepted.",
        },
        {
          kind: "official-only",
          text: "Which documents, photographs, translations, or certificates an office accepts on the day.",
        },
        {
          kind: "official-only",
          text: "Which physical-fitness or knowledge tests apply to a given applicant, and what a medical certificate has to contain.",
        },
        {
          kind: "official-only",
          text: "Current fees, payment methods, and whether an office handles a service at a branch or only at the main office.",
        },
        {
          kind: "official-only",
          text: "Whether a fully online renewal path is available to a specific applicant today.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "Read these as dated reports, not as rules. Where sources disagree, both statements are kept as they were found.",
      claims: [
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was removed for renewals and kept for first-time applicants, and the brake-reaction test was waived for drivers aged 55 or under whose licence expired within one year, who then take peripheral-vision and depth-perception tests.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Drivers over 55, and anyone whose licence expired more than one year ago, still take the full set of physical-fitness tests.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "A fully electronic renewal system was described as still in development with the Public Health Ministry and the Medical Council, with no announced launch date, so online renewal should not be assumed to exist yet.",
        },
        {
          source:
            "Indexed text of the official dlt.go.th renewal page (page itself renders only with JavaScript)",
          sourceUrl: "https://www.dlt.go.th/th/driving-license/81",
          observedOn: "2026-07-31",
          kind: "reported",
          text: "Renewal training is described as taken through the DLT e-learning system, with the training result then used for a physical-fitness test at a land transport office within a stated window, and the office visit booked in advance through DLT Smart Queue.",
        },
      ],
    },
  ],
};

const CONVERT_GUIDE: Guide = {
  slug: "convert-foreign-driving-license-thailand",
  title: "Converting a foreign driving licence in Thailand: appointment reality first",
  metaDescription:
    "What appointment data shows about converting a foreign driving licence in Thailand, what only the Department of Land Transport can confirm, and what third-party guides report.",
  intro:
    'Conversion questions usually arrive as "which office should I go to, and when can I get in?" That part we can help with. The paperwork and testing rules belong to DLT, and this page keeps that boundary visible.',
  keyword: " NEW THAI",
  updatedOn: "2026-07-31",
  sections: [
    {
      heading: "What we observe in the appointment data",
      claims: [
        {
          kind: "proven",
          text: 'A first Thai licence maps to the upstream keyword " NEW THAI", which this project sends unchanged rather than translating it.',
        },
        {
          kind: "proven",
          text: 'Many offices return no work options at all for " NEW THAI". That empty answer is rendered honestly as an empty result, not as an error, and it is a real signal that the office is not offering that service through the appointment system.',
        },
        {
          kind: "proven",
          text: "Because offices differ, comparing several at once is the fastest way to find one that both offers the option and shows an open day; the comparison view accepts up to eight at a time.",
        },
        {
          kind: "proven",
          text: "Area pages show which offices belong to a city or province, so a nearby province office is easy to test as an alternative.",
        },
        {
          kind: "proven",
          text: "Nothing here requires an account, a document number, or DLT credentials, and this service never books on your behalf.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Which visa or residence status an office accepts for a conversion, and what proof of address it wants.",
        },
        {
          kind: "official-only",
          text: "Whether a translation or embassy certification of the foreign licence is needed, and in what form.",
        },
        {
          kind: "official-only",
          text: "Which tests are taken, which are waived for a valid foreign licence, and in which languages a test is offered.",
        },
        {
          kind: "official-only",
          text: "Medical-certificate validity, fees, licence duration, and whether an office handles conversions at all.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "One well-known law-firm guide describes the process in detail. It is dated, it cites no official document for its list, and other guides disagree on the theory test, so treat it as a starting point for questions to ask DLT.",
      claims: [
        {
          ...FORBES_2025,
          kind: "reported",
          text: "The reported document set is a passport with a non-immigrant visa, a residence certificate or embassy letter, a medical certificate no older than 30 days, the valid foreign licence with a certified translation, and a form obtained at the office.",
        },
        {
          ...FORBES_2025,
          kind: "reported",
          text: "The practical driving test is reported as waived for conversions, while four aptitude tests and a written theory examination are reported as required, with indicative fees around 205 baht for a car licence and 155 baht for a motorcycle licence.",
        },
        {
          ...FORBES_2025,
          kind: "reported",
          text: "A tourist visa is reported as not accepted for conversion, and appointments are reported as booked through the DLT Smart Queue application.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was reported as removed for renewals but kept for first-time applicants, which is the category a conversion applicant usually falls into.",
        },
      ],
    },
  ],
};

export const GUIDES: readonly Guide[] = [RENEW_GUIDE, CONVERT_GUIDE];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}
