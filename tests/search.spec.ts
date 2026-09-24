import { test, expect } from "@playwright/test";

test("search finds a style and navigates to it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).first().click();

  const input = page.getByPlaceholder(/search/i);
  await expect(input).toBeVisible();
  await input.fill("realism");

  await expect(page.getByText(/Realism/i).first()).toBeVisible();

  await page.getByText(/Realism/i).first().click();
  await expect(page).toHaveURL(/realism/);
});

test("search shows no-results message for gibberish", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).first().click();
  await page.getByPlaceholder(/search/i).fill("zzzznonsensequery");
  await expect(page.getByText(/no results/i)).toBeVisible();
});

test("search closes on Escape", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /search/i }).first().click();
  await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByPlaceholder(/search/i)).not.toBeVisible();
});