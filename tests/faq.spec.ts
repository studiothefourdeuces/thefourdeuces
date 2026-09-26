import { test, expect } from "@playwright/test";

test("FAQ accordion opens and closes", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  const firstQuestion = page.locator("details summary").first();
  await expect(firstQuestion).toBeVisible();

  const firstDetails = page.locator("details").first();
  await expect(firstDetails).not.toHaveAttribute("open", "");

  await firstQuestion.click();
  await expect(firstDetails).toHaveAttribute("open", "");

  await firstQuestion.click();
  await expect(firstDetails).not.toHaveAttribute("open", "");
});

test("FAQ download links are present", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  const links = page.locator('a[download]');
  await expect(links).toHaveCount(2);
});