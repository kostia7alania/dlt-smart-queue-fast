import { ImageResponse } from "next/og";
import { INDEPENDENCE_NOTICE, SITE_NAME } from "@/shared/config/site";
import { BrandMark, INK, MUTED, PAPER } from "./apple-icon";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;
// `output: "export"` refuses to prerender an image route unless it says so.
export const dynamic = "force-static";

// The headline and the line under it are read from the site config, so a rename
// or a reworded notice reships correct share cards without touching this file.
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        padding: "88px 96px",
        backgroundColor: PAPER,
      }}
    >
      <BrandMark size={148} />
      <div
        style={{
          marginTop: 56,
          fontSize: 88,
          lineHeight: 1.05,
          letterSpacing: -2,
          color: INK,
        }}
      >
        {SITE_NAME}
      </div>
      <div
        style={{
          marginTop: 28,
          maxWidth: 880,
          fontSize: 34,
          lineHeight: 1.4,
          color: MUTED,
        }}
      >
        {INDEPENDENCE_NOTICE}
      </div>
    </div>,
    { ...size },
  );
}
