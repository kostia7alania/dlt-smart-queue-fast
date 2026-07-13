"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

import type { GeoPrecision, Office } from "@/entities/dlt";
import { officeGeoById, officeGeoDataset } from "@/entities/dlt";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

// Thailand roughly centered; zoom 6 shows the whole country.
const THAILAND_CENTER: [number, number] = [13.75, 100.5];

const PRECISION_STYLE: Record<GeoPrecision, { color: string; label: string }> = {
  office: { color: "#2563eb", label: "exact office location" },
  district: { color: "#f59e0b", label: "district-level position" },
  province: { color: "#9ca3af", label: "province centroid" },
};

type OfficeMapProps = {
  offices: Office[];
};

export function OfficeMap({ offices }: OfficeMapProps) {
  const located = offices.flatMap((office) => {
    const geo = officeGeoById.get(office.sit_id);
    return geo ? [{ office, geo }] : [];
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
          {located.map(({ office, geo }) => (
            <CircleMarker
              key={office.sit_id}
              center={[geo.lat, geo.lon]}
              radius={7}
              pathOptions={{
                className: `office-map__marker office-map__marker--${geo.precision}`,
                color: PRECISION_STYLE[geo.precision].color,
                fillColor: PRECISION_STYLE[geo.precision].color,
                fillOpacity: 0.75,
                weight: 1.5,
              }}
            >
              <Popup className="office-map__popup">
                <span className="office-map__popup-name tw:block tw:font-medium">
                  {office.sit_name}
                </span>
                <span className="office-map__popup-precision tw:mt-1 tw:block tw:text-xs tw:text-muted-foreground">
                  {PRECISION_STYLE[geo.precision].label}
                </span>
                <Link
                  href={`/calendar?siteId=${office.sit_id}`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "office-map__popup-open tw:mt-2 tw:rounded-full",
                  )}
                >
                  Open calendar
                </Link>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <div className="office-map__legend tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-xs tw:text-muted-foreground">
        {(Object.keys(PRECISION_STYLE) as GeoPrecision[]).map((precision) => (
          <span
            key={precision}
            className="office-map__legend-item tw:flex tw:items-center tw:gap-1.5"
          >
            <span
              aria-hidden
              className="office-map__legend-dot tw:inline-block tw:size-3 tw:rounded-full"
              style={{ backgroundColor: PRECISION_STYLE[precision].color }}
            />
            {PRECISION_STYLE[precision].label}
          </span>
        ))}
        <span className="office-map__attribution tw:ml-auto">
          Geocoding &copy; OpenStreetMap contributors (ODbL), generated{" "}
          {officeGeoDataset.generated_at.slice(0, 10)}
        </span>
      </div>

      {unlocated.length > 0 && (
        <p className="office-map__unlocated tw:text-xs tw:text-muted-foreground">
          Not on the map yet: {unlocated.map((office) => office.sit_name).join(", ")}
        </p>
      )}
    </div>
  );
}
