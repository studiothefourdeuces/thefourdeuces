# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /artists has no critical accessibility violations
- Location: tests/accessibility.spec.ts:7:3

# Error details

```
Error: button-name: Ensure buttons have discernible text (3 nodes)

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 235

- Array []
+ Array [
+   Object {
+     "description": "Ensure buttons have discernible text",
+     "help": "Buttons must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.13/button-name?application=playwright",
+     "id": "button-name",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"button\" data-cursor=\"pointer\" class=\"group relative block aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(2) > .aspect-square.rounded-xl.ring-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"button\" data-cursor=\"pointer\" class=\"group relative block aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(9) > .aspect-square.rounded-xl.ring-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"button\" data-cursor=\"pointer\" class=\"group relative block aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           "div:nth-child(16) > .aspect-square.rounded-xl.ring-1",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.9.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "@the.four.deuces" [ref=e6]:
        - /url: https://instagram.com/the.four.deuces
      - generic [ref=e12]: Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work —
  - button "Search" [ref=e14]
  - button "Change language" [ref=e19]: EN
  - button "Open menu" [ref=e22]
  - main [ref=e25]:
    - generic [ref=e26]:
      - paragraph [ref=e27]: Our artists
      - heading "Artists" [level=1] [ref=e28]
      - generic [ref=e29]:
        - generic [ref=e31]:
          - button "Max" [ref=e32]
          - button "Eugene" [ref=e34]
          - button "Daria" [ref=e36]
          - button "Darya" [ref=e38]
          - button "Mila" [ref=e40]
          - button "Gianluca" [ref=e42]
          - button "Selçuk" [ref=e44]
        - img "Max" [ref=e48]
        - generic [ref=e49]:
          - paragraph [ref=e50]:
            - text: 01 —
            - button "Chicano" [ref=e52]
            - generic [ref=e53]:
              - text: ","
              - button "Realism" [ref=e54]
            - generic [ref=e55]:
              - text: ","
              - button "Portraits" [ref=e56]
          - heading "Max" [level=2] [ref=e57]
          - paragraph [ref=e58]: Chicano-inspired realism and portraits — black-and-grey work with smooth gradients and lifelike depth.
          - paragraph [ref=e59]: Tattooing since 2014
          - generic [ref=e60]:
            - button "Book with Max" [ref=e61]
            - link "Request free consultation" [ref=e62]:
              - /url: https://wa.me/31645052222
      - generic [ref=e63]:
        - heading "Works by Max" [level=2] [ref=e64]
        - generic [ref=e65]:
          - button [ref=e67]:
            - img "Max — work 1" [ref=e68]
          - button [ref=e70]
          - button [ref=e73]:
            - img "Max — work 3" [ref=e74]
          - button [ref=e76]:
            - img "Max — work 4" [ref=e77]
          - button [ref=e79]:
            - img "Max — work 5" [ref=e80]
          - button [ref=e82]:
            - img "Max — work 6" [ref=e83]
          - button [ref=e85]:
            - img "Max — work 7" [ref=e86]
          - button [ref=e88]:
            - img "Max — work 8" [ref=e89]
          - button [ref=e91]
          - button [ref=e94]:
            - img "Max — work 10" [ref=e95]
          - button [ref=e97]:
            - img "Max — work 11" [ref=e98]
          - button [ref=e100]:
            - img "Max — work 12" [ref=e101]
          - button [ref=e103]:
            - img "Max — work 13" [ref=e104]
          - button [ref=e106]:
            - img "Max — work 14" [ref=e107]
          - button [ref=e109]:
            - img "Max — work 15" [ref=e110]
          - button [ref=e112]
          - button [ref=e115]:
            - img "Max — work 17" [ref=e116]
          - button [ref=e118]:
            - img "Max — work 18" [ref=e119]
          - button [ref=e121]:
            - img "Max — work 19" [ref=e122]
          - button [ref=e124]:
            - img "Max — work 20" [ref=e125]
          - button [ref=e127]:
            - img "Max — work 21" [ref=e128]
        - generic [ref=e129]:
          - paragraph [ref=e130]: Good to know
          - generic [ref=e131]:
            - group [ref=e132]:
              - generic "How is Chicano different from ordinary black & grey realism?" [ref=e133]
            - group [ref=e136]:
              - generic "Do you do Chicano in colour?" [ref=e137]
            - group [ref=e140]:
              - generic "How many sessions for a large Chicano project (sleeve, back)?" [ref=e141]
            - group [ref=e144]:
              - generic "Won't the fine swirls in lettering blur over the years?" [ref=e145]
            - group [ref=e148]:
              - generic "Can Chicano be combined with a cover-up?" [ref=e149]
            - group [ref=e152]:
              - generic "Why is grey wash so important in Chicano, and how does it heal?" [ref=e153]
            - group [ref=e156]:
              - generic "How do I keep deep blacks and smooth shadows for years?" [ref=e157]
            - group [ref=e160]:
              - generic "How many sessions does a realistic tattoo take?" [ref=e161]
            - group [ref=e164]:
              - generic "How does microrealism age and heal?" [ref=e165]
            - group [ref=e168]:
              - generic "How is realism different, technically, from other styles?" [ref=e169]
            - group [ref=e172]:
              - generic "Does microrealism hurt, and how long is a session?" [ref=e173]
            - group [ref=e176]:
              - generic "Will microrealism blur after 3–5 years?" [ref=e177]
            - group [ref=e180]:
              - generic "Can you do a realistic portrait of a person or pet?" [ref=e181]
            - group [ref=e184]:
              - generic "How do I prepare for a realism session?" [ref=e185]
            - group [ref=e188]:
              - generic "Is a touch-up needed after healing?" [ref=e189]
  - contentinfo [ref=e192]:
    - generic [ref=e193]:
      - generic [ref=e194]:
        - generic [ref=e195]:
          - paragraph [ref=e196]: Discover
          - list [ref=e197]:
            - listitem [ref=e198]:
              - button "Home" [ref=e199]
            - listitem [ref=e200]:
              - button "Artists" [ref=e201]
            - listitem [ref=e202]:
              - button "Reviews" [ref=e203]
            - listitem [ref=e204]:
              - button "Sponsors" [ref=e205]
        - generic [ref=e206]:
          - paragraph [ref=e207]: Studio
          - list [ref=e208]:
            - listitem [ref=e209]:
              - button "About" [ref=e210]
            - listitem [ref=e211]:
              - button "FAQ" [ref=e212]
            - listitem [ref=e213]:
              - button "Guests & Careers" [ref=e214]
            - listitem [ref=e215]:
              - button "Contact" [ref=e216]
        - generic [ref=e217]:
          - paragraph [ref=e218]: Tattoo styles
          - list [ref=e219]:
            - listitem [ref=e220]:
              - button "All styles" [ref=e221]
            - listitem [ref=e222]:
              - button "Realism" [ref=e223]
            - listitem [ref=e224]:
              - button "Chicano" [ref=e225]
            - listitem [ref=e226]:
              - button "Fine Line" [ref=e227]
            - listitem [ref=e228]:
              - button "Anime" [ref=e229]
        - list [ref=e231]:
          - listitem [ref=e232]:
            - button "Fluid Line" [ref=e233]
          - listitem [ref=e234]:
            - button "Ornamental" [ref=e235]
          - listitem [ref=e236]:
            - button "Freehand" [ref=e237]
          - listitem [ref=e238]:
            - button "Minimal" [ref=e239]
          - listitem [ref=e240]:
            - button "Botanical" [ref=e241]
      - generic [ref=e242]:
        - paragraph [ref=e243]: The Four Deuces
        - paragraph [ref=e244]:
          - text: Designed & developed by
          - link "aerdt" [ref=e245]:
            - /url: https://aerdt.xyz/
        - generic [ref=e246]:
          - button "Terms & Privacy" [ref=e247]
          - generic [ref=e248]: ·
          - generic [ref=e249]: © 2020–2026 The Four Deuces
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import AxeBuilder from "@axe-core/playwright";
  3  | 
  4  | const PAGES = ["/", "/book", "/artists", "/faq", "/contact", "/about", "/guests"];
  5  | 
  6  | for (const path of PAGES) {
  7  |   test(`${path} has no critical accessibility violations`, async ({ page }) => {
  8  |     await page.goto(path);
  9  |     await expect(page.locator("footer")).toBeVisible({ timeout: 10000 });
  10 |     const acceptCookies = page.getByRole("button", { name: /accept/i });
  11 |     if (await acceptCookies.isVisible().catch(() => false)) {
  12 |       await acceptCookies.click();
  13 |     }
  14 | 
  15 |     const results = await new AxeBuilder({ page })
  16 |       .withTags(["wcag2a", "wcag2aa"])
  17 |       .disableRules(["color-contrast"])
  18 |       .exclude(".tfd-marquee")
  19 |       .analyze();
  20 | 
  21 |     const critical = results.violations.filter(
  22 |       (v) => v.impact === "critical" || v.impact === "serious",
  23 |     );
  24 | 
  25 |     expect(
  26 |       critical,
  27 |       critical.map((v) => `${v.id}: ${v.description} (${v.nodes.length} nodes)`).join("\n"),
> 28 |     ).toEqual([]);
     |       ^ Error: button-name: Ensure buttons have discernible text (3 nodes)
  29 |   });
  30 | }
```