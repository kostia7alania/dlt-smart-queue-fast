export const WORK_KEYWORDS = [" NEW THAI", " RENEW THAI"] as const;

export type WorkKeyword = (typeof WORK_KEYWORDS)[number];

export const DEFAULT_WORK_KEYWORD: WorkKeyword = WORK_KEYWORDS[0];

export function parseWorkKeyword(value: string | null): WorkKeyword {
  return WORK_KEYWORDS.find((keyword) => keyword === value) ?? DEFAULT_WORK_KEYWORD;
}
