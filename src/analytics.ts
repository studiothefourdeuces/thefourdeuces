// Google Analytics 4 + Google Ads conversion tracking with EU Consent Mode v2.
//
// Everything here is a no-op until the IDs are provided at build time:
//   VITE_GA4_ID          GA4 measurement id           e.g. "G-XXXXXXXXXX"
//   VITE_GADS_ID         Google Ads tag id            e.g. "AW-XXXXXXXXX"
//   VITE_GADS_LEAD_LABEL Ads conversion "send_to"     e.g. "AW-XXXXXXXXX/AbC-D_efG"
//
// Consent Mode: we set every storage type to "denied" by default and only
// flip to "granted" once the visitor accepts in the cookie banner — required
// for the EU/Netherlands.

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GADS_ID = import.meta.env.VITE_GADS_ID as string | undefined;
const LEAD_LABEL = import.meta.env.VITE_GADS_LEAD_LABEL as string | undefined;

const ENABLED = Boolean(GA4_ID || GADS_ID);
let started = false;

// gtag shim — pushes each command onto the dataLayer for gtag.js to process.
function gtag(...args: unknown[]) {
  ((window as unknown as { dataLayer: unknown[] }).dataLayer ||= []).push(args);
}

// Load gtag.js and register consent defaults (denied). Safe to call once, early
// — before the visitor has chosen — so Consent Mode can work as intended.
export function initAnalytics() {
  if (!ENABLED || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { dataLayer: unknown[]; gtag: typeof gtag };
  w.dataLayer ||= [];
  w.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
  gtag("js", new Date());
  if (GA4_ID) gtag("config", GA4_ID, { anonymize_ip: true });
  if (GADS_ID) gtag("config", GADS_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + (GA4_ID || GADS_ID);
  document.head.appendChild(s);
}

export function grantConsent() {
  if (!ENABLED) return;
  gtag("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}

export function denyConsent() {
  if (!ENABLED) return;
  gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

// SPA route change → GA4 page_view.
export function trackPageview(path: string) {
  if (!ENABLED || !GA4_ID) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!ENABLED) return;
  gtag("event", name, params);
}

// ---------------------------------------------------------------------------
// Ad attribution — capture Google Ads click ids (gclid/gbraid/wbraid) and UTM
// params from the landing URL and keep them, so each lead can carry the ad tag
// that produced it (worker → Telegram/Sheet) and Ads/GA4 can attribute the
// conversion. Independent of GA4/Ads being configured.
// ---------------------------------------------------------------------------

export type Attribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing?: string;
  first_seen?: string;
};

const ATTR_KEY = "tfd_attribution";
const ATTR_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

// Read ad params from the current URL; if any are present, store them
// (last-click wins, first_seen preserved). Call once on load.
export function captureAttribution() {
  if (typeof window === "undefined") return;
  try {
    const q = new URLSearchParams(window.location.search);
    const hit: Record<string, string> = {};
    for (const k of ATTR_PARAMS) {
      const v = q.get(k);
      if (v) hit[k] = v.slice(0, 200);
    }
    if (Object.keys(hit).length === 0) return; // no ad params → keep any prior
    const prev = getAttribution();
    const merged: Attribution = {
      ...hit,
      landing: (window.location.pathname + window.location.search).slice(0, 300),
      first_seen: prev?.first_seen || new Date().toISOString(),
    };
    localStorage.setItem(ATTR_KEY, JSON.stringify(merged));
  } catch {
    /* private mode / storage disabled — attribution just won't persist */
  }
}

export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(ATTR_KEY) || "null");
  } catch {
    return null;
  }
}

// Primary conversion: a booking / lead was submitted.
export function trackLead(params: { value?: number; source?: string } = {}) {
  if (!ENABLED) return;
  const value = params.value ?? 0;
  gtag("event", "generate_lead", {
    currency: "EUR",
    value,
    source: params.source,
  });
  if (LEAD_LABEL) {
    gtag("event", "conversion", {
      send_to: LEAD_LABEL,
      value,
      currency: "EUR",
    });
  }
}
