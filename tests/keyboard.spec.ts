import { test, expect } from "@playwright/test";

test("burger menu is keyboard-operable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  const menuButton = page.getByRole("button", { name: /open menu/i });
  await menuButton.focus();
  await expect(menuButton).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("dialog", { name: /site menu/i })).toBeVisible({ timeout: 5000 });

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /site menu/i })).not.toBeVisible();
});

test("search overlay is keyboard-operable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Search" }).first().click();
  const input = page.getByPlaceholder(/search/i);
  await expect(input).toBeVisible({ timeout: 5000 });
  await expect(input).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(input).not.toBeVisible();
});

test("tab order reaches primary interactive elements", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  let reachedBookButton = false;
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => document.activeElement?.textContent?.trim());
    if (active?.toLowerCase().includes("book")) {
      reachedBookButton = true;
      break;
    }
  }
  expect(reachedBookButton).toBe(true);
});

test("FAQ accordion is keyboard-operable", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  const firstSummary = page.locator("details summary").first();
  await firstSummary.focus();
  await expect(firstSummary).toBeFocused();
  await page.keyboard.press("Enter");

  const firstDetails = page.locator("details").first();
  await expect(firstDetails).toHaveAttribute("open", "");
});