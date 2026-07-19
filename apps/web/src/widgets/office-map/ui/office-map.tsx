"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import type {
  GeoPrecision,
  MapAvailabilityResult,
  MapAvailabilityStatus,
  Office,
} from "@/entities/dlt";
import { officeGeoById, officeGeoDataset } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

// Thailand roughly centered; zoom 6 shows the whole country.
const THAILAND_CENTER: [number, number] = [13.75, 100.5];

const PRECISION_STYLE: Record<GeoPrecision, { dashArray?: string; label: string }> = {
  office: { label: "solid border: exact office location" },
  district: { dashArray: "5 3", label: "dashed border: district-level position" },
  province: { dashArray: "1 4", label: "dotted border: province centroid" },
};

const AVAILABILITY_STYLE: Record<
  MapAvailabilityStatus,
  { color: string; label: string; radius: number; description: string }
> = {
  available: {
    color: "#15803d",
    label: "Available",
    radius: 10,
    description: "stored snapshot has an upcoming available day",
  },
  full: {
    color: "#b91c1c",
    label: "Full",
    radius: 8,
    description: "all upcoming days in the stored snapshot are full",
  },
  no_slots: {
    color: "#a16207",
    label: "No upcoming days",
    radius: 7,
    description: "stored snapshot has no upcoming days",
  },
  not_offered: {
    color: "#6b7280",
    label: "Not offered",
    radius: 6,
    description: "latest stored work-type lookup was empty",
  },
  unknown: {
    color: "#475569",
    label: "Unknown",
    radius: 5,
    description: "no usable stored availability snapshot",
  },
};

type OfficeMapProps = {
  offices: Office[];
  availabilityBySite: ReadonlyMap<number, MapAvailabilityResult>;
  availabilityLoading: boolean;
  availableOnly: boolean;
  keyword: string;
};

export function OfficeMap({
  offices,
  availabilityBySite,
  availabilityLoading,
  availableOnly,
  keyword,
}: OfficeMapProps) {
  const located = offices.flatMap((office) => {
    const geo = officeGeoById.get(office.sit_id);
    if (!geo) return [];
    const availability = availabilityBySite.get(office.sit_id);
    const status = availability?.status ?? "unknown";
    return !availableOnly || status === "available" ? [{ office, geo, availability, status }] : [];
  });
  const unlocated = offices.filter((office) => !officeGeoById.has(office.sit_id));

  return (
    <div className="office-map tw:flex tw:flex-col tw:gap-3">
      <div className="office-map__canvas tw:overflow-hidden tw:rounded-xl tw:border tw:border-border">
        <MapContainer
          center={THAILAND_CENTER}
          zoom={6}
          scrollWheelZoom
          className="office-map__map tw:h-[70vh] tw:w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {located.map(({ office, geo, availability, status }) => {
            const statusStyle = AVAILABILITY_STYLE[status];
            return (
              <CircleMarker
                key={office.sit_id}
                center={[geo.lat, geo.lon]}
                radius={statusStyle.radius}
                pathOptions={{
                  className: `office-map__marker office-map__marker--${status} office-map__marker--${geo.precision}`,
                  color: "#111827",
                  dashArray: PRECISION_STYLE[geo.precision].dashArray,
                  fillColor: statusStyle.color,
                  fillOpacity: availabilityLoading ? 0.45 : 0.82,
                  weight: 2,
                }}
              >
                <Popup className="office-map__popup">
                  <span className="office-map__popup-name tw:block tw:font-medium">
                    {office.sit_name}
                  </span>
                  <span className="office-map__popup-precision tw:mt-1 tw:block tw:text-xs tw:text-muted-foreground">
                    {PRECISION_STYLE[geo.precision].label}
                  </span>
                  <span className="office-map__popup-status tw:mt-2 tw:block tw:text-sm tw:font-medium">
                    Status: {statusStyle.label}
                  </span>
                  <span className="office-map__popup-status-detail tw:block tw:text-xs tw:text-muted-foreground">
                    {availability?.first_available
                      ? `${availability.first_available.date}: ${availability.first_available.message}`
                      : statusStyle.description}
                  </span>
                  <span className="office-map__popup-freshness tw:mt-1 tw:block tw:text-xs tw:text-muted-foreground">
                    {formatAvailabilityFreshness(availability)}
                  </span>
                  <Link
                    href={`/calendar?siteId=${office.sit_id}&keyword=${encodeURIComponent(keyword)}`}
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "office-map__popup-open tw:mt-2 tw:rounded-full",
                    )}
                  >
                    Open calendar
                  </Link>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      <div className="office-map__legend tw:flex tw:flex-col tw:gap-2 tw:text-xs tw:text-muted-foreground">
        <ul className="office-map__availability-legend tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          {(Object.keys(AVAILABILITY_STYLE) as MapAvailabilityStatus[]).map((status) => (
            <li key={status} className="office-map__legend-item tw:flex tw:items-center tw:gap-1.5">
              <span
                aria-hidden="true"
                className="office-map__legend-dot tw:inline-block tw:rounded-full tw:border-2 tw:border-slate-900"
                style={{
                  backgroundColor: AVAILABILITY_STYLE[status].color,
                  height: AVAILABILITY_STYLE[status].radius + 4,
                  width: AVAILABILITY_STYLE[status].radius + 4,
                }}
              />
              {AVAILABILITY_STYLE[status].label}
            </li>
          ))}
        </ul>
        <ul className="office-map__precision-legend tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          {(Object.keys(PRECISION_STYLE) as GeoPrecision[]).map((precision) => (
            <li
              key={precision}
              className="office-map__legend-item tw:flex tw:items-center tw:gap-1.5"
            >
              <span
                aria-hidden="true"
                className="office-map__legend-line tw:inline-block tw:w-5 tw:border-t-2 tw:border-slate-900"
                style={{
                  borderTopStyle:
                    precision === "office"
                      ? "solid"
                      : precision === "district"
                        ? "dashed"
                        : "dotted",
                }}
              />
              {PRECISION_STYLE[precision].label}
            </li>
          ))}
          <li className="office-map__attribution tw:ml-auto">
            Geocoding &copy; OpenStreetMap contributors (ODbL), generated{" "}
            {officeGeoDataset.generated_at.slice(0, 10)}
          </li>
        </ul>
      </div>

      {unlocated.length > 0 && (
        <p className="office-map__unlocated tw:text-xs tw:text-muted-foreground">
          Not on the map yet: {unlocated.map((office) => office.sit_name).join(", ")}
        </p>
      )}
    </div>
  );
}

function formatAvailabilityFreshness(availability: MapAvailabilityResult | undefined): string {
  if (!availability) return "No stored work-type lookup yet";
  const value = availability.slots_fetched_at ?? availability.work_types_fetched_at;
  const date = new Date(value);
  const formatted = Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  return availability.slots_fetched_at
    ? `Slots stored ${formatted}`
    : `Work types stored ${formatted}; no usable slot snapshot`;
}
