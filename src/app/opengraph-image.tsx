import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

/**
 * opengraph-image.tsx — default Open Graph / Twitter card (1200×630).
 *
 * Generated at build time (statically optimized — no request-time APIs). Before
 * this file existed, the site had NO OG image, so every link preview on Slack,
 * LinkedIn, iMessage, etc. rendered as a bare URL. This is the single biggest
 * brand-visibility fix in Phase 1.
 *
 * Design: the Engineering-Luxury system on a card — near-black navy bg, the
 * Engineered S mark top-left, the headline value-prop, teal accent rule, mono
 * eyebrow. Fraunces for the headline (loaded at build from the verified Google
 * Fonts repo URL), system sans for the rest.
 *
 * Verified facts:
 *  - ImageResponse API: next/og, flexbox + subset of CSS (Satori), 500KB bundle
 *    cap.
 *  - Font: STATIC Fraunces 700 (latin-700-normal.ttf from fontsource/jsDelivr),
 *    NOT the variable TTF. Verified root cause: @vercel/og's font parser
 *    (`parseFvarAxis`) crashes on Fraunces' variable axes (SOFT/WONK) —
 *    `TypeError: Cannot read properties of undefined (reading '256')`. Static
 *    instance (36KB, no fvar table) is Satori-safe.
 *  - Twitter image cap 5MB, OG cap 8MB — PNG output is ~30-150KB.
 */
export const alt = `${SITE.name} — Enterprise-Grade Workflow Automation for Canadian Business`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const frauncesData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-700-normal.ttf",
    { next: { revalidate: 604800 } } // cache 7 days — font barely changes
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #050810 0%, #0a0e1a 60%, #0d1220 100%)",
          padding: "72px",
          fontFamily: "Fraunces",
          position: "relative",
        }}
      >
        {/* Engineering grid texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Teal aura glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(13,148,136,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Top: logo mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Engineered S mark (SVG not supported in Satori — composed from divs) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0d9488, #0f766e)",
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#ffffff", letterSpacing: -0.5 }}>
              Sutaz Automation
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#2dd4bf",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              automation
            </div>
          </div>
        </div>

        {/* Middle: headline value prop */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 3, background: "#2dd4bf" }} />
            <div style={{ fontSize: 15, color: "#94a3b8", letterSpacing: 4, textTransform: "uppercase" }}>
              Canadian B2B Automation
            </div>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: -1.2,
            }}
          >
            Enterprise-grade workflows that eliminate admin bottlenecks.
          </div>
          <div style={{ fontSize: 23, color: "#94a3b8", lineHeight: 1.4, maxWidth: 880 }}>
            Custom cloud automation engines for Real Estate, Construction, and
            High-Scale Agency operations.
          </div>
        </div>

        {/* Bottom: proof stats */}
        <div style={{ display: "flex", gap: 56 }}>
          {[
            { v: "99.8%", l: "PARSE PRECISION" },
            { v: "120s", l: "LEAD RESPONSE" },
            { v: "30-day", l: "ROLLOUT" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#2dd4bf" }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "#64748b", letterSpacing: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: frauncesData,
          weight: 700,
          style: "normal" as const,
        },
      ],
    }
  );
}
