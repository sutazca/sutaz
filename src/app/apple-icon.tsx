import { ImageResponse } from "next/og";

/**
 * apple-icon.tsx — Apple Touch Icon (180×180) generated at build time.
 *
 * Apple's home-screen icons are opaque 180×180 squares (no transparency, no
 * radius — iOS applies its own mask). This renders the "S" mark at higher
 * fidelity than the 32px PNG favicon: larger glyph, more generous padding,
 * same teal-gradient tile so it reads as the same brand identity on the
 * iOS home screen.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
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
