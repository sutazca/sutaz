import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for sutaz.ca E2E.
 * Tests run against the PRODUCTION standalone server (port 3999), NOT the dev
 * server. The dev server (Turbopack compile-on-demand) cannot sustain parallel
 * test load and times out. The production server serves instantly. Start it
 * before the run: PORT=3999 HOSTNAME=127.0.0.1 node .next/standalone/server.js
 * (after copying .next/static → .next/standalone/.next/static per Next.js docs).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Performance tests measure Core Web Vitals, which race font-load timing.
  // Running them single-threaded eliminates CPU contention that causes false
  // CLS failures (the site's real CLS is ~0.003-0.046 — verified in isolation).
  workers: process.env.CI ? 1 : 2,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: "http://127.0.0.1:3999",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    // Use domcontentloaded — the 'load' event waits on long-polling/HMR sockets
    // and is unreliable. DCL fires as soon as the DOM is parseable.
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Desktop project must NOT run mobile-specific tests.
      testIgnore: /mobile\.spec\.ts/,
    },
    // Cross-browser: run the core functional suite on Firefox + WebKit.
    // Scoped to site.spec.ts (the browser-dependent E2E) — unit/API/SEO tests
    // are browser-independent and already covered by chromium.
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: /site\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: /site\.spec\.ts/,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      // Mobile project runs ONLY mobile tests.
      testMatch: /mobile\.spec\.ts/,
    },
  ],
});
