import { test, expect } from "@playwright/test";

/**
 * ContactForm — /contact written-request form.
 *
 * The e2e server runs WITHOUT a database (documented fail-closed contract in
 * api.spec.ts), so a valid submission here reaches the real route, really
 * fails to persist (503), and MUST surface the honest failure copy — this
 * suite deliberately tests the truthful-failure UI, not a mocked success.
 */

test.describe("contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("renders all fields and the submit button", async ({ page }) => {
    for (const label of [
      "Company",
      "Your name",
      "Email",
      "Phone (optional)",
      "Industry",
      "What to automate?",
      "Message (optional)",
    ]) {
      await expect(page.getByLabel(label, { exact: false })).toBeAttached();
    }
    await expect(
      page.getByRole("button", { name: "Send request" }),
    ).toBeVisible();
  });

  test("empty submit shows inline errors and sends no request", async ({
    page,
  }) => {
    let posted = false;
    page.on("request", (req) => {
      if (req.url().includes("/api/leads")) posted = true;
    });
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByRole("alert").first()).toBeVisible();
    expect(posted).toBe(false);
  });

  test("invalid email shows its inline error", async ({ page }) => {
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.locator("#contact_email-error")).toBeVisible();
  });

  test("valid submission surfaces the honest failure state without a DB", async ({
    page,
  }) => {
    await page.getByLabel("Company").fill("Test Corp");
    await page.getByLabel("Your name").fill("Test Person");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Industry").fill("Real Estate");
    await page.getByLabel("What to automate?").fill("Lead routing");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(
      page.getByText("We couldn't save your request", { exact: false }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
