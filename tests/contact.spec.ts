import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }
});

test("contact form shows error on invalid submit", async ({ page }) => {
  await page.getByRole("button", { name: /send message/i }).click();
  await expect(page.getByText(/add your name/i)).toBeVisible();
});

test("contact form submits successfully with valid data", async ({ page }) => {
  await page.getByPlaceholder(/your name/i).fill("Test User");
  await page.getByPlaceholder(/your email/i).fill("test@example.com");
  await page.getByPlaceholder(/your message/i).fill("This is a test message.");
  await page.getByRole("button", { name: /send message/i }).click();

  await expect(page.getByText(/sent/i)).toBeVisible({ timeout: 10000 });
});

test("contact form rejects invalid email", async ({ page }) => {
  await page.getByPlaceholder(/your name/i).fill("Test User");
  await page.getByPlaceholder(/your email/i).fill("test@nodot");
  await page.getByPlaceholder(/your message/i).fill("Test message");

  const sendButton = page.getByRole("button", { name: /send message/i });
  await sendButton.scrollIntoViewIfNeeded();
  await sendButton.click();

  await expect(page.getByText(/add your name/i)).toBeVisible({ timeout: 10000 });
});