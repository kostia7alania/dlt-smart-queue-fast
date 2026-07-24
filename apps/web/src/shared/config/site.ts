export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "DLT Smart Queue Fast";

export const PUBLIC_SITE_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "http://localhost:3000";
