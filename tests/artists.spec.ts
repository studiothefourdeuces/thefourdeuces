import { test, expect } from "@playwright/test";

test("artist works lightbox opens and closes", async ({ page }) => {
  await page.goto("/artists");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  const firstWork = page.locator("main section button").filter({ has: page.locator("img, video") }).first();
  await expect(firstWork).toBeVisible({ timeout: 10000 });
  await firstWork.click();

  const closeButton = page.getByRole("button", { name: /close/i });
  await expect(closeButton).toBeVisible({ timeout: 10000 });
  await closeButton.click();
  await expect(closeButton).not.toBeVisible();
});

test("switching between artists updates content", async ({ page }) => {
  await page.goto("/artists");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await expect(page.getByRole("heading", { name: "Max", exact: true })).toBeVisible({ timeout: 10000 });

  await page
    .getByRole("button", { name: "Eugene", exact: true })
    .first()
    .evaluate((el) => (el as HTMLElement).click());

  await expect(page.getByRole("heading", { name: "Eugene", exact: true })).toBeVisible({ timeout: 10000 });
});