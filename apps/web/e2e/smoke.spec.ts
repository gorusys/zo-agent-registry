import { test, expect } from "@playwright/test";

test.describe("Registry", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Zo Agent Registry/i })).toBeVisible();
  });

  test("browse page loads", async ({ page }) => {
    await page.goto("/browse");
    await expect(page.getByRole("heading", { name: /Browse agents/i })).toBeVisible();
  });

  test("docs page loads", async ({ page }) => {
    await page.goto("/docs");
    await expect(page.getByRole("heading", { name: /Documentation/i })).toBeVisible();
  });

  test("submit page has form", async ({ page }) => {
    await page.goto("/submit");
    await expect(page.getByRole("heading", { name: /Submit an agent/i })).toBeVisible();
    await expect(page.getByLabel(/Manifest JSON/i)).toBeVisible();
  });
});
