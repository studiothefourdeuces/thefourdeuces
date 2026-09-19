// Cloudflare Worker — the studio's lead + WhatsApp-automation backend.
//
// It does three jobs:
//   1. Receives leads from the static site (POST) and fans them out to Telegram
//      (instant alert), email (Resend) and a Google Sheet (durable record).
//   2. On a booking / consultation lead it kicks off a WhatsApp conversation
//      from the business number via the Meta WhatsApp Cloud API:
//        • template #1 (welcome / thank-you)          — sent instantly
//        • template #2 (describe idea, size, 1–4 refs) — sent right after
//      Both are business-initiated (the client hasn't messaged us yet), so
//      WhatsApp requires *approved templates* for them.
//   3. Acts as the WhatsApp webhook. When the client replies for the first time
//      (their idea / inspirations), we send a free-form thank-you telling them
//      we'll check with the artists and come back shortly — and ping Telegram.
//
// Secrets (set with `wrangler secret put NAME`):
//   TG_TOKEN               Telegram bot token from @BotFather
//   TG_CHAT_ID             your chat / group id
//   RESEND_KEY             Resend API key                 (optional — email skipped if unset)
//   SHEET_URL              Apps Script web-app URL        (optional — sheet skipped if unset)
//   WHATSAPP_TOKEN         Meta WhatsApp permanent token  (optional — WA skipped if unset)
//   WHATSAPP_VERIFY_TOKEN  any string you choose; also set it in the Meta webhook config
//
// Plain vars (in wrangler.toml [vars]):
//   ALLOWED_ORIGIN            e.g. https://thefourdeuces.nl  ("*" allows any origin)
//   MAIL_TO / MAIL_FROM       email copy inbox / verified Resend sender
//   NOTIFY_HANDLE             Telegram @handle to greet in alerts
//   WHATSAPP_PHONE_NUMBER_ID  the number's id from Meta (not the phone number)
//   WHATSAPP_API_VERSION      Graph API version (default "v21.0")
//   WA_TEMPLATE_WELCOME       approved template name for message #1
//   WA_TEMPLATE_ASK           approved template name for message #2
//   WA_TEMPLATE_LANG          template language code, e.g. "en" / "en_US" / "uk"
//   WA_FOLLOWUP_TEXT          optional override for the after-inspirations reply
//
// KV (in wrangler.toml [[kv_namespaces]]): binding WA_STATE — tracks each chat's
// stage so the after-inspirations reply fires exactly once. Without it, the two
// templates still send, but the follow-up can't be triggered.

const corsHeaders = (origin) => ({
  "access-control-allow-origin": origin || "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
});

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "content-type": "application/json" },
  });

// How long we remember a chat's stage (2 weeks). Long enough to cover a slow
// reply, short enough that stale conversations expire on their own.
const WA_STATE_TTL = 60 * 60 * 24 * 14;

/* -------------------------------------------------------------------------- */
/* WhatsApp Cloud API helpers                                                 */
/* -------------------------------------------------------------------------- */

const waConfigured = (env) =>
  !!(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID);

// Low-level send. Returns the fetch Response (or null when WA isn't configured).
async function waSend(env, payload) {
  if (!waConfigured(env)) return null;
  const version = env.WHATSAPP_API_VERSION || "v21.0";
  return fetch(
    `https://graph.facebook.com/${version}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
    },
  );
}

// A zero-variable template message (business-initiated).
const waTemplate = (to, name, lang) => ({
  to,
  type: "template",
  template: { name, language: { code: lang } },
});

// A free-form text message (only valid inside the 24h customer-service window).
const waText = (to, body) => ({
  to,
  type: "text",
  text: { preview_url: false, body },
});

async function tgSend(env, text, waDigits) {
  if (!(env.TG_TOKEN && env.TG_CHAT_ID)) return;
  const body = {
    chat_id: env.TG_CHAT_ID,
    text,
    disable_web_page_preview: true,
  };
  if (waDigits) {
    body.reply_markup = {
      inline_keyboard: [
        [
          {
            text: "📱 Написати клієнту",
            url: `https://wa.me/${waDigits}`,
          },
        ],
      ],
    };
  }
  return fetch(`https://api.telegram.org/bot${env.TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Kick off the WhatsApp conversation for a fresh lead: welcome, then the ask,
// then remember that we're waiting for the client's first reply.
async function waStartConversation(env, waDigits) {
  if (!waConfigured(env) || !waDigits) return;
  const lang = env.WA_TEMPLATE_LANG || "en";
  try {
    if (env.WA_TEMPLATE_WELCOME)
      await waSend(env, waTemplate(waDigits, env.WA_TEMPLATE_WELCOME, lang));
    if (env.WA_TEMPLATE_ASK)
      await waSend(env, waTemplate(waDigits, env.WA_TEMPLATE_ASK, lang));
    if (env.WA_STATE)
      await env.WA_STATE.put(
        `wa:${waDigits}`,
        JSON.stringify({ stage: "awaiting_reply", at: new Date().toISOString() }),
        { expirationTtl: WA_STATE_TTL },
      );
  } catch (e) {
    console.error("waStartConversation failed", e);
  }
}

/* -------------------------------------------------------------------------- */
/* WhatsApp webhook                                                           */
/* -------------------------------------------------------------------------- */

// GET verification handshake from Meta.
function waVerify(req, env) {
  const u = new URL(req.url);
  const mode = u.searchParams.get("hub.mode");
  const token = u.searchParams.get("hub.verify_token");
  const challenge = u.searchParams.get("hub.challenge");
  if (
    mode === "subscribe" &&
    token &&
    env.WHATSAPP_VERIFY_TOKEN &&
    token === env.WHATSAPP_VERIFY_TOKEN
  ) {
    return new Response(challenge || "", { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

// POST events from Meta. We only care about inbound *messages* (not delivery
// statuses). The first reply from a client we're awaiting triggers message #4.
async function waHandleWebhook(data, env) {
  const followup =
    env.WA_FOLLOWUP_TEXT ||
    "Thank you — got everything! 🖤 I'll go over your idea and inspirations " +
      "with our artists and come back to you very soon with the next steps.";
  const handle = env.NOTIFY_HANDLE || "";

  // Guard against double-firing when a client sends several messages in one
  // webhook batch (KV is eventually consistent, so re-reading it mid-batch may
  // still say "awaiting_reply").
  const handledThisRun = new Set();

  for (const entry of data.entry || []) {
    for (const change of entry.changes || []) {
      const value = (change && change.value) || {};
      const messages = value.messages || []; // inbound only; statuses ignored
      for (const m of messages) {
        const from = String(m.from || "").replace(/\D/g, "");
        if (!from || handledThisRun.has(from)) continue;

        let state = null;
        if (env.WA_STATE) {
          try {
            state = JSON.parse((await env.WA_STATE.get(`wa:${from}`)) || "null");
          } catch {
            state = null;
          }
        }
        if (!state || state.stage !== "awaiting_reply") continue;

        handledThisRun.add(from);
        // Mark done first so a same-batch sibling message can't double-send.
        if (env.WA_STATE)
          await env.WA_STATE.put(
            `wa:${from}`,
            JSON.stringify({ stage: "done", at: new Date().toISOString() }),
            { expirationTtl: WA_STATE_TTL },
          );

        try {
          await waSend(env, waText(from, followup));
        } catch (e) {
          console.error("follow-up send failed", e);
        }
        await tgSend(
          env,
          `${handle ? `Hi ${handle} 👋 ` : ""}A client just replied on ` +
            `WhatsApp with their idea / inspirations:\n📱 ${from}`,
          from,
        ).catch(() => {});
      }
    }
  }
}

/* -------------------------------------------------------------------------- */
/* Lead intake (from the website)                                            */
/* -------------------------------------------------------------------------- */

async function handleLead(data, env, allow, ctx) {
  // Honeypot — a real user never fills this. Pretend success, do nothing.
  if (data.hp) return json({ ok: true }, 200, allow);

  const source = String(data.source || "hero").slice(0, 40);
  // The contact form posts { name, email, message }. Everything else is a
  // booking or a free consultation and posts a WhatsApp number.
  const isContact = source === "contact";
  const type = data.type === "consultation" ? "consultation" : "booking";
  const isConsult = !isContact && type === "consultation";

  // Contact-form fields.
  const email = String(data.email || "").slice(0, 120);
  const name = String(data.name || "").slice(0, 120);
  const message = String(data.message || "").slice(0, 2000);

  // Booking / consultation fields.
  const whatsapp = String(data.whatsapp || "")
    .replace(/[^\d+\s()-]/g, "")
    .trim()
    .slice(0, 32);
  const waDigits = whatsapp.replace(/\D/g, "");
  const budget = String(data.budget || "").replace(/\D/g, "").slice(0, 20);
  const artist = String(data.artist || "").slice(0, 60);
  const bodyPart = String(data.bodyPart || "").slice(0, 60);

  // Ad attribution captured on the site (Google Ads click id + UTM tags).
  const clean = (v) => String(v || "").slice(0, 200);
  const gclid = clean(data.gclid || data.gbraid || data.wbraid);
  const utm = {
    source: clean(data.utm_source),
    medium: clean(data.utm_medium),
    campaign: clean(data.utm_campaign),
    content: clean(data.utm_content),
    term: clean(data.utm_term),
  };
  const hasAd = !!(gclid || utm.source || utm.campaign);
  // One-line ad summary for Telegram / email.
  const adText = hasAd
    ? `📈 Ad: ${utm.campaign || utm.source || "—"}` +
      (utm.content ? ` · ${utm.content}` : "") +
      (utm.term ? ` · "${utm.term}"` : "") +
      (gclid ? `\n🔗 gclid: ${gclid}` : "")
    : "";

  if (isContact) {
    if (!/.+@.+\..+/.test(email))
      return json({ ok: false, error: "invalid email" }, 422, allow);
  } else if (waDigits.length < 7) {
    return json({ ok: false, error: "missing whatsapp" }, 422, allow);
  }

  const when = new Date().toISOString();

  // Fan out. Promise.allSettled so one dead channel never breaks the others
  // and every failure still surfaces in `wrangler tail` logs.
  const tasks = [];

  if (env.TG_TOKEN && env.TG_CHAT_ID) {
    const handle = env.NOTIFY_HANDLE || "Sasha";
    const text = isContact
      ? `Hi ${handle} 👋 New Contact Message:\n\n` +
        (name ? `🙂 Name: ${name}\n` : "") +
        `📧 Email: ${email}` +
        (message ? `\n\n💬 ${message}` : "")
      : isConsult
        ? `Hi ${handle} 👋 New Free Consultation Request:\n\n` +
          `📱 WhatsApp: ${whatsapp}` +
          (adText ? `\n\n${adText}` : "")
        : `Hi ${handle} 👋 New Booking Request:\n\n` +
          `📱 WhatsApp: ${whatsapp}\n` +
          `💸 Budget: €${budget || "—"}\n` +
          `🎨 Artist: ${artist || "—"}\n` +
          `📍 Placement: ${bodyPart || "—"}` +
          (adText ? `\n\n${adText}` : "");
    tasks.push(tgSend(env, text, isContact ? "" : waDigits));
  }

  if (env.RESEND_KEY && env.MAIL_TO && env.MAIL_FROM) {
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from: env.MAIL_FROM,
          to: env.MAIL_TO,
          reply_to: email || undefined,
          subject: isContact
            ? `New contact message${name ? ` — ${name}` : ""}`
            : isConsult
              ? `New free consultation request`
              : `New booking — €${budget || "—"}`,
          text: isContact
            ? `Name: ${name}\nEmail: ${email}\nMessage:\n${message}\nTime: ${when}`
            : isConsult
              ? `WhatsApp: ${whatsapp}\nSource: ${source}\n${adText}\nTime: ${when}`
              : `WhatsApp: ${whatsapp}\nBudget: €${budget || "—"}\nArtist: ${artist || "—"}\nPlacement: ${bodyPart || "—"}\nSource: ${source}\n${adText}\nTime: ${when}`,
        }),
      }),
    );
  }

  if (env.SHEET_URL) {
    tasks.push(
      fetch(env.SHEET_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          when,
          type: isContact ? "contact" : type,
          whatsapp,
          budget,
          email,
          artist,
          bodyPart,
          name,
          message,
          source,
          gclid,
          utm_source: utm.source,
          utm_medium: utm.medium,
          utm_campaign: utm.campaign,
          utm_content: utm.content,
          utm_term: utm.term,
        }),
      }),
    );
  }

  // Start the WhatsApp conversation for bookings & consultations (not contact).
  if (!isContact && waDigits) tasks.push(waStartConversation(env, waDigits));

  await Promise.allSettled(tasks);
  return json({ ok: true }, 200, allow);
}

/* -------------------------------------------------------------------------- */
/* Entry point                                                               */
/* -------------------------------------------------------------------------- */

export default {
  async fetch(req, env, ctx) {
    const allow = env.ALLOWED_ORIGIN || "*";

    if (req.method === "OPTIONS")
      return new Response(null, { headers: corsHeaders(allow) });

    // WhatsApp webhook verification handshake.
    if (req.method === "GET") return waVerify(req, env);

    if (req.method !== "POST")
      return json({ ok: false, error: "method not allowed" }, 405, allow);

    let data;
    try {
      data = await req.json();
    } catch {
      return json({ ok: false, error: "bad request" }, 400, allow);
    }

    // WhatsApp inbound webhook events. Respond 200 fast; process in the
    // background so Meta doesn't retry.
    if (data && data.object === "whatsapp_business_account") {
      ctx.waitUntil(waHandleWebhook(data, env));
      return new Response("ok", { status: 200 });
    }

    // Otherwise it's a lead from the website.
    return handleLead(data, env, allow, ctx);
  },
};
