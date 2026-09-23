import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useAnimationFrame,
  useMotionValue,
} from "motion/react";
import {
  Check,
  Cookie,
  Instagram,
  ArrowUpRight,
  ChevronDown,
  Download,
  Smartphone,
  Euro,
  X,
  Globe,
  Search,
} from "lucide-react";
import dariaImg from "./img/artists/daria.jpg";
import eugeneImg from "./img/artists/eugene.jpg";
import maxImg from "./img/artists/max.jpg";
import milaImg from "./img/artists/mila.jpg";
import selcukImg from "./img/artists/selcuk.jpg";
import gianlucaImg from "./img/artists/gianluca.jpg";
import daryaImg from "./img/artists/darya.jpg";
import tattoolandLogo from "./img/partners/tattooland.png";
import killerinkLogo from "./img/partners/killerink.png";
import dashaLogo from "./img/partners/tattoodasha.png";
import { getFaq } from "./faq";
import {
  STYLES,
  stylePathForToken,
  getAbout,
  getStyles,
  getArtistText,
  localizeRegion,
} from "./content";
import {
  initAnalytics,
  grantConsent,
  denyConsent,
  trackPageview,
  trackLead,
  captureAttribution,
  getAttribution,
} from "./analytics";
import AsciiFire from "./AsciiFire";
import { buildSearchIndex, searchIndex, type SearchResult } from "./search";
import {
  LANGS,
  DEFAULT_LANG,
  splitLangPath,
  langPath,
  htmlLangFor,
  t as translate,
  type Lang,
} from "./i18n";

// Current UI language, provided at the app root and read by any component.
const LangContext = createContext<Lang>(DEFAULT_LANG);
const useLang = () => useContext(LangContext);
// Returns a translate function bound to the current language: t("nav.home").
const useT = () => {
  const lang = useLang();
  return (key: string) => translate(lang, key);
};


/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

type Artist = {
  name: string;
  img: string;
  ig: string;
  role: string;
  bio: string;
  since?: number; // year they started tattooing (shown only when set)
};

const ARTISTS: Artist[] = [
  {
    name: "Max",
    img: maxImg,
    ig: "https://www.instagram.com/maxxonk_tattoo/",
    role: "Chicano, Realism, Portraits",
    bio: "Chicano-inspired realism and portraits — black-and-grey work with smooth gradients and lifelike depth.",
    since: 2014,
  },
  {
    name: "Eugene",
    img: eugeneImg,
    ig: "https://www.instagram.com/novohatskytattoo/",
    role: "Chicano, Realism, Blackwork",
    bio: "Chicano lettering and portrait realism backed by solid blackwork that stays crisp for years.",
    since: 2018,
  },
  {
    name: "Daria",
    img: dariaImg,
    ig: "https://www.instagram.com/tattoo.daria/",
    role: "Fine Line, Minimal, Botanical",
    bio: "Soft watercolour washes, delicate fine-line work, and loose abstract compositions that feel painted onto the skin.",
    since: 2019,
  },
  {
    name: "Darya",
    img: daryaImg,
    ig: "https://www.instagram.com/bazhina_tatoonl/",
    role: "Anime, Manga, Realism",
    bio: "Anime and manga brought to skin — bold graphic linework and colour alongside detailed black-and-grey realism and illustrative graphic art.",
    since: 2018,
  },
  {
    name: "Mila",
    img: milaImg,
    ig: "https://www.instagram.com/mila.delger/",
    role: "Freehand, Fluid Line, Abstract",
    bio: "Freehand pieces drawn straight onto the skin — fluid-line and abstract shapes made to flow with the body.",
    since: 2018,
  },
  {
    name: "Gianluca",
    img: gianlucaImg,
    ig: "https://www.instagram.com/gianluca_tattooer/",
    role: "Ornamental, Blackwork, Geometric",
    bio: "Geometric, optical and ornamental blackwork with elements of abstract calligraphy, dotwork, and engraving-inspired detail.",
    since: 2023,
  },
  {
    name: "Selçuk",
    img: selcukImg,
    ig: "https://www.instagram.com/selcukozger.ink/",
    role: "Minimal, Fine Line, Botanical",
    bio: "Minimal fine-line and botanical designs — restrained, elegant, and built to last.",
    since: 2011,
  },
];

// Works live in a per-artist folder: src/img/works/<slug>/<anything>.jpg
// (e.g. src/img/works/max/1.jpg). The folder name is the artist slug, so to
// add works just drop .jpg files into that artist's folder. Folders that don't
// map to an artist (e.g. guest/) are skipped.
const workUrls = import.meta.glob("./img/works/*/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Work videos live in src/vid/ so Vite fingerprints them (content-hashed URLs).
// That means replacing a clip changes its URL, so browsers/CDN never serve a
// stale cached copy — the problem plain /public files (fixed URLs) have.
const videoUrls = import.meta.glob("./vid/*.mp4", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const VIDEO_BY_FILE: Record<string, string> = {};
for (const [path, url] of Object.entries(videoUrls)) {
  VIDEO_BY_FILE[path.split("/").pop() as string] = url;
}

const WORK_ARTIST_INDEX: Record<string, number> = {
  max: 0,
  eugene: 1,
  daria: 2,
  darya: 3,
  mila: 4,
  gianluca: 5,
  selcuk: 6,
};

// Optional looping video for a work. Key = "<artistFolder>/<filename>.jpg" (the
// same path as the image, which stays the poster); value = the clip's filename
// in src/vid/. The video only loads when the work becomes the centre card of a
// carousel or is opened in the lightbox, so it never affects initial page load.
const WORK_VIDEOS: Record<string, string> = {
  "max/1a.jpg": "max-1a.mp4",
  "max/7a.jpg": "max-7a.mp4",
  "max/13a.jpg": "max-13a.mp4",
  "eugene/1a.jpg": "eugene-1a.mp4",
  "eugene/7a.jpg": "eugene-7a.mp4",
  "eugene/13a.jpg": "eugene-13a.mp4",
  "daria/1a.jpg": "daria-1a.mp4",
  "daria/7a.jpg": "daria-7a.mp4",
  "darya/1a.jpg": "darya-1a.mp4",
  "mila/1a.jpg": "mila-1a.mp4",
  "mila/7a.jpg": "mila-7a.mp4",
  "mila/13a.jpg": "mila-13a.mp4",
};

type Work = { img: string; artistIdx: number; video?: string; key: string };

// Natural numeric sort of filenames so "2.jpg" comes before "10.jpg".
const naturalKey = (path: string) => {
  const file = path.split("/").pop() || "";
  const n = parseInt(file, 10);
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
};

const WORKS: Work[] = (() => {
  const byArtist: Work[][] = ARTISTS.map(() => []);
  const entries = Object.entries(workUrls).sort(
    ([a], [b]) => naturalKey(a) - naturalKey(b),
  );
  for (const [path, url] of entries) {
    const parts = path.split("/");
    const slug = (parts[parts.length - 2] || "").toLowerCase(); // folder name
    const idx = WORK_ARTIST_INDEX[slug];
    if (idx === undefined) continue; // unmapped folder (e.g. guest/)
    const key = `${slug}/${parts[parts.length - 1]}`; // e.g. "max/1.jpg"
    const videoFile = WORK_VIDEOS[key];
    byArtist[idx].push({
      img: url,
      artistIdx: idx,
      video: videoFile ? VIDEO_BY_FILE[videoFile] : undefined,
      key,
    });
  }
  // Interleave round-robin so consecutive cards aren't the same artist.
  const out: Work[] = [];
  const maxLen = Math.max(0, ...byArtist.map((a) => a.length));
  for (let r = 0; r < maxLen; r++)
    for (const arr of byArtist) if (arr[r]) out.push(arr[r]);
  return out;
})();

// Every work grouped by its artist (used by the works grid + lightbox).
const WORKS_BY_ARTIST: Work[][] = ARTISTS.map((_, i) =>
  WORKS.filter((w) => w.artistIdx === i),
);

const WORK_BY_KEY = new Map(WORKS.map((w) => [w.key, w]));

// A representative image for a style — its keyed work, else the first work of a
// mapped artist, else that artist's portrait. Shared by the style page, the
// styles index and the footer.
function styleImage(style: (typeof STYLES)[number]): string {
  const keyed = style.photoKey ? WORK_BY_KEY.get(style.photoKey) : undefined;
  if (keyed) return keyed.img;
  const idxs = style.artists
    .map((name) => ARTISTS.findIndex((a) => a.name === name))
    .filter((i) => i >= 0);
  for (const i of idxs) {
    const w = (WORKS_BY_ARTIST[i] || [])[0];
    if (w) return w.img;
  }
  return idxs.length ? ARTISTS[idxs[0]].img : "";
}

// Spread the video-works evenly among the photos rather than letting them
// cluster (used by both carousels so photos and videos always alternate).
function interleaveVideos(list: Work[], everyN: number): Work[] {
  const vids = list.filter((w) => w.video);
  const pics = list.filter((w) => !w.video);
  if (!vids.length) return list;
  const out: Work[] = [];
  let vi = 0;
  pics.forEach((p, i) => {
    out.push(p);
    if ((i + 1) % everyN === 0 && vi < vids.length) out.push(vids[vi++]);
  });
  while (vi < vids.length) out.push(vids[vi++]); // leftovers (shouldn't happen)
  return out;
}

// Desktop carousel: all works, videos spread evenly across the whole set so
// they don't bunch up (and the looping carousel has no long video-less gap).
const CAROUSEL_WORKS: Work[] = (() => {
  const nv = WORKS.filter((w) => w.video).length;
  const np = WORKS.length - nv;
  return interleaveVideos(WORKS, nv ? Math.max(1, Math.floor(np / nv)) : 1);
})();

// The specific videos to feature in the mobile hero coverflow (by work key).
const HERO_VIDEO_KEYS = [
  "daria/7a.jpg", // daria-7a
  "max/13a.jpg", // max-13a
  "eugene/13a.jpg", // eugene-13a
  "darya/1a.jpg", // darya-1a
  "mila/7a.jpg", // mila-7a
];

// Mobile hero coverflow: strictly alternating photo/video, one photo per hero
// video so the counts are equal. The mila photo slot shows gianluca's 3rd work.
const HERO_SLIDES: Work[] = (() => {
  const heroVids = HERO_VIDEO_KEYS.map((k) => WORK_BY_KEY.get(k)).filter(
    (w): w is Work => Boolean(w),
  );
  const swap: Record<string, string> = { "mila/1.jpg": "gianluca/3.jpg" };
  const pics = WORKS.filter((w) => !w.video).map(
    (w) => WORK_BY_KEY.get(swap[w.key]) ?? w,
  );
  const out: Work[] = [];
  heroVids.forEach((v, i) => {
    if (pics.length) out.push(pics[i % pics.length]); // one photo…
    out.push(v); // …then one video
  });
  return out;
})();

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
const PILL = (solid: boolean) =>
  `inline-flex w-full max-w-[300px] items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 py-3.5 text-[15px] transition-colors md:w-auto md:max-w-none md:py-3 md:text-[14px] ${
    solid
      ? "border-white/25 bg-white/10 text-white backdrop-blur hover:border-white/50 hover:bg-white/15"
      : "border-white/25 text-white/85 hover:border-white/50 hover:bg-white/5"
  }`;

// Studio WhatsApp Business — direct chat link used by the consultation CTAs.
const WHATSAPP_URL = "https://wa.me/31645052222";

// A row of pill CTAs. The first item is filled (primary) unless `solid` is set
// explicitly; the rest are outlined. Stacked on mobile, side by side on desktop.
type CtaItem = {
  label: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  solid?: boolean;
};

function CtaBar({
  items,
  className = "",
}: {
  items: CtaItem[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 md:flex-row md:justify-center ${className}`}
    >
      {items.map((it, i) => {
        const cls = PILL(it.solid ?? i === 0);
        return it.href ? (
          <a
            key={i}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="pointer"
            className={cls}
          >
            {it.label}
          </a>
        ) : (
          <button
            key={i}
            type={it.type ?? "button"}
            onClick={it.onClick}
            data-cursor="pointer"
            className={cls}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

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
type RevealFn = (delaySec: number) => void;
const revealCbs = new Map<Element, RevealFn>();
let revealIO: IntersectionObserver | null = null;
const REVEAL_STEP = 0.08; // seconds between staggered items
const REVEAL_MAX_DELAY = 0.5;

function revealObserver(): IntersectionObserver {
  if (revealIO) return revealIO;
  revealIO = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting);
      if (!entering.length) return;
      entering.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
      );
      entering.forEach((e, i) => {
        const cb = revealCbs.get(e.target);
        if (!cb) return;
        cb(Math.min(i * REVEAL_STEP, REVEAL_MAX_DELAY));
        revealCbs.delete(e.target);
        revealIO!.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
  );
  return revealIO;
}

function Reveal({
  children,
  className,
  y = 24,
  eager = false,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(eager);
  const [delay, setDelay] = useState(0);

  // Show right away when asked (e.g. above-the-fold items that would otherwise
  // wait for a scroll that never happens), and stay in sync if `eager` flips.
  useEffect(() => {
    if (eager) setShown(true);
  }, [eager]);

  useEffect(() => {
    if (eager) return;
    const el = ref.current;
    if (!el) return;

    // Elements already in (or near) the viewport reveal straight away, cascading
    // top-to-bottom by their vertical position. This runs synchronously so it
    // works even when the tab is hidden (IntersectionObserver wouldn't fire).
    const vh = window.innerHeight || 800;
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.95 && r.bottom > 0) {
      setDelay(Math.min((Math.max(r.top, 0) / vh) * 0.5, REVEAL_MAX_DELAY));
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    // Below the fold → reveal on scroll; the shared observer staggers rows that
    // enter together top-to-bottom.
    const cb: RevealFn = (d) => {
      setDelay(d);
      setShown(true);
    };
    revealCbs.set(el, cb);
    revealObserver().observe(el);
    return () => {
      revealCbs.delete(el);
      revealIO?.unobserve(el);
    };
  }, [eager]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* TEXT RING — a phrase repeated around a slowly spinning circle, with the      */
/* card's own content sitting (border-free) in the middle.                     */
/* -------------------------------------------------------------------------- */

// Per-glyph widths via a canvas, so the phrase can be spread evenly around the
// ring. Falls back to rough estimates when there's no document (SSR/build).
function measureGlyphWidths(
  letters: string[],
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
): number[] {
  if (letters.length === 0) return [];
  if (typeof document === "undefined")
    return letters.map((l) => (l === " " ? fontSizePx * 0.35 : fontSizePx * 0.55));
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx)
    return letters.map((l) => (l === " " ? fontSizePx * 0.35 : fontSizePx * 0.55));
  ctx.font = `${fontWeight} ${fontSizePx}px ${fontFamily}`;
  return letters.map((l) => ctx.measureText(l === " " ? " " : l).width);
}

// Build the letter list (phrase + separator, repeated to fill the circle) and
// the angle for each letter so the text covers the circumference evenly.
function buildRingText(
  phrase: string,
  separator: string,
  circumference: number,
  fontSizePx: number,
  fontWeight: string,
  fontFamily: string,
): { letters: string[]; angles: number[]; spacing: number } {
  const segment = `${phrase} ${separator} `;
  const segLetters = Array.from(segment);
  if (!segLetters.length || circumference <= 0)
    return { letters: [], angles: [], spacing: 0 };

  const segWidth = measureGlyphWidths(
    segLetters,
    fontSizePx,
    fontWeight,
    fontFamily,
  ).reduce((a, b) => a + b, 0);

  let repeats = Math.max(1, Math.round(circumference / Math.max(segWidth, 1)));
  let letters = Array.from(segment.repeat(repeats));
  let widths = measureGlyphWidths(letters, fontSizePx, fontWeight, fontFamily);
  let sum = widths.reduce((a, b) => a + b, 0);
  // Shrink until at least a hair of positive spacing remains.
  while (repeats > 1 && circumference - sum < 0) {
    repeats -= 1;
    letters = Array.from(segment.repeat(repeats));
    widths = measureGlyphWidths(letters, fontSizePx, fontWeight, fontFamily);
    sum = widths.reduce((a, b) => a + b, 0);
  }
  const spacing = Math.max(0, (circumference - sum) / letters.length);

  const angles: number[] = [];
  let cursor = 0;
  for (let i = 0; i < letters.length; i += 1) {
    const w = widths[i] ?? 0;
    angles.push(((cursor + w / 2) / circumference) * 360);
    cursor += w + spacing;
  }
  return { letters, angles, spacing };
}

function TextRing({
  text,
  diameter = 240,
  fontSizePx = 12,
  spinSeconds = 28,
  reverse = false,
  color = "rgba(255,255,255,0.45)",
  separator = "✦",
  className = "",
  children,
}: {
  text: string;
  diameter?: number;
  fontSizePx?: number;
  spinSeconds?: number;
  reverse?: boolean;
  color?: string;
  separator?: string;
  className?: string;
  children?: ReactNode;
}) {
  const rotation = useMotionValue(0);
  const radius = diameter / 2 - fontSizePx * 0.9;
  const circumference = 2 * Math.PI * radius;
  const phrase = text.trim().toUpperCase();

  const { letters, angles, spacing } = useMemo(
    () =>
      buildRingText(
        phrase,
        separator,
        circumference,
        fontSizePx,
        "600",
        "ui-sans-serif, system-ui, sans-serif",
      ),
    [phrase, separator, circumference, fontSizePx],
  );

  useAnimationFrame((_, delta) => {
    const dps = 360 / spinSeconds;
    const dir = reverse ? -1 : 1;
    let next = (rotation.get() + dir * dps * (Math.min(delta, 64) / 1000)) % 360;
    if (next < 0) next += 360;
    rotation.set(next);
  });

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: diameter,
        height: diameter,
        flexShrink: 0,
      }}
    >
      <motion.div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          rotate: rotation,
          color,
          fontWeight: 600,
          fontSize: fontSizePx,
          letterSpacing: `${spacing}px`,
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        {letters.map((letter, i) => {
          const angle = angles[i] ?? 0;
          const rad = (angle * Math.PI) / 180;
          const x = radius * Math.cos(rad);
          const y = radius * Math.sin(rad);
          const t = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle + 90}deg)`;
          return (
            <span
              key={`${letter}-${i}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                display: "inline-block",
                lineHeight: 1,
                transform: t,
                WebkitTransform: t,
              }}
            >
              {letter === " " ? " " : letter}
            </span>
          );
        })}
      </motion.div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: diameter * 0.16,
        }}
      >
        {children}
      </div>
    </div>
  );
}

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
              animate={{ marginTop: showResults ? "6vh" : "30vh" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Start typing (e.g., 'realism', 'aftercare')..."
                  data-cursor="text"
                  className="w-full rounded-full border border-white/15 bg-white/[0.04] py-3 pl-11 pr-4 text-[16px] text-white outline-none transition focus:border-white/40 md:text-[14px]"
                />
              </div>
              {!showResults && (
                <p className="mt-4 text-center text-[13px] leading-relaxed text-white/40">
                  Search across tattoo styles, studio information, guest artist details, terms and conditions, faq and more.
                </p>
              )}
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
function ArtistButtons({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  const M = ARTISTS.length;
  const posRef = useRef(0);
  const [pos, setPos] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Ease the strip so the active artist rotates to the centre (shortest path).
  useEffect(() => {
    let delta = active - Math.round(posRef.current);
    delta = ((delta % M) + M) % M;
    if (delta > M / 2) delta -= M;
    const startPos = posRef.current;
    const targetPos = startPos + delta;
    const startTime = performance.now();
    const DURATION = 340;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = (now: number) => {
      const p = Math.min(1, (now - startTime) / DURATION);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      posRef.current = startPos + (targetPos - startPos) * e;
      setPos(posRef.current);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else {
        posRef.current = targetPos;
        setPos(targetPos);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, M]);

  const BTN = 46;
  const GAP = 22;
  const stepPx = BTN + GAP;
  const half = Math.floor(M / 2);

  return (
    <div
      className="relative isolate hidden shrink-0 md:block"
      style={{ width: BTN, height: 2 * half * stepPx + BTN }}
    >
      {ARTISTS.map((a, i) => {
        let slot = i - pos;
        slot = ((slot % M) + M) % M;
        if (slot > M / 2) slot -= M;
        const y = slot * stepPx; // straight vertical line
        const abs = Math.abs(slot);
        const depth = Math.max(0, 1 - (0.45 * abs) / Math.max(1, half));
        const scale = 0.62 + 0.38 * depth;
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            data-cursor="pointer"
            aria-label={a.name}
            className="absolute left-1/2 top-1/2 outline-none"
            style={{
              width: BTN,
              height: BTN,
              marginLeft: -BTN / 2,
              marginTop: -BTN / 2,
              transform: `translateY(${y}px) scale(${scale})`,
              zIndex: Math.round(depth * 100) + (isActive ? 100 : 0),
              opacity: depth < 0.15 ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <span
              className="block h-full w-full overflow-hidden rounded-full transition"
              style={{
                boxShadow: isActive
                  ? "0 0 0 2px #fff"
                  : "0 0 0 1px rgba(255,255,255,0.2)",
                opacity: isActive ? 1 : 0.45,
              }}
            >
              <img
                src={a.img}
                alt=""
                draggable={false}
                className="h-full w-full object-cover"
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// Mobile-only horizontal avatar row (used by the home artist showcase).
function ArtistRow({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      {ARTISTS.map((a, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            data-cursor="pointer"
            aria-label={a.name}
            className="h-9 w-9 shrink-0 overflow-hidden rounded-full outline-none transition"
            style={{
              boxShadow: isActive
                ? "0 0 0 2px #fff"
                : "0 0 0 1px rgba(255,255,255,0.2)",
              opacity: isActive ? 1 : 0.5,
            }}
          >
            <img
              src={a.img}
              alt=""
              draggable={false}
              className="h-full w-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

/* Image that fades in once it has loaded (handles cached images too). */
function FadeImg({
  src,
  alt,
  className = "",
  draggable,
  loading,
}: {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
  loading?: "lazy" | "eager";
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    // Already decoded (cached or resolved during commit, which React's onLoad
    // can miss) → show immediately. Otherwise wait for the native load event,
    // which is more reliable here than the synthetic one.
    if (img.complete && img.naturalWidth > 0) {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    img.addEventListener("load", onLoad);
    return () => img.removeEventListener("load", onLoad);
  }, [src]);
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      draggable={draggable}
      loading={loading}
      onLoad={() => setLoaded(true)}
      className={`${className} transition duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    />
  );
}

/* A muted, looping work video. It's mounted only while the work is actually on
   show (the carousel's centre card, or the lightbox's current slide), so the
   file never loads until then — the still image acts as the poster meanwhile.
   Hosted off-repo (Cloudflare R2 / Stream); see WORK_VIDEOS. */
function LazyVideo({
  src,
  poster,
  className = "",
  style,
  play = true,
}: {
  src: string;
  poster?: string;
  className?: string;
  style?: CSSProperties;
  play?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [play, src]);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={play}
      preload="auto"
      disablePictureInPicture
      draggable={false}
      className={className}
      style={style}
    />
  );
}

/* Full-screen, swipeable gallery of a single artist's works. Opened by tapping
   an artist's photo (primarily on mobile). Uses native horizontal scroll-snap
   so swiping feels native and needs no drag maths. */
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
function RoleLinks({
  role,
  onNavigate,
}: {
  role: string;
  onNavigate: (path: string) => void;
}) {
  const tokens = role
    .split(/,|&/)
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <>
      {tokens.map((tok, i) => {
        const path = stylePathForToken(tok);
        return (
          <span key={i}>
            {i > 0 ? ", " : ""}
            {path ? (
              <button
                type="button"
                onClick={() => onNavigate(path)}
                data-cursor="pointer"
                className="uppercase underline-offset-4 transition hover:text-white hover:underline"
              >
                {tok}
              </button>
            ) : (
              tok
            )}
          </span>
        );
      })}
    </>
  );
}

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

const MAX_PORTFOLIO = 21;

// Compact FAQ accordion (question + answer), reused on the artists page for the
// styles each artist works in.
function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => (
        <details key={i} className="group py-4">
          <summary
            data-cursor="pointer"
            className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] text-white/90 md:text-[15px] [&::-webkit-details-marker]:hidden"
          >
            {item.q}
            <ChevronDown
              className="h-4 w-4 shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-180"
              strokeWidth={2}
            />
          </summary>
          <p className="mt-2 text-[13px] leading-relaxed text-white/55">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

function ArtistsPage({
  active,
  onSelect,
  onOpenWorks,
  onBook,
  onNavigate,
}: {
  active: number;
  onSelect: (i: number) => void;
  onOpenWorks: (artist: number, startIndex: number) => void;
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const M = ARTISTS.length;
  const artist = ARTISTS[active];
  const at = getArtistText(lang, artist.name);
  const role = at?.role ?? artist.role;
  const bio = at?.bio ?? artist.bio;
  const works = (WORKS_BY_ARTIST[active] || []).slice(0, MAX_PORTFOLIO);

  // On mobile the works grid sits well below the fold, so the first two are
  // shown/loaded eagerly (they appear with the heading) instead of waiting for
  // a scroll-reveal. Desktop is unaffected.
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setIsMobile(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Direction of the last switch → the photo slides in from that side (same as
  // the home artist showcase).
  const [dir, setDir] = useState(1);
  const prevRef = useRef(active);
  useEffect(() => {
    let d = active - prevRef.current;
    d = ((d % M) + M) % M;
    if (d > M / 2) d -= M;
    if (d !== 0) setDir(Math.sign(d));
    prevRef.current = active;
  }, [active, M]);

  // On mobile the works grid always shows an even number of tiles (a lone
  // trailing tile on the last row looks unbalanced) — drop the last if odd.
  const worksToShow =
    isMobile && works.length % 2 === 1 ? works.slice(0, -1) : works;

  // FAQ pulled from the style pages this artist works in (deduped by question).
  const artistFaq = useMemo(() => {
    // Order the FAQ by the artist's own listed specialities (their role line)
    // rather than the global style order, so e.g. Darya leads with Anime/Manga
    // and Eugene with Chicano. Styles not named in the role fall to the end.
    const enStyles = getStyles("en");
    const rolePos = (slug: string) => {
      const en = enStyles.find((s) => s.slug === slug);
      if (!en) return 999;
      const idx = artist.role.toLowerCase().indexOf(en.nav.toLowerCase());
      return idx === -1 ? 999 : idx;
    };
    const seen = new Set<string>();
    const out: { q: string; a: string }[] = [];
    const styles = getStyles(lang)
      .filter((s) => s.artists.includes(artist.name))
      .sort((a, b) => rolePos(a.slug) - rolePos(b.slug));
    for (const s of styles) {
      for (const item of s.faq) {
        if (seen.has(item.q)) continue;
        seen.add(item.q);
        out.push({ q: item.q, a: item.a });
      }
    }
    return out;
  }, [lang, artist.name, artist.role]);

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
          {t("ui.ourArtists")}
        </p>
        {/* Title — the artist's name on mobile (matches the profile layout),
            the generic "Artists" heading on desktop. */}
        <motion.h1
          key={`m-${active}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:hidden"
        >
          {artist.name}
        </motion.h1>
        <h1 className="hidden text-center font-serif leading-[0.95] tracking-tight md:block md:text-[4.5rem]">
          {t("ui.artists")}
        </h1>

        {/* ===== MOBILE: name-led text, then a horizontal artist picker ===== */}
        <motion.div
          key={`mt-${active}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 md:hidden"
        >
          <p className="mb-3 text-[12px] uppercase tracking-[0.3em] text-white/40">
            {String(active + 1).padStart(2, "0")} —{" "}
            <RoleLinks role={role} onNavigate={onNavigate} />
          </p>
          <p className="text-[15px] leading-relaxed text-white/60">{bio}</p>
          {artist.since && (
            <p className="mt-4 text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("ui.tattooingSince")} {artist.since}
            </p>
          )}
        </motion.div>
        {/* Artist picker — horizontal row of avatars, under the bio/since. */}
        <div className="mt-8 md:hidden">
          <ArtistRow active={active} onSelect={onSelect} />
        </div>

        {/* ===== DESKTOP showcase — mirrors the home page layout ===== */}
        <div className="mt-14 hidden w-full items-center gap-10 md:flex md:flex-row md:justify-center md:gap-14">
          <div className="shrink-0">
            <ArtistButtons active={active} onSelect={onSelect} />
          </div>

          <div className="w-full max-w-[300px] shrink-0 md:max-w-md">
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
          </div>

          <motion.div
            key={active}
            className="flex-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {String(active + 1).padStart(2, "0")} —{" "}
              <RoleLinks role={role} onNavigate={onNavigate} />
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4rem]">
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
            <div className="mt-8 flex flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => onBook({ artist: artist.name })}
                data-cursor="pointer"
                className={PILL(true)}
              >
                {t("ui.bookWith")} {artist.name}
              </button>
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
          </motion.div>
        </div>

        {/* Works grid */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-[1.7rem] leading-[1] tracking-tight md:text-[2.2rem]">
            {t("ui.worksBy")} {artist.name}
          </h2>
          {worksToShow.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {worksToShow.map((w, i) => {
                // First few images load eagerly; the rest lazily as they near
                // the viewport. The tile itself reveals via the shared cascade.
                const eagerImg = i < 4;
                return (
                  <Reveal key={`${active}-${i}`} y={24}>
                    <button
                      type="button"
                      onClick={() => onOpenWorks(active, i)}
                      data-cursor="pointer"
                      className="group relative block aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none"
                    >
                      {w.video ? (
                        <LazyVideo
                          src={w.video}
                          poster={w.img}
                          className="h-full w-full object-cover group-hover:scale-105"
                        />
                      ) : (
                        <FadeImg
                          src={w.img}
                          alt={`${artist.name} — work ${i + 1}`}
                          draggable={false}
                          loading={eagerImg ? "eager" : "lazy"}
                          className="h-full w-full object-cover group-hover:scale-105"
                        />
                      )}
                    </button>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-center text-[14px] text-white/40">
              {t("ui.portfolioSoon")}
            </p>
          )}

          {/* Book CTA — under the gallery on mobile (desktop shows it in the
              artist column, under "tattooing since"). */}
          <div className="mt-12 flex flex-col items-center gap-3 text-center md:hidden">
            <p className="text-[13px] text-white/45">{t("ui.bookLead")}</p>
            <button
              type="button"
              onClick={() => onBook({ artist: artist.name })}
              data-cursor="pointer"
              className={PILL(true)}
            >
              {t("ui.bookWith")} {artist.name}
            </button>
            <p className="mt-2 text-[13px] text-white/45">{t("book.notsure")}</p>
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

          {/* Style FAQ — under the works on desktop, under the book CTA on
              mobile. Centred, same width as the FAQ page. */}
          {artistFaq.length > 0 && (
            <div className="mx-auto mt-16 max-w-3xl">
              <p className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("guests.faq.title")}
              </p>
              <FaqList items={artistFaq} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* REVIEWS — real client DMs floating in two auto-scrolling columns            */
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

function ContactPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const emailValid = /.+@.+\..+/.test(email);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailValid || !message.trim()) {
      setError(t("contact.error"));
      return;
    }
    setError("");
    setSent(true);
    trackLead({ source: "contact" });
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, hp, source: "contact" }),
      }).catch(() => {});
    }
  };

  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-white/40";

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("contact.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {t("contact.title")}
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            {t("contact.intro.pre")}
            <button
              onClick={() => onNavigate("/book")}
              data-cursor="pointer"
              className="text-white underline underline-offset-4 transition hover:text-white/70"
            >
              {t("contact.intro.link")}
            </button>
            {t("contact.intro.post")}
          </p>
        </Reveal>

        <Reveal>
        {sent ? (
          <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h2 className="font-serif text-[2rem] leading-[1.05] md:text-[2.6rem]">
              {t("contact.done.a")}{" "}
              <span className="italic">{t("contact.done.b")}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-white/40">
              {t("contact.done.note")}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("contact.ph.name")}
              data-cursor="text"
              className={field}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("contact.ph.email")}
              data-cursor="text"
              className={field}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("contact.ph.message")}
              rows={5}
              data-cursor="text"
              className={`${field} resize-none`}
            />
            {/* Honeypot — hidden from users; bots that fill it are dropped. */}
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
            {error && <p className="text-[13px] text-red-400">{error}</p>}
            <p className="mt-2 text-center text-[13px] text-white/40 md:text-left">
              {t("contact.agree.send")}
              <button
                type="button"
                onClick={() => onNavigate("/terms")}
                data-cursor="pointer"
                className="text-white/70 underline underline-offset-4 transition hover:text-white"
              >
                {t("legal.terms")}
              </button>
              .
            </p>
            <button
              type="submit"
              data-cursor="pointer"
              className={`${PILL(true)} self-center md:self-start`}
            >
              {t("contact.send")}
            </button>
          </form>
        )}

          <div className="mt-14 border-t border-white/10 pt-6">
            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/40">
              {t("contact.partnerships")}
            </p>
            <a
              href="mailto:studio@thefourdeuces.nl"
              data-cursor="pointer"
              className="text-[15px] text-white/80 transition hover:text-white"
            >
              studio@thefourdeuces.nl
            </a>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/40">
              {t("contact.careers")}
            </p>
            <a
              href="mailto:studio@thefourdeuces.nl"
              data-cursor="pointer"
              className="text-[15px] text-white/80 transition hover:text-white"
            >
              studio@thefourdeuces.nl
            </a>
            <p className="mt-3 text-[13px] text-white/50">
              {t("contact.careers.pre")}
              <button
                onClick={() => onNavigate("/guests")}
                data-cursor="pointer"
                className="text-white/70 underline underline-offset-4 transition hover:text-white"
              >
                {t("contact.careers.link")}
              </button>
              {t("contact.careers.post")}
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* GUESTS PAGE — /guests route: guest-artist terms + careers / recruiting     */
/* -------------------------------------------------------------------------- */

function GuestsPage() {
  const t = useT();
  const faq = [
    { q: t("guests.faq.supplies.q"), a: t("guests.faq.supplies.a") },
    { q: t("guests.faq.q1"), a: t("guests.faq.a1") },
    { q: t("guests.faq.q2"), a: t("guests.faq.a2") },
    { q: t("guests.faq.q3"), a: t("guests.faq.a3") },
    { q: t("guests.faq.q4"), a: t("guests.faq.a4") },
    { q: t("guests.faq.q5"), a: t("guests.faq.a5") },
    { q: t("guests.faq.q6"), a: t("guests.faq.a6") },
    { q: t("guests.faq.q7"), a: t("guests.faq.a7") },
    { q: t("guests.faq.q8"), a: t("guests.faq.a8") },
  ];
  // Title with the last word italicised (works across languages).
  const titleParts = t("guests.title").split(" ");
  const titleLast = titleParts.pop();
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("guests.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {titleParts.length ? `${titleParts.join(" ")} ` : ""}
            <span className="italic">{titleLast}</span>
          </h1>
          <p className="mt-6 text-[15px] leading-relaxed text-white/60">
            {t("guests.intro")}
          </p>
        </Reveal>

        {/* Join our team — sits directly under the studio intro. */}
        <Reveal>
          <div className="mt-12 border-y border-white/10 py-6 text-center">
            <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-white/40">
              {t("guests.emailLabel")}
            </p>
            <p className="text-[15px] leading-relaxed text-white/60">
              {t("guests.emailIntro")}
              <a
                href="mailto:studio@thefourdeuces.nl"
                data-cursor="pointer"
                className="text-white/90 underline underline-offset-4 transition hover:text-white"
              >
                studio@thefourdeuces.nl
              </a>
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12">
            <h2 className="text-center font-serif text-[1.6rem] leading-tight md:text-[2rem]">
              {t("guests.guest.title")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              {t("guests.guest.text")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 border-t border-white/10 pt-12">
            <h2 className="text-center font-serif text-[1.6rem] leading-tight md:text-[2rem]">
              {t("guests.careers.title")}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              {t("guests.careers.text")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-12 max-w-3xl">
            <p className="mb-2 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
              {t("guests.faq.title")}
            </p>
            <div className="divide-y divide-white/10 border-t border-white/10">
              {faq.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary
                    data-cursor="pointer"
                    className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] text-white/90 md:text-[18px] [&::-webkit-details-marker]:hidden"
                  >
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-180"
                      strokeWidth={2}
                    />
                  </summary>
                  <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-white/55">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Downloadable documents (like the FAQ page). */}
        <Reveal>
          <div className="mt-14 border-t border-white/10 pt-14">
            <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("guests.docs.title")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <DownloadCard
                href="/docs/first-aid-guide.pdf"
                title={t("guests.docs.firstaid")}
                sub="PDF · EN"
              />
              <DownloadCard
                href="/docs/hygiene-disinfection-guidelines.pdf"
                title={t("guests.docs.hygiene")}
                sub="PDF · EN"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ PAGE — /faq route                                                      */
/* -------------------------------------------------------------------------- */

// FAQ content lives in ./faq (shared with the build-time schema generator).

function DownloadCard({
  href,
  title,
  sub,
}: {
  href: string;
  title: string;
  sub: string;
}) {
  return (
    <a
      href={href}
      download
      data-cursor="pointer"
      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-white/20">
        <Download className="h-5 w-5 text-white/80" strokeWidth={2} />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] text-white/90">{title}</span>
        <span className="block text-[12px] text-white/40">{sub}</span>
      </span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* "DOES IT HURT?" — interactive body pain map (front / back, human silhouette)     */
/* -------------------------------------------------------------------------- */

type View = "front" | "back";

const PAIN_LEVELS: Record<number, { label: string; color: string }> = {
  1: { label: "Low", color: "#34d399" },
  2: { label: "Medium", color: "#fbbf24" },
  3: { label: "High", color: "#fb923c" },
  4: { label: "Severe", color: "#f87171" },
};

type BodyRegion = {
  key: string;
  label: string;
  pain: 1 | 2 | 3 | 4;
  duration: string;
  note: string;
  geo: string;
};

// Sensible defaults — pain ratings & typical session lengths per area. Edit here.
const FRONT_REGIONS: BodyRegion[] = [
  { key: "head", geo: "head", label: "Head & face", pain: 4, duration: "2–4 h", note: "Thin skin over bone — sharp and intense." },
  { key: "neck", geo: "neck", label: "Neck", pain: 4, duration: "1–3 h", note: "Very sensitive, with lots of nerve endings." },
  { key: "chest", geo: "chest", label: "Chest", pain: 3, duration: "3–6 h", note: "Manageable on the pecs, sharper near the sternum." },
  { key: "shoulder", geo: "shoulder", label: "Shoulder", pain: 2, duration: "2–4 h", note: "One of the easier spots — muscle and even skin." },
  { key: "upperArm", geo: "upperArm", label: "Upper arm", pain: 1, duration: "2–5 h", note: "The classic first tattoo — low pain, great canvas." },
  { key: "forearm", geo: "forearm", label: "Forearm", pain: 2, duration: "2–5 h", note: "Comfortable overall; the inner side is a touch more tender." },
  { key: "hand", geo: "hand", label: "Hand & fingers", pain: 4, duration: "1–3 h", note: "Bony, with thin skin — intense, and heals fast." },
  { key: "stomach", geo: "stomach", label: "Stomach", pain: 3, duration: "3–6 h", note: "Soft and stretchy; sensation varies a lot person to person." },
  { key: "hip", geo: "hip", label: "Hip", pain: 4, duration: "2–4 h", note: "The hip bone itself is sharp; fleshier areas are easier." },
  { key: "thigh", geo: "thigh", label: "Thigh", pain: 1, duration: "3–6 h", note: "Lots of muscle and space — a very forgiving area." },
  { key: "knee", geo: "knee", label: "Knee", pain: 4, duration: "1–3 h", note: "Bone close to the surface — expect it to bite." },
  { key: "shin", geo: "shin", label: "Shin", pain: 3, duration: "2–4 h", note: "Bone-adjacent; tolerable but not gentle." },
  { key: "foot", geo: "foot", label: "Foot & ankle", pain: 4, duration: "1–3 h", note: "Thin skin over bone and tendons — quite sharp." },
];

const BACK_REGIONS: BodyRegion[] = [
  { key: "head", geo: "head", label: "Head", pain: 4, duration: "2–4 h", note: "Thin skin over bone — sharp and intense." },
  { key: "neck", geo: "neck", label: "Nape of neck", pain: 4, duration: "1–3 h", note: "Very sensitive, with lots of nerve endings." },
  { key: "upperBack", geo: "chest", label: "Upper back", pain: 3, duration: "3–6 h", note: "Fine over the shoulder blades, sharp along the spine." },
  { key: "shoulder", geo: "shoulder", label: "Shoulder", pain: 2, duration: "2–4 h", note: "One of the easier spots — muscle and even skin." },
  { key: "upperArm", geo: "upperArm", label: "Upper arm", pain: 1, duration: "2–5 h", note: "The triceps area is low pain and a great canvas." },
  { key: "forearm", geo: "forearm", label: "Forearm", pain: 2, duration: "2–5 h", note: "Comfortable overall; tolerable throughout." },
  { key: "hand", geo: "hand", label: "Hand & fingers", pain: 4, duration: "1–3 h", note: "Bony, with thin skin — intense, and heals fast." },
  { key: "lowerBack", geo: "stomach", label: "Lower back", pain: 3, duration: "3–6 h", note: "A popular spot; sharper right over the spine." },
  { key: "glutes", geo: "hip", label: "Glutes", pain: 1, duration: "3–5 h", note: "Plenty of cushioning — one of the least painful areas." },
  { key: "hamstring", geo: "thigh", label: "Hamstring", pain: 1, duration: "3–6 h", note: "Muscular and forgiving, much like the thigh." },
  { key: "knee", geo: "knee", label: "Back of knee", pain: 4, duration: "1–3 h", note: "The soft ditch behind the knee is very sensitive." },
  { key: "calf", geo: "shin", label: "Calf", pain: 2, duration: "2–4 h", note: "Muscular and fairly tolerable." },
  { key: "foot", geo: "foot", label: "Heel & ankle", pain: 4, duration: "1–3 h", note: "Thin skin over bone and tendons — quite sharp." },
];

const REGION_SETS: Record<View, BodyRegion[]> = {
  front: FRONT_REGIONS,
  back: BACK_REGIONS,
};

// --- exact mannequin geometry, extracted from man.svg (viewBox 308 x 1026) ---
const CLIPS = [
  { id: "c0", x: 79.999, y: 969.999, w: 140, h: 20 },
  { id: "c1", x: 82.999, y: 729.999, w: 140, h: 20 },
  { id: "c2", x: 82.999, y: 509.999, w: 140, h: 28 },
  { id: "c3", x: 101.999, y: 353.999, w: 100, h: 50 },
  { id: "c4", x: 123.999, y: 140.999, w: 58, h: 32 },
];

const MAN: { d: string; region: string; clip?: string }[] = [
  { d: "M80.4985 1012.66C80.4983 1025 111.991 1025 111.991 1025C111.991 1025 144.499 1025 144.499 1012.66C144.499 1012.66 144.499 988.999 111.991 988.999C80.4985 988.999 80.4985 1012.66 80.4985 1012.66Z", region: "foot" },
  { d: "M161.499 1012.66C161.498 1025 192.991 1025 192.991 1025C192.991 1025 225.499 1025 225.499 1012.66C225.499 1012.66 225.499 988.999 192.991 988.999C161.499 988.999 161.499 1012.66 161.499 1012.66Z", region: "foot" },
  { d: "M193.999 965.999C203.533 965.999 210.999 972.626 210.999 980.499C210.999 988.372 203.533 994.999 193.999 994.999C184.465 994.999 176.999 988.372 176.999 980.499C176.999 972.626 184.465 965.999 193.999 965.999Z", region: "foot", clip: "c0" },
  { d: "M111.999 965.999C121.533 965.999 128.999 972.626 128.999 980.499C128.999 988.372 121.533 994.999 111.999 994.999C102.465 994.999 94.999 988.372 94.999 980.499C94.999 972.626 102.465 965.999 111.999 965.999Z", region: "foot", clip: "c0" },
  { d: "M173.106 886.117V969.999H216.234V886.117C216.234 886.117 231.455 749.999 216.234 749.999H172.598C157.377 749.999 169.047 840.744 173.106 886.117Z", region: "shin" },
  { d: "M91.1059 886.117V969.999H134.234V886.117C134.234 886.117 149.455 749.999 134.234 749.999H90.5985C75.3767 749.999 87.0468 840.744 91.1059 886.117Z", region: "shin" },
  { d: "M193.999 721.999C205.74 721.999 214.999 730.19 214.999 739.999C214.999 749.807 205.74 757.999 193.999 757.999C182.258 757.999 172.999 749.807 172.999 739.999C172.999 730.19 182.258 721.999 193.999 721.999Z", region: "knee", clip: "c1" },
  { d: "M111.999 721.999C123.74 721.999 132.999 730.19 132.999 739.999C132.999 749.807 123.74 757.999 111.999 757.999C100.258 757.999 90.999 749.807 90.999 739.999C90.999 730.19 100.258 721.999 111.999 721.999Z", region: "knee", clip: "c1" },
  { d: "M169.656 537.999C159.411 537.999 165.387 665.999 169.656 729.999H219.402C219.402 729.999 229.745 537.999 219.402 537.999H169.656Z", region: "thigh" },
  { d: "M87.6557 537.999C77.4109 537.999 83.387 665.999 87.6557 729.999H137.402C137.402 729.999 147.745 537.999 137.402 537.999H87.6557Z", region: "thigh" },
  { d: "M193.999 501.999C209.607 501.999 221.999 512.878 221.999 525.999C221.999 539.119 209.607 549.999 193.999 549.999C178.391 549.999 165.999 539.119 165.999 525.999C165.999 512.878 178.391 501.999 193.999 501.999Z", region: "thigh", clip: "c2" },
  { d: "M111.999 501.999C127.607 501.999 139.999 512.878 139.999 525.999C139.999 539.119 127.607 549.999 111.999 549.999C96.3906 549.999 83.999 539.119 83.999 525.999C83.999 512.878 96.3906 501.999 111.999 501.999Z", region: "thigh", clip: "c2" },
  { d: "M274.607 580.499C263.129 582.262 258.256 589.332 259.09 592.999L278.362 626.999L297.634 660.999C317.657 617.799 300.971 587.332 290.125 578.999C288.623 578.999 274.607 580.499 274.607 580.499Z", region: "hand" },
  { d: "M33.3909 580.499C44.8691 582.262 49.7422 589.332 48.9079 592.999L29.636 626.999L10.364 660.999C-9.65891 617.799 7.02747 587.332 17.8732 578.999C19.3749 578.999 33.3909 580.499 33.3909 580.499Z", region: "hand" },
  { d: "M288.781 562.528L266.37 564.884C261.158 571.359 261.687 576.384 268.042 580.796L290.454 578.441C296.649 572.709 296.121 567.684 288.781 562.528Z", region: "hand" },
  { d: "M40.4535 564.813L18.042 562.458C11.5982 567.708 11.0703 572.733 16.3695 578.37L38.7811 580.726C46.0326 576.408 46.5608 571.383 40.4535 564.813Z", region: "hand" },
  { d: "M231.452 339.34L237.271 394.701L280.296 390.179L274.477 334.817C274.477 334.817 280.22 243.383 265.035 244.979L221.504 249.554C221.504 249.554 224.255 309.819 231.452 339.34Z", region: "upperArm" },
  { d: "M74.6615 339.34L68.8427 394.701L25.8177 390.179L31.6364 334.817C31.6364 334.817 25.8935 243.383 41.0788 244.979L84.6101 249.554C84.6101 249.554 81.8584 309.819 74.6615 339.34Z", region: "upperArm" },
  { d: "M109.417 403.999C109.417 403.999 79.0262 403.999 80.023 509.999H225.999C225.999 403.999 196.106 403.999 196.106 403.999H109.417Z", region: "hip" },
  { d: "M151.999 336.999C179.208 336.999 200.999 355.939 200.999 378.999C200.999 402.058 179.208 420.999 151.999 420.999C124.79 420.999 102.999 402.058 102.999 378.999C102.999 355.939 124.79 336.999 151.999 336.999Z", region: "stomach", clip: "c3" },
  { d: "M202.139 353.999H153.232H103.306C103.306 353.999 40.8487 169.999 153.232 169.999C265.616 169.999 202.139 353.999 202.139 353.999Z", region: "chest" },
  { d: "M241.999 197.999C255.254 197.999 265.999 208.744 265.999 221.999C265.999 235.253 255.254 245.999 241.999 245.999C228.744 245.999 217.999 235.253 217.999 221.999C217.999 208.744 228.744 197.999 241.999 197.999Z", region: "shoulder" },
  { d: "M241.999 212.999C246.97 212.999 250.999 217.028 250.999 221.999C250.999 226.969 246.97 230.999 241.999 230.999C237.028 230.999 232.999 226.969 232.999 221.999C232.999 217.028 237.028 212.999 241.999 212.999Z", region: "shoulder" },
  { d: "M63.999 197.999C77.2539 197.999 87.999 208.744 87.999 221.999C87.999 235.253 77.2539 245.999 63.999 245.999C50.7442 245.999 39.999 235.253 39.999 221.999C39.999 208.744 50.7442 197.999 63.999 197.999Z", region: "shoulder" },
  { d: "M63.999 212.999C68.9696 212.999 72.999 217.028 72.999 221.999C72.999 226.969 68.9696 230.999 63.999 230.999C59.0285 230.999 54.999 226.969 54.999 221.999C54.999 217.028 59.0285 212.999 63.999 212.999Z", region: "shoulder" },
  { d: "M152.999 132.999C168.607 132.999 180.999 143.878 180.999 156.999C180.999 170.119 168.607 180.999 152.999 180.999C137.391 180.999 124.999 170.119 124.999 156.999C124.999 143.878 137.391 132.999 152.999 132.999Z", region: "neck", clip: "c4" },
  { d: "M187.653 140.999H152.213H115.761C115.761 140.999 63.4988 1.00001 152.213 1C242.5 0.999992 187.653 140.999 187.653 140.999Z", region: "head" },
  { d: "M242.703 418.355C234.891 419.176 249.761 516.823 258.173 565.544L296.103 561.557C296.103 561.557 288.519 413.539 280.633 414.368L242.703 418.355Z", region: "forearm" },
  { d: "M63.2949 418.355C71.1062 419.176 56.2361 516.823 47.8247 565.544L9.89478 561.557C9.89478 561.557 17.4785 413.539 25.365 414.368L63.2949 418.355Z", region: "forearm" },
  { d: "M58.3721 393.448L33.1591 390.798C25.6788 398.903 24.8869 406.44 30.6504 414.667L55.8634 417.317C64.2195 410.574 65.0117 403.037 58.3721 393.448Z", region: "forearm" },
  { d: "M271.86 391.384L246.647 394.034C241.016 403.516 241.808 411.054 249.156 417.902L274.369 415.252C281.141 406.92 280.348 399.382 271.86 391.384Z", region: "forearm" },
];

function BodyMap({
  regions,
  selected,
  onSelect,
}: {
  regions: BodyRegion[];
  selected: string | null;
  onSelect: (k: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const byGeo: Record<string, BodyRegion> = {};
  regions.forEach((r) => {
    byGeo[r.geo] = r;
  });
  const hoverRegion = hover ? regions.find((r) => r.key === hover) : null;
  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      onPointerMove={(e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (r) setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
    >
    <svg
      viewBox="0 0 308 1026"
      className="h-full w-full"
      role="img"
      aria-label="body pain map"
    >
      <defs>
        {CLIPS.map((c) => (
          <clipPath key={c.id} id={c.id}>
            <rect x={c.x} y={c.y} width={c.w} height={c.h} />
          </clipPath>
        ))}
      </defs>
      {MAN.map((p, i) => {
        const region = byGeo[p.region];
        if (!region) return null;
        const active = selected === region.key;
        const hot = !active && hover === region.key;
        const color = PAIN_LEVELS[region.pain].color;
        const fill = active
          ? `${color}40`
          : hot
            ? "rgba(255,255,255,0.14)"
            : "transparent";
        const stroke = active
          ? color
          : hot
            ? "rgba(255,255,255,0.9)"
            : "rgba(255,255,255,0.6)";
        return (
          <path
            key={i}
            d={p.d}
            clipPath={p.clip ? `url(#${p.clip})` : undefined}
            onClick={() => onSelect(region.key)}
            onPointerEnter={() => setHover(region.key)}
            onPointerLeave={() => setHover((h) => (h === region.key ? null : h))}
            data-cursor="pointer"
            style={{
              fill,
              stroke,
              strokeWidth: 2,
              cursor: "pointer",
              transition: "fill .2s ease, stroke .2s ease",
            }}
          />
        );
      })}
    </svg>
      {/* Cursor-following name tooltip — desktop only (no hover on touch) */}
      {hoverRegion && (
        <div
          className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-white px-3 py-1 text-[12px] font-medium text-black md:block"
          style={{ left: pos.x, top: pos.y - 10 }}
        >
          {hoverRegion.label}
        </div>
      )}
    </div>
  );
}

function BodyPain({
  onBook,
}: {
  onBook?: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const t = useT();
  const lang = useLang();
  const durUnit =
    lang === "nl" ? "u" : lang === "de" ? "Std." : lang === "ua" ? "год" : "h";
  const [view, setView] = useState<View>("front");
  const [selected, setSelected] = useState<string | null>(null);
  const regions = REGION_SETS[view];
  const region = regions.find((r) => r.key === selected) || null;
  const loc = region ? localizeRegion(lang, region.label, region.note) : null;

  // When a zone is picked, bring its description + Book button into view —
  // scrolls down on mobile, centres on desktop (like the hero carousel).
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!selected) return;
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selected]);

  const ViewBtn = ({ value, label }: { value: View; label: string }) => (
    <button
      onClick={() => setView(value)}
      data-cursor="pointer"
      className={`rounded-full px-5 py-2 text-[13px] transition ${
        view === value ? "bg-white text-black" : "text-white/60 hover:text-white"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="mt-8 flex flex-col items-center gap-8 md:flex-row md:items-stretch md:justify-center md:gap-14">
      {/* Body + view toggle */}
      <div className="flex flex-col items-center gap-5">
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
          <ViewBtn value="front" label={t("body.front")} />
          <ViewBtn value="back" label={t("body.back")} />
        </div>
        <div className="h-[520px] w-[156px] md:h-[620px] md:w-[186px]">
          <BodyMap regions={regions} selected={selected} onSelect={setSelected} />
        </div>
      </div>

      {/* Info panel */}
      <div
        ref={panelRef}
        className="w-full scroll-mt-24 md:w-96 md:self-center md:border-l md:border-white/10 md:pl-12"
      >
        {region ? (
          <div>
            <p className="mb-2 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {t("body.selectedArea")}
            </p>
            <h3 className="font-serif text-[2.4rem] leading-[1] md:text-[3rem]">
              {loc?.label ?? region.label}
            </h3>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mb-2 text-[12px] uppercase tracking-[0.25em] text-white/40">
                  {t("body.painLevel")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className="h-2.5 w-8 rounded-full"
                        style={{
                          background:
                            n <= region.pain
                              ? PAIN_LEVELS[region.pain].color
                              : "rgba(255,255,255,0.12)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[15px]"
                    style={{ color: PAIN_LEVELS[region.pain].color }}
                  >
                    {t(`pain.${region.pain}`)}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-[12px] uppercase tracking-[0.25em] text-white/40">
                  {t("body.typicalSession")}
                </p>
                <p className="text-[18px] text-white/90">
                  {region.duration.replace(/h$/, durUnit)}
                </p>
              </div>

              <p className="max-w-md text-[14px] leading-relaxed text-white/55">
                {loc?.note ?? region.note}
              </p>

              {onBook && (
                <button
                  type="button"
                  onClick={() => onBook({ bodyPart: region.label })}
                  data-cursor="pointer"
                  className={PILL(true)}
                >
                  {t("body.bookThis")}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden h-full flex-col justify-center md:flex">
            <h3 className="font-serif text-[1.8rem] leading-[1.1] text-white/80 md:text-[2.2rem]">
              {t("book.tap.a")} <span className="italic">{t("book.tap.b")}</span>
            </h3>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/50">
              {t("book.tap.lead")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookPage({
  onBook,
}: {
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const t = useT();
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-20 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-5xl">
        {/* Title + intro — desktop only (mobile jumps straight to the map) */}
        <Reveal className="hidden md:block">
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("book.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {t("book.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
            {t("book.intro")}{" "}
            <span className="italic">{t("book.intro.italic")}</span>
          </p>
        </Reveal>

        <section className="mt-2 md:mt-14">
          {/* Mobile lead above the map */}
          <Reveal className="md:hidden">
            <h2 className="text-center font-serif text-[2rem] leading-[1] tracking-tight">
              {t("book.tap.a")} <span className="italic">{t("book.tap.b")}</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
              {t("book.tap.lead")}
            </p>
          </Reveal>
          <Reveal>
            <BodyPain onBook={onBook} />
          </Reveal>
        </section>

        {/* Not ready to book? — under the body-part selector on every size. */}
        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-3 text-center">
            <p className="text-[13px] text-white/45">{t("book.notsure")}</p>
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
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ PAGE — /faq route: questions + downloadable documents                  */
/* -------------------------------------------------------------------------- */

function FaqPage({
  onNavigate,
  onConsult,
}: {
  onNavigate: (path: string) => void;
  onConsult: () => void;
}) {
  const t = useT();
  const lang = useLang();
  // Answers may contain [[BOOK]] / [[CONSULT]] tokens that render as links.
  const renderAnswer = (text: string) =>
    text.split(/(\[\[BOOK\]\]|\[\[CONSULT\]\])/).map((part, i) => {
      if (part === "[[BOOK]]")
        return (
          <button
            key={i}
            type="button"
            onClick={() => onNavigate("/book")}
            data-cursor="pointer"
            className="text-white underline underline-offset-4 transition hover:text-white/70"
          >
            {t("faq.bookLink")}
          </button>
        );
      if (part === "[[CONSULT]]")
        return (
          <button
            key={i}
            type="button"
            onClick={onConsult}
            data-cursor="pointer"
            className="text-white underline underline-offset-4 transition hover:text-white/70"
          >
            {t("faq.consultCta")}
          </button>
        );
      return part;
    });
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("faq.kicker")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            FAQ
          </h1>
        </Reveal>

        <Reveal>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {getFaq(lang).map((item, i) => (
            <details key={i} className="group py-5">
              <summary
                data-cursor="pointer"
                className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] text-white/90 md:text-[18px] [&::-webkit-details-marker]:hidden"
              >
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-180"
                  strokeWidth={2}
                />
              </summary>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
                {renderAnswer(item.a)}
              </p>
            </details>
          ))}
        </div>
        </Reveal>

        <Reveal>
        <div className="mt-14">
          <h2 className="mb-1 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
            {t("faq.downloads")}
          </h2>
          <p className="mb-5 text-center text-[13px] text-white/40">{t("faq.dutchOnly")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <DownloadCard
              href="/docs/nazorginstructie-tatoeage.pdf"
              title={t("faq.dl.aftercare")}
              sub="Nazorginstructie · PDF · NL"
            />
            <DownloadCard
              href="/docs/informatie-risicos-tatoeage-pmu.pdf"
              title={t("faq.dl.risks")}
              sub="Risico-informatie (PMU) · PDF · NL"
            />
          </div>
        </div>
        </Reveal>

        <Reveal>
          <p className="mt-14 border-t border-white/10 pt-6 text-[14px] text-white/50">
            {t("faq.foot.pre")}
            <button
              onClick={() => onNavigate("/terms")}
              data-cursor="pointer"
              className="text-white underline underline-offset-4 transition hover:text-white/70"
            >
              {t("legal.terms")}
            </button>
            {t("faq.foot.lang")}.
          </p>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* TERMS & CONDITIONS PAGE — /terms route (not in the menu)                   */
/* -------------------------------------------------------------------------- */

const TERMS: { title: string; items: string[] }[] = [
  {
    title: "1. Introduction",
    items: [
      "These Terms apply to clients receiving services from The Four Deuces B.V. and its resident and guest artists.",
      "Booking an appointment or receiving services constitutes agreement to these Terms.",
    ],
  },
  {
    title: "2. Appointments",
    items: [
      "Booking is available in person, by email, via Instagram, or through the website; we do not accept walk-ins.",
      "Official email addresses: booking@thefourdeuces.nl and studio@thefourdeuces.nl.",
      "A non-refundable deposit is required.",
      "At least 48 hours' notice is required to cancel or reschedule.",
      "Arriving more than 30 minutes late without notice can result in cancellation or rescheduling and loss of the deposit.",
    ],
  },
  {
    title: "3. Pricing and Payment",
    items: [
      "Price depends on size, complexity, placement, and consultation.",
      "Separate provisions apply for standard tattoos, cover-ups, and reworks.",
      "Payment methods: cash, credit/debit cards, and potentially PayPal by agreement.",
      "Tips are appreciated but optional.",
      "Additional work or changes can incur extra charges.",
    ],
  },
  {
    title: "4. Health and Safety",
    items: [
      "The minimum age is 18, or the client must be accompanied by an adult.",
      "Clients must disclose medical conditions, allergies, and skin sensitivities.",
      "The studio follows NEN-EN 17169 hygiene protocols.",
      "Pregnant or nursing clients may be refused; written doctor confirmation may be required.",
      "No local anesthetics are used.",
      "An artist may refuse a tattoo where risks are high or difficult to assess.",
    ],
  },
  {
    title: "5. Tattoo Process",
    items: [
      "The final design and placement must be approved before tattooing begins.",
      "Once approved, complaints about design or placement are void.",
      "Verbal approval has the same legal force as written approval.",
      "Clients are responsible for following the aftercare instructions.",
      "One complimentary touch-up is offered within 6 months, subject to the stated conditions.",
    ],
  },
  {
    title: "6. Liability",
    items: [
      "The client acknowledges risks including allergic reactions, infections, and dissatisfaction.",
      "The client must disclose relevant health issues.",
      "The studio is not liable for health complications, including infections or allergic reactions.",
      "Clients may be asked to sign a liability waiver.",
    ],
  },
  {
    title: "7. Photography and Intellectual Property",
    items: [
      "The studio may photograph or video tattoos for promotional purposes, with an opt-out available.",
      "The studio retains the rights to custom designs.",
      "Studio artwork may not be used commercially without permission.",
      "These Terms are subject to the Dutch Copyright Act (Auteurswet).",
    ],
  },
  {
    title: "8. Conduct",
    items: [
      "Harassment, discrimination, and inappropriate behaviour may result in refusal of service.",
      "Accompanying persons must remain on the ground floor.",
      "Service may be refused if the client is sick, intoxicated, or under the influence of alcohol or drugs.",
      "Clients must follow the artist's instructions.",
    ],
  },
  {
    title: "9. Guest Artists",
    items: [
      "Guest artists are independent and not studio employees or representatives.",
      "Separate booking and payment arrangements may apply.",
      "The studio touch-up policy does not apply to guest artists.",
      "The studio disclaims liability for issues arising from guest-artist services.",
      "Studio conduct, hygiene, and safety rules still apply.",
    ],
  },
  {
    title: "10. Modifications to Terms",
    items: [
      "The studio reserves the right to modify these Terms at any time and will notify clients of significant changes.",
    ],
  },
  {
    title: "11. Contact Information",
    items: [
      "Questions regarding these Terms should be directed to studio@thefourdeuces.nl.",
    ],
  },
];

const PRIVACY: { title: string; items: string[] }[] = [
  {
    title: "1. Who we are",
    items: [
      "The Four Deuces B.V. is the controller responsible for any personal data collected through thefourdeuces.nl.",
      "For any privacy question or request, contact us at studio@thefourdeuces.nl.",
    ],
  },
  {
    title: "2. Cookies & analytics",
    items: [
      "We only place analytics cookies after you accept them in the cookie banner. If you decline, no analytics cookies are set and no usage data is collected.",
      "With your consent, we use Microsoft Clarity to understand how visitors experience the site so we can improve it. Clarity records general usage and behaviour — pages viewed, clicks and taps, scrolling, and mouse movement (aggregated into heatmaps) — and may capture anonymised replays of on-site interactions, together with basic device, browser, and approximate location information.",
      "This data is used only to analyse and improve the website. We do not use it to identify you personally, we do not use it for advertising, and we do not sell it.",
      "Microsoft Clarity processes this data on our behalf as a processor, under Microsoft's own privacy terms.",
      "You can withdraw your consent at any time by clearing this site's cookies and data in your browser; the banner will then appear again on your next visit.",
    ],
  },
  {
    title: "3. Booking requests",
    items: [
      "When you send a booking request from the home page, we receive the budget you enter and your Instagram handle.",
      "We use this information once, for the sole purpose of contacting you about your enquiry. Your Instagram handle is never stored in a database, never added to any mailing list, and never used for anything else — the request is deleted as soon as we have made contact.",
    ],
  },
  {
    title: "4. Contact form",
    items: [
      "When you use the contact form, we receive the name, email address, and message you provide.",
      "We do not store your personal information. It is used a single time to reply to you and is then permanently deleted. It is never shared with anyone else and never used for marketing.",
    ],
  },
  {
    title: "5. Legal basis for processing",
    items: [
      "For analytics cookies we rely on your consent, which you can withdraw at any time.",
      "For enquiries you send us (booking or contact form) we process your data solely to take the step you have asked us to take — getting back to you.",
    ],
  },
  {
    title: "6. Data retention",
    items: [
      "Enquiry details (booking or contact) are kept only for as long as needed to respond, and are deleted once your enquiry is resolved.",
      "Analytics data is retained by Microsoft Clarity in line with its standard retention period.",
    ],
  },
  {
    title: "7. Sharing & processors",
    items: [
      "We do not sell your personal data and do not share it with third parties for their own purposes.",
      "Enquiry details are seen only by The Four Deuces staff. Website analytics are processed by Microsoft Clarity, as described above.",
    ],
  },
  {
    title: "8. Your rights",
    items: [
      "Under the GDPR you have the right to access, correct, delete, restrict, or object to the processing of your personal data, the right to data portability, and the right to withdraw consent at any time.",
      "To exercise any of these rights, email studio@thefourdeuces.nl. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
    ],
  },
  {
    title: "9. Changes to this policy",
    items: [
      "We may update this Privacy Policy from time to time. Any significant changes will be published on this page.",
    ],
  },
  {
    title: "10. Contact",
    items: [
      "Questions about this Privacy Policy or about your data can be sent to studio@thefourdeuces.nl.",
    ],
  },
];

function LegalGroup({ data }: { data: { title: string; items: string[] }[] }) {
  return (
    <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
      {data.map((s) => (
        <div
          key={s.title}
          className="grid gap-2 py-7 md:grid-cols-[190px_1fr] md:gap-10"
        >
          <h3 className="font-display text-[15px] font-medium leading-snug text-white/90">
            {s.title}
          </h3>
          <div className="space-y-3">
            {s.items.map((it, i) => (
              <p
                key={i}
                className="text-[15px] leading-relaxed text-white/55"
              >
                {it}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TermsPage() {
  const sectionHead =
    "text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.8rem]";
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            Legal
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            Terms &amp; <span className="italic">Privacy</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
            The rules of the studio, and how we look after your data.
          </p>
        </Reveal>

        <Reveal>
          <section className="mt-16">
            <h2 className={sectionHead}>Terms &amp; Conditions</h2>
            <LegalGroup data={TERMS} />
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-24">
            <h2 className={sectionHead}>Privacy Policy</h2>
            <LegalGroup data={PRIVACY} />
          </section>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* ABOUT PAGE — /about (SEO + studio story)                                   */
/* -------------------------------------------------------------------------- */

// The studio address, and a Google Maps link for it (same target as the footer
// / mobile address). Used to make the address in the location copy clickable.
const STUDIO_ADDRESS = "Van Baerlestraat 126H";
const STUDIO_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=The%20Four%20Deuces%20Van%20Baerlestraat%20126H%201071%20BD%20Amsterdam";

// Render a paragraph, turning any occurrence of the studio address into a link.
function withAddressLink(text: string): ReactNode {
  const parts = text.split(STUDIO_ADDRESS);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && (
        <a
          href={STUDIO_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className="text-white/80 underline underline-offset-4 transition hover:text-white"
        >
          {STUDIO_ADDRESS}
        </a>
      )}
      {part}
    </span>
  ));
}

function AboutPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const ABOUT = getAbout(useLang());
  const t = useT();

  // Section headings are centred; body copy stays left. Transport & parking
  // sub-headings match the size of "How to find us".
  const subHead =
    "mt-10 border-t border-white/10 pt-10 text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]";
  const para = "mt-5 text-[15px] leading-relaxed text-white/60";

  const renderIntro = () =>
    ABOUT.intro.map((p, i) => (
      <p key={i} className="mt-6 text-[15px] leading-relaxed text-white/60">
        {p}
      </p>
    ));

  const renderFindUs = () => (
    <>
      <h2 className="text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]">
        {ABOUT.locationTitle}
      </h2>
      {ABOUT.location.map((p, i) => (
        <p key={`loc-${i}`} className="mt-5 text-[15px] leading-relaxed text-white/60">
          {withAddressLink(p)}
        </p>
      ))}
      <p className={subHead}>{ABOUT.transportTitle}</p>
      {ABOUT.transport.map((p, i) => (
        <p key={`tr-${i}`} className={para}>
          {p}
        </p>
      ))}
      <p className={subHead}>{ABOUT.parkingTitle}</p>
      {ABOUT.parking.map((p, i) => (
        <p key={`pk-${i}`} className={para}>
          {p}
        </p>
      ))}
      <div className="mt-8 flex justify-center">
        
          href={STUDIO_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="pointer"
          className={PILL(true)}
        >
          {t("about.navigate")}
        </a>
      </div>
    </>
  );

  // One cell of the desktop 2×2 grid: centred heading + left body copy.
  const cell = (
    title: string,
    paras: string[],
    mapper?: (s: string) => ReactNode,
  ) => (
    <>
      <h2 className="text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.6rem]">
        {title}
      </h2>
      {paras.map((p, i) => (
        <p key={i} className="mt-4 text-[15px] leading-relaxed text-white/60">
          {mapper ? mapper(p) : p}
        </p>
      ))}
    </>
  );

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        {/* Title */}
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {ABOUT.kicker}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            The Four <span className="italic">Deuces</span>
          </h1>
        </Reveal>

        {/* Why clients choose us — rings, desktop only, directly under the
            title. */}
        <Reveal className="hidden md:block">
          <div className="mt-14 grid justify-items-center gap-10 sm:grid-cols-3">
            {ABOUT.why.map((w, i) => (
              <TextRing
                key={w.h}
                text={w.h}
                diameter={260}
                reverse={i % 2 === 1}
                spinSeconds={30 + i * 4}
                color="rgba(255,255,255,0.3)"
              >
                <p className="text-[12.5px] leading-relaxed text-white/70">
                  {w.p}
                </p>
              </TextRing>
            ))}
          </div>
        </Reveal>

        {/* ===== MOBILE: stacked — story, then How to find us ===== */}
        <div className="md:hidden">
          <Reveal>{renderIntro()}</Reveal>
          <Reveal>
            <section className="mt-12 border-t border-white/10 pt-12">
              {renderFindUs()}
            </section>
          </Reveal>
        </div>

        {/* ===== DESKTOP: the four sections in a 2×2 grid (About · How to find
            us / Public transport · Car & parking), split by an interior cross
            of divider lines. ===== */}
        <Reveal className="hidden md:block">
          <div className="mt-16 grid grid-cols-2 border-t border-white/10 pt-14">
            <div className="border-b border-r border-white/10 pb-14 pr-14">
              {cell(t("nav.about"), ABOUT.intro)}
            </div>
            <div className="border-b border-white/10 pb-14 pl-14">
              {cell(ABOUT.locationTitle, ABOUT.location, withAddressLink)}
            </div>
            <div className="border-r border-white/10 pt-14 pr-14">
              {cell(ABOUT.transportTitle, ABOUT.transport)}
            </div>
            <div className="pt-14 pl-14">
              {cell(ABOUT.parkingTitle, ABOUT.parking)}
            </div>
          </div>
        </Reveal>

        {/* Guests & Careers — unchanged, Apply is now a button. */}
        <Reveal>
          <section className="mt-16 border-t border-white/10 pt-8 text-center">
            <h2 className="font-serif text-[1.8rem] leading-tight tracking-tight md:text-[2.2rem]">
              {(() => {
                const parts = t("contact.careers.link").split(" ");
                const last = parts.pop();
                return (
                  <>
                    {parts.length ? `${parts.join(" ")} ` : ""}
                    <span className="italic">{last}</span>
                  </>
                );
              })()}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
              {t("about.careersText")}
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate("/guests")}
                data-cursor="pointer"
                className={PILL(false)}
              >
                {t("about.apply")}
              </button>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLES INDEX — /styles: a grid of every tattoo style, each linking out to   */
/* its own landing page.                                                        */
/* -------------------------------------------------------------------------- */

function StylesIndexPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
  const t = useT();
  const lang = useLang();
  const styles = getStyles(lang);
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("ui.ourStyles")}
          </p>
          <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
            {(() => {
              const parts = t("styles.title").split(" ");
              const last = parts.pop();
              return (
                <>
                  {parts.length ? `${parts.join(" ")} ` : ""}
                  <span className="italic">{last}</span>
                </>
              );
            })()}
          </h1>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {styles.map((s) => {
            const base = STYLES.find((x) => x.slug === s.slug);
            const img = base ? styleImage(base) : "";
            return (
              <Reveal key={s.slug}>
                <button
                  type="button"
                  onClick={() => onNavigate(s.slug)}
                  data-cursor="pointer"
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] text-left transition-colors hover:bg-white/[0.04]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {img && (
                      <FadeImg
                        src={img}
                        alt={`${s.name} tattoo — The Four Deuces Amsterdam`}
                        draggable={false}
                        className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="relative flex flex-1 flex-col justify-between gap-6 px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-serif text-[1.35rem] leading-tight text-white">
                        {s.name}
                      </span>
                      <ArrowUpRight
                        className="h-5 w-5 shrink-0 text-white/45 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        strokeWidth={1.75}
                      />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.15em] text-white/55 transition group-hover:text-white">
                      {t("ui.readMore")}
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* STYLE PAGE — /{style}-tattoo-amsterdam (SEO landing per style)            */
/* -------------------------------------------------------------------------- */

function StylePage({
  style,
  onNavigate,
  onOpenArtist,
}: {
  style: (typeof STYLES)[number];
  onNavigate: (path: string) => void;
  onOpenArtist: (i: number) => void;
}) {
  const t = useT();
  const lang = useLang();
  // Title with its last word in italic (matching the /terms heading style).
  const words = style.title.trim().split(" ");
  const lastWord = words.pop();
  const leadWords = words.join(" ");

  // Artists mapped to this style (explicit list), and a representative work to
  // use as the style's photo (in black & white).
  const styleArtistIdxs = style.artists
    .map((name) => ARTISTS.findIndex((a) => a.name === name))
    .filter((i) => i >= 0);
  const photo = styleImage(style);

  // Artist avatars — shown to the left of the photo on desktop, and again (with
  // a heading) below the copy on mobile.
  const artistAvatars = styleArtistIdxs.map((i) => (
    <button
      key={i}
      type="button"
      onClick={() => onOpenArtist(i)}
      data-cursor="pointer"
      aria-label={ARTISTS[i].name}
      className="group flex flex-col items-center gap-1.5"
    >
      <span className="h-14 w-14 overflow-hidden rounded-full ring-1 ring-white/20 transition group-hover:ring-white/60">
        <img
          src={ARTISTS[i].img}
          alt={ARTISTS[i].name}
          draggable={false}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="text-[11px] text-white/50 transition group-hover:text-white">
        {ARTISTS[i].name}
      </span>
    </button>
  ));

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
            {t("ui.ourStyles")}
          </p>
        </Reveal>

        {/* Showcase — mirrors the /artists layout: artist avatars + photo + text */}
        <div className="mt-10 flex w-full flex-col items-center gap-8 md:flex-row md:justify-center md:gap-14">
          {styleArtistIdxs.length > 0 && (
            <Reveal className="hidden shrink-0 md:block">
              <div className="flex flex-col items-center justify-center gap-4">
                {artistAvatars}
              </div>
            </Reveal>
          )}

          <Reveal className="w-full max-w-[300px] shrink-0 md:max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
              {photo ? (
                <FadeImg
                  src={photo}
                  alt={`${style.name} tattoo — The Four Deuces Amsterdam`}
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal className="flex-1" y={24}>
            <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40 md:text-left">
              {style.kicker}
            </p>
            <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-left md:text-[4rem]">
              {leadWords ? leadWords + " " : ""}
              <span className="italic">{lastWord}</span>
            </h1>
            {style.lead.map((p, i) => (
              <p
                key={i}
                className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        {/* Mobile-only: artists who work in this style, below the copy */}
        {styleArtistIdxs.length > 0 && (
          <Reveal className="md:hidden">
            <section className="mt-14">
              <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
                {t("ui.madeByArtists")}
              </h2>
              <div className="flex flex-row flex-wrap items-start justify-center gap-6">
                {artistAvatars}
              </div>
            </section>
          </Reveal>
        )}

        {/* Other styles — All styles first, then the rest. */}
        <Reveal>
          <section className="mt-16">
            <h2 className="mb-5 text-center text-[12px] uppercase tracking-[0.25em] text-white/40">
              {t("ui.otherStyles")}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate("/styles")}
                data-cursor="pointer"
                className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/75 transition hover:border-white/40 hover:bg-white/5"
              >
                {t("nav.styles")}
              </button>
              {getStyles(lang)
                .filter((s) => s.slug !== style.slug)
                .map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => onNavigate(s.slug)}
                    data-cursor="pointer"
                    className="rounded-full border border-white/15 px-4 py-2 text-[13px] text-white/75 transition hover:border-white/40 hover:bg-white/5"
                  >
                    {s.nav}
                  </button>
                ))}
            </div>
          </section>
        </Reveal>

        {/* FAQ (also emitted as FAQPage structured data at build time) */}
        <Reveal>
          <section className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-center font-serif text-[1.9rem] leading-[1] tracking-tight md:text-[2.4rem]">
              {t("ui.qa")}
            </h2>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {style.faq.map((item, i) => (
                <details key={i} className="group py-5">
                  <summary
                    data-cursor="pointer"
                    className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] text-white/90 md:text-[18px] [&::-webkit-details-marker]:hidden"
                  >
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-white/40 transition-transform duration-300 group-open:rotate-180"
                      strokeWidth={2}
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/55">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Hidden SEO copy — keyword-rich text for search engines (e.g.
            "realism tattoo Amsterdam"); visually hidden (sr-only) so it has no
            effect on the layout. */}
        <section className="sr-only">
          <h2>{style.name} Tattoo in Amsterdam — The Four Deuces</h2>
          <p>
            The Four Deuces is a tattoo studio in Amsterdam's Museum Quarter
            (Amsterdam Zuid), at Van Baerlestraat 126H, 1071 BD Amsterdam,
            specialising in {style.name.toLowerCase()} tattoos. We create
            fully custom, highly detailed work and welcome clients from across
            Amsterdam, the Netherlands and abroad.
          </p>
          <p>
            {style.aliases
              .map((a) => `${a} tattoo Amsterdam`)
              .join(" · ")}
          </p>
          <p>
            Book a {style.nav.toLowerCase()} tattoo in Amsterdam, or a free
            consultation, at The Four Deuces — Van Baerlestraat 126H, near
            Museumplein, the Van Gogh Museum and Vondelpark.
          </p>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

// Eased scroll to a section — a longer, gentler glide than the browser's
// native smooth scroll (easeInOutCubic).
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

function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const t = useT();
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <AsciiFire />
      {/* Vignette so the text stays legible over the flames */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.25) 42%, rgba(5,5,5,0.8) 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/50">
          {t("nf.kicker")}
        </p>
        <h1 className="font-serif text-[6rem] leading-[0.9] tracking-tight md:text-[10rem]">
          404
        </h1>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/70">
          {t("nf.msg")}
        </p>
        <CtaBar
          className="mt-8"
          items={[{ label: t("nf.back"), onClick: () => onNavigate("/") }]}
        />
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* LOADER — preloads the gallery images before revealing the site             */
/* -------------------------------------------------------------------------- */

function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const urls = Array.from(
      new Set([...ARTISTS.map((a) => a.img), ...WORKS.map((w) => w.img)]),
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
            <div className="flex w-full max-w-[560px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] py-2 pl-3 pr-2 backdrop-blur-xl">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Cookie className="h-4 w-4 text-white/70" strokeWidth={2} />
              </span>
              <p className="flex-1 text-[11px] leading-tight text-white/60">
                {tr("cookie.text")}{" "}
                <button
                  onClick={() => navigate("/terms")}
                  data-cursor="pointer"
                  className="text-white/80 underline underline-offset-2"
                >
                  {tr("cookie.privacy")}
                </button>
              </p>
              <button
                onClick={() => decideConsent("declined")}
                className="rounded-full px-4 py-2 text-[12px] text-white/70 transition hover:text-white"
              >
                {tr("cookie.decline")}
              </button>
              <button
                onClick={() => decideConsent("accepted")}
                className="rounded-full bg-white px-5 py-2 text-[12px] font-medium text-black transition hover:bg-white/90"
              >
                {tr("cookie.accept")}
              </button>
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
