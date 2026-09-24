# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> /terms loads without console errors
- Location: tests/navigation.spec.ts:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('footer')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('footer') with timeout 10000ms
  - waiting for locator('footer')
    9 × waiting for "https://thefourdeuces.nl/terms" navigation to finish...
      - navigated to "https://thefourdeuces.nl/terms"
    - waiting for navigation to finish...
    11 × navigated to "https://thefourdeuces.nl/terms"
       - waiting for "https://thefourdeuces.nl/terms" navigation to finish...
    - navigated to "https://thefourdeuces.nl/terms"
    - waiting for navigation to finish...
    - navigated to "https://thefourdeuces.nl/terms"
    - waiting for "https://thefourdeuces.nl/terms" navigation to finish...
    - navigated to "https://thefourdeuces.nl/terms"

```

```yaml
- paragraph:
  - text: Redirecting to
  - link "/terms":
    - /url: /terms
  - text: …
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | const PAGES = [
  4  |   "/",
  5  |   "/book",
  6  |   "/artists",
  7  |   "/styles",
  8  |   "/realism",
  9  |   "/chicano",
  10 |   "/fine-line",
  11 |   "/anime",
  12 |   "/fluid-line",
  13 |   "/ornamental",
  14 |   "/freehand",
  15 |   "/minimal",
  16 |   "/botanical",
  17 |   "/about",
  18 |   "/faq",
  19 |   "/guests",
  20 |   "/contact",
  21 |   "/terms",
  22 | ];
  23 | 
  24 | for (const path of PAGES) {
  25 |   test(`${path} loads without console errors`, async ({ page }) => {
  26 |     const errors: string[] = [];
  27 |     page.on("console", (msg) => {
  28 |       if (msg.type() === "error") errors.push(msg.text());
  29 |     });
  30 |     page.on("pageerror", (err) => errors.push(err.message));
  31 | 
  32 |     const response = await page.goto(path);
  33 |     expect(response?.status()).toBeLessThan(400);
> 34 |     await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
     |                                          ^ Error: expect(locator).toBeVisible() failed
  35 |     await page.waitForTimeout(1000);
  36 | 
  37 |     expect(errors, `Console errors on ${path}: ${errors.join(", ")}`).toEqual([]);
  38 |   });
  39 | }
  40 | 
  41 | test("404 page shows for unknown route", async ({ page }) => {
  42 |   const response = await page.goto("/this-page-does-not-exist");
  43 |   await page.waitForTimeout(1000);
  44 |   await expect(page.getByText("404")).toBeVisible();
  45 | });
```