import { SITE_NAME } from "@/shared/config/site";

export const EVIDENCE_SOURCES = [
  {
    key: "live",
    label: "Live response",
    summary: "Received from the DLT service during the action you just started.",
    boundary:
      "It is a point-in-time response, not a held or reserved appointment, and it can change before booking.",
  },
  {
    key: "stored",
    label: "Stored observation",
    summary: `A previous successful response read from the PostgreSQL history of ${SITE_NAME}.`,
    boundary:
      "Read the displayed observation time. Stored evidence is not a current check or a promise that the state persists.",
  },
] as const;

export const AVAILABILITY_STATES = [
  {
    key: "available",
    label: "Available",
    anchor: "status-available",
    appearsIn: "Map and History",
    condition: "At least one returned day in scope has an exact DLT message different from เต็ม.",
    safeConclusion: "An observed payload contained at least one day not marked full.",
    unsafeConclusion: "The day is reserved, guaranteed, or still bookable now.",
  },
  {
    key: "full",
    label: "Full",
    anchor: "status-full",
    appearsIn: "Map and History",
    condition: "Returned days in scope exist and every exact DLT message is เต็ม.",
    safeConclusion: "Every in-scope day in that observation carried the full marker.",
    unsafeConclusion: "The office will remain full or has no other service path.",
  },
  {
    key: "no_slots",
    label: "No upcoming days",
    anchor: "status-no-slots",
    appearsIn: "Map and History",
    condition:
      "The stored slot payload has no days in scope; on Map, that means none on or after the selected current date.",
    safeConclusion: "That observation contains no matching upcoming day rows.",
    unsafeConclusion: "The office is closed, unsupported, or will not release more dates.",
  },
  {
    key: "not_offered",
    label: "Not offered",
    anchor: "status-not-offered",
    appearsIn: "Map",
    condition:
      "The latest complete stored work-type lookup is empty for the selected New or Renew option.",
    safeConclusion: "The selected option did not return a work type in that stored lookup.",
    unsafeConclusion:
      "DLT has ruled that you are ineligible or the office never handles the service.",
  },
  {
    key: "unknown",
    label: "Unknown",
    anchor: "status-unknown",
    appearsIn: "Map",
    condition: "A work type is known, but no usable stored slot payload exists.",
    safeConclusion: `${SITE_NAME} does not have enough stored evidence to summarize the office.`,
    unsafeConclusion: "No appointment is available.",
  },
] as const;

export const MAP_PRECISIONS = [
  {
    key: "office",
    label: "Office point",
    definition: "An exact office point-of-interest match in the committed geodata.",
  },
  {
    key: "district",
    label: "District anchor",
    definition: "A district-level fallback when an exact office point was not established.",
  },
  {
    key: "province",
    label: "Province anchor",
    definition: "A province-centroid fallback when a more precise match was not established.",
  },
] as const;

export const TOOL_EVIDENCE = [
  {
    key: "calendar",
    label: "Calendar",
    question: "What did one office return?",
    behaviour:
      "Tries the DLT service for one office and its first matching work type, with visible stored fallback for work types or slots.",
    href: "/calendar",
  },
  {
    key: "compare",
    label: "Compare",
    question: "Which of up to eight offices has the earliest observed day?",
    behaviour:
      "Checks offices sequentially, can reuse stored data up to ten minutes old, then tries live and isolates per-office fallbacks or errors.",
    href: "/compare",
  },
  {
    key: "map",
    label: "Map",
    question: "What last-known evidence exists nearby?",
    behaviour:
      "The availability overlay is stored-only. Loading or filtering it never fans out live DLT requests.",
    href: "/map",
  },
  {
    key: "history",
    label: "History",
    question: "How have stored observations changed?",
    behaviour:
      "History rows come only from PostgreSQL. Resolving the selected work type can still use the normal live-with-stored-fallback lookup first.",
    href: "/history",
  },
] as const;

export const EVIDENCE_WORKFLOW = [
  {
    number: "01",
    title: "Check the source",
    description: "Start with live or stored; the same status carries different freshness context.",
  },
  {
    number: "02",
    title: "Check the time",
    description: "For stored evidence, read when it was observed before comparing offices.",
  },
  {
    number: "03",
    title: "Read the exact state",
    description: "Use the definition, especially when the state is unknown or not offered.",
  },
  {
    number: "04",
    title: "Inspect an alternative",
    description: "Open Calendar, Compare, Map, or History instead of treating one row as final.",
  },
  {
    number: "05",
    title: "Confirm with DLT",
    description: "Verify current availability, eligibility, and booking in the official service.",
  },
] as const;
