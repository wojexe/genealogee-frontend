import { expect, test } from "@playwright/test";

test("index page has expected h1", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByText("About us")).toBeVisible();
});
