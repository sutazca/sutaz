import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/content";
import "./globals.css";

/**
 * Fonts — self-hosted via next/font (no requests to Google at runtime).
 * Each exposes a CSS variable consumed by the @theme block in globals.css.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
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
      className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
