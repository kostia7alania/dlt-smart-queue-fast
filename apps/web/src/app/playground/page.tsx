"use client";

import { useState } from "react";
import Link from "next/link";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type DLTStep = {
  id: string;
  title: string;
  description: string;
  endpoint: () => string;
  disabled?: () => boolean;
};

export default function Playground() {
  const [siteId, setSiteId] = useState("47");
  const [groupId, setGroupId] = useState("4");
  const [keyword, setKeyword] = useState(" NEW THAI");
  const [workTypeId, setWorkTypeId] = useState("111093");
  const [currentDate, setCurrentDate] = useState("2026-04-04");
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [response, setResponse] = useState<JsonValue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const steps: DLTStep[] = [
    {
      id: "offices",
      title: "1. Load offices",
      description: "GET /v1/dlt/offices",
      endpoint: () => "/v1/dlt/offices",
    },
    {
      id: "work",
      title: "2. Load work availability",
      description: "GET /v1/dlt/offices/{siteId}/work-availability",
      endpoint: () => `/v1/dlt/offices/${encodeURIComponent(siteId)}/work-availability`,
      disabled: () => siteId.trim() === "",
    },
    {
      id: "vehicles",
      title: "3. Load vehicle types",
      description: "GET /v1/dlt/vehicles",
      endpoint: () => "/v1/dlt/vehicles",
    },
    {
      id: "work-types",
      title: "4. Resolve work types",
      description: "GET /v1/dlt/work-types?siteId=...&groupId=...&keyword=...",
      endpoint: () =>
        `/v1/dlt/work-types?siteId=${encodeURIComponent(siteId)}&groupId=${encodeURIComponent(
          groupId
        )}&keyword=${encodeURIComponent(keyword)}`,
      disabled: () => siteId.trim() === "" || groupId.trim() === "" || keyword === "",
    },
    {
      id: "holidays",
      title: "5. Load holidays",
      description: "GET /v1/dlt/work-types/{workTypeId}/holidays",
      endpoint: () => `/v1/dlt/work-types/${encodeURIComponent(workTypeId)}/holidays`,
      disabled: () => workTypeId.trim() === "",
    },
    {
      id: "slots",
      title: "6. Load slots",
      description: "GET /v1/dlt/work-types/{workTypeId}/slots?currentDate=...",
      endpoint: () =>
        `/v1/dlt/work-types/${encodeURIComponent(workTypeId)}/slots?currentDate=${encodeURIComponent(
          currentDate
        )}`,
      disabled: () => workTypeId.trim() === "" || currentDate.trim() === "",
    },
  ];

  const runStep = async (step: DLTStep) => {
    setLoadingStep(step.id);
    setError(null);
    setResponse(null);

    try {
      const endpoint = step.endpoint();
      const res = await fetch(`${apiBase}${endpoint}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse({
        endpoint,
        data,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingStep(null);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 md:p-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-sm font-medium text-blue-600 underline dark:text-blue-400">
              &larr; Back to Home
            </Link>
            <h1 className="mt-4 text-3xl font-bold">DLT API Playground</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Run the read-only DLT Smart Queue lookup chain and inspect raw JSON responses.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="block text-xs uppercase tracking-wide text-zinc-500">API base</span>
            <span className="font-mono">{apiBase}</span>
          </div>
        </div>

        <section className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:grid-cols-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Site ID</span>
            <input
              value={siteId}
              onChange={(event) => setSiteId(event.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 font-mono dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Group ID</span>
            <input
              value={groupId}
              onChange={(event) => setGroupId(event.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 font-mono dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Keyword</span>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 font-mono dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Work Type ID</span>
            <input
              value={workTypeId}
              onChange={(event) => setWorkTypeId(event.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 font-mono dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium">Current Date</span>
            <input
              value={currentDate}
              onChange={(event) => setCurrentDate(event.target.value)}
              className="rounded-md border border-zinc-300 bg-transparent px-3 py-2 font-mono dark:border-zinc-700"
            />
          </label>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => {
            const disabled = step.disabled?.() || loadingStep !== null;
            return (
              <button
                key={step.id}
                type="button"
                disabled={disabled}
                onClick={() => runStep(step)}
                className="rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <span className="block text-lg font-semibold">{step.title}</span>
                <span className="mt-2 block break-all font-mono text-xs text-zinc-600 dark:text-zinc-400">
                  {step.description}
                </span>
                <span className="mt-4 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  {loadingStep === step.id ? "Loading..." : "Run"}
                </span>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Response</h2>
            <span className="text-xs text-zinc-500">
              Raw values are displayed without label normalization.
            </span>
          </div>

          {error && (
            <div className="rounded-md bg-red-100 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {!error && !response && (
            <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Run a step to see JSON here.
            </div>
          )}

          {response && (
            <pre className="max-h-[560px] overflow-auto rounded-md bg-zinc-100 p-4 text-sm dark:bg-zinc-950">
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </main>
  );
}
