// Licence-journey content for the /licence/* cluster.
//
// Same evidence boundary as the guides: `proven` is what this project observes
// in the appointment data it reads, `official-only` is what only the Department
// of Land Transport can decide, and `reported` is a dated third-party statement
// that is never presented as ours. The evidence and the recorded conflicts are
// in docs/research/2026-07-31-dlt-source-and-process-evidence.md.
//
// `keyword` is null where the appointment contract has no work option for the
// journey. Those pages carry a `keywordNote` instead of a calendar promise.

import type { Journey } from "./journey";

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

const STARTER_KIT_LICENCE = {
  source: "Thailand Starter Kit (formerly ExpatDen), Thai driving licence guide",
  sourceUrl: "https://www.thailandstarterkit.com/lifestyle/thai-driving-license/",
  observedOn: "2026-08-01",
} as const;

const STARTER_KIT_IDP = {
  source: "Thailand Starter Kit (formerly ExpatDen), international driving permit guide",
  sourceUrl:
    "https://www.thailandstarterkit.com/transportation/international-drivers-license-thailand/",
  observedOn: "2026-08-01",
} as const;

const MOTORIST_2025 = {
  source: "Motorist Thailand, article on replacing a lost driving licence (published 2025-10-30)",
  sourceUrl:
    "https://www.motorist.co.th/en/article/5197/what-to-do-if-your-driver-s-license-is-lost-steps-to-get-a-new-driver-s-license-2025",
  observedOn: "2026-08-01",
} as const;

const THAILAND_LIFE = {
  source: "TheThailandLife driving-licence guide for foreigners (last updated 2026-05-05)",
  sourceUrl: "https://www.thethailandlife.com/learning-to-drive-in-thailand",
  observedOn: "2026-08-01",
} as const;

const NEW_LICENCE: Journey = {
  slug: "new-thai-driving-license",
  group: "licence",
  title: "Getting a new Thai driving license",
  metaDescription:
    "What appointment data shows about first-licence availability at Thai land transport offices, what only the Department of Land Transport can confirm, and what dated third-party guides report.",
  intro:
    "This page is for a first Thai licence: nothing to convert, nothing to renew. It covers what the appointment data shows about where and when a first-licence appointment is open, and leaves the procedure itself to DLT or to a dated source.",
  cardTitle: "Get a first licence",
  audience:
    "Anyone applying for a first Thai driving licence, including foreigners with no licence from another country and those whose foreign licence an office will not convert.",
  outcome:
    "You can see which offices currently return the first-licence work option, how their day messages read, and which questions belong to DLT rather than to a guide.",
  prerequisites: ["documents-checklist", "medical-certificate", "residence-certificate"],
  nextSteps: ["e-learning-course", "tests-and-exams", "five-year-license"],
  keyword: " NEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      lead: "Everything here comes from the public appointment endpoints this project reads, and is visible in the calendar and comparison views.",
      claims: [
        {
          kind: "proven",
          text: "The captured office list holds 218 entries, and 115 of them report app_open = 1. Each entry keeps its upstream name unchanged, including the known spelling defects.",
        },
        {
          kind: "proven",
          text: 'A first licence maps to the upstream work keyword " NEW THAI". This project sends that string unchanged, leading space included, rather than translating it.',
        },
        {
          kind: "proven",
          text: 'Many offices return no work options at all for " NEW THAI". That is rendered as an empty result rather than an error, because an empty answer is itself information about what the office offers through the booking system.',
        },
        {
          kind: "proven",
          text: 'Where options do come back, the calendar shows the day-level message the upstream returns for each date, including the full marker "เต็ม".',
        },
        {
          kind: "proven",
          text: "Every reading is labelled live or stored and carries the time it was fetched, so an old answer is recognisable as old.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "These belong to the Department of Land Transport, and they change by year, office, and applicant. We send you there instead of guessing.",
      claims: [
        {
          kind: "official-only",
          text: "Whether a first licence is the right path for you, or whether a foreign licence can be converted instead.",
        },
        {
          kind: "official-only",
          text: "Which documents, photographs, and certificates an office accepts on the day, and how recently they may have been issued.",
        },
        {
          kind: "official-only",
          text: "Which training, knowledge tests, and driving tests apply to a given applicant, and in which languages a test is offered.",
        },
        {
          kind: "official-only",
          text: "Current fees, payment methods, and the validity of the licence issued at the end.",
        },
        {
          kind: "official-only",
          text: "Whether an office handles first-licence applications at all, or only at its main branch.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "Dated and attributed. Read these as questions to put to DLT, not as rules.",
      claims: [
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "First-time applicants are described as attending a five-hour training seminar and sitting a theory exam, while someone converting a foreign licence is described as watching a one-hour video instead.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "The listed documents are an application form, a passport, a residence certificate issued within 30 days, and a medical certificate issued within 30 days. A first licence is reported as a two-year temporary licence costing 205 baht.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The theory test is reported as 50 multiple-choice questions with a pass mark of 45, available in Thai and in English.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was reported as removed for renewals and kept for first-time applicants, which is the category a first application falls into.",
        },
      ],
    },
    {
      heading: "Choosing where to apply",
      claims: [
        {
          kind: "proven",
          text: "Area pages list the offices captured for a city or province, so a neighbouring province office is easy to test as an alternative.",
        },
        {
          kind: "proven",
          text: "Up to eight offices can be compared at once from the same day messages, so an earlier first open day is visible without opening eight calendars.",
        },
        {
          kind: "proven",
          text: "Stored history shows how one office and work option moved across recent observations, without contacting the upstream service again.",
        },
        {
          kind: "proven",
          text: "Booking happens on the DLT service itself. Nothing here books on your behalf, and no account or document number is entered on this site.",
        },
      ],
    },
  ],
};

const RENEW_LICENCE: Journey = {
  slug: "renew-thai-driving-license",
  group: "licence",
  title: "Renewing a Thai driving license",
  metaDescription:
    "Renewal appointment availability at Thai land transport offices, what only the Department of Land Transport can confirm, and what dated sources report about the 2026 renewal changes.",
  intro:
    "This page is about closing a renewal: finding an office whose renewal calendar is open, and knowing which parts of the renewal belong to DLT. It does not restate the renewal procedure as fact.",
  cardTitle: "Renew a licence",
  audience:
    "Holders of a Thai driving licence that is near expiry, or expired recently enough that an office still treats it as a renewal.",
  outcome:
    "You can find offices with open renewal days, see how fresh that reading is, and know which renewal questions only DLT answers.",
  prerequisites: ["e-learning-course", "medical-certificate", "documents-checklist"],
  nextSteps: ["five-year-license", "costs-and-fees", "driving-in-thailand-rules"],
  keyword: " RENEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: 'Renewal maps to the upstream keyword " RENEW THAI", sent unchanged. Renewal availability at an office is read separately from its first-licence availability, and the two often differ.',
        },
        {
          kind: "proven",
          text: 'The calendar shows the day-level message the upstream returns for each date, including the full marker "เต็ม", instead of converting it into a count of free places.',
        },
        {
          kind: "proven",
          text: "Of the 218 captured office entries, 115 report app_open = 1, and a renewal option is returned only by a subset of those.",
        },
        {
          kind: "proven",
          text: "Every reading says whether it came from a live request or from stored data, and when it was fetched.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "These are decisions the Department of Land Transport makes, per office and per applicant.",
      claims: [
        {
          kind: "official-only",
          text: "Whether a particular licence is eligible for renewal, and how early or how late an office accepts one.",
        },
        {
          kind: "official-only",
          text: "Which training, physical-fitness tests, or knowledge tests apply to you this year.",
        },
        {
          kind: "official-only",
          text: "What an office accepts as a medical certificate, and how recently it may have been issued.",
        },
        {
          kind: "official-only",
          text: "Current fees, payment methods, and the validity of the renewed licence.",
        },
        {
          kind: "official-only",
          text: "Whether a fully online renewal path is open to a specific applicant today.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "Where sources disagree, both statements stay as they were found.",
      claims: [
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was removed for renewals and kept for first-time applicants, and the brake-reaction test was waived for drivers aged 55 or under whose licence expired within one year, who then take peripheral-vision and depth-perception tests.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "A fully electronic renewal system was described as still in development with the Public Health Ministry and the Medical Council, with no announced launch date, so online renewal should not be assumed to exist yet.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "Renewal is described as possible three months before expiry, or within one year after it.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "A five-year licence is reported at 505 baht, against 205 baht for the two-year temporary licence.",
        },
      ],
    },
    {
      heading: "Reading the renewal calendar",
      claims: [
        {
          kind: "proven",
          text: "A day marked full is full for that office and that work option only. It says nothing about the next office in the same province.",
        },
        {
          kind: "proven",
          text: "Comparing up to eight offices at once is the quickest way to see the earliest open renewal day in an area.",
        },
        {
          kind: "proven",
          text: "Stored history shows how renewal availability at one office moved across recent observations, which is useful when today's answer is discouraging.",
        },
        {
          kind: "proven",
          text: "The booking itself happens on the DLT service. This site reads availability and stops there.",
        },
      ],
    },
  ],
};

const CONVERT_LICENCE: Journey = {
  slug: "convert-foreign-license",
  group: "licence",
  title: "Converting a foreign license in Thailand",
  metaDescription:
    "Which Thai land transport offices show first-licence appointment availability for a conversion, what only the Department of Land Transport can confirm, and what dated third-party guides report.",
  intro:
    'A conversion question usually arrives as "which office, and when can I get in?" That part the appointment data answers. The paperwork and testing rules belong to DLT, and this page keeps the line visible.',
  cardTitle: "Convert a foreign licence",
  audience:
    "Foreign residents holding a valid licence from another country who want a Thai licence issued against it.",
  outcome:
    "You can shortlist offices that return the first-licence option with open days, and see which conversion details are unsettled between sources.",
  prerequisites: ["residence-certificate", "medical-certificate", "documents-checklist"],
  nextSteps: ["theory-test", "aptitude-test", "international-driving-permit"],
  keyword: " NEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: 'A conversion is booked through the same first-licence work option as any other new Thai licence, under the exact upstream keyword " NEW THAI". The appointment contract has no separate conversion option.',
        },
        {
          kind: "proven",
          text: "Offices differ widely: some return several work options, some return none. An empty answer is shown as empty, not as a failure.",
        },
        {
          kind: "proven",
          text: "Up to eight offices can be compared side by side, which is the fastest way to find one that both offers the option and shows an open day.",
        },
        {
          kind: "proven",
          text: "Area pages show which of the 218 captured entries belong to a city or province, so a provincial office an hour away is easy to test.",
        },
        {
          kind: "proven",
          text: "No account, document number, or DLT credential is entered here, and this service never books for you.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "Which visa or residence status an office accepts for a conversion, and what proof of address it wants.",
        },
        {
          kind: "official-only",
          text: "Whether a translation or embassy certification of the foreign licence is wanted, and in what form.",
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
      lead: "One law-firm guide describes the process in detail but cites no official document, and third-party guides disagree about the theory test. Both sides stay attributed and dated.",
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
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "A conversion is described as a one-hour e-learning video rather than the five-hour seminar first-time applicants attend, and as a single day at the office against two or three days for a first licence.",
        },
      ],
    },
    {
      heading: "Comparing offices before you commit",
      claims: [
        {
          kind: "proven",
          text: "Each comparison row carries its own live-or-stored label and fetch time, so a stale row is not mistaken for a fresh one.",
        },
        {
          kind: "proven",
          text: 'Day messages are shown as the upstream sends them, including the full marker "เต็ม", rather than being summarised into a number.',
        },
        {
          kind: "proven",
          text: "Stored history for an office and work option shows whether its availability has been steady or erratic over recent observations.",
        },
      ],
    },
  ],
};

const MOTORCYCLE_LICENCE: Journey = {
  slug: "motorcycle-license",
  group: "licence",
  title: "Getting a Thai motorcycle license",
  metaDescription:
    "How motorcycle-licence applications map onto the two upstream appointment keywords, what only the Department of Land Transport can confirm, and what dated third-party guides report about fees and tests.",
  intro:
    "A motorcycle licence is a separate licence from a car licence, but the appointment system does not separate them. This page explains what that means for booking, and keeps the procedure attributed.",
  cardTitle: "Motorcycle licence",
  audience:
    "Anyone applying for a Thai motorcycle licence, whether on its own, alongside a car licence, or against a foreign motorcycle licence.",
  outcome:
    "You can find offices with open first-licence days and know that the vehicle class is settled at the counter, not in the appointment data.",
  prerequisites: ["documents-checklist", "medical-certificate", "e-learning-course"],
  nextSteps: ["practical-test", "five-year-license", "driving-in-thailand-rules"],
  keyword: " NEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: 'The appointment contract exposes two work keywords, " NEW THAI" and " RENEW THAI". Neither names a vehicle class, so a first motorcycle licence is read through the same first-licence option as a car licence.',
        },
        {
          kind: "proven",
          text: "The work options an office returns under that keyword are shown with their upstream labels unchanged, which is where any distinction an office makes would appear.",
        },
        {
          kind: "proven",
          text: "The captured list holds 218 office entries with 115 reporting app_open = 1, and per-area pages group them by city and province.",
        },
        {
          kind: "proven",
          text: 'Day-level messages are shown exactly as returned, including the full marker "เต็ม", each labelled live or stored with its fetch time.',
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "Which engine sizes and vehicle types a given motorcycle licence covers.",
        },
        {
          kind: "official-only",
          text: "Whether a car licence and a motorcycle licence can be handled in the same visit at a particular office.",
        },
        {
          kind: "official-only",
          text: "Which training, aptitude, theory, and riding tests apply, and what the riding course contains on the day.",
        },
        {
          kind: "official-only",
          text: "Current fees, licence validity, and which documents an office accepts.",
        },
        {
          kind: "official-only",
          text: "How a foreign motorcycle licence is treated, and whether any test is waived against it.",
        },
      ],
    },
    {
      heading: "What other sources report",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The 2026 fee list gives 105 baht for a temporary motorcycle licence and 255 baht for a five-year motorcycle licence, against 205 and 505 baht for the car equivalents.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "Applying for a car licence and a motorcycle licence in the same visit is described as possible, using the same steps and the same tests.",
        },
        {
          ...FORBES_2025,
          kind: "reported",
          text: "For a conversion from a foreign licence, an indicative fee of about 155 baht is reported for a motorcycle licence, against about 205 baht for a car licence.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "An international permit for motorcycles is described as issued against a five-year motorcycle licence, with the same documents and process as the car permit.",
        },
      ],
    },
    {
      heading: "What the two keywords do not separate",
      lead: "This is the main limit of the data on this page, and it is worth stating twice.",
      claims: [
        {
          kind: "proven",
          text: "An open first-licence day at an office means that office had capacity for the first-licence work option, not that it had capacity for a motorcycle test specifically.",
        },
        {
          kind: "proven",
          text: "Comparing up to eight offices still narrows the search usefully, because an office with no first-licence option at all can be ruled out immediately.",
        },
        {
          kind: "proven",
          text: "Stored history shows how first-licence availability at one office moved recently, which helps when planning around a medical certificate that ages quickly.",
        },
      ],
    },
  ],
};

const INTERNATIONAL_PERMIT: Journey = {
  slug: "international-driving-permit",
  group: "licence",
  title: "International Driving Permit in Thailand",
  metaDescription:
    "Why appointment data does not cover international driving permits in Thailand, what only the Department of Land Transport can confirm, and what dated third-party guides report about permit types and documents.",
  intro:
    "An international driving permit is issued by the Department of Land Transport against a Thai licence. The appointment system this site reads has no work option for it, so this page is mostly about where to go and what to ask.",
  cardTitle: "International permit",
  audience:
    "Holders of a Thai driving licence who plan to drive abroad, and people working out whether a permit issued elsewhere covers them here.",
  outcome:
    "You can find and locate offices, and you know why no calendar on this site can show permit availability.",
  prerequisites: ["five-year-license", "documents-checklist"],
  nextSteps: ["driving-in-thailand-rules", "foreigner-faq"],
  keyword: null,
  keywordNote:
    "The booking system exposes only first-licence and renewal work options, so it has no international-permit calendar to read; use the office and area pages here to locate a counter, then confirm the permit service with DLT directly.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: "Neither of the two upstream work keywords covers an international permit, so no calendar on this site describes one. That absence is a fact about the booking contract, not about the service DLT provides.",
        },
        {
          kind: "proven",
          text: "The captured office list holds 218 entries with their upstream names intact, and 115 of them report app_open = 1 for the options the system does expose.",
        },
        {
          kind: "proven",
          text: "Area pages group those entries by city and province, which is still the useful part here: finding which offices exist near you.",
        },
        {
          kind: "proven",
          text: "Office readings are labelled live or stored with the time they were fetched, so a page you left open yesterday does not read as today's answer.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "Whether a specific office issues international permits, on which days, and whether it takes walk-ins for them.",
        },
        {
          kind: "official-only",
          text: "Which Thai licence types qualify, and what documents and photographs an office accepts.",
        },
        {
          kind: "official-only",
          text: "Current permit fees, validity, and which convention a permit is issued under for a given destination.",
        },
        {
          kind: "official-only",
          text: "Whether a permit issued in another country is accepted for driving in Thailand, and for how long.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "One guide covers this in detail. It was read on the date shown and is not an official statement.",
      claims: [
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "The permit is described as issued to holders of a five-year Thai licence, with two-year temporary licence holders converting to the five-year licence first.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "Two permit types are described: a one-year permit under the 1949 Geneva Convention and a three-year permit under the 1968 Vienna Convention.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "The listed documents are the five-year Thai licence, a passport, a non-immigrant visa, a residence certificate, and two passport photographs no older than six months, with a fee of 505 baht for either permit type.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "Application is described as a walk-in at any land transport office, with no advance appointment, and the writer reports the counter visit taking about 15 minutes.",
        },
      ],
    },
    {
      heading: "Using the office pages instead",
      claims: [
        {
          kind: "proven",
          text: "Each office page shows the upstream name, site ID, and area of an entry, which is enough to identify the office when you call or ask DLT.",
        },
        {
          kind: "proven",
          text: "Eight named entries in the capture have no geocode, and four have Thai names but empty English names, so a blank on a map is an upstream gap rather than a missing office.",
        },
        {
          kind: "proven",
          text: "Nothing on this site contacts DLT for you, holds a queue position, or stores anything about your licence.",
        },
      ],
    },
  ],
};

const LOST_OR_DAMAGED: Journey = {
  slug: "lost-or-damaged-license",
  group: "licence",
  title: "Lost or damaged Thai driving license",
  metaDescription:
    "Why replacement of a lost or damaged Thai licence does not appear in appointment data, what only the Department of Land Transport can confirm, and what a dated Thai motoring source reports.",
  intro:
    "Replacing a licence is a different counter from renewing one, and the appointment system this site reads does not expose it. This page says what the data can and cannot do, and points you at the office instead.",
  cardTitle: "Replace a lost licence",
  audience:
    "Anyone whose Thai driving licence has been lost, stolen, or damaged, and who needs a replacement rather than a renewal.",
  outcome:
    "You can locate a nearby office quickly, and you know that no calendar here covers replacement.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["renew-thai-driving-license", "expired-license", "foreigner-faq"],
  keyword: null,
  keywordNote:
    "Replacement is not one of the two work options the booking system exposes, so no calendar here covers it; use the office and area pages to find a nearby office and confirm with DLT how it handles replacements.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: 'The two upstream work keywords are " NEW THAI" and " RENEW THAI". Neither is a replacement option, so an empty answer here reflects the booking contract, not the office.',
        },
        {
          kind: "proven",
          text: "The captured list holds 218 office entries, 115 with app_open = 1, and area pages group them by city and province so the nearest counter is easy to find.",
        },
        {
          kind: "proven",
          text: "If your licence has also expired, the renewal keyword does apply, and its calendar and day messages work normally.",
        },
        {
          kind: "proven",
          text: "Every office reading carries a live-or-stored label and a fetch time.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "Whether a replacement is issued on the day, and whether any appointment is taken for it.",
        },
        {
          kind: "official-only",
          text: "Which documents an office accepts, and whether a police report is wanted for a stolen licence.",
        },
        {
          kind: "official-only",
          text: "The replacement fee, and whether the replacement keeps the original expiry date.",
        },
        {
          kind: "official-only",
          text: "How a damaged licence is treated when it is close to expiry, and whether it becomes a renewal instead.",
        },
      ],
    },
    {
      heading: "What other sources report",
      claims: [
        {
          ...MOTORIST_2025,
          kind: "reported",
          text: "A police report is described as no longer necessary for a lost licence.",
        },
        {
          ...MOTORIST_2025,
          kind: "reported",
          text: "The cost is broken down as 5 baht for the application, 100 baht for the replacement licence, and 100 baht for the photograph and printing, at any land transport office.",
        },
        {
          ...MOTORIST_2025,
          kind: "reported",
          text: "No driving test is described as being retaken for a replacement, and the article recommends booking through the DLT Smart Queue application.",
        },
        {
          ...MOTORIST_2025,
          kind: "reported",
          text: "The article separates replacement, for a licence that is still valid, from renewal, for one that has expired.",
        },
      ],
    },
    {
      heading: "Finding the right office",
      claims: [
        {
          kind: "proven",
          text: "Office pages carry the upstream name and site ID, which is what to quote when you call ahead.",
        },
        {
          kind: "proven",
          text: "Some captured names contain upstream defects and are shown byte-for-byte, so an odd-looking name here matches the odd-looking name in the DLT system.",
        },
        {
          kind: "proven",
          text: "Nothing here books, cancels, or holds anything on your behalf.",
        },
      ],
    },
  ],
};

const EXPIRED_LICENCE: Journey = {
  slug: "expired-license",
  group: "licence",
  title: "Expired Thai driving license",
  metaDescription:
    "How to read renewal appointment availability when a Thai licence has already expired, what only the Department of Land Transport can confirm, and what dated sources report about time limits and retests.",
  intro:
    "How an expired licence is handled depends on how long it has been expired, and only DLT settles that. What this page adds is the appointment side: which offices show open renewal days while you sort the rest out.",
  cardTitle: "Expired licence",
  audience:
    "Holders of a Thai licence that has already expired, who need to know whether they are still renewing or starting again.",
  outcome:
    "You can watch renewal availability at nearby offices and take the right question to DLT: which category your expiry date puts you in.",
  prerequisites: ["medical-certificate", "e-learning-course"],
  nextSteps: ["renew-thai-driving-license", "tests-and-exams", "five-year-license"],
  keyword: " RENEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: "The appointment data carries nothing about your own licence. It shows what an office offers, not what your expiry date entitles you to.",
        },
        {
          kind: "proven",
          text: 'Renewal availability is read under the exact keyword " RENEW THAI", with the day-level message shown as returned, including the full marker "เต็ม".',
        },
        {
          kind: "proven",
          text: "If an office treats your case as a fresh application instead, that is the other keyword, and its availability at the same office is often different.",
        },
        {
          kind: "proven",
          text: "Each reading is labelled live or stored with its fetch time, and stored history shows how the same office and option looked on earlier observations.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "How long after expiry an office still treats a licence as a renewal.",
        },
        {
          kind: "official-only",
          text: "Which tests are retaken at each stage of lateness, and whether training is repeated.",
        },
        {
          kind: "official-only",
          text: "What penalty applies for driving on an expired licence, and how it is assessed.",
        },
        {
          kind: "official-only",
          text: "Whether an expired licence affects insurance, vehicle rental, or an international permit application.",
        },
        {
          kind: "official-only",
          text: "Current fees and the validity of whatever licence is issued at the end.",
        },
      ],
    },
    {
      heading: "What other sources report",
      lead: "The two sources below were read on different dates and describe different rule sets. Neither is quoted as law.",
      claims: [
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "Renewal is described as possible within one year after expiry. Past one year the theory test is reported as retaken, and past three years both the theory test and the practical test.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "Driving on an expired licence is reported as carrying a fine of up to 2,000 baht.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Drivers over 55, and anyone whose licence expired more than one year ago, were described as still taking the full set of physical-fitness tests.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "The brake-reaction test was described as waived for drivers aged 55 or under whose licence expired within one year, who then take peripheral-vision and depth-perception tests.",
        },
      ],
    },
    {
      heading: "Watching availability while you prepare",
      lead: "A medical certificate ages, and so does an appointment reading. Both are worth timing together.",
      claims: [
        {
          kind: "proven",
          text: "An office that showed the full marker last week may not today. The fetch time on each reading is what tells you how old the answer is.",
        },
        {
          kind: "proven",
          text: "Comparing up to eight offices at once surfaces the earliest open renewal day in an area without opening eight calendars.",
        },
        {
          kind: "proven",
          text: "Area pages show which of the 218 captured entries sit in your province, including offices you may not have considered.",
        },
      ],
    },
  ],
};

const FIVE_YEAR_LICENCE: Journey = {
  slug: "five-year-license",
  group: "licence",
  title: "The five-year Thai driving license",
  metaDescription:
    "How the move from a temporary Thai licence to a five-year licence maps onto renewal appointment data, what only the Department of Land Transport can confirm, and what dated sources report about fees and eligibility.",
  intro:
    "The five-year licence is normally reached through a renewal, not through a separate application. This page covers the appointment side of that renewal and keeps the eligibility rules attributed.",
  cardTitle: "Five-year licence",
  audience:
    "Holders of a two-year temporary licence approaching its first renewal, and anyone who needs a five-year licence for a further step such as an international permit.",
  outcome:
    "You can plan the renewal appointment that produces the longer licence, and know which conditions only DLT confirms.",
  prerequisites: ["new-thai-driving-license", "medical-certificate", "e-learning-course"],
  nextSteps: ["renew-thai-driving-license", "international-driving-permit", "costs-and-fees"],
  keyword: " RENEW THAI",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the appointment data shows",
      claims: [
        {
          kind: "proven",
          text: 'The appointment contract has no five-year option. The upgrade rides on the renewal work option " RENEW THAI", which is what to look for in the calendar.',
        },
        {
          kind: "proven",
          text: "The data never names the licence duration an office will issue. It shows only whether a renewal day is open and what message the upstream returns for it.",
        },
        {
          kind: "proven",
          text: "Of the 218 captured office entries, 115 report app_open = 1, and renewal options come back from a subset of those.",
        },
        {
          kind: "proven",
          text: "Every reading is labelled live or stored with its fetch time, and stored history shows recent movement for the same office and option.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "official-only",
          text: "Whether your temporary licence qualifies for a five-year licence at this renewal.",
        },
        {
          kind: "official-only",
          text: "How outstanding traffic violations, visa status, or address changes affect that decision.",
        },
        {
          kind: "official-only",
          text: "Which tests or training apply at the upgrade, and what documents an office accepts.",
        },
        {
          kind: "official-only",
          text: "Current fees, and the exact validity dates printed on the licence.",
        },
        {
          kind: "official-only",
          text: "Whether a five-year licence issued to a foreign resident is tied to the length of a visa or permit to stay.",
        },
      ],
    },
    {
      heading: "What other sources report",
      claims: [
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "A first Thai licence is described as a two-year temporary licence, which becomes a five-year licence at the first renewal when documents are in order and no major violations are outstanding.",
        },
        {
          ...STARTER_KIT_LICENCE,
          kind: "reported",
          text: "The two-year temporary licence is reported at 205 baht and the five-year licence at 505 baht.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The 2026 fee list gives 105 baht for a temporary motorcycle licence, 205 for a temporary car licence, 255 for a five-year motorcycle licence, and 505 for a five-year car licence.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "An international driving permit is described as issued only against a five-year licence, with two-year temporary holders converting first.",
        },
      ],
    },
    {
      heading: "Timing the renewal that upgrades the licence",
      claims: [
        {
          kind: "proven",
          text: "Renewal calendars move, so a date that reads full today is worth re-checking rather than treating as final.",
        },
        {
          kind: "proven",
          text: "Comparing up to eight offices at once shows where the earliest open renewal day sits in your area.",
        },
        {
          kind: "proven",
          text: "The booking itself happens on the DLT service. This site reads availability and hands you over.",
        },
      ],
    },
  ],
};

export const LICENCE_JOURNEYS: readonly Journey[] = [
  NEW_LICENCE,
  RENEW_LICENCE,
  CONVERT_LICENCE,
  MOTORCYCLE_LICENCE,
  INTERNATIONAL_PERMIT,
  LOST_OR_DAMAGED,
  EXPIRED_LICENCE,
  FIVE_YEAR_LICENCE,
];
