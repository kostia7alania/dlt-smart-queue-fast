// The Twitter card is the same 1200x630 composition as the Open Graph image;
// re-exporting keeps a single source for the share card.
export { alt, contentType, default, size } from "./opengraph-image";

// Next infers staticness from the module itself, and a pure re-export defeats
// that inference, so `output: "export"` needs it declared here.
export const dynamic = "force-static";
