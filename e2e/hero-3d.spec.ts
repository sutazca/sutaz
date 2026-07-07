import { test, expect } from "@playwright/test";

/**
 * Hero 3D (R3F orb) — layer-architecture contract tests.
 *
 * The hero's guarantee (HeroSection.tsx): the static poster + headline never
 * wait on WebGL; the three.js scene is an idle-deferred progressive
 * enhancement, skipped entirely under prefers-reduced-motion.
 *
 * Canvas-presence assertions are chromium-scoped — headless Firefox/WebKit
 * WebGL support varies by platform; the poster/reduced-motion contracts are
 * browser-independent and run everywhere.
 */

test.describe("hero 3D orb", () => {
  test("poster is the immediate base layer (LCP guarantee)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('img[src*="orb-poster"]')).toBeVisible();
  });

  test("headline never waits on WebGL", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
  });

  test("3D canvas mounts on capable browsers", async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName !== "chromium",
      "headless WebGL only asserted on chromium",
    );
    // ?forceOrb=1 bypasses the hardware-acceleration gate: CI/VM machines
    // render WebGL in software (SwiftShader), where production users get the
    // poster. The override lets e2e verify the real mount path end to end.
    await page.goto("/?forceOrb=1");
    await expect(page.locator("section canvas").first()).toBeAttached({
      timeout: 15_000,
    });
  });

  test("reduced motion renders poster only — no canvas", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Give the idle-mount window time to (not) fire, then assert absence.
    await page.waitForTimeout(3_000);
    await expect(page.locator("section canvas")).toHaveCount(0);
    await expect(page.locator('img[src*="orb-poster"]')).toBeVisible();
  });
});
