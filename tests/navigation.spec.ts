import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/book",
  "/artists",
  "/styles",
  "/realism",
  "/chicano",
  "/fine-line",
  "/anime",
  "/fluid-line",
  "/ornamental",
  "/freehand",
  "/minimal",
  "/botanical",
  "/about",
  "/faq",
  "/guests",
  "/contact",
  "/terms",
];

for (const path of PAGES) {
  test(`${path} loads without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    expect(errors, `Console errors on ${path}: ${errors.join(", ")}`).toEqual([]);
  });
}

test("404 page shows for unknown route", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  await page.waitForTimeout(1000);
  await expect(page.getByText("404")).toBeVisible();
});