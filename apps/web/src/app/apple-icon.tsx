import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/shared/config/site";

/** Warm paper background used across the site. */
export const PAPER = "#f5f1e8";
/** stone-950 */
export const INK = "#0c0a09";
/** stone-600 */
export const MUTED = "#57534e";
/** emerald-600, the same signal colour as the dot in the site header. */
export const ACCENT = "#009966";

type MarkShape = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  fill: string;
};

// These coordinates share the 32-unit grid of icon.svg, so the favicon and every
// generated image draw the identical mark: an ink licence card whose top-right
// corner is bitten out by a paper notch holding the emerald header signal.
const MARK_SHAPES: readonly MarkShape[] = [
  { x: 3.5, y: 9.5, width: 25, height: 14, radius: 3.2, fill: INK },
  { x: 7, y: 12.8, width: 6.4, height: 7.4, radius: 1.8, fill: PAPER },
  { x: 15.6, y: 13.2, width: 8.4, height: 2.4, radius: 1.2, fill: PAPER },
  { x: 15.6, y: 17.4, width: 5.6, height: 2.4, radius: 1.2, fill: PAPER },
  { x: 21.3, y: 3.5, width: 8.6, height: 8.6, radius: 4.3, fill: PAPER },
  { x: 22.75, y: 4.95, width: 5.7, height: 5.7, radius: 2.85, fill: ACCENT },
];

/**
 * The site mark, drawn with plain boxes so it renders identically under Satori
 * (which powers ImageResponse) without shipping a rasterised asset.
 */
export function BrandMark({ size: markSize }: { size: number }) {
  const unit = markSize / 32;

  return (
    <div style={{ position: "relative", display: "flex", width: markSize, height: markSize }}>
      {MARK_SHAPES.map((shape) => (
        <div
          key={`${shape.x}:${shape.y}`}
          style={{
            position: "absolute",
            display: "flex",
            left: shape.x * unit,
            top: shape.y * unit,
            width: shape.width * unit,
            height: shape.height * unit,
            borderRadius: shape.radius * unit,
            backgroundColor: shape.fill,
          }}
        />
      ))}
    </div>
  );
}

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = SITE_NAME;
// `output: "export"` refuses to prerender an image route unless it says so.
export const dynamic = "force-static";

// Full-bleed paper: iOS applies its own corner mask, so the mark is inset
// rather than rounded here.
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: PAPER,
      }}
    >
      <BrandMark size={156} />
    </div>,
    { ...size },
  );
}
