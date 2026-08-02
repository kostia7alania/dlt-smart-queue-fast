// Process journeys: the steps inside a licence application rather than the
// licence itself — tests, training, certificates, documents, money, and time.
//
// These pages are about procedure, and procedure is exactly the thing this
// project cannot observe. The appointment feed carries office names, an
// appointment-open flag, work options under two upstream keywords, and
// day-level messages. It carries no test content, no document list, and no fee
// schedule. So almost every statement here is either `official-only` (DLT or the
// office decides it) or `reported` (a dated, attributed third-party statement).
//
// Evidence rules and the recorded conflicts between sources live in
// docs/research/2026-07-31-dlt-source-and-process-evidence.md. Where sources
// disagree, both are kept and the disagreement is stated in the section lead.

import type { Journey } from "./journey";

const NATION_2026 = {
  source: "Nation Thailand, quoting DLT spokesman Titiphat Thaijongrak (published 2026-06-16)",
  sourceUrl: "https://www.nationthailand.com/news/general/40067483",
  observedOn: "2026-07-31",
} as const;

const FORBES_CONVERT = {
  source: "Forbes & Partners licence-conversion guide (published 2025-10-04, updated 2025-12-19)",
  sourceUrl: "https://www.forbesandpartners.com/convert-foreign-driving-license-thailand/",
  observedOn: "2026-07-31",
} as const;

const FORBES_RENEW = {
  source:
    "Forbes & Partners renewal guide for foreigners (published 2025-10-04, updated 2026-01-06)",
  sourceUrl: "https://www.forbesandpartners.com/renew-thai-driving-license-foreigner/",
  observedOn: "2026-08-01",
} as const;

const THAILAND_LIFE = {
  source: "TheThailandLife guide to learning to drive in Thailand (last updated 2026-05-05)",
  sourceUrl: "https://www.thethailandlife.com/learning-to-drive-in-thailand",
  observedOn: "2026-08-01",
} as const;

const STARTER_KIT = {
  source: "Thailand Starter Kit (formerly ExpatDen) Thai driving-licence guide (dated 2026-08-01)",
  sourceUrl: "https://www.thailandstarterkit.com/lifestyle/thai-driving-license/",
  observedOn: "2026-08-01",
} as const;

const STARTER_KIT_DRIVING = {
  source: "Thailand Starter Kit guide to driving in Thailand (last updated 2026-01-26)",
  sourceUrl: "https://www.thailandstarterkit.com/transportation/driving-in-thailand/",
  observedOn: "2026-08-01",
} as const;

const STARTER_KIT_IDP = {
  source: "Thailand Starter Kit international-driving-permit guide (last updated 2026-05-21)",
  sourceUrl:
    "https://www.thailandstarterkit.com/transportation/international-drivers-license-thailand/",
  observedOn: "2026-08-01",
} as const;

const ROOJAI_RULES = {
  source: "Roojai guide to driving licences and road rules for foreigners (published 2026-01-29)",
  sourceUrl: "https://www.roojai.com/en/article/road-tips/foreigners-driving-in-thailand/",
  observedOn: "2026-08-01",
} as const;

const ROOJAI_MEDICAL = {
  source: "Roojai guide to the driving-licence medical certificate (published 2025-12-01)",
  sourceUrl: "https://www.roojai.com/en/article/road-tips/medical-certificate-for-driving-licence/",
  observedOn: "2026-08-01",
} as const;

const THAIGER_ELEARNING = {
  source: "Thaiger guide to DLT online training and licence renewal (published 2024-11-06)",
  sourceUrl:
    "https://thethaiger.com/guides/automotive/how-to-do-the-online-training-and-renew-your-drivers-licence-in-thailand",
  observedOn: "2026-08-01",
} as const;

const THAIGER_WALKIN = {
  source:
    "Thaiger news report on walk-in licence services, quoting DLT deputy director Seksom Akkaphan (published 2023-01-19)",
  sourceUrl:
    "https://thethaiger.com/news/national/walk-in-driving-license-services-now-available-in-thailand",
  observedOn: "2026-08-01",
} as const;

const MOTORIST_QUEUE = {
  source: "Motorist Thailand guide to booking through DLT Smart Queue (last updated 2025-02-20)",
  sourceUrl:
    "https://www.motorist.co.th/en/article/2580/how-to-book-a-driver-s-licence-appointment-through-dlt-smart-queue-2025-update",
  observedOn: "2026-08-01",
} as const;

const DLT_INDEXED = {
  source:
    "Indexed text of the official dlt.go.th renewal page (the page itself renders only with JavaScript)",
  sourceUrl: "https://www.dlt.go.th/th/driving-license/81",
  observedOn: "2026-07-31",
} as const;

/** Reused wording for the boundary claim that every page in this cluster carries. */
const FEED_CONTENT_CLAIM = {
  kind: "proven",
  text: 'The upstream appointment feed carries office names, an appointment-open flag, work options under the exact keywords " NEW THAI" and " RENEW THAI", and day-level messages. No test content, document list, or fee appears anywhere in it.',
} as const;

const FRESHNESS_CLAIM = {
  kind: "proven",
  text: "Every availability answer on this site states whether it came from a live read or from stored data, and the time it was fetched, so a stale answer is recognizable as stale.",
} as const;

const TESTS_AND_EXAMS: Journey = {
  slug: "tests-and-exams",
  group: "process",
  title: "Tests and exams for a Thai driving license",
  metaDescription:
    "The separate tests behind a Thai driving licence, which parts only the Department of Land Transport can confirm, what dated guides report, and live appointment availability for the office visit.",
  intro:
    "Four different things get called the test, and they apply to different people. This page separates them, attributes every procedural statement to a dated source, and leaves the decisions with DLT.",
  cardTitle: "Tests and exams",
  audience:
    "Foreigners heading to a land transport office for a first licence, a conversion, or a renewal, who want to know what the visit contains.",
  outcome:
    "You can tell the four tests apart, see where the published accounts disagree, and arrive with a short list of questions for the office.",
  prerequisites: ["documents-checklist", "e-learning-course"],
  nextSteps: ["theory-test", "practical-test", "aptitude-test", "processing-time"],
  keyword: null,
  keywordNote:
    "The appointment system exposes only the work option an office offers, never the tests inside a visit, so the availability views here help with the visit itself rather than with the exam.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "Four different things are called the test",
      lead: "Sorting them apart early saves a wasted trip. Which of them applies to a given applicant is a DLT decision.",
      claims: [
        {
          kind: "official-only",
          text: "Whether an applicant sits a written theory examination, and whether holding a valid foreign licence changes that.",
        },
        {
          kind: "official-only",
          text: "Whether a practical driving test applies, and whether a particular office waives it.",
        },
        {
          kind: "official-only",
          text: "Which physical-fitness tests are taken on the day, on which devices, and in what order.",
        },
        {
          kind: "official-only",
          text: "Whether an online training course comes before the visit, and how recently it has to have been completed.",
        },
        {
          kind: "official-only",
          text: "Which languages a test is offered in at the office you booked.",
        },
      ],
    },
    {
      heading: "What dated guides report about the sequence",
      lead: "Third-party reports, read on the dates shown. Treat them as questions to put to DLT rather than as rules.",
      claims: [
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "An applicant who already holds a licence is reported to finish in about one day, while a first-time applicant is reported to spend two to three days across two visits to the office.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The written test is reported as mandatory since 2025 for every applicant, including holders of a valid foreign licence, at 50 questions with a 45-question pass mark.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was reported as removed for renewals and kept for first-time applicants, so a renewal and a first application do not involve the same set of checks.",
        },
      ],
    },
    {
      heading: "Where the reports disagree",
      lead: "Two guides count the physical-fitness tests differently. Both are kept as they were found; the disagreement is the useful part.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Three aptitude tests are reported: traffic-light colour recognition, braking ability, and distance perception.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "Four aptitude tests are reported: colour blindness, depth perception, brake reflex, and peripheral vision.",
        },
        {
          kind: "official-only",
          text: "Which of those tests a given office administers today, and to which applicants.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "The data behind this site is about office availability, not about examinations.",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "What a test contains, how it is scored, and how many attempts an office allows.",
        },
        {
          kind: "official-only",
          text: "Whether an office runs the whole sequence in one visit or splits it across days.",
        },
      ],
    },
  ],
};

const THEORY_TEST: Journey = {
  slug: "theory-test",
  group: "process",
  title: "The theory test for a Thai driving license",
  metaDescription:
    "What dated guides report about the Thai written driving test, when it appears at all, what only the Department of Land Transport can confirm, and what this service does not observe.",
  intro:
    "The written test is the step foreigners worry about most. Everything published here about its format is attributed to a dated source, because no official page served readable text when we checked.",
  cardTitle: "Theory test",
  audience:
    "Foreigners facing a written examination at a land transport office, including licence converters and people renewing after a long lapse.",
  outcome:
    "You know the format the published guides describe, when the test is reported to apply, and which questions belong to DLT.",
  prerequisites: ["e-learning-course", "documents-checklist"],
  nextSteps: ["practical-test", "tests-and-exams", "aptitude-test"],
  keyword: null,
  keywordNote:
    "The appointment contract has no field for an examination, so the availability views on this site cover the office visit that contains the test rather than the test itself.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "The format, as reported",
      lead: "Two independent guides describe the same shape. Neither cites an official document for it.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The test is reported as 50 multiple-choice questions with a pass mark of 45 correct answers, offered in Thai and in English.",
        },
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "The same 50-question examination with a 45-answer pass mark is reported for applicants converting a foreign licence.",
        },
        {
          kind: "official-only",
          text: "The question count and pass mark in force on the day you sit it.",
        },
        {
          kind: "official-only",
          text: "Whether the office you booked offers the test in a language other than Thai.",
        },
      ],
    },
    {
      heading: "When the written test appears at all",
      lead: "The reports agree that a lapse in the licence changes the answer, and they date from October 2025 to May 2026.",
      claims: [
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "For a renewal inside the allowed window no written and no practical test is reported, while a licence expired between one and three years is reported to bring back the written test, and a licence expired more than three years a full reapplication.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "The same tiers are reported independently: under a year no retest, one to three years a written test, over three years both the written and the practical test.",
        },
        {
          kind: "official-only",
          text: "Which tier your own licence falls into, counted from a date only DLT holds.",
        },
      ],
    },
    {
      heading: "Preparing, and what preparation does not settle",
      lead: "Practice sets circulate widely. Nothing published outside DLT can confirm that they match the current bank.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Downloadable practice examinations in English are offered by the guide, described as matching the style of the published question bank.",
        },
        {
          kind: "official-only",
          text: "Whether the current question bank matches any practice set circulating online.",
        },
        {
          kind: "official-only",
          text: "How many retakes an office allows, and after how long.",
        },
        {
          kind: "official-only",
          text: "Whether the written test is taken before or after the physical-fitness checks at that office.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Any actual question, answer, or scoring rule used in the examination.",
        },
      ],
    },
  ],
};

const PRACTICAL_TEST: Journey = {
  slug: "practical-test",
  group: "process",
  title: "The practical driving test in Thailand",
  metaDescription:
    "What dated guides report about the Thai practical driving test, who it is reported to apply to, what only the Department of Land Transport can confirm, and what this service does not observe.",
  intro:
    "The practical test is the step most often described as waived, and it is also the step where published accounts disagree most. Both accounts are kept here, with their dates.",
  cardTitle: "Practical test",
  audience:
    "Foreigners applying for a first Thai licence, and holders of a foreign licence who have been told the driving test may not apply to them.",
  outcome:
    "You know what the reported test stations look like, and you know that the waiver question is settled at the office rather than online.",
  prerequisites: ["theory-test", "documents-checklist"],
  nextSteps: ["tests-and-exams", "processing-time", "costs-and-fees"],
  keyword: null,
  keywordNote:
    "Nothing in the appointment data describes a driving test, so use the availability views here to plan the office visit and ask the office about the test itself.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "The reported test stations",
      lead: "One guide describes the course in unusual detail. It is a single dated account, not a specification.",
      claims: [
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "Three stations are reported: driving forward and backward between poles; driving along a curb and stopping at a stop sign, given as 25 cm from the curb and one metre before the sign; and parallel parking within a maximum of seven gear changes.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "A failed practical test is reported as retakeable after three business days, and a test car is reported as rentable at the office for roughly 100 to 200 baht.",
        },
        {
          kind: "official-only",
          text: "The layout, tolerances, and scoring used at the office you attend.",
        },
        {
          kind: "official-only",
          text: "Whether the office supplies a vehicle, and which vehicle categories it accepts for the test.",
        },
      ],
    },
    {
      heading: "Whether it applies to you at all",
      lead: "Two guides disagree. One reports a flat waiver for conversions; the other reports that waivers vary by office and are granted less often than they were. Both statements are kept.",
      claims: [
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "For conversions the practical driving test is reported as waived, with four aptitude tests and the written examination still taken.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Waivers for holders of a foreign licence are reported as varying by office and as granted increasingly rarely, which disagrees with the flat waiver above.",
        },
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "For a standard renewal, no practical driving test is reported at all.",
        },
        {
          kind: "official-only",
          text: "Which of those accounts describes the office you booked, on the day you attend it.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Whether a foreign licence, an international permit, or a driving-school certificate removes the practical test.",
        },
        {
          kind: "official-only",
          text: "Whether the practical test happens on the same visit as the written test.",
        },
        {
          kind: "official-only",
          text: "What a retake costs, and whether a new appointment is involved.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Whether the test course at a given office is open on a given day.",
        },
      ],
    },
  ],
};

const APTITUDE_TEST: Journey = {
  slug: "aptitude-test",
  group: "process",
  title: "The aptitude and physical-fitness test",
  metaDescription:
    "What dated sources report about the Thai driving-licence aptitude tests, what the 2026 renewal change did and did not alter, and what only the Department of Land Transport can confirm.",
  intro:
    "Almost every applicant meets these short machine tests, including people who take no written or driving test at all. The published accounts differ on how many there are.",
  cardTitle: "Aptitude test",
  audience:
    "Anyone renewing, converting, or applying for a first Thai licence, including drivers over 55 and drivers whose licence has lapsed.",
  outcome:
    "You know which checks are reported, that the 2026 easing applies to renewals rather than to first applications, and what to confirm with the office.",
  prerequisites: ["medical-certificate", "documents-checklist"],
  nextSteps: ["tests-and-exams", "renew-thai-driving-license", "five-year-license"],
  keyword: null,
  keywordNote:
    "The appointment system does not expose the tests inside a visit, so the availability views here are for finding the office visit in which these checks happen.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What is reported as tested",
      lead: "Three dated guides describe overlapping but different sets. The counts disagree — three tests in one account, four in another — and we keep both.",
      claims: [
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "For renewals, colour-blindness, reaction-time, and peripheral-vision checks are reported, with no written or practical driving test.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "Four checks are reported: colour blindness on traffic-light colours, depth perception by aligning bars, brake reflex, and peripheral vision.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Three checks are reported: traffic-light colour recognition, braking ability, and distance perception.",
        },
      ],
    },
    {
      heading: "The 2026 change, and what it left alone",
      lead: "A DLT spokesman was quoted in June 2026 describing an easing for renewals. It was described as a change to renewals, not to first applications.",
      claims: [
        {
          ...NATION_2026,
          kind: "reported",
          text: "Colour-vision testing was reported as removed for renewals and kept for first-time applicants, and the brake-reaction test as waived for drivers aged 55 or under whose licence expired within one year, who then take peripheral-vision and depth-perception tests.",
        },
        {
          ...NATION_2026,
          kind: "reported",
          text: "Drivers over 55, and anyone whose licence expired more than one year ago, were reported as still taking the full set of checks.",
        },
        {
          kind: "official-only",
          text: "Whether that easing reaches a foreigner renewing a two-year licence at a particular office.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Which devices an office uses, and what result counts as a pass on each of them.",
        },
        {
          kind: "official-only",
          text: "Whether a failed check can be retried the same day, and how often.",
        },
        {
          kind: "official-only",
          text: "Whether glasses, contact lenses, or a medical report change how a check is applied.",
        },
        {
          kind: "official-only",
          text: "Whether the medical certificate is inspected before or after these checks.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Any personal result, exemption, or medical judgement about a specific applicant.",
        },
      ],
    },
  ],
};

const E_LEARNING_COURSE: Journey = {
  slug: "e-learning-course",
  group: "process",
  title: "The DLT e-learning course",
  metaDescription:
    "What the official site's indexed text and dated guides say about the DLT e-learning training, how long it is reported to take, how long the result is reported to last, and what only DLT can confirm.",
  intro:
    "Online training usually comes before the office visit, and the reported course lengths range from one hour to five. They describe different applicant types and different dates, and they are kept apart here.",
  cardTitle: "E-learning course",
  audience:
    "Foreigners renewing a Thai licence, converting a foreign one, or applying for a first licence who have been told to complete training online first.",
  outcome:
    "You know what the training is reported to involve, why the quoted durations differ, and which part of it DLT alone can confirm for your case.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["aptitude-test", "renew-thai-driving-license", "processing-time"],
  keyword: null,
  keywordNote:
    "Training happens on a separate DLT system that this project does not read, so the availability views here cover only the office visit that follows it.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the training is reported to involve",
      lead: "The official renewal page did not render readable text without JavaScript when we checked, so even the DLT statement below comes from a search index rather than from the page itself.",
      claims: [
        {
          ...DLT_INDEXED,
          kind: "reported",
          text: "The official site's indexed text states that renewal training is taken through the DLT e-learning system, that private, transport, and public courses run one, two, and three hours, and that the applicant then has 90 days to complete the physical-fitness test at a land transport office, booking in advance through DLT Smart Queue.",
        },
        {
          ...THAIGER_ELEARNING,
          kind: "reported",
          text: "Registration at dlt-elearning.com with an identity or passport number is reported, with the course split into segments of about 15 minutes and embedded quizzes that cannot be skipped, ending in a QR code kept as proof.",
        },
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "A one-hour renewal course made of a pre-test, a video, and a post-test is reported, with a screenshot of the QR-code confirmation carried to the office.",
        },
      ],
    },
    {
      heading: "Why the reported durations differ",
      lead: "The figures below are not a contradiction to resolve by picking one: they describe renewal, conversion, and first application, from sources dated 2024 to 2026. They do disagree on the car-renewal figure.",
      claims: [
        {
          ...THAIGER_ELEARNING,
          kind: "reported",
          text: "Motorcycle renewal training is reported as one hour and car renewal training as two hours, which disagrees with the flat one-hour renewal course reported elsewhere.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "First-time applicants are reported to sit at least five hours of training, roughly a full day with a break, while licence converters are reported to watch a one-hour video followed by five questions.",
        },
        {
          kind: "official-only",
          text: "Which course applies to your licence class and your reason for applying.",
        },
        {
          kind: "official-only",
          text: "How long a completion result stays usable, and what happens when it lapses before the office visit.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Whether an office accepts the online course at all, or runs classroom training instead.",
        },
        {
          kind: "official-only",
          text: "Which languages the course is offered in, and whether the certificate names a language.",
        },
        {
          kind: "official-only",
          text: "Whether a passport holder without a Thai identity number can register, and how.",
        },
        {
          kind: "official-only",
          text: "What proof of completion the counter accepts: a printout, a screenshot, or a lookup by the officer.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "This project reads the appointment endpoints only. It does not touch the e-learning system, hold an account there, or see any training record.",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Whether your own training result is on file and still valid.",
        },
      ],
    },
  ],
};

const MEDICAL_CERTIFICATE: Journey = {
  slug: "medical-certificate",
  group: "process",
  title: "The medical certificate for a Thai driving license",
  metaDescription:
    "What dated guides report about the Thai driving-licence medical certificate — what it covers, how long it lasts, what it costs — and what only the Department of Land Transport can confirm.",
  intro:
    "A medical certificate is the cheapest and most time-limited item in the folder, which is why it is usually collected last. Reported prices vary by a factor of twenty, so treat them as a range, not a price list.",
  cardTitle: "Medical certificate",
  audience:
    "Foreigners assembling paperwork for a first licence, a conversion, or a renewal at a land transport office.",
  outcome:
    "You know what the certificate is reported to cover, the reported window in which it stays usable, and that acceptance is decided at the counter.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["residence-certificate", "aptitude-test", "costs-and-fees"],
  keyword: null,
  keywordNote:
    "A clinic visit is outside the appointment system entirely, so the availability views here only help you time the office visit the certificate is carried to.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What the certificate is, as reported",
      lead: "Two dated guides describe it consistently: a short examination by a licensed doctor, on a standard form, with a 30-day life.",
      claims: [
        {
          ...ROOJAI_MEDICAL,
          kind: "reported",
          text: "The examination is reported to cover vision including colour vision and depth perception, blood pressure, pulse, height and weight, hearing, and a general health check with no fasting, and the certificate is reported as valid for 30 days from issue whether it comes from a local clinic, a public hospital, or a private hospital.",
        },
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "The document is reported as the five-disease form, dated within 30 days of the application, issued by a clinic or hospital.",
        },
        {
          kind: "official-only",
          text: "Whether the counter takes the original certificate, a copy, or both.",
        },
      ],
    },
    {
      heading: "Reported costs, which do not agree",
      lead: "Three sources give three ranges. They overlap but they do not match, so read them as an order of magnitude rather than a quote.",
      claims: [
        {
          ...ROOJAI_MEDICAL,
          kind: "reported",
          text: "Costs are reported as roughly 50 to 100 baht at a local clinic, 200 to 300 baht at a public hospital, and from about 1,400 baht at a private hospital.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "Costs are reported as 150 to 300 baht at clinics and 600 baht or more at hospitals, which sits above the clinic figure above.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "A single range of 100 to 500 baht is reported, with clinics described as issuing the certificate the same day.",
        },
      ],
    },
    {
      heading: "What only DLT and the office decide",
      claims: [
        {
          kind: "official-only",
          text: "Whether a certificate from a given clinic is accepted, and on which form it has to be written.",
        },
        {
          kind: "official-only",
          text: "How recently the certificate has to be dated for the service you booked.",
        },
        {
          kind: "official-only",
          text: "Which conditions disqualify an applicant, and what happens if one is found.",
        },
        {
          kind: "official-only",
          text: "Whether a certificate issued outside Thailand can be used at all.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Whether a specific clinic near a specific office issues an acceptable certificate.",
        },
      ],
    },
  ],
};

const RESIDENCE_CERTIFICATE: Journey = {
  slug: "residence-certificate",
  group: "process",
  title: "The residence certificate for a Thai driving license",
  metaDescription:
    "What dated guides report about proving your address in Thailand for a driving licence — immigration certificates, embassy letters, work permits — and what only the office can confirm.",
  intro:
    "Proof of address is the item that most often sends people home for another day, because the accepted forms differ by office and by province. Every statement below is attributed and dated.",
  cardTitle: "Residence certificate",
  audience:
    "Foreigners who hold a passport but no Thai house registration, and who have to show a Thai address at a land transport office.",
  outcome:
    "You know the reported routes to proof of address, the reported costs and their spread, and which questions belong to immigration and to DLT.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["medical-certificate", "costs-and-fees", "processing-time"],
  keyword: null,
  keywordNote:
    "Immigration paperwork is outside the appointment system, so the availability views here only cover the land transport office visit that the certificate is carried to.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "The reported routes to proof of address",
      lead: "Immigration is the route described most often. Two alternatives — a work permit and an embassy letter — appear in the same guides with caveats.",
      claims: [
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "A certificate of residence from the local immigration office is reported, applied for with a passport, a TM30 receipt, and a rental contract or property documents, with processing reported as anything from same-day to several weeks depending on the office, and the certificate itself reported as valid for 30 days.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "A residence certificate issued within 30 days, or a work permit carrying a signature, is reported — with the work permit described as increasingly refused at some offices, and a yellow house book listed as another route.",
        },
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "For a conversion, a residence certificate or an embassy letter is reported as part of the document set.",
        },
      ],
    },
    {
      heading: "Reported costs and expiry do not agree",
      lead: "The prices below differ by province, and the expiry accounts contradict each other: a flat 30-day life above, certificates with no printed expiry below. Both are kept as they were found.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Fees are reported as varying by province, with 300 baht quoted in Pattaya and 500 baht in Buriram, and some offices reported as issuing certificates that carry no expiry date at all.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "A residence certificate from immigration is reported at 200 baht, below both provincial figures above.",
        },
        {
          kind: "official-only",
          text: "Which of these accounts matches the immigration office that would issue yours, and what the land transport office does with a certificate that shows no expiry.",
        },
      ],
    },
    {
      heading: "What only DLT and immigration decide",
      claims: [
        {
          kind: "official-only",
          text: "Which proof of address the land transport office accepts on the day.",
        },
        {
          kind: "official-only",
          text: "Whether an embassy letter substitutes for an immigration certificate at that office.",
        },
        {
          kind: "official-only",
          text: "How old the certificate may be when it is presented.",
        },
        {
          kind: "official-only",
          text: "What immigration asks for before issuing one, and how long it takes in your province.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Whether your own address evidence satisfies a particular officer.",
        },
      ],
    },
  ],
};

const DOCUMENTS_CHECKLIST: Journey = {
  slug: "documents-checklist",
  group: "process",
  title: "Documents for a Thai driving license",
  metaDescription:
    "Three dated third-party document lists for a Thai driving licence, side by side, with the differences named — and a clear statement of what only the Department of Land Transport can confirm.",
  intro:
    "There is no machine-readable official checklist, so this page shows three dated lists next to each other and names where they differ. The office decides what it accepts.",
  cardTitle: "Documents checklist",
  audience:
    "Foreigners packing a folder for a land transport office and trying to avoid a second trip.",
  outcome:
    "You can build a candidate folder from three independent lists and see exactly which items are contested.",
  prerequisites: [],
  nextSteps: ["medical-certificate", "residence-certificate", "costs-and-fees", "tests-and-exams"],
  keyword: null,
  keywordNote:
    "The appointment system carries no document list, so use the availability views to book the visit and this page to prepare questions about the folder.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "Three dated lists, side by side",
      lead: "Read down the three and note the overlap: passport, proof of address, a recent medical certificate, and a form from the office appear in all of them.",
      claims: [
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "The reported set is a passport with a non-immigrant visa, a residence certificate or embassy letter, a medical certificate no older than 30 days, the valid foreign licence with a certified translation, and a form obtained at the office.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "The reported set is a passport with visa and entry stamp, proof of residence from immigration or an embassy, a medical certificate issued within 30 days, passport-style photographs of about 1.5 by 2 inches, a foreign licence with a certified translation where it is not in English, and an application form.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "The reported set is an application form supplied at the office, a passport, a residence certificate issued within 30 days or a signed work permit, a medical certificate issued within 30 days, and optionally a home licence or international permit with a translation where it is not in English.",
        },
      ],
    },
    {
      heading: "Where the lists differ",
      lead: "Photographs appear in one list and not in the other two, and only one list takes a position on visa type. Neither difference is settled outside the office.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Passport-style photographs are reported as an item to bring, while the other two lists describe photographs being handled at the office.",
        },
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "A tourist visa is reported as not accepted for a licence conversion, and a non-immigrant visa as the expected status.",
        },
        {
          kind: "official-only",
          text: "Which visa or stay status the office accepts, which is the single most consequential item on this page.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Whether photographs are taken at the counter or brought, and in what size.",
        },
        {
          kind: "official-only",
          text: "Which translations and certifications are accepted, and who may certify them.",
        },
        {
          kind: "official-only",
          text: "How many copies of each document are wanted, and whether each page is signed.",
        },
        {
          kind: "official-only",
          text: "Whether a work permit stands in for a residence certificate at that branch.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "Whether your particular folder is complete for your particular case.",
        },
      ],
    },
  ],
};

const COSTS_AND_FEES: Journey = {
  slug: "costs-and-fees",
  group: "process",
  title: "Costs and fees for a Thai driving license",
  metaDescription:
    "Reported government fees for Thai driving licences, the side costs around them, where the published figures disagree, and what only the Department of Land Transport can confirm.",
  intro:
    "Licence fees in Thailand are small, and the figures published for them mostly agree. Where they disagree — the motorcycle figure — both are shown, because fee schedules change and we do not read them.",
  cardTitle: "Costs and fees",
  audience:
    "Foreigners budgeting a licence application, a renewal, or a conversion, including the costs that are not paid to DLT.",
  outcome:
    "You have a realistic order of magnitude for the whole exercise and know which single number to confirm at the counter.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["medical-certificate", "residence-certificate", "processing-time"],
  keyword: null,
  keywordNote:
    "The appointment data contains no prices at all, so the availability views here only help with when to go, not with what it costs.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "Government fees, as reported",
      lead: "The car figures agree across three sources. The motorcycle figure does not, and both versions are kept.",
      claims: [
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "Fees are reported as about 205 baht for a two-year car licence, 105 baht for a two-year motorcycle licence, 505 baht for a five-year car licence, and 255 baht for a five-year motorcycle licence.",
        },
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "Renewal fees are reported as 505 baht for a car licence and 255 baht for a motorcycle licence, matching the five-year figures above.",
        },
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "Conversion fees are reported as about 205 baht for a car licence and about 155 baht for a motorcycle licence, and that motorcycle figure disagrees with the 105 baht reported above.",
        },
      ],
    },
    {
      heading: "The costs that are not DLT fees",
      lead: "Most of the money in a licence application is spent outside the office. These figures are reported and dated; the pages for each item carry the fuller ranges.",
      claims: [
        {
          ...ROOJAI_MEDICAL,
          kind: "reported",
          text: "A medical certificate is reported at roughly 50 to 100 baht at a local clinic, 200 to 300 baht at a public hospital, and from about 1,400 baht at a private hospital.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "Renting a car at the office for the practical test is reported at roughly 100 to 200 baht.",
        },
        {
          kind: "official-only",
          text: "Whether an office charges separately for a retest, a reprint, or a licence class added on the day.",
        },
      ],
    },
    {
      heading: "What only DLT can confirm",
      claims: [
        {
          kind: "official-only",
          text: "The fee in force today for your licence class and duration.",
        },
        {
          kind: "official-only",
          text: "Which payment methods an office takes, and whether cash is the only one.",
        },
        {
          kind: "official-only",
          text: "Whether a fee is refundable if an application stops part-way.",
        },
        {
          kind: "official-only",
          text: "Whether any surcharge applies to a foreign applicant, and on what basis.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "No price on this page comes from us, and this site takes no payment of any kind.",
      claims: [
        FEED_CONTENT_CLAIM,
        FRESHNESS_CLAIM,
        {
          kind: "proven",
          text: "Nothing here involves an account, a document number, or DLT credentials, and this service never books on your behalf.",
        },
      ],
    },
  ],
};

const PROCESSING_TIME: Journey = {
  slug: "processing-time",
  group: "process",
  title: "How long a Thai driving license takes",
  metaDescription:
    "What appointment data actually shows about timing at Thai land transport offices, what dated guides report about the day itself, and what only the Department of Land Transport can confirm.",
  intro:
    "This is the page where our own data is worth the most: not how long the counter takes, but which offices show open days and how fresh that answer is. The rest is attributed.",
  cardTitle: "Processing time",
  audience:
    "Foreigners planning around a visa run, a work schedule, or a flight, who need to know how far ahead to plan.",
  outcome:
    "You can compare offices on the earliest day they report as open, and you know which parts of the timeline nobody outside DLT can promise.",
  prerequisites: ["documents-checklist"],
  nextSteps: ["tests-and-exams", "costs-and-fees", "foreigner-faq"],
  keyword: null,
  keywordNote:
    "This page covers the whole timeline rather than one bookable step, so it carries no upstream work keyword; the calendar and comparison views map to the two keywords the appointment system does expose.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "What we can actually show about timing",
      lead: "Everything in this section comes from the public appointment endpoints this project reads, and is visible in the interactive views.",
      claims: [
        {
          kind: "proven",
          text: 'The calendar shows the day-level message the upstream returns for each date at a chosen office and work option, including the exact full marker "เต็ม".',
        },
        {
          kind: "proven",
          text: "Comparison across up to eight offices is computed from the same day messages, so an office with an earlier first open day is visible without opening eight calendars.",
        },
        {
          kind: "proven",
          text: "Stored history shows how availability for one office and work option changed across recent observations, without contacting the upstream service again.",
        },
        {
          kind: "proven",
          text: "The captured office list contains 218 entries, of which 115 report an appointment-open flag, and area pages group them by city and province so a nearby alternative is easy to test.",
        },
        FRESHNESS_CLAIM,
      ],
    },
    {
      heading: "What dated guides report about the day itself",
      lead: "These are third-party accounts of time spent at the office, read on the dates shown.",
      claims: [
        {
          ...FORBES_RENEW,
          kind: "reported",
          text: "A renewal with an appointment is reported to take about 30 to 45 minutes at the office.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "One renewal is described as taking about 45 minutes, with appointments at some locations reported as booked six to eight weeks ahead.",
        },
        {
          ...STARTER_KIT,
          kind: "reported",
          text: "An applicant who already holds a licence is reported to finish in about a day, and a first-time applicant in two to three days across two visits.",
        },
      ],
    },
    {
      heading: "Booking and walk-ins, as reported",
      lead: "These two reports date from 2023 and 2025, and they describe practice that varies by office and can change without notice.",
      claims: [
        {
          ...THAIGER_WALKIN,
          kind: "reported",
          text: "Walk-in service was reported as restored at transport offices nationwide for renewals, two-to-five-year upgrades, replacements, and first applications, with pre-booked appointments served first.",
        },
        {
          ...MOTORIST_QUEUE,
          kind: "reported",
          text: "Applying by walking in or by booking in advance is reported as possible, with officers reported to prioritise pre-booked applicants, and a booking returning a QR code to present on the day.",
        },
        {
          kind: "official-only",
          text: "Whether the office you have in mind accepts walk-ins today, and under what daily limit.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "A day message is an upstream answer about a date. It is not a measurement of a queue.",
      claims: [
        {
          kind: "proven",
          text: "The day message shown here is the upstream answer for that date and work option. It is not a slot count, a queue length, or a waiting time, and this project never publishes a number of available appointments.",
        },
        FEED_CONTENT_CLAIM,
        {
          kind: "official-only",
          text: "How long the counter takes on the day, and whether the licence is printed while you wait or posted later.",
        },
      ],
    },
  ],
};

const DRIVING_IN_THAILAND_RULES: Journey = {
  slug: "driving-in-thailand-rules",
  group: "process",
  title: "Driving in Thailand: rules a foreign driver meets first",
  metaDescription:
    "What dated guides report about driving legally in Thailand as a foreigner — which licence is accepted, speed limits, alcohol limits, helmets, and insurance — with the licence questions left to DLT.",
  intro:
    "This page is about the rules you meet on the road, not about the licence counter. Everything here is attributed to a dated source, because road law is not something this project observes.",
  cardTitle: "Driving rules",
  audience:
    "Foreigners driving or riding in Thailand on a home licence, an international permit, or a Thai licence.",
  outcome:
    "You know which licence the published guides say is accepted, the figures they quote for speed and alcohol, and where those accounts differ.",
  prerequisites: [],
  nextSteps: ["international-driving-permit", "foreigner-faq", "new-thai-driving-license"],
  keyword: null,
  keywordNote:
    "Road rules are nowhere in the appointment data, so use the availability views only when the answer here is that a Thai licence is the next step.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "Which licence is reported as accepted",
      lead: "Two dated guides agree on the shape and differ on the detail: a home licence alone is described as insufficient for most foreigners.",
      claims: [
        {
          ...ROOJAI_RULES,
          kind: "reported",
          text: "Licences issued in ASEAN countries are reported as usable without an international permit, short-term visitors as driving on an international permit together with the home licence, and long-term residents as holding a Thai licence.",
        },
        {
          ...STARTER_KIT_DRIVING,
          kind: "reported",
          text: "Carrying a Thai licence or an international permit is reported as the expectation, with a home licence alone described as insufficient outside the ASEAN exception, and insurers reported as declining cover where neither is held.",
        },
        {
          kind: "official-only",
          text: "Whether your own licence, permit, or combination is accepted for the vehicle you intend to drive.",
        },
      ],
    },
    {
      heading: "Reported speed, alcohol, and safety figures",
      lead: "The two accounts describe city limits slightly differently, and neither replaces the limit posted on the road in front of you.",
      claims: [
        {
          ...STARTER_KIT_DRIVING,
          kind: "reported",
          text: "A blood-alcohol limit of 50 mg per 100 ml is reported, with highways at 80 to 120 km/h, Bangkok main roads at 60 km/h, other large cities at 80 km/h, and small residential streets at up to 30 km/h.",
        },
        {
          ...ROOJAI_RULES,
          kind: "reported",
          text: "A 0.05 percent blood-alcohol limit is reported, with urban roads at roughly 50 to 60 km/h and highways at 80 to 120 km/h depending on the zone, which states the city figures differently from the account above.",
        },
        {
          ...STARTER_KIT_DRIVING,
          kind: "reported",
          text: "Seat belts are reported for front and rear passengers, and helmets for every motorcycle rider and passenger.",
        },
        {
          ...ROOJAI_RULES,
          kind: "reported",
          text: "Compulsory motor insurance, known as Por Ror Bor, is reported as carried by every vehicle, with voluntary cover described as common on top of it.",
        },
      ],
    },
    {
      heading: "What only the licensing authority can confirm",
      claims: [
        {
          kind: "official-only",
          text: "Which licence classes cover which vehicles, and what a Thai licence entitles its holder to drive.",
        },
        {
          kind: "official-only",
          text: "Whether an international permit issued under one convention is honoured here for its full printed validity.",
        },
        {
          kind: "official-only",
          text: "After how long a stay a foreign licence stops being an acceptable substitute for a Thai one.",
        },
        {
          kind: "official-only",
          text: "The penalty in force for driving without an accepted licence.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      claims: [
        {
          kind: "proven",
          text: "This project reads appointment availability at land transport offices. It holds no traffic law, no fine schedule, no road data, and no enforcement record.",
        },
        FRESHNESS_CLAIM,
        {
          kind: "official-only",
          text: "The speed limit, restriction, or traffic rule applying on a specific road today.",
        },
      ],
    },
  ],
};

const FOREIGNER_FAQ: Journey = {
  slug: "foreigner-faq",
  group: "process",
  title: "Thai driving license questions foreigners ask",
  metaDescription:
    "Common foreigner questions about Thai driving licences, sorted into what this service observes, what dated third-party sources report, and what only the Department of Land Transport can answer.",
  intro:
    "The questions below are sorted by who can answer them rather than by topic. That sorting is the point: a confident answer from the wrong source is what sends people home for a second day.",
  cardTitle: "Foreigner FAQ",
  audience:
    "Foreigners starting from zero on the Thai licence question, unsure which part is bureaucracy and which part is scheduling.",
  outcome:
    "You know which questions this site answers with data, which have dated third-party answers, and which belong to DLT.",
  prerequisites: [],
  nextSteps: ["documents-checklist", "tests-and-exams", "processing-time", "costs-and-fees"],
  keyword: null,
  keywordNote:
    "This page spans several services rather than one bookable step, so it carries no upstream keyword; the calendar and comparison views cover the office visit once you know which service you want.",
  updatedOn: "2026-08-01",
  sections: [
    {
      heading: "Questions we answer from our own data",
      lead: "Everything in this section is observable in the appointment endpoints this project reads.",
      claims: [
        {
          kind: "proven",
          text: "Which offices the upstream list contains, and which of them report an appointment-open flag: 218 entries captured, 115 flagged open, with upstream names kept unchanged including their defects.",
        },
        {
          kind: "proven",
          text: 'Whether a given office returns work options under " NEW THAI" or " RENEW THAI". Many offices return none, and that empty answer is rendered as an empty result rather than as an error.',
        },
        {
          kind: "proven",
          text: 'What the upstream says about a specific date at a specific office, including the exact full marker "เต็ม".',
        },
        FRESHNESS_CLAIM,
        {
          kind: "proven",
          text: "Nothing here involves an account, a document number, or DLT credentials, and this service never books on your behalf.",
        },
      ],
    },
    {
      heading: "Questions other people answer, with dates",
      lead: "Attributed third-party statements. They are dated because this area changes, and they are not our claims.",
      claims: [
        {
          ...NATION_2026,
          kind: "reported",
          text: "A fully electronic renewal system was described in June 2026 as still in development with the Public Health Ministry and the Medical Council, with no announced launch date, so an online renewal path should not be assumed to exist.",
        },
        {
          ...FORBES_CONVERT,
          kind: "reported",
          text: "A tourist visa is reported as not accepted for a licence conversion, with a non-immigrant visa reported as the expected status.",
        },
        {
          ...STARTER_KIT_IDP,
          kind: "reported",
          text: "A foreign international driving permit is reported as usable in Thailand for one year and as carried together with the home licence, while a Thai-issued permit is reported to need a five-year Thai licence and to cost 505 baht.",
        },
        {
          ...THAILAND_LIFE,
          kind: "reported",
          text: "A first licence is reported as a two-year temporary one, with five-year licences reported for holders of longer-stay visas and two-year licences for short-stay holders.",
        },
      ],
    },
    {
      heading: "Questions only DLT can answer",
      lead: "We link you to DLT for these rather than guessing, because the answer varies by office, applicant, and year.",
      claims: [
        {
          kind: "official-only",
          text: "Which visa or stay status your office accepts for the service you want.",
        },
        {
          kind: "official-only",
          text: "Whether your foreign licence removes any test, and which one.",
        },
        {
          kind: "official-only",
          text: "Whether the office serves foreigners at a particular counter or during particular hours.",
        },
        {
          kind: "official-only",
          text: "Whether a licence is collected the same day or posted later.",
        },
        {
          kind: "official-only",
          text: "Whether any part of your case can be completed online today.",
        },
      ],
    },
    {
      heading: "What this service cannot tell you",
      lead: "This site is independent of the Department of Land Transport and handles no personal case.",
      claims: [
        FEED_CONTENT_CLAIM,
        {
          kind: "proven",
          text: "This project holds no personal record: no application status, no licence number, no appointment of yours. It reads public availability and shows it with its timestamp.",
        },
        {
          kind: "official-only",
          text: "Anything about your own file, your own eligibility, or a decision an officer has already taken.",
        },
      ],
    },
  ],
};

export const PROCESS_JOURNEYS: readonly Journey[] = [
  TESTS_AND_EXAMS,
  THEORY_TEST,
  PRACTICAL_TEST,
  APTITUDE_TEST,
  E_LEARNING_COURSE,
  MEDICAL_CERTIFICATE,
  RESIDENCE_CERTIFICATE,
  DOCUMENTS_CHECKLIST,
  COSTS_AND_FEES,
  PROCESSING_TIME,
  DRIVING_IN_THAILAND_RULES,
  FOREIGNER_FAQ,
];
