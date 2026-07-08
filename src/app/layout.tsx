import type { Metadata, Viewport } from "next";
import { Antonio, Geist, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/content";
import "./globals.css";

/**
 * Fonts — v3 cinematic pairing (verified in next/font/google font-data).
 *  - Antonio:  condensed grotesque (variable wght 100–700). UPPERCASE display
 *              only — the dark-cinematic agency register (reference: elypt.io).
 *  - Geist:    Vercel's Swiss grotesque, built for dark developer-tooling UIs.
 *              Body + UI (unchanged, matches the SutazStays template).
 *  - JetBrains Mono: technical numerals (ROI counter, code, stats).
 */
const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-display",
  // display:"swap" + preload:true + adjustFontFallback:true (default) → the
  // font is fetched high-priority and the auto-generated fallback @font-face
  // matches its metrics so any swap is shift-free. (Residual CLS in headless
  // test envs comes from the fallback's local() candidates not resolving; the
  // @font-face override in globals.css widens the local() list — its metric
  // numbers MUST mirror the build-emitted "Antonio Fallback" values.)
  display: "swap",
  preload: true,
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sutaz.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — Enterprise-Grade Workflow Automation for Canadian Business`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "We design, deploy, and maintain custom cloud automation engines and internal tools for Canadian Real Estate, Construction, and High-Scale Agency operations.",
  keywords: [
    "workflow automation",
    "Canadian automation agency",
    "real estate automation",
    "construction document processing",
    "agency onboarding automation",
    "QuickBooks automation",
    "Realtor.ca lead automation",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: SITE.name,
    title: `${SITE.name} — Enterprise-Grade Workflow Automation`,
    description:
      "Custom cloud automation engines for Canadian Real Estate, Construction, and High-Scale Agency operations.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Enterprise-Grade Workflow Automation`,
    description:
      "Custom cloud automation engines for Canadian Real Estate, Construction, and High-Scale Agency operations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-CA"
      className={`${antonio.variable} ${geist.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-navy-500">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
