const configuredAPIBase = process.env.NEXT_PUBLIC_API_URL?.trim();

// An explicitly empty production value keeps requests on the Worker origin.
// Local development retains the Go API default when the variable is absent.
export const API_BASE =
  configuredAPIBase !== undefined
    ? configuredAPIBase.replace(/\/+$/, "")
    : process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:8080";
