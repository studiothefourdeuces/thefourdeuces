import { test, expect } from "@playwright/test";

const XSS_PAYLOAD = `<script>window.__xss_fired = true;</script>`;

test("contact form does not execute injected script", async ({ page }) => {
  let fired = false;
  await page.exposeFunction("__reportXss", () => {
    fired = true;
  });

  await page.goto("/contact");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  const acceptCookies = page.getByRole("button", { name: /accept/i });
  if (await acceptCookies.isVisible().catch(() => false)) {
    await acceptCookies.click();
  }

  await page.getByPlaceholder(/your name/i).fill(XSS_PAYLOAD);
  await page.getByPlaceholder(/your email/i).fill("test@example.com");
  await page.getByPlaceholder(/your message/i).fill(XSS_PAYLOAD);

  const sendButton = page.getByRole("button", { name: /send message/i });
  await sendButton.scrollIntoViewIfNeeded();
  await sendButton.click();

  await page.waitForTimeout(1000);

  const scriptExecuted = await page.evaluate(
    () => (window as any).__xss_fired === true,
  );
  expect(scriptExecuted).toBe(false);

  const rawScriptInDom = await page.locator("script:has-text('__xss_fired')").count();
  expect(rawScriptInDom).toBe(0);
});

test("search input does not execute injected script", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Search" }).first().click();
  const input = page.getByPlaceholder(/search/i);
  await expect(input).toBeVisible({ timeout: 5000 });

  await input.fill(XSS_PAYLOAD);
  await page.waitForTimeout(500);

  const scriptExecuted = await page.evaluate(
    () => (window as any).__xss_fired === true,
  );
  expect(scriptExecuted).toBe(false);
});

test("no mixed content (all resources load over HTTPS)", async ({ page }) => {
  const insecureRequests: string[] = [];
  page.on("request", (req) => {
    if (req.url().startsWith("http://") && !req.url().startsWith("http://localhost")) {
      insecureRequests.push(req.url());
    }
  });

  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });

  expect(insecureRequests, `Insecure requests: ${insecureRequests.join(", ")}`).toEqual([]);
});