import { ImageResponse } from "next/og";

/**
 * icon.tsx — PNG favicon (32×32) generated at build time.
 *
 * SVG favicons (icon.svg, also present) are preferred by modern browsers and
 * scale infinitely, but a PNG fallback guarantees the icon renders in every
 * context (older browsers, some bookmark UIs, link unfurlers that don't parse
 * SVG). The "S" sits in a teal gradient tile — the brand mark at tab scale.
 *
 * Per Next 16 metadata docs: default export returns ImageResponse; size +
 * contentType are config exports. Statically optimized (no request-time APIs).
 * No custom font: at 32px the glyph legibility is the only thing that matters;
 * system default renders crisply and avoids a font-fetch round trip.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
          borderRadius: 7,
          fontSize: 22,
          fontWeight: 700,
          color: "#ffffff",
          letterSpacing: -0.02,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
