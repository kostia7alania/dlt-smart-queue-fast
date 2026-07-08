"use client";

import Link from "next/link";
import { useState } from "react";
import { type DLTStep, StepCard } from "@/features/dlt-step-runner";
import { API_BASE } from "@/shared/config/api";
import { Badge } from "@/shared/ui/badge";
import { Card, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type ParamField = {
  key: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function PlaygroundPage() {
  const [siteId, setSiteId] = useState("47");
  const [groupId, setGroupId] = useState("4");
  const [keyword, setKeyword] = useState(" NEW THAI");
  const [workTypeId, setWorkTypeId] = useState("111093");
  const [currentDate, setCurrentDate] = useState("2026-04-04");
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [response, setResponse] = useState<JsonValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params: ParamField[] = [
    { key: "siteId", label: "Site ID", value: siteId, onChange: setSiteId },
    { key: "groupId", label: "Group ID", value: groupId, onChange: setGroupId },
    { key: "keyword", label: "Keyword", value: keyword, onChange: setKeyword },
    { key: "workTypeId", label: "Work Type ID", value: workTypeId, onChange: setWorkTypeId },
    { key: "currentDate", label: "Current Date", value: currentDate, onChange: setCurrentDate },
  ];

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
          groupId,
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
          currentDate,
        )}`,
      disabled: () => workTypeId.trim() === "" || currentDate.trim() === "",
    },
  ];

  const snapshotSteps: DLTStep[] = [
    {
      id: "snapshot-offices",
      title: "Last offices",
      description: "GET /v1/dlt/snapshots/offices",
      endpoint: () => "/v1/dlt/snapshots/offices",
    },
    {
      id: "snapshot-work-types",
      title: "Last work types",
      description: "GET /v1/dlt/snapshots/work-types?siteId=...&groupId=...&keyword=...",
      endpoint: () =>
        `/v1/dlt/snapshots/work-types?siteId=${encodeURIComponent(siteId)}&groupId=${encodeURIComponent(
          groupId,
        )}&keyword=${encodeURIComponent(keyword)}`,
    },
    {
      id: "snapshot-slots",
      title: "Last slot snapshot",
      description: "GET /v1/dlt/snapshots/slots?workTypeId=...",
      endpoint: () => `/v1/dlt/snapshots/slots?workTypeId=${encodeURIComponent(workTypeId)}`,
      disabled: () => workTypeId.trim() === "",
    },
    {
      id: "fetches",
      title: "Fetch log",
      description: "GET /v1/dlt/fetches?limit=20",
      endpoint: () => "/v1/dlt/fetches?limit=20",
    },
  ];

  // Snapshot responses carry a fetched_at timestamp; surface it as freshness.
  const responseFetchedAt = (() => {
    if (!response || typeof response !== "object" || Array.isArray(response)) return null;
    const data = (response as { [key: string]: JsonValue }).data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;
    const fetchedAt = (data as { [key: string]: JsonValue }).fetched_at;
    return typeof fetchedAt === "string" ? fetchedAt : null;
  })();

  const runStep = async (step: DLTStep) => {
    setLoadingStep(step.id);
    setError(null);
    setResponse(null);

    try {
      const endpoint = step.endpoint();
      const res = await fetch(`${API_BASE}${endpoint}`);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResponse({ endpoint, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingStep(null);
    }
  };

  return (
    <main className="dlt-playground tw:min-h-screen tw:bg-background tw:p-6 tw:text-foreground tw:md:p-10">
      <div className="dlt-playground__container tw:mx-auto tw:flex tw:w-full tw:max-w-6xl tw:flex-col tw:gap-8">
        <div className="dlt-playground__header tw:flex tw:flex-col tw:gap-4 tw:md:flex-row tw:md:items-end tw:md:justify-between">
          <div>
            <Link
              href="/"
              className="dlt-playground__back tw:text-sm tw:font-medium tw:text-primary tw:underline"
            >
              &larr; Back to Home
            </Link>
            <h1 className="dlt-playground__title tw:mt-4 tw:text-3xl tw:font-bold">
              DLT API Playground
            </h1>
            <p className="dlt-playground__subtitle tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-muted-foreground">
              Run the read-only DLT Smart Queue lookup chain and inspect raw JSON responses.
            </p>
          </div>
          <Card className="dlt-playground__api-base tw:gap-0.5 tw:px-4 tw:py-3 tw:text-sm">
            <span className="tw:text-xs tw:uppercase tw:tracking-wide tw:text-muted-foreground">
              API base
            </span>
            <span className="tw:font-mono">{API_BASE}</span>
          </Card>
        </div>

        <Card className="dlt-playground__params tw:grid tw:gap-4 tw:p-5 tw:md:grid-cols-5">
          {params.map((param) => (
            <label
              key={param.key}
              htmlFor={`param-${param.key}`}
              className="dlt-playground__param tw:flex tw:flex-col tw:gap-2 tw:text-sm"
            >
              <span className="tw:font-medium">{param.label}</span>
              <Input
                id={`param-${param.key}`}
                value={param.value}
                onChange={(event) => param.onChange(event.target.value)}
                className="tw:font-mono"
              />
            </label>
          ))}
        </Card>

        <section className="dlt-playground__steps tw:grid tw:gap-4 tw:md:grid-cols-2 tw:xl:grid-cols-3">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              loading={loadingStep === step.id}
              disabled={step.disabled?.() || loadingStep !== null}
              onRun={runStep}
            />
          ))}
        </section>

        <Card className="dlt-playground__snapshots tw:gap-3 tw:p-5">
          <CardHeader className="tw:flex tw:flex-row tw:items-center tw:justify-between tw:p-0">
            <CardTitle>Snapshots &amp; freshness</CardTitle>
            <span className="tw:text-xs tw:text-muted-foreground">
              Stored in PostgreSQL by previous live fetches; no upstream calls.
            </span>
          </CardHeader>
          <div className="dlt-playground__snapshot-steps tw:grid tw:gap-4 tw:md:grid-cols-2 tw:xl:grid-cols-4">
            {snapshotSteps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                tone="snapshot"
                loading={loadingStep === step.id}
                disabled={step.disabled?.() || loadingStep !== null}
                onRun={runStep}
              />
            ))}
          </div>
        </Card>

        <Card className="dlt-playground__response tw:gap-3 tw:p-5">
          <CardHeader className="tw:flex tw:flex-row tw:items-center tw:justify-between tw:p-0">
            <CardTitle>Response</CardTitle>
            <span className="tw:text-xs tw:text-muted-foreground">
              Raw values are displayed without label normalization.
            </span>
          </CardHeader>

          {error && (
            <div className="dlt-playground__error tw:rounded-md tw:bg-destructive/10 tw:p-4 tw:text-sm tw:text-destructive">
              {error}
            </div>
          )}

          {!error && !response && (
            <div className="dlt-playground__placeholder tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm tw:text-muted-foreground">
              Run a step to see JSON here.
            </div>
          )}

          {response && (
            <>
              {responseFetchedAt && (
                <Badge variant="secondary" className="dlt-playground__freshness tw:self-start">
                  Fetched at {new Date(responseFetchedAt).toLocaleString()}
                </Badge>
              )}
              <pre className="dlt-playground__json tw:max-h-[560px] tw:overflow-auto tw:rounded-md tw:bg-muted tw:p-4 tw:text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
