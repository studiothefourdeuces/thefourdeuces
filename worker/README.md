# The Four Deuces — lead capture

The hero form POSTs `{ budget, email }` to this Cloudflare Worker, which fans the
lead out to **Telegram** (instant alert), **email** (Resend, optional) and a
**Google Sheet** (durable record, optional). Secrets stay in the Worker — never
in the public site or the repo.

```
[Hero form] --fetch--> [Cloudflare Worker] --> Telegram + Email + Google Sheet
```

---

## 1. Telegram bot (required — the instant alert)

1. In Telegram, open **@BotFather** → `/newbot` → follow prompts.
   Copy the **bot token** it gives you (looks like `123456:ABC-...`).
2. Send any message to your new bot (so it's allowed to message you back).
3. Get your **chat id**: open
   `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser after messaging
   the bot, and read `result[0].message.chat.id`.
   *(For a group: add the bot to the group, post a message, use the group's
   negative chat id.)*

## 2. Google Sheet (optional — the record)

1. Create a Google Sheet.
2. **Extensions ▸ Apps Script**, paste [`apps-script.gs`](./apps-script.gs), Save.
3. **Deploy ▸ New deployment ▸ Web app** — *Execute as: Me*, *Access: Anyone*.
4. Copy the `/exec` URL → that's your `SHEET_URL`.

## 3. Email (optional — the backup copy)

1. Sign up at [resend.com](https://resend.com), verify your domain
   (`thefourdeuces.nl`), create an **API key** → that's `RESEND_KEY`.
2. Set `MAIL_FROM` to a sender on the verified domain (e.g. `leads@thefourdeuces.nl`)
   and `MAIL_TO` to where you want the copy (e.g. `booking@thefourdeuces.nl`) in
   `wrangler.toml`.

## 4. Deploy the Worker

```bash
cd worker
npm install
npx wrangler login

# secrets (paste each value when prompted)
npx wrangler secret put TG_TOKEN
npx wrangler secret put TG_CHAT_ID
npx wrangler secret put RESEND_KEY   # skip if not using email
npx wrangler secret put SHEET_URL    # skip if not using the sheet

# edit wrangler.toml [vars] first (ALLOWED_ORIGIN / MAIL_TO / MAIL_FROM), then:
npm run deploy
```

`wrangler deploy` prints your Worker URL, e.g.
`https://tfd-leads.<your-subdomain>.workers.dev`.

## 5. Point the site at the Worker

In the **frontend** project root, set the build-time env var to that URL:

```bash
# .env  (project root — see .env.example)
VITE_FORM_ENDPOINT=https://tfd-leads.<your-subdomain>.workers.dev
```

Then rebuild/redeploy the site. If you build via GitHub Actions, add
`VITE_FORM_ENDPOINT` as a repository **variable** and pass it to the build step.

## Test

```bash
curl -X POST https://tfd-leads.<sub>.workers.dev \
  -H "content-type: application/json" \
  -d '{"budget":"350","email":"you@example.com","source":"test"}'
```

You should get a Telegram ping, an email (if enabled), and a new sheet row.
Watch live logs with `npm run tail`.

## Notes

- **Honeypot:** the form ships a hidden `hp` field; the Worker silently drops any
  submission where it's filled (kills most bots). No CAPTCHA needed at this scale.
- **GDPR (EU/.nl):** you're storing a personal email. Keep the privacy note by the
  form, use a business inbox, and don't repurpose the data.
- Lock `ALLOWED_ORIGIN` to your real domain once live to cut casual cross-site
  spam (it's not security, just hygiene).
