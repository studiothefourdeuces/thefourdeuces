import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
} from "motion/react";
import {
  Check,
  Cookie,
  Instagram,
  ArrowUpRight,
  ChevronDown,
  Smartphone,
  Euro,
  X,
  Globe,
  Search,
} from "lucide-react";
import tattoolandLogo from "./img/partners/tattooland.png";
import killerinkLogo from "./img/partners/killerink.png";
import dashaLogo from "./img/partners/tattoodasha.png";
import { getAbout, getStyles, getArtistText } from "./content";
import {
  initAnalytics,
  grantConsent,
  denyConsent,
  trackPageview,
  trackLead,
  captureAttribution,
  getAttribution,
} from "./analytics";
import { buildSearchIndex, searchIndex, type SearchResult } from "./search";
import { LangContext, useLang, useT } from "./lang-context";
import {
  ARTISTS,
  WORKS_BY_ARTIST,
  CAROUSEL_WORKS,
  HERO_SLIDES,
} from "./artists-data";
import {
  PILL,
  WHATSAPP_URL,
  Reveal,
  FadeImg,
  LazyVideo,
  ArtistButtons,
  ArtistRow,
  RoleLinks,
} from "./ui";
import {
  LANGS,
  splitLangPath,
  langPath,
  htmlLangFor,
  t as translate,
  type Lang,
} from "./i18n";

// Route pages are code-split: each is loaded only when its route is visited,
// so the initial (home) bundle stays small.
const ArtistsPage = lazy(() => import("./pages/ArtistsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const GuestsPage = lazy(() => import("./pages/GuestsPage"));
const BookPage = lazy(() => import("./pages/BookPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const StylesIndexPage = lazy(() => import("./pages/StylesIndexPage"));
const StylePage = lazy(() => import("./pages/StylePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const TICKER =
  "Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — ";

const MENU: { tkey: string; target: string }[] = [
  { tkey: "nav.home", target: "top" },
  { tkey: "nav.artists", target: "/artists" },
  { tkey: "nav.stylesMenu", target: "/styles" },
  { tkey: "nav.reviews", target: "#reviews" },
  { tkey: "nav.about", target: "/about" },
  { tkey: "nav.faq", target: "/faq" },
  { tkey: "nav.careers", target: "/guests" },
];

// Full native language names (used by the in-menu mobile language picker).
const LANG_NAMES: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  ua: "Українська",
};

// Shared button — one size & shape for every button on the site. On mobile a
// single uniform width matching the home "artists" section photo (w-full capped
// at 300px); on desktop it sizes to its label. `solid` picks the primary (white
// outline + glass fill, like the Instagram chip) vs secondary (faint outline).
// Staggered reveal for the language panel items (mirrors the burger menu).
const LANG_ITEM = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type ChatMsg = { from: "me" | "them"; text: string; timestamp?: string };
type ChatThread = { handle: string; messages: ChatMsg[] };

const CHATS: ChatThread[] = [
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        text: "Session was great! Daria is super organized, professional, and creative. I love love love the custom tattoo that she designed for me. She captured all the elements I wanted. I'm super happy with the tattoo ☺️",
      },
      {
        from: "them",
        text: "I will be seeing her again for another tattoo. I'm looking maybe December or January",
      },
      {
        from: "me",
        text: "Great to hear it! Thank you so much for your feedback and will be glad to see you for more sessions with us ☺️",
      },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Hey! Yes thanks! I'm really happy — all of the tattoos are exactly what I expected and Max was very kind and professional 🥰 It's the 3rd time with Max and I'll come back next year for sure 👌!",
      },
      {
        from: "me",
        text: "Perfect! Really glad to see you here with us, hope to see you soon again, thanks for trusting us ☺️ ❤️",
      },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      {
        from: "them",
        text: "Everything good, the session was nice and the tattoo is healing good, it's almost completely healed",
      },
      { from: "me", text: "Many thanks for your feedback 😊" },
    ],
  },
  {
    handle: "bazhina_tatoonl",
    messages: [
      {
        from: "them",
        text: "Hey!! I thought I'd send you a picture of the tattoo 1.5 months after the session. It looks amazing and makes me wanna have more tattoos haha. Thank you again for the great session",
      },
      {
        from: "me",
        text: "Hey))) I am very pleased to hear your feedback!!! The tattoo looks wonderful)",
      },
    ],
  },
  {
    handle: "mila.delger",
    messages: [
      {
        from: "them",
        timestamp: "3:07 PM",
        text: "Thank you Mila for this incredible piece of art! Can't wait for the next session, was a pleasure to meet you ❤️",
      },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Hi! Everything went good! I'm happy with the results and the healing going good as well",
      },
      {
        from: "me",
        text: "Glad to hear it! Thanks for sharing your feedback and thanks for coming to us 😊",
      },
      { from: "them", text: "See u next time 🙏🏻 ❤️" },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      { from: "them", text: "I am a happy men! Thanks bro for the result! 🙏🏽" },
      {
        from: "me",
        text: "Thanks man! I'm glad to read it! I don't want to be happy alone 😂 ❤️",
      },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      { from: "them", text: "It healed very well. Super happy with the result, yes!" },
      {
        from: "me",
        text: "Wow! Thanks la for sharing, glad to hear that's it went good 🤗 ❤️",
      },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Hi, sorry for the delay, I'm not here often. I am very satisfied and the healing went perfectly :)",
      },
      { from: "me", text: "Glad to hear it! Thanks for your feedback ☺️👌🏻" },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        timestamp: "18:40",
        text: "The whole experience was really good. I will send you a pic of the healed version. Thank you so much dear Daria! ❤️",
      },
      {
        from: "them",
        text: "Also a reminder for sending me the pics and videos please 🤗",
      },
      { from: "me", text: "thank you so much 🫶" },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        text: "Hi Daria! I hope you had an amazing day off ❤️ Thank you so so much again for your incredible work and for being such a kind person to be around — I enjoyed our appointment a lot 🥰",
      },
      { from: "me", text: "Hi, thank you too ❤️" },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      {
        from: "them",
        text: "Hey, happy New Year! I hope you had a great start to the new year. Yes, I'm very happy with Eugene. It's just wonderful. Only my elbow might need a touch-up because the colour didn't stay in the skin very well there. Thank you so much again for everything! 😊💪🏻",
      },
      {
        from: "me",
        text: "Many thanks for your feedback! Happy New Year too 🤗🙏",
      },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      {
        from: "them",
        text: "I still wanted to thank you for everything, and the whole team — you are super nice, smiling and I really like it. You take care of your customers and I see that you are fully involved. Thank you again and I'll keep you informed of all the progress!",
      },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Hey!! Yes very happy with it. It has healed great actually. Thinking about my next one",
      },
      {
        from: "me",
        text: "Many thanks for your feedback! Glad to hear it :) Let us know when you'd like to do the next one ☺️",
      },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        text: "Hiii, here are a few pictures of my tattoo. I also want to say thank you again. I love my tattoo so so much and I felt really comfortable at the studio with you 🥰",
      },
      {
        from: "me",
        text: "Hi! Thank you so much for the healed tattoo photo, it looks amazing 😍 And thanks for your kind words, I hope we'll see each other again 😁",
      },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        text: "Thank you again for the amazing tat! 🤩 and I would love to get the pictures once you have them :)",
      },
      {
        from: "me",
        text: "Thank you for your trust as well ☺️ I'll send the photos a bit later once I receive them, so let's stay in touch ✨",
      },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      {
        from: "them",
        text: "Hi man! Thanks for yesterday! I had a good day and I'm really happy with the result! Super tired now, so I'll take it easy today! Was nice to meet you and let's keep in touch! Also if you want to visit the natural history museum 😉 ❤️",
      },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      {
        from: "them",
        text: "It was a great experience for the first tattoo. Probably will do a next one soon hahaaa",
      },
    ],
  },
  {
    handle: "tattoo.daria",
    messages: [
      { from: "them", text: "I'm so so happy with the tattoo, thank you ❤️❤️❤️" },
      { from: "me", text: "Thank you too 🥹" },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Hi Max, hope you're doing well! Just wanted to thank you again for your amazing work — I'm genuinely super happy with the final result. It's fully healed now; I followed all your aftercare instructions and the skin recovered smoothly with no issues at all.",
      },
    ],
  },
  {
    handle: "maxxonk_tattoo",
    messages: [
      {
        from: "them",
        text: "Session was nice! I was really happy with the designing process. Healing is going great so far — I'm keeping it moisturized and clean! Thanks for checking in! ❤️",
      },
      { from: "me", text: "Really glad to hear it, thanks for choosing us 🤗 ❤️" },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      { from: "them", text: "Yes all good, second skin is still on" },
      { from: "them", text: "Session was perfect" },
      { from: "me", text: "Great! Thanks for your feedback 🤗" },
    ],
  },
  {
    handle: "novohatskytattoo",
    messages: [
      {
        from: "them",
        text: "Hey, thank you for the message, it's all going great. I messaged Eugene already — really happy with the results so far!",
      },
      { from: "me", text: "Glad to know it! Thanks for coming to us ☺️ ❤️" },
    ],
  },
];

const fmtBudget = (raw: string) => {
  const d = raw.replace(/\D/g, "");
  return d ? Number(d).toLocaleString("en-US") : "";
};

// International dialling code → ISO-3166 country (for the flag emoji shown when a
// WhatsApp number is typed with its country code). Shared codes (+1, +7) map to
// the most common country. Order doesn't matter — the longest matching prefix
// wins at lookup time.
const DIAL_CODES: Record<string, string> = {
  "1": "US", "7": "RU", "20": "EG", "27": "ZA", "30": "GR", "31": "NL",
  "32": "BE", "33": "FR", "34": "ES", "36": "HU", "39": "IT", "40": "RO",
  "41": "CH", "43": "AT", "44": "GB", "45": "DK", "46": "SE", "47": "NO",
  "48": "PL", "49": "DE", "51": "PE", "52": "MX", "53": "CU", "54": "AR",
  "55": "BR", "56": "CL", "57": "CO", "58": "VE", "60": "MY", "61": "AU",
  "62": "ID", "63": "PH", "64": "NZ", "65": "SG", "66": "TH", "81": "JP",
  "82": "KR", "84": "VN", "86": "CN", "90": "TR", "91": "IN", "92": "PK",
  "93": "AF", "94": "LK", "95": "MM", "98": "IR", "212": "MA", "213": "DZ",
  "216": "TN", "218": "LY", "220": "GM", "221": "SN", "233": "GH", "234": "NG",
  "251": "ET", "254": "KE", "255": "TZ", "256": "UG", "260": "ZM", "263": "ZW",
  "351": "PT", "352": "LU", "353": "IE", "354": "IS", "355": "AL", "356": "MT",
  "357": "CY", "358": "FI", "359": "BG", "370": "LT", "371": "LV", "372": "EE",
  "373": "MD", "374": "AM", "375": "BY", "376": "AD", "377": "MC", "378": "SM",
  "380": "UA", "381": "RS", "382": "ME", "383": "XK", "385": "HR", "386": "SI",
  "387": "BA", "389": "MK", "420": "CZ", "421": "SK", "423": "LI", "480": "PL",
  "500": "FK", "501": "BZ", "502": "GT", "503": "SV", "504": "HN", "505": "NI",
  "506": "CR", "507": "PA", "509": "HT", "590": "GP", "591": "BO", "593": "EC",
  "595": "PY", "598": "UY", "599": "CW", "670": "TL", "673": "BN", "674": "NR",
  "675": "PG", "676": "TO", "679": "FJ", "852": "HK", "853": "MO", "855": "KH",
  "856": "LA", "880": "BD", "886": "TW", "960": "MV", "961": "LB", "962": "JO",
  "963": "SY", "964": "IQ", "965": "KW", "966": "SA", "967": "YE", "968": "OM",
  "970": "PS", "971": "AE", "972": "IL", "973": "BH", "974": "QA", "975": "BT",
  "976": "MN", "977": "NP", "992": "TJ", "993": "TM", "994": "AZ", "995": "GE",
  "996": "KG", "998": "UZ",
};

// Dialling codes ordered longest-first so a lookup matches the most specific
// prefix (e.g. +380 → UA, not +3 → nothing).
const DIAL_CODES_BY_LEN = Object.keys(DIAL_CODES).sort(
  (a, b) => b.length - a.length,
);

// A country's ISO-2 code → its flag emoji (regional-indicator letters).
const flagEmoji = (iso: string) =>
  String.fromCodePoint(
    ...[...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65),
  );

// Flag emoji for a typed WhatsApp number — only once a country code (leading +)
// is present and recognised; otherwise "".
const flagForWhatsapp = (whatsapp: string) => {
  if (!/^\s*\+/.test(whatsapp)) return "";
  const digits = whatsapp.replace(/\D/g, "");
  const code = DIAL_CODES_BY_LEN.find((c) => digits.startsWith(c));
  return code ? flagEmoji(DIAL_CODES[code]) : "";
};

/* -------------------------------------------------------------------------- */
/* CUSTOM CURSOR (metallic arrow that follows the pointer)                    */
/* -------------------------------------------------------------------------- */

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a,button,input,[data-cursor]");
      // translate = instant follow; scale = smoothly transitioned (below).
      el.style.translate = `${e.clientX}px ${e.clientY}px`;
      el.style.scale = interactive ? "1.5" : "1";
      el.style.opacity = "1";
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[120] origin-top-left"
      style={{ opacity: 0, transition: "scale 150ms ease-out" }}
      aria-hidden="true"
    >
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <defs>
          <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#c7cbd1" />
            <stop offset="0.55" stopColor="#8a9099" />
            <stop offset="1" stopColor="#e9edf2" />
          </linearGradient>
        </defs>
        <path
          d="M2 1.5 L2 25 L8.2 19.2 L12 27.5 L15.6 25.8 L11.9 17.8 L20 17.6 Z"
          fill="url(#chrome)"
          stroke="rgba(0,0,0,0.35)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* REVEAL — fades/slides content up as it scrolls into view (plays once)       */
/* -------------------------------------------------------------------------- */

// One shared IntersectionObserver drives every <Reveal>. When several elements
// enter together (e.g. on page load) they're sorted by vertical position and
// revealed top-to-bottom with a small incremental delay, so the page cascades
// in. Elements that enter alone while scrolling reveal immediately (no delay).

/* -------------------------------------------------------------------------- */
/* COVERFLOW CAROUSEL (artist photos — auto-drifting; click a card to centre)  */
/* -------------------------------------------------------------------------- */

function Carousel({
  onOpenProfile,
}: {
  onOpenProfile: (artistIdx: number) => void;
}) {
  const items = CAROUSEL_WORKS;
  const N = items.length;
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpenProfile);
  openRef.current = onOpenProfile;
  // Which card is currently centred — only that one plays its video (if any).
  const [center, setCenter] = useState(0);
  const centerRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // Only bother tracking the centre (a per-card re-render) if some work
    // actually has a video to play there.
    const anyVideo = items.some((it) => it.video);

    const DRIFT = 0.00045; // progress units / ms — the standard auto-scroll speed
    const GLIDE = DRIFT * 8; // click-to-centre glides at 8× the drift speed
    const IDLE_MS = 1000; // resume auto-scroll after 1s of no carousel interaction

    let raf = 0;
    let progress = 0;
    let target: number | null = null;
    let last = performance.now();
    let lastCardW = -1;
    let lastActivity = performance.now();
    let dragging = false;
    let dragStartX = 0;
    let dragStartProgress = 0;
    let dragMoved = 0;

    const dims = () => {
      const vw = window.innerWidth;
      const cardW = vw < 640 ? 280 : vw < 1024 ? 216 : 264;
      return { cardW, spacing: cardW * 1.04 }; // >cardW → visible gaps
    };

    // Step the clicked card to the centre along the shortest wrapped path.
    const centerOn = (idx: number) => {
      let rel = idx - progress;
      rel = ((rel % N) + N) % N;
      if (rel > N / 2) rel -= N;
      target = progress + rel;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, t - last);
      last = t;
      const now = performance.now();
      const { cardW, spacing } = dims();

      if (target !== null) {
        // Glide to the clicked card at the SAME constant speed as the drift,
        // so a click feels like the standard auto-scroll (not a sharp ease).
        const diff = target - progress;
        const step = GLIDE * dt;
        if (Math.abs(diff) <= step) {
          progress = target;
          target = null;
        } else {
          progress += Math.sign(diff) * step;
        }
      } else if (now - lastActivity > IDLE_MS) {
        progress += DRIFT * dt; // standard auto-scroll after 3s of inactivity
      }

      const sizeChanged = cardW !== lastCardW;
      if (sizeChanged) lastCardW = cardW;
      const cardH = Math.round(cardW * 0.72);

      // Track the centred card so React can mount its video (and only its).
      if (anyVideo) {
        const c = (((Math.round(progress) % N) + N) % N);
        if (c !== centerRef.current) {
          centerRef.current = c;
          setCenter(c);
        }
      }

      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        if (sizeChanged) {
          el.style.width = `${cardW}px`;
          el.style.height = `${cardH}px`;
        }
        let rel = i - progress;
        rel = ((rel % N) + N) % N;
        if (rel > N / 2) rel -= N;
        const a = Math.abs(rel);
        const x = rel * spacing;
        const rotY = Math.max(-58, Math.min(58, -rel * 22));
        const tz = -a * 150;
        const scale = Math.max(0.55, 1 - a * 0.12);
        const opacity = Math.max(0, 1 - Math.max(0, a - 2.2) * 0.9);
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${tz}px) rotateY(${rotY}deg) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = `${100 - Math.round(a * 10)}`;
      }
    };

    // Only interaction: click a card → it centres and opens that artist's
    // profile. Pick the visible card nearest the click (3D-transformed side
    // cards don't hit-test reliably at their painted pixels, so match on screen
    // position instead).
    const onClick = (e: MouseEvent) => {
      if (dragMoved > 8) {
        dragMoved = 0;
        return; // a drag, not a tap — don't open a profile
      }
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < N; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        if (parseFloat(el.style.opacity || "1") < 0.15) continue; // skip faded
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - e.clientX);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best < 0) return;

      centerOn(best);
      openRef.current(items[best].artistIdx); // single click → open artist
    };

    // Drag to scroll the carousel (touch + mouse). A tap with no real movement
    // still opens a profile (see onClick). Any pointer interaction counts as
    // activity, which pauses the auto-scroll for a moment.
    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartProgress = progress;
      dragMoved = 0;
      target = null; // cancel any in-flight glide
      lastActivity = performance.now();
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      lastActivity = performance.now();
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      dragMoved = Math.max(dragMoved, Math.abs(dx));
      progress = dragStartProgress - dx / dims().spacing;
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    wrap.addEventListener("click", onClick);
    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("click", onClick);
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
    };
  }, [N]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-[5%] z-20 h-[46vh] md:bottom-[9%] md:h-[240px]"
      style={{ perspective: "1200px" }}
    >
      <div
        ref={wrapRef}
        className="pointer-events-auto relative mx-auto h-full w-full"
        style={{ transformStyle: "preserve-3d", touchAction: "pan-y" }}
      >
        {items.map((a, i) => (
          <div
            key={i}
            data-idx={i}
            data-cursor="pointer"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/60"
            style={{
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <img
              src={a.img}
              alt={ARTISTS[a.artistIdx].name}
              draggable={false}
              loading="lazy"
              decoding="async"
              className="pointer-events-none h-full w-full select-none object-cover grayscale"
            />
            {i === center && a.video && (
              <LazyVideo
                src={a.video}
                poster={a.img}
                className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover grayscale"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Mobile hero carousel — the Originkit "Smooth 3D Slideshow": active card
   upright & centred, neighbours tilt back (rotateY) with a side tilt (rotateZ),
   recede in depth and dim. Discrete active index with a smooth eased CSS
   transition; autoplays, swipeable, tap a side card to centre it, tap the
   centre card to open that artist. */
function Smooth3DSlideshow({
  onOpenProfile,
}: {
  onOpenProfile: (artistIdx: number) => void;
}) {
  const slides = HERO_SLIDES;
  const n = slides.length;
  const [active, setActive] = useState(0);
  // Size from the viewport up-front so the first paint is already correct —
  // otherwise a post-mount resize would animate the side cards inward.
  const measure = () => {
    // Match the home "artists" section photo: w-full capped at 300px inside a
    // px-6 (24px) section.
    const w = Math.min(300, window.innerWidth - 48);
    return { w, h: Math.round(w * 1.45) };
  };
  const [dim, setDim] = useState(measure);
  // Transitions stay off for the first paint so nothing slides in on load.
  const [ready, setReady] = useState(false);
  const pausedUntil = useRef(0);
  const startX = useRef<number | null>(null);
  const lastX = useRef(0);
  // Set on a swipe so the click that follows pointerup doesn't also fire
  // (which would open the profile).
  const swipedRef = useRef(false);

  useEffect(() => {
    const onResize = () => setDim(measure());
    window.addEventListener("resize", onResize);
    const t = window.setTimeout(() => setReady(true), 60);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
    };
  }, []);

  // Originkit coverflow timing: a 0.6s eased move per card (ease-out, so each
  // card decelerates as it settles into the centre — the natural coverflow
  // feel). HOLD is the full cadence: the 0.6s move, then a ~1s rest so each
  // photo stays on screen long enough to take in before the next advance.
  const DUR = 0.6;
  const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
  const HOLD = 1600;

  const step = useCallback(
    (dir: number) => {
      if (!dir) return;
      setActive((a) => (((a + dir) % n) + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (n < 2) return;
    let id = 0;
    const tick = () => {
      if (performance.now() >= pausedUntil.current) step(1);
      id = window.setTimeout(tick, HOLD);
    };
    // Kick off the first move right away so the carousel starts drifting as
    // soon as the page loads, instead of sitting still for a full HOLD.
    id = window.setTimeout(tick, 250);
    return () => window.clearTimeout(id);
  }, [n, step]);

  // Resume auto-drift 1s after the last interaction — same as the desktop
  // carousel's IDLE_MS.
  const pause = () => {
    pausedUntil.current = performance.now() + 1000;
  };

  const endSwipe = () => {
    if (startX.current == null) return;
    const dx = lastX.current - startX.current;
    startX.current = null;
    pause();
    if (Math.abs(dx) > 40) {
      swipedRef.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };

  const TILT = 12;
  const SIDE = 8;
  const DEPTH = 240;
  const SCALE_STEP = 0.16;
  const MAX_VISIBLE = 2;
  const transitionCss = `transform ${DUR}s ${EASE}, opacity ${DUR}s ${EASE}`;
  const radius = Math.round((3 / 20) * (Math.min(dim.w, dim.h) / 2));

  return (
    <div
      // In-flow flex child (the mobile hero centres title · carousel · CTA in a
      // column); sized to the photo height so the column spacing stays even.
      className="pointer-events-auto relative flex w-full items-center justify-center"
      // pan-y lets the page still scroll vertically while we own horizontal
      // gestures — otherwise the browser hijacks the swipe and fires
      // pointercancel before we see the pointerup.
      style={{
        perspective: "1600px",
        touchAction: "pan-y",
        height: dim.h,
      }}
      onPointerDown={(e) => {
        startX.current = e.clientX;
        lastX.current = e.clientX;
        swipedRef.current = false;
        pause();
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* not all pointer types support capture */
        }
        const a = document.activeElement;
        if (a instanceof HTMLElement && a !== document.body) a.blur();
      }}
      onPointerMove={(e) => {
        if (startX.current != null) lastX.current = e.clientX;
      }}
      onPointerUp={endSwipe}
      onPointerCancel={endSwipe}
    >
      <div
        style={{
          position: "relative",
          width: dim.w,
          height: dim.h,
          transformStyle: "preserve-3d",
        }}
      >
        {slides.map((slide, i) => {
          let rel = i - active;
          if (rel > n / 2) rel -= n;
          if (rel < -n / 2) rel += n;
          const ax = Math.abs(rel);
          const visible = ax <= MAX_VISIBLE;
          const isActive = rel === 0;
          const sc = Math.max(0.4, 1 - ax * SCALE_STEP);
          // Graduated fade so cards ease in/out on the sides rather than
          // popping at the edge of the stack.
          const cardOpacity = Math.max(0, 1 - ax * 0.5);
          const tx = rel * (dim.w * 1.15);
          const tz = -ax * DEPTH;
          const ry = -rel * TILT;
          const rz = rel * SIDE;
          return (
            <div
              key={i}
              onClick={() => {
                if (swipedRef.current) {
                  swipedRef.current = false;
                  return;
                }
                pause();
                if (isActive) onOpenProfile(slide.artistIdx);
                else step(rel);
              }}
              data-cursor="pointer"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: dim.w,
                height: dim.h,
                borderRadius: radius,
                overflow: "hidden",
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
                transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                transition: ready ? transitionCss : "none",
                opacity: cardOpacity,
                pointerEvents: visible ? "auto" : "none",
                backgroundColor: "#111",
                // Same subtle outline the artist / works photos use
                // (Tailwind `ring-1 ring-white/10`).
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            >
              <img
                src={slide.img}
                alt={ARTISTS[slide.artistIdx].name}
                draggable={false}
                loading="lazy"
                decoding="async"
                className="grayscale"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  userSelect: "none",
                }}
              />
              {isActive && slide.video && (
                <LazyVideo
                  src={slide.video}
                  poster={slide.img}
                  className="grayscale"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#000",
                  opacity: isActive ? 0 : 0.2,
                  transition: `opacity ${DUR}s ${EASE}`,
                  pointerEvents: "none",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO — heading + multi-step lead form                                      */
/* The input sits at the exact vertical centre; the heading and button are    */
/* absolutely positioned so they never shift it. The heading blurs while a    */
/* field is active, and the input shakes on invalid submit.                   */
/* -------------------------------------------------------------------------- */

// Lead endpoint — the Cloudflare Worker URL. Set VITE_FORM_ENDPOINT at build
// time. If unset, the form still works locally; it just doesn't ship the lead.
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

type BookingType = "booking" | "consultation";
type LeadContext = {
  type: BookingType;
  source: string;
  artist?: string;
  bodyPart?: string;
};

// The fields a booking can step through (a consultation only asks WhatsApp).
type BookingField = "whatsapp" | "budget";

// Stepped booking / consultation flow (one big field at a time).
//   consultation → whatsapp
//   booking      → budget → whatsapp
// The artist (from /artists) and placement (from /book) come from context.
function BookingForm({
  context,
  onClose,
}: {
  context: LeadContext;
  onClose: () => void;
}) {
  const t = useT();
  const isConsult = context.type === "consultation";
  const steps: BookingField[] = isConsult
    ? ["whatsapp"]
    : ["budget", "whatsapp"];

  const [stepIdx, setStepIdx] = useState(0);
  const [budget, setBudget] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const artist = context.artist || "";
  const bodyPart = context.bodyPart || "";
  const [focused, setFocused] = useState(false);
  const [hp, setHp] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shake = useAnimationControls();

  const cur = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  // Require a country code (leading +) and a plausible length.
  const waDigits = whatsapp.replace(/\D/g, "");
  const waValid = /^\s*\+/.test(whatsapp) && waDigits.length >= 8;

  // Lock scroll + Escape.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Focus the field on each step.
  useEffect(() => {
    inputRef.current?.focus();
  }, [cur]);

  const doShake = () =>
    shake.start({
      x: [0, -10, 9, -8, 6, -3, 0],
      transition: { duration: 0.45, ease: "easeInOut" },
    });

  const send = () => {
    trackLead({ source: context.source, value: Number(budget) || 0 });
    if (!FORM_ENDPOINT) return;
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: context.type,
        whatsapp: whatsapp.trim(),
        budget: isConsult ? "" : budget,
        artist: isConsult ? "" : artist,
        bodyPart: isConsult ? "" : bodyPart,
        source: context.source,
        // Ad attribution (gclid / UTM captured from the landing URL, if any).
        ...(getAttribution() || {}),
        hp,
      }),
    }).catch(() => {});
  };

  const advance = () => {
    if (cur === "whatsapp" && !waValid) return doShake();
    if (isLast) {
      setSent(true);
      send();
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  const big =
    "font-display font-normal text-[1.5rem] leading-none tracking-tight sm:text-[2.2rem] md:text-[3.2rem]";

  // Current text field value + placeholder (budget / whatsapp).
  const isBudget = cur === "budget";
  const value = isBudget ? fmtBudget(budget) : whatsapp;
  const placeholder = isBudget ? t("form.ph.budget") : t("form.ph.whatsapp");
  const Icon = isBudget ? Euro : Smartphone;
  const filled = !!value;
  const waFlag = isBudget ? "" : flagForWhatsapp(whatsapp);

  const contextLabel = context.artist
    ? `${t("form.with")} ${context.artist}`
    : context.bodyPart
      ? context.bodyPart
      : null;

  const honeypot = (
    <input
      type="text"
      name="company"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      value={hp}
      onChange={(e) => setHp(e.target.value)}
      className="absolute left-[-9999px] h-0 w-0 opacity-0"
    />
  );

  const fieldGroup = (
    <motion.div animate={shake} className="flex items-center gap-3 md:gap-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:h-14 md:w-14 ${
          filled ? "bg-white text-black" : "bg-white/30 text-black"
        }`}
      >
        {waFlag ? (
          <span className="text-[22px] leading-none md:text-[26px]">
            {waFlag}
          </span>
        ) : (
          <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
        )}
      </span>

      {
        <div className="relative grid items-center" style={{ maxWidth: "80vw" }}>
          <span
            aria-hidden
            className={`${big} invisible col-start-1 row-start-1 whitespace-pre`}
          >
            {value || placeholder}
          </span>
          <input
            ref={inputRef}
            value={value}
            type="text"
            inputMode={isBudget ? "numeric" : "tel"}
            placeholder={placeholder}
            data-cursor="text"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) =>
              isBudget
                ? setBudget(e.target.value.replace(/\D/g, "").slice(0, 6))
                : setWhatsapp(
                    e.target.value.replace(/[^\d+\s()-]/g, "").slice(0, 24),
                  )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") advance();
            }}
            size={1}
            className={`${big} col-start-1 row-start-1 w-full min-w-0 bg-transparent text-left text-white outline-none placeholder:text-transparent ${
              value ? "caret-white" : "caret-transparent"
            }`}
          />
          {!value && (
            <div
              className={`${big} pointer-events-none absolute inset-0 flex items-center`}
            >
              <span className="whitespace-pre text-white/30">{placeholder}</span>
              {focused && (
                <span
                  className="ml-[3px] w-[2px] shrink-0 bg-white"
                  style={{
                    height: "0.82em",
                    animation: "caretBlink 1.05s steps(1, end) infinite",
                  }}
                />
              )}
            </div>
          )}
        </div>
      }
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#050505]"
    >
      <div className="flex items-center justify-between px-5 pb-3 pt-5">
        <span className="font-serif text-[15px] tracking-tight text-white/60">
          The Four <span className="italic">Deuces</span>
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          data-cursor="pointer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-[12vh] text-center">
        {honeypot}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h2 className="font-serif text-[2.4rem] leading-[1.05] md:text-[3.4rem]">
              {isConsult ? (
                <>
                  {t("form.done.consult.a")}{" "}
                  <span className="italic">{t("form.done.consult.b")}</span>
                </>
              ) : (
                <>
                  {t("form.done.booking.a")}{" "}
                  <span className="italic">{t("form.done.booking.b")}</span>
                </>
              )}
            </h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/70">
              {t("form.done.msg")}
            </p>
            <div className="mt-6 space-y-1 text-[13px]">
              <div>
                <span className="text-white/40">whatsapp</span>{" "}
                <span className="text-white/90">{whatsapp.trim() || "—"}</span>
              </div>
              {!isConsult && (
                <>
                  <div>
                    <span className="text-white/40">{t("form.lbl.budget")}</span>{" "}
                    <span className="text-white/90">
                      {budget ? "€" + fmtBudget(budget) : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40">{t("form.lbl.artist")}</span>{" "}
                    <span className="text-white/90">{artist || "—"}</span>
                  </div>
                  {bodyPart && (
                    <div>
                      <span className="text-white/40">
                        {t("form.lbl.placement")}
                      </span>{" "}
                      <span className="text-white/90">{bodyPart}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="font-serif text-[2rem] leading-[1.1] tracking-tight md:text-[2.8rem]">
                {isConsult ? (
                  <>
                    {t("form.consult.a")}{" "}
                    <span className="italic">{t("form.consult.b")}</span>
                  </>
                ) : (
                  <>
                    {t("form.booking.a")}{" "}
                    <span className="italic">{t("form.booking.b")}</span>
                  </>
                )}
              </h2>
              <p className="mt-3 text-[13px] uppercase tracking-[0.25em] text-white/40">
                {isConsult
                  ? t("form.consult.sub")
                  : contextLabel ||
                    `${t("form.step")} ${stepIdx + 1} ${t("form.of")} ${steps.length}`}
              </p>
            </div>
            {fieldGroup}
            {cur === "whatsapp" && (
              <p className="mt-4 text-[12px] text-white/40">{t("form.hint")}</p>
            )}
            <div className="mt-8 flex h-12 items-start justify-center">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={advance}
                data-cursor="pointer"
                className={PILL(isLast)}
              >
                {isLast
                  ? isConsult
                    ? t("form.submit.consult")
                    : t("form.submit.booking")
                  : t("form.next")}
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Hero({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(id);
  }, []);
  const t = useT();
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(26px)",
        transition:
          "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <h1 className="pointer-events-none absolute left-1/2 top-[14%] w-full -translate-x-1/2 px-6 text-center font-serif text-[2rem] leading-[1.15] tracking-tight md:top-[calc(50%-170px)] md:text-[2.8rem]">
        Ink With Intent.
        <br />
        <span className="italic">Made to Last.</span>
      </h1>

      {/* Primary Book pill + a bold consultation link below (→ WhatsApp). On
          mobile the block matches the carousel's centred card; on desktop it
          matches the width of the "Ink With Intent." title line. */}
      <div className="pointer-events-auto absolute bottom-[3%] left-1/2 flex w-[calc(100vw-3rem)] max-w-[300px] -translate-x-1/2 flex-col items-center gap-4 md:bottom-auto md:top-1/2 md:w-[222px] md:max-w-none md:-translate-y-1/2">
        <button
          type="button"
          onClick={() => onNavigate("/book")}
          data-cursor="pointer"
          className={`${PILL(true)} w-full!`}
        >
          {[t("cta.book.a"), t("cta.book.b")].filter(Boolean).join(" ")}
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="group block text-center text-[13px] text-white/50 transition hover:text-white"
        >
          {t("book.freeconsult")}
          <ArrowUpRight
            className="ml-1.5 inline-block h-3.5 w-3.5 -translate-y-px transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </a>
      </div>
    </div>
  );
}

// Mobile hero — a centred vertical column (title · carousel · CTA) so the photo
// is the middle element and the gaps between the three stay even and scale with
// the screen height. Desktop keeps the absolute-positioned Hero + Carousel.
function MobileHero({
  onNavigate,
  onOpenProfile,
}: {
  onNavigate: (path: string) => void;
  onOpenProfile: (artistIdx: number) => void;
}) {
  const t = useT();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(id);
  }, []);
  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center gap-[clamp(1.5rem,4.5vh,3.25rem)] overflow-hidden px-6 pb-8 pt-20"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(26px)",
        transition:
          "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <h1 className="w-full text-center font-serif text-[2rem] leading-[1.15] tracking-tight">
        Ink With Intent.
        <br />
        <span className="italic">Made to Last.</span>
      </h1>

      <Smooth3DSlideshow onOpenProfile={onOpenProfile} />

      <div className="flex w-[calc(100vw-3rem)] max-w-[300px] flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate("/book")}
          data-cursor="pointer"
          className={`${PILL(true)} w-full!`}
        >
          {[t("cta.book.a"), t("cta.book.b")].filter(Boolean).join(" ")}
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="group block text-center text-[13px] text-white/50 transition hover:text-white"
        >
          {t("book.freeconsult")}
          <ArrowUpRight
            className="ml-1.5 inline-block h-3.5 w-3.5 -translate-y-px transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </a>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* MENU — circular burger button (morphs to a cross) + full-screen overlay     */
/* with a hover text-reveal (line rolls up, siblings dim).                      */
/* -------------------------------------------------------------------------- */

function MenuButton({
  open,
  onClick,
  disabled = false,
}: {
  open: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const t = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-cursor={disabled ? undefined : "pointer"}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="main-menu"
      className={`fixed right-4 top-[9px] z-[60] flex h-12 w-12 items-center justify-center transition-opacity duration-300 md:right-6 md:h-14 md:w-14 ${
        disabled ? "pointer-events-none opacity-30" : "mix-blend-difference"
      }`}
    >
      <motion.span
        className="absolute h-[2px] w-5 rounded-full bg-white md:w-6"
        animate={open ? { y: 0, rotate: 45 } : { y: -3.5, rotate: 0 }}
        transition={t}
      />
      <motion.span
        className="absolute h-[2px] w-5 rounded-full bg-white md:w-6"
        animate={open ? { y: 0, rotate: -45 } : { y: 3.5, rotate: 0 }}
        transition={t}
      />
    </button>
  );
}

// Language switcher — current language label + chevron, opening a small
// dropdown. Sits just left of the burger.
function LanguageSwitcher({
  current,
  onSelect,
}: {
  current: Lang;
  onSelect: (l: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const cur = LANGS.find((l) => l.code === current) ?? LANGS[0];
  return (
    <div className="fixed right-16 top-[9px] z-[60] hidden h-12 items-center md:right-24 md:flex md:h-14">
      <button
        type="button"
        data-cursor="pointer"
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-2 py-1 text-[14px] font-normal tracking-wide text-white transition hover:text-white/70"
      >
        {cur.label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.75}
        />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 flex min-w-[64px] flex-col overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur"
            >
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  data-cursor="pointer"
                  onClick={() => {
                    onSelect(l.code);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 text-left text-[13px] transition hover:bg-white/10 ${
                    l.code === current ? "text-white" : "text-white/60"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile language menu — a globe button beside the burger that opens a
// full-screen panel explaining the choice + listing the languages.
function MobileLangMenu({
  current,
  onSelect,
  open,
  onOpenChange,
  disabled = false,
}: {
  current: Lang;
  onSelect: (l: Lang) => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const t = useT();

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <>
      {/* Globe trigger — mobile only, just left of the burger. Greyed out and
          non-clickable while the burger menu is open. */}
      <button
        type="button"
        disabled={disabled}
        data-cursor={disabled ? undefined : "pointer"}
        aria-label="Change language"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
        className={`fixed right-16 top-[9px] z-[70] flex h-12 w-12 items-center justify-center text-white transition-opacity duration-300 md:hidden ${
          disabled ? "pointer-events-none opacity-30" : "mix-blend-difference"
        }`}
      >
        <Globe className="h-6 w-6" strokeWidth={1.6} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={t("lang.title")}
            className="fixed inset-0 z-[55] flex flex-col items-center justify-center bg-black/70 px-8 backdrop-blur-xl md:hidden"
            onClick={() => onOpenChange(false)}
          >
            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
              }}
              initial="hidden"
              animate="show"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm text-center"
            >
              <motion.h2
                variants={LANG_ITEM}
                className="font-serif text-[2rem] leading-tight"
              >
                {(() => {
                  const parts = t("lang.title").split(" ");
                  const last = parts.pop();
                  return (
                    <>
                      {parts.length ? `${parts.join(" ")} ` : ""}
                      <span className="italic">{last}</span>
                    </>
                  );
                })()}
              </motion.h2>
              <motion.p
                variants={LANG_ITEM}
                className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-white/50"
              >
                {t("lang.desc")}
              </motion.p>
              <div className="mt-8 flex flex-col items-center gap-2.5">
                {LANGS.map((l) => {
                  const isCurrent = l.code === current;
                  return (
                    <motion.button
                      key={l.code}
                      variants={LANG_ITEM}
                      type="button"
                      data-cursor="pointer"
                      onClick={() => {
                        onSelect(l.code);
                        onOpenChange(false);
                      }}
                      className={PILL(isCurrent)}
                    >
                      {LANG_NAMES[l.code] ?? l.label}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const RESULT_TYPE_LABEL: Record<SearchResult["type"], string> = {
  style: "Style",
  faq: "FAQ",
  about: "About",
  guests: "Guests",
};

function SearchOverlay({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const lang = useLang();
  const t = useT();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIdx = useMemo(() => buildSearchIndex(lang), [lang]);
  const results = useMemo(
    () => searchIndex(searchIdx, query),
    [searchIdx, query],
  );
  const showResults = query.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(id);
  }, [open]);

  const goToResult = (r: SearchResult) => {
    onClose();
    onNavigate(r.path);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#050505]"
        >
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <span className="font-serif text-[15px] tracking-tight text-white/60">
              The Four <span className="italic">Deuces</span>
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              data-cursor="pointer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 pb-10">
                        <motion.div
              className="w-full max-w-md shrink-0"
              animate={{ marginTop: showResults ? "6vh" : "22vh" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {!showResults && (
                <div className="mb-6 text-center">
                  <h2 className="font-serif text-[2rem] leading-tight">
                    {t("search.title")}
                  </h2>
                  <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-white/50">
                    {t("search.desc")}
                  </p>
                </div>
              )}
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  data-cursor="text"
                  className="w-full rounded-full border border-white/15 bg-white/[0.04] py-3 pl-11 pr-4 text-[16px] text-white outline-none transition focus:border-white/40 md:text-[14px]"
                />
              </div>
            </motion.div>

            {showResults && (
              <div className="mt-6 w-full max-w-md">
                {results.length === 0 ? (
                  <p className="mt-6 text-center text-[13px] text-white/40">
                    No results for "{query}"
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {results.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goToResult(r)}
                        data-cursor="pointer"
                        className="group flex flex-col items-start gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/25 hover:bg-white/[0.06]"
                      >
                        <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">
                          {RESULT_TYPE_LABEL[r.type]}
                        </span>
                        <span className="text-[15px] text-white/90 transition group-hover:text-white">
                          {r.title}
                        </span>
                        <span className="line-clamp-1 text-[13px] leading-relaxed text-white/50">
                          {r.snippet}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Menu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const [hovered, setHovered] = useState<number | null>(null);
  const anyActive = hovered !== null;
  const reveal = { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const;
  const line =
    "block font-display font-normal leading-[0.9] tracking-[-0.03em] text-[14vw] md:text-[7rem]";
  const sections = MENU;

  // Live Amsterdam local time (shown in the mobile menu footer).
  const [amsTime, setAmsTime] = useState("");
  useEffect(() => {
    const update = () =>
      setAmsTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Europe/Amsterdam",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Close on Escape + lock background scroll while the menu is open.
    useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const go = (item: (typeof MENU)[number]) => {
    onClose();
    const onHome =
      window.location.pathname === "/" || window.location.pathname === "";
    if (item.target === "top") {
      if (onHome) window.scrollTo({ top: 0, behavior: "smooth" });
      else onNavigate("/");
    } else if (item.target.startsWith("#")) {
      if (onHome) {
        document
          .querySelector(item.target)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Coming from a sub-page: go home first, then scroll to the section.
        onNavigate("/");
        setTimeout(() => {
          document
            .querySelector(item.target)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 140);
      }
    } else {
      onNavigate(item.target);
    }
  };

  return (
    <AnimatePresence onExitComplete={() => setHovered(null)}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseLeave={() => setHovered(null)}
          id="main-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          <nav className="flex flex-1 flex-col items-center justify-center gap-1 px-6 md:gap-2">
            {sections.map((item, i) => {
              const isHovered = hovered === i;
              const color = anyActive
                ? isHovered
                  ? "#FFFFFF"
                  : "#51565A"
                : "#FFFFFF";
              return (
                <motion.div
                  key={item.tkey}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 28 }}
                  transition={{
                    duration: 0.5,
                    delay: open ? 0.08 + i * 0.06 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onClick={() => go(item)}
                  data-cursor="pointer"
                  className="overflow-hidden"
                >
                  <motion.div
                    className="relative"
                    animate={{ y: isHovered ? "-100%" : "0%" }}
                    transition={reveal}
                  >
                    <span className={line} style={{ color, transition: "color 0.2s ease" }}>
                      {t(item.tkey)}
                    </span>
                    <span
                      aria-hidden
                      className={`${line} absolute left-0 top-full w-full`}
                      style={{ color, transition: "color 0.2s ease" }}
                    >
                      {t(item.tkey)}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </nav>

          {/* Address + local time — mobile only, under the menu links */}
          <div className="border-t border-white/10 px-6 py-6 text-center text-[12px] leading-relaxed text-white/45 md:hidden">
            <a
              href="https://www.google.com/maps/search/?api=1&query=The%20Four%20Deuces%20Van%20Baerlestraat%20126H%201071%20BD%20Amsterdam"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="transition hover:text-white/70"
            >
              Van Baerlestraat 126 H, 1071 BD Amsterdam
            </a>
            <p className="mt-1.5 text-white/35">Local time · {amsTime}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* ARTIST SHOWCASE — one section for all artists; a vertical button carousel   */
/* on the left switches the shown profile.                                     */
/* -------------------------------------------------------------------------- */

/* Vertical button carousel: small avatar buttons on an arc. The active one is
   centred + highlighted; clicking one selects that artist. */
function WorksLightbox({
  artistIdx,
  startIndex = 0,
  onClose,
}: {
  artistIdx: number | null;
  startIndex?: number;
  onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const open = artistIdx !== null;

  // Open on the clicked work (jump straight to it, no scroll animation).
  useEffect(() => {
    if (!open) return;
    setIdx(startIndex);
    const jump = () => {
      const el = trackRef.current;
      if (el) el.scrollLeft = startIndex * el.clientWidth;
    };
    jump(); // element is already mounted at effect time
    requestAnimationFrame(jump); // re-apply once layout settles
  }, [artistIdx, open, startIndex]);

  // Step to an adjacent work (used by the arrow keys).
  const go = useCallback((delta: number) => {
    const el = trackRef.current;
    if (!el) return;
    const target = Math.round(el.scrollLeft / el.clientWidth) + delta;
    const clamped = Math.max(0, Math.min(target, el.children.length - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  }, []);

  // Lock page scroll; close on Escape; step with the arrow keys; and let a
  // (vertical) mouse wheel scroll horizontally through the works on desktop.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    // Wheel / trackpad → page one work at a time. A short cooldown means one
    // scroll gesture advances a single image (snap-mandatory fights a raw
    // scrollLeft += delta, so we page explicitly instead).
    const track = trackRef.current;
    let cooling = false;
    const onWheel = (e: WheelEvent) => {
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 4 || !track) return;
      e.preventDefault();
      if (cooling) return;
      cooling = true;
      setTimeout(() => {
        cooling = false;
      }, 350);
      go(delta > 0 ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    track?.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      track?.removeEventListener("wheel", onWheel);
    };
  }, [open, onClose, go]);

  const artist = artistIdx !== null ? ARTISTS[artistIdx] : null;
  const works = artistIdx !== null ? WORKS_BY_ARTIST[artistIdx] : [];

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <AnimatePresence>
      {open && artist && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col bg-[#050505]"
        >
          {/* Top bar: artist + counter + close */}
          <div className="flex items-center justify-between px-5 pb-3 pt-5">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                <img
                  src={artist.img}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="leading-tight">
                <p className="text-[14px] font-medium">{artist.name}</p>
                <p className="text-[11px] text-white/45">
                  {idx + 1} / {works.length}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              data-cursor="pointer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Swipeable works */}
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="flex flex-1 snap-x snap-mandatory overflow-y-hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {works.map((w, i) => (
              <div
                key={i}
                className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4 pb-4"
              >
                {w.video && i === idx ? (
                  <LazyVideo
                    src={w.video}
                    poster={w.img}
                    className="max-h-full max-w-full rounded-xl object-contain"
                  />
                ) : (
                  <FadeImg
                    src={w.img}
                    alt={`${artist.name} — work ${i + 1}`}
                    draggable={false}
                    className="max-h-full max-w-full rounded-xl object-contain"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Dots */}
          {works.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pb-7 pt-1">
              {works.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full bg-white transition-all duration-300"
                  style={{ width: i === idx ? 18 : 6, opacity: i === idx ? 1 : 0.35 }}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Renders an artist's "role" string with each recognised style word linking to
// its style landing page (the rest stays plain text).
function ArtistShowcase({
  active,
  onSelect,
  onNavigate,
  onBook,
}: {
  active: number;
  onSelect: (i: number) => void;
  onNavigate: (path: string) => void;
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const t = useT();
  const lang = useLang();
  const M = ARTISTS.length;
  const artist = ARTISTS[active];
  const at = getArtistText(lang, artist.name);
  const role = at?.role ?? artist.role;
  const bio = at?.bio ?? artist.bio;
  const [dir, setDir] = useState(1);
  const prevRef = useRef(active);
  useEffect(() => {
    let d = active - prevRef.current;
    d = ((d % M) + M) % M;
    if (d > M / 2) d -= M;
    if (d !== 0) setDir(Math.sign(d));
    prevRef.current = active;
  }, [active, M]);

  return (
    <section
      id="artists"
      className="relative flex min-h-screen flex-col justify-center px-6 py-24 md:px-16"
    >
      {/* Mobile-only title (matches the /artists page; floats in like Reviews) */}
      <Reveal className="mb-12 md:hidden">
        <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
          {t("ui.ourArtists")}
        </p>
        <h2 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight">
          {t("ui.artists")}
        </h2>
      </Reveal>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-center md:gap-14">
        <Reveal className="hidden shrink-0 md:block" y={24}>
          <ArtistButtons active={active} onSelect={onSelect} />
        </Reveal>

        {/* Photo */}
        <Reveal
          className="w-full max-w-[300px] shrink-0 md:max-w-md"
          y={24}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
            <motion.img
              key={active}
              src={artist.img}
              alt={artist.name}
              draggable={false}
              initial={{ opacity: 0, x: dir * 80, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </Reveal>

        {/* Mobile-only: horizontal artist selector under the photo */}
        <Reveal className="md:hidden">
          <ArtistRow active={active} onSelect={onSelect} />
        </Reveal>

        {/* Text */}
        <Reveal className="flex-1" y={24}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {String(active + 1).padStart(2, "0")} —{" "}
              <RoleLinks role={role} onNavigate={onNavigate} />
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[5.5rem]">
              {artist.name}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              {bio}
            </p>
            {artist.since && (
              <p className="mt-4 text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("ui.tattooingSince")} {artist.since}
              </p>
            )}
            <div className="mt-8 flex w-full flex-col items-center gap-2.5 md:w-auto md:flex-row md:justify-start md:gap-3">
              <button
                type="button"
                onClick={() => onBook({ artist: artist.name })}
                data-cursor="pointer"
                className={PILL(true)}
              >
                {t("ui.bookWith")} {artist.name}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(active);
                  onNavigate("/artists");
                }}
                data-cursor="pointer"
                className={PILL(false)}
              >
                {t("ui.seePortfolio")}
              </button>
                            <div className="flex w-full flex-col items-center gap-2 md:w-auto md:contents">
                <p className="text-[13px] text-white/45 md:hidden">{t("book.notsure")}</p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="pointer"
                  className={PILL(false)}
                >
                  {t("book.freeconsult")}
                </a>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* ARTISTS PAGE — /artists route: switch between artists; each shows photo,   */
/* styles, bio and a grid of up to 18 works.                                  */
/* -------------------------------------------------------------------------- */


function ChatCard({ chat }: { chat: ChatThread }) {
  return (
    <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
      <div className="flex flex-col gap-2">
        {chat.messages.map((m, mi) => {
          const isMe = m.from === "me";
          return (
            <div
              key={mi}
              className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%]">
                {m.timestamp && (
                  <div className="mb-1 text-center text-[11px] text-white/40">
                    {m.timestamp}
                  </div>
                )}
                <div
                  className="text-[14px] leading-[1.4]"
                  style={{
                    padding: "9px 14px",
                    color: "#fff",
                    background: isMe ? "#7a5cf0" : "#2a2a2e",
                    borderRadius: isMe
                      ? "20px 20px 6px 20px"
                      : "20px 20px 20px 6px",
                  }}
                >
                  {m.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-[12px]">
        <span className="text-white/30">#tfdfeedback </span>
        <a
          href={`https://instagram.com/${chat.handle}`}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="text-white/55 transition hover:text-white"
        >
          @{chat.handle}
        </a>
      </div>
    </div>
  );
}

const REVIEW_MASK =
  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";

function FloatingColumn({
  items,
  dir,
  duration,
  className = "",
}: {
  items: ChatThread[];
  dir: "up" | "down";
  duration: number;
  className?: string;
}) {
  return (
    <div
      className={`group relative h-[560px] overflow-hidden md:h-[720px] ${className}`}
      style={{ WebkitMaskImage: REVIEW_MASK, maskImage: REVIEW_MASK }}
    >
      <div
        className="tfd-marquee absolute inset-x-0 top-0 flex flex-col [animation-play-state:running] group-hover:[animation-play-state:paused]"
        style={{
          animation: `${dir === "up" ? "tfdFloatUp" : "tfdFloatDown"} ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {/* rendered twice for a seamless loop */}
        {[...items, ...items].map((c, i) => (
          <ChatCard key={i} chat={c} />
        ))}
      </div>
    </div>
  );
}

// Mobile reviews — a single floating column (like the desktop marquee) that the
// user can also drag up/down. Auto-float pauses on touch and resumes 1s later.
function MobileReviews() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const DRIFT = 0.04; // px per ms — gentle upward float
    const IDLE_MS = 1000; // resume floating 1s after the last interaction

    let raf = 0;
    let last = performance.now();
    let lastActivity = 0; // float straight away
    let offset = 0;
    const secondCopy = () => track.children[1] as HTMLElement | undefined;
    let half = secondCopy()?.offsetTop || 0; // height of one full copy
    let dragging = false;
    let dragStartY = 0;
    let dragStartOffset = 0;

    const ro = new ResizeObserver(() => {
      half = secondCopy()?.offsetTop || half;
    });
    ro.observe(track);

    const wrapOffset = () => {
      if (half <= 0) return;
      while (offset <= -half) offset += half;
      while (offset > 0) offset -= half;
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, t - last);
      last = t;
      if (!dragging && performance.now() - lastActivity > IDLE_MS) {
        offset -= DRIFT * dt; // float upward
      }
      wrapOffset();
      track.style.transform = `translateY(${offset}px)`;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartY = e.clientY;
      dragStartOffset = offset;
      lastActivity = performance.now();
      try {
        wrap.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      lastActivity = performance.now();
      if (!dragging) return;
      offset = dragStartOffset + (e.clientY - dragStartY);
      wrapOffset();
      track.style.transform = `translateY(${offset}px)`; // immediate feedback
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      lastActivity = performance.now();
      try {
        wrap.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    wrap.addEventListener("pointerdown", onPointerDown);
    wrap.addEventListener("pointermove", onPointerMove, { passive: true });
    wrap.addEventListener("pointerup", onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointerdown", onPointerDown);
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerup", onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-[60vh] overflow-hidden md:hidden"
      style={{
        WebkitMaskImage: REVIEW_MASK,
        maskImage: REVIEW_MASK,
        touchAction: "none",
      }}
    >
      <div
        ref={trackRef}
        className="absolute inset-x-0 top-0 flex flex-col will-change-transform"
      >
        {/* rendered twice for a seamless loop */}
        <div className="flex flex-col">
          {CHATS.map((c, i) => (
            <ChatCard key={i} chat={c} />
          ))}
        </div>
        <div className="flex flex-col">
          {CHATS.map((c, i) => (
            <ChatCard key={`b${i}`} chat={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Reviews() {
  const t = useT();
  const left = CHATS.filter((_, i) => i % 2 === 0);
  const right = CHATS.filter((_, i) => i % 2 === 1);

  return (
    <section
      id="reviews"
      className="relative overflow-hidden px-6 py-24 md:px-16 md:py-32"
    >
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("ui.whatPeopleSay")}
          </p>
          <h2 className="mb-12 text-center font-serif text-[2.6rem] leading-[0.95] tracking-tight md:mb-16 md:text-[4.5rem]">
            {t("ui.reviews")}
          </h2>
        </Reveal>

        <Reveal>
          {/* Mobile: one floating, draggable column with every review. */}
          <MobileReviews />

          {/* Desktop: two auto-scrolling columns, split. */}
          <div className="hidden gap-6 md:grid md:grid-cols-2">
            <FloatingColumn items={left} dir="down" duration={60} />
            <FloatingColumn items={right} dir="up" duration={60} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SPONSORS — supplier logos (muted → brighten on hover, clickable)            */
/* -------------------------------------------------------------------------- */

const SPONSORS = [
  {
    name: "Tattooland",
    logo: tattoolandLogo,
    tag: "Supply partner",
    url: "https://www.tattooland.com/",
  },
  {
    name: "Killer Ink",
    logo: killerinkLogo,
    tag: "Supply partner",
    url: "https://www.killerinktattoo.com/",
  },
  {
    name: "Dasha Tattoo Supplies",
    logo: dashaLogo,
    tag: "Supply partner",
    url: "https://dashatattoo.com/",
  },
];

function Sponsors() {
  const t = useT();
  return (
    <section id="sponsors" className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("partners.kicker")}
          </p>
          <h2 className="mb-12 text-center font-serif text-[2.6rem] leading-[0.95] tracking-tight md:mb-16 md:text-[4.5rem]">
            {t("partners.title")}
          </h2>
        </Reveal>
        <div className="border-t border-white/10">
          {SPONSORS.map((s) => (
          <Reveal key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="group flex items-center justify-between gap-6 border-b border-white/10 py-7 transition-colors hover:bg-white/[0.03] md:py-9"
          >
            <div className="flex min-w-0 items-center gap-3 md:gap-5">
              <img
                src={s.logo}
                alt=""
                className="h-9 w-auto max-w-[110px] shrink-0 object-contain opacity-70 transition duration-300 group-hover:opacity-100 md:h-14 md:max-w-[160px]"
              />
              <span className="truncate font-serif text-[1.35rem] leading-none text-white md:text-[2.2rem]">
                {s.name}
              </span>
            </div>

            <div className="flex items-center gap-6 md:gap-12">
              <span className="hidden text-right text-[13px] uppercase tracking-wide text-white/40 md:block">
                {t("ui.supplyPartner")}
              </span>
              <ArrowUpRight
                className="h-5 w-5 shrink-0 text-white/45 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white md:h-6 md:w-6"
                strokeWidth={1.75}
              />
            </div>
          </a>
          </Reveal>
        ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT PAGE — /contact route                                              */
/* -------------------------------------------------------------------------- */

function smoothScrollToId(id: string, duration = 950) {
  const el = document.getElementById(id);
  if (!el) return;
  const startY = window.scrollY;
  const dist = el.getBoundingClientRect().top; // distance to bring it to the top
  if (Math.abs(dist) < 2) return;
  let startT: number | null = null;
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const step = (now: number) => {
    if (startT === null) startT = now;
    const p = Math.min(1, (now - startT) / duration);
    window.scrollTo(0, startY + dist * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Fullscreen, non-dismissable notice shown when a phone is held in landscape.
// It clears itself the moment the device returns to portrait.
function RotateNotice() {
  const t = useT();
  const [landscape, setLandscape] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(orientation: landscape) and (max-height: 500px)",
    );
    const update = () => setLandscape(mq.matches);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  if (!landscape) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-[#050505] px-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <Smartphone className="h-7 w-7 text-white" strokeWidth={1.75} />
      </span>
      <h2 className="font-serif text-[2rem] leading-[1.05]">
        {t("rotate.a")} <span className="italic">{t("rotate.b")}</span>
      </h2>
      <p className="max-w-sm text-[14px] leading-relaxed text-white/60">
        {t("rotate.msg")}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 404 — ASCII fire spelled from the studio's letters                          */
/* -------------------------------------------------------------------------- */

function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only wait on what's actually visible on first paint (artist portraits
    // shown in the home carousel + hero), not every work image across all
    // artists — that's what was causing the multi-second blank load.
    const firstArtistWorks = WORKS_BY_ARTIST[0]?.slice(0, 4).map((w) => w.img) ?? [];
    const urls = Array.from(
      new Set([...ARTISTS.map((a) => a.img), ...firstArtistWorks]),
    );
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        onDone();
      }
    };
    if (urls.length === 0) {
      finish();
      return;
    }
    let loaded = 0;
    const bump = () => {
      loaded += 1;
      setProgress(Math.round((loaded / urls.length) * 100));
      if (loaded >= urls.length) finish();
    };
    urls.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });
    // Never block longer than 6s, even on a slow connection.
    const timer = setTimeout(finish, 6000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-6 bg-[#050505]"
    >
      <p className="font-serif text-[28px] leading-none tracking-tight text-white/90">
        The Four <span className="italic">Deuces</span>
      </p>
      <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full bg-white transition-[width] duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
        {progress}%
      </p>
    </motion.div>
  );
}

const CONSENT_KEY = "tfd-consent";
type Consent = "accepted" | "declined";

// Microsoft Clarity — loaded ONLY after the visitor accepts. Set the project id
// as VITE_CLARITY_ID at build time; without it this is a no-op.
let clarityStarted = false;
function loadClarity() {
  const id = import.meta.env.VITE_CLARITY_ID as string | undefined;
  if (!id || clarityStarted) return;
  clarityStarted = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.clarity =
    w.clarity ||
    function () {
      (w.clarity.q = w.clarity.q || []).push(arguments);
    };
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.clarity.ms/tag/" + id;
  const first = document.getElementsByTagName("script")[0];
  if (first && first.parentNode) first.parentNode.insertBefore(s, first);
}

/* -------------------------------------------------------------------------- */
/* SITE FOOTER — shown on every page. CTAs (from the menu) + nav columns +      */
/* brand. Same width as the Partners section.                                   */
/* -------------------------------------------------------------------------- */

function SiteFooter({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const styles = getStyles(useLang());
  const linkCls = "text-[14px] text-white/55 transition hover:text-white";
  const headCls = "mb-4 text-[11px] uppercase tracking-[0.25em] text-white/40";
  const goAnchor = (sel: string) => {
    const onHome =
      window.location.pathname === "/" || window.location.pathname === "";
    if (onHome) {
      document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
    } else {
      onNavigate("/");
      setTimeout(
        () => document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" }),
        140,
      );
    }
  };

  return (
    <footer className="px-6 py-14 md:px-16">
      <div className="mx-auto w-full max-w-6xl">
        {/* Nav columns — Discover · Studio · Tattoo styles */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-12 text-center sm:text-left md:grid-cols-4 md:gap-x-10">
          <div>
            <p className={headCls}>{t("footer.discover")}</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: t("nav.home"), path: "/" },
                { label: t("nav.artists"), path: "/artists" },
                { label: t("nav.reviews"), path: "#reviews" },
                { label: t("nav.partners"), path: "#sponsors" },
              ].map((l) => (
                <li key={l.path}>
                  <button
                    onClick={() =>
                      l.path.startsWith("#") ? goAnchor(l.path) : onNavigate(l.path)
                    }
                    data-cursor="pointer"
                    className={linkCls}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={headCls}>{t("footer.studio")}</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: t("nav.about"), path: "/about" },
                { label: t("nav.faq"), path: "/faq" },
                { label: t("nav.guests"), path: "/guests" },
                { label: t("nav.contact"), path: "/contact" },
              ].map((l) => (
                <li key={l.path}>
                  <button
                    onClick={() => onNavigate(l.path)}
                    data-cursor="pointer"
                    className={linkCls}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {(() => {
            const styleLinks = [
              { label: t("nav.styles"), path: "/styles" },
              ...styles.map((s) => ({ label: s.nav, path: s.slug })),
            ];
            const half = Math.ceil(styleLinks.length / 2);
            const groups = [styleLinks.slice(0, half), styleLinks.slice(half)];
            return groups.map((group, gi) => (
              <div key={gi}>
                <p
                  className={gi === 0 ? headCls : `${headCls} invisible`}
                  aria-hidden={gi === 1}
                >
                  {t("footer.styles")}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {group.map((l) => (
                    <li key={l.path}>
                      <button
                        onClick={() => onNavigate(l.path)}
                        data-cursor="pointer"
                        className={linkCls}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ));
          })()}
        </div>

        {/* Brand + credit */}
        <div className="border-t border-white/10 pt-10 text-center">
          <p className="font-serif text-[24px] leading-none tracking-tight text-white/70">
            The Four <span className="italic">Deuces</span>
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/40">
            {t("footer.designed")}{" "}
            <a
              href="https://aerdt.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="text-white/70 underline underline-offset-4 transition hover:text-white"
            >
              aerdt
            </a>
          </p>
          {/* Mobile: Terms left, © right */}
          <div className="mt-6 flex w-full items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-white/30 md:hidden">
            <button
              onClick={() => onNavigate("/terms")}
              data-cursor="pointer"
              className="shrink-0 transition hover:text-white/70"
            >
              {t("footer.terms")}
            </button>
            <span>© 2020–{new Date().getFullYear()} The Four Deuces</span>
          </div>
          {/* Desktop: centred */}
          <div className="mt-6 hidden items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/30 md:flex">
            <button
              onClick={() => onNavigate("/terms")}
              data-cursor="pointer"
              className="transition hover:text-white/70"
            >
              {t("footer.terms")}
            </button>
            <span className="text-white/15">·</span>
            <span>© 2020–{new Date().getFullYear()} The Four Deuces</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [consent, setConsent] = useState<Consent | null>(() =>
    typeof localStorage !== "undefined"
      ? (localStorage.getItem(CONSENT_KEY) as Consent | null)
      : null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [activeArtist, setActiveArtist] = useState(0);
  const [worksArtist, setWorksArtist] = useState<number | null>(null);
  const [worksStart, setWorksStart] = useState(0);
  const openWorks = (artistIdx: number, startIndex = 0) => {
    setWorksStart(startIndex);
    setWorksArtist(artistIdx);
  };
  const [booking, setBooking] = useState<LeadContext | null>(null);
  const [loading, setLoading] = useState(true);
  const finishLoading = useCallback(() => setLoading(false), []);
  const [route, setRoute] = useState(() => window.location.pathname);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Set Consent Mode defaults (denied) + load gtag as early as possible, and
  // capture any ad click id / UTM from the landing URL for lead attribution.
  useEffect(() => {
    captureAttribution();
    initAnalytics();
  }, []);

  // Returning visitor who already accepted → grant consent + start analytics.
  useEffect(() => {
    if (consent === "accepted") {
      grantConsent();
      loadClarity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decideConsent = (choice: Consent) => {
    setConsent(choice);
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* ignore */
    }
    if (choice === "accepted") {
      grantConsent();
      loadClarity();
    } else {
      denyConsent();
    }
  };

  // Current language + the language-agnostic path ("/", "/book", "/realism").
  const { lang, rest } = splitLangPath(route);
  // App-level translate (App sits above the LangContext.Provider).
  const tr = (key: string) => translate(lang, key);

  // Keep the document language in sync for accessibility / SEO.
  useEffect(() => {
    document.documentElement.lang = htmlLangFor(lang);
  }, [lang]);

  // navigate() takes a language-agnostic path and keeps the current language
  // prefix (e.g. on /nl, navigate("/book") → /nl/book).
  const navigate = (p: string) => {
    setMenuOpen(false);
    const target = langPath(lang, p);
    if (target !== window.location.pathname) {
      window.history.pushState({}, "", target);
      setRoute(target);
    }
    window.scrollTo(0, 0);
  };

  // Switch language, staying on the same page.
  const setLang = (next: Lang) => {
    const target = langPath(next, rest);
    if (target !== window.location.pathname) {
      window.history.pushState({}, "", target);
      setRoute(target);
    }
  };

  const path = rest.replace(/\/+$/, "") || "/";
  // Localised style list for the current language (slug lookup is unchanged).
  const localizedStyles = useMemo(() => getStyles(lang), [lang]);
  const stylePage = localizedStyles.find((s) => s.slug === path);
  const page =
    path === "/"
      ? "home"
      : path === "/about"
        ? "about"
        : path === "/contact"
          ? "contact"
          : path === "/book" || path === "/guide"
            ? "book"
            : path === "/artists"
              ? "artists"
              : path === "/faq"
                ? "faq"
                : path === "/terms"
                  ? "terms"
                  : path === "/guests"
                    ? "guests"
                    : path === "/styles"
                      ? "styles"
                      : stylePage
                        ? "style"
                        : "notfound";
  const isHome = page === "home";

  // Client-side navigation doesn't reload the document, so keep the tab title
  // in sync with the route (mirrors the per-route titles baked into the
  // prerendered HTML in vite.config.ts).
  useEffect(() => {
    if (page === "style" && stylePage) {
      document.title = stylePage.seoTitle;
      return;
    }
    const titles: Record<string, string> = {
      home: tr("title.home"),
      about: getAbout(lang).seoTitle,
      book: tr("title.book"),
      artists: tr("title.artists"),
      faq: tr("title.faq"),
      contact: tr("title.contact"),
      terms: tr("title.terms"),
      guests: tr("title.guests"),
      notfound: tr("title.notfound"),
    };
    document.title = titles[page] ?? titles.home;
  }, [page, stylePage, lang]);

  // SPA navigation → GA4 page_view (fires after the title updates above).
  useEffect(() => {
    trackPageview(path);
  }, [path]);

  const openProfile = (i: number) => {
    setActiveArtist(i);
    smoothScrollToId("artists", 950);
  };

  // From a style page → open that artist on the /artists page.
  const openArtist = (i: number) => {
    setActiveArtist(i);
    navigate("/artists");
  };

  const openBooking = (
    ctx: { source?: string; artist?: string; bodyPart?: string } = {},
  ) => {
    setMenuOpen(false);
    const source =
      ctx.source ?? (ctx.artist ? "artist" : ctx.bodyPart ? "book" : "hero");
    setBooking({
      type: "booking",
      source,
      artist: ctx.artist,
      bodyPart: ctx.bodyPart,
    });
  };

  const openConsult = (source = "hero") => {
    setMenuOpen(false);
    setBooking({ type: "consultation", source });
  };

  return (
    <LangContext.Provider value={lang}>
    <div className="relative w-full overflow-x-hidden bg-[#050505] text-white">
      {/* ===================== LOADER ===================== */}
      <AnimatePresence>
        {loading && <Loader key="loader" onDone={finishLoading} />}
      </AnimatePresence>

      {/* ===================== HEADER ===================== */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-start justify-between px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <a
            href="https://instagram.com/the.four.deuces"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 backdrop-blur transition hover:bg-white/10"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                background:
                  "linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)",
              }}
            >
              <Instagram className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
            </span>
            <span className="text-[11px] font-medium text-white/80">
              @the.four.deuces
            </span>
          </a>
          <div className="relative hidden h-4 w-[46vw] max-w-[560px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_82%,transparent)] sm:block">
            <motion.div
              className="absolute whitespace-nowrap text-[11px] tracking-wide text-white/45"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
              {TICKER.repeat(4)}
            </motion.div>
          </div>
        </div>

      </header>

      {/* Burger menu + language switcher — always available. On mobile the
          language switcher is a globe (MobileLangMenu); while its menu is open
          the burger is greyed out and non-clickable. */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
        data-cursor="pointer"
        className="fixed right-32 top-[9px] z-[60] hidden h-12 w-12 items-center justify-center text-white transition-opacity duration-300 md:right-40 md:flex md:h-14 md:w-14"
      >
        <Search className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        disabled={langMenuOpen || menuOpen}
        onClick={() => setSearchOpen(true)}
        aria-label="Search"
        data-cursor={langMenuOpen || menuOpen ? undefined : "pointer"}
        className={`fixed right-28 top-[9px] z-[70] flex h-12 w-12 items-center justify-center text-white transition-opacity duration-300 md:hidden ${
          langMenuOpen || menuOpen ? "pointer-events-none opacity-30" : "mix-blend-difference"
        }`}
      >
        <Search className="h-6 w-6" strokeWidth={1.6} />
      </button>
      <LanguageSwitcher current={lang} onSelect={setLang} />
      <MobileLangMenu
        current={lang}
        onSelect={setLang}
        open={langMenuOpen}
        disabled={menuOpen}
        onOpenChange={(v) => {
          if (v) setMenuOpen(false);
          setLangMenuOpen(v);
        }}
      />
      <MenuButton
        open={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
        disabled={langMenuOpen}
      />
      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />

      <Suspense fallback={<div className="min-h-screen" />}>
      {isHome ? (
        <>
          {/* ============ FIRST SCREEN: hero + carousel ============ */}
          {isMobile ? (
            <MobileHero onNavigate={navigate} onOpenProfile={openProfile} />
          ) : (
            <section className="relative min-h-screen overflow-hidden">
              <main className="pointer-events-none relative z-30 min-h-screen">
                <Hero onNavigate={navigate} />
              </main>
              <Carousel onOpenProfile={openProfile} />
            </section>
          )}

          {/* ============ ARTIST SHOWCASE ============ */}
          <ArtistShowcase
            active={activeArtist}
            onSelect={setActiveArtist}
            onNavigate={navigate}
            onBook={openBooking}
          />

          {/* ============ REVIEWS ============ */}
          <Reviews />

          {/* ============ SPONSORS ============ */}
          <Sponsors />

          {/* Hidden SEO copy — mirrors /about; present in the DOM for crawlers,
              visually hidden (sr-only) so it doesn't affect the design. */}
          <section className="sr-only">
            <h2>{getAbout(lang).title} — Tattoo Studio in Amsterdam</h2>
            {getAbout(lang).intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h3>{getAbout(lang).whyTitle}</h3>
            {getAbout(lang).why.map((w) => (
              <p key={w.h}>
                <strong>{w.h}.</strong> {w.p}
              </p>
            ))}
            <h3>{getAbout(lang).locationTitle}</h3>
            {getAbout(lang).location.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

        </>
      ) : page === "contact" ? (
        <ContactPage onNavigate={navigate} />
      ) : page === "book" ? (
        <BookPage onBook={openBooking} />
      ) : page === "faq" ? (
        <FaqPage onNavigate={navigate} onConsult={() => openConsult("faq")} />
      ) : page === "artists" ? (
        <ArtistsPage
          active={activeArtist}
          onSelect={setActiveArtist}
          onOpenWorks={openWorks}
          onBook={openBooking}
          onNavigate={navigate}
        />
      ) : page === "terms" ? (
        <TermsPage />
      ) : page === "guests" ? (
        <GuestsPage />
      ) : page === "styles" ? (
        <StylesIndexPage onNavigate={navigate} />
      ) : page === "about" ? (
        <AboutPage onNavigate={navigate} />
      ) : page === "style" && stylePage ? (
        <StylePage
          style={stylePage}
          onNavigate={navigate}
          onOpenArtist={openArtist}
        />
      ) : (
        <NotFoundPage onNavigate={navigate} />
      )}
      </Suspense>

      {/* ===================== FOOTER (every page) ===================== */}
      <SiteFooter onNavigate={navigate} />

      {/* ===================== WORKS LIGHTBOX ===================== */}
      <WorksLightbox
        artistIdx={worksArtist}
        startIndex={worksStart}
        onClose={() => setWorksArtist(null)}
      />

      {/* ===================== BOOKING / CONSULTATION OVERLAY ============ */}
      <AnimatePresence>
        {booking && (
          <BookingForm
            key="booking"
            context={booking}
            onClose={() => setBooking(null)}
          />
        )}
      </AnimatePresence>

      {/* ===================== COOKIE BANNER ===================== */}
      <AnimatePresence>
        {consent === null && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
          >
            <div className="flex w-full max-w-[560px] flex-col gap-3 rounded-[28px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:flex-row md:items-center md:gap-3 md:rounded-[28px] md:p-2 md:pl-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Cookie className="h-4 w-4 text-white/70" strokeWidth={2} />
                </span>
                <p className="flex-1 text-[11px] leading-tight text-white/60 md:flex-1">
                  {tr("cookie.text")}
                </p>
              </div>
              <div className="flex items-center gap-2 md:justify-end md:gap-3">
                <button
                  onClick={() => decideConsent("declined")}
                  className="flex-1 rounded-full px-4 py-2 text-[12px] text-white/70 transition hover:text-white md:flex-none"
                >
                  {tr("cookie.decline")}
                </button>
                <button
                  onClick={() => decideConsent("accepted")}
                  className="flex-1 rounded-full bg-white px-5 py-2 text-[12px] font-medium text-black transition hover:bg-white/90 md:flex-none"
                >
                  {tr("cookie.accept")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor />
      <RotateNotice />
    </div>
    </LangContext.Provider>
  );
}
