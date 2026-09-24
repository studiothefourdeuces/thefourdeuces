import { test, expect } from "@playwright/test";

test("booking flow via body map", async ({ page }) => {
  await page.goto("/book");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await page.locator("svg path").first().click({ force: true, timeout: 10000 });

  const bookButton = page.getByRole("button", { name: /book this area/i });
  await expect(bookButton).toBeVisible({ timeout: 10000 });
  await bookButton.click();

  const budgetInput = page.getByPlaceholder(/budget/i);
  await expect(budgetInput).toBeVisible({ timeout: 10000 });
  await budgetInput.fill("500");
  await page.getByRole("button", { name: /next/i }).click();

  await expect(page.getByPlaceholder(/whatsapp/i)).toBeVisible({ timeout: 10000 });
});

test("language switcher changes URL prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "NL" }).click();
  await page.getByText("Nederlands").click();
  await expect(page).toHaveURL(/\/nl/);
});