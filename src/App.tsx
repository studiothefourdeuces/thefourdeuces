import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import {
  Euro,
  Check,
  Cookie,
  Instagram,
  ArrowUpRight,
  ArrowLeft,
  ChevronDown,
  Download,
  Smartphone,
  X,
} from "lucide-react";
import dariaImg from "./img/artists/daria.png";
import eugeneImg from "./img/artists/eugene.png";
import maxImg from "./img/artists/max.png";
import milaImg from "./img/artists/mila.png";
import selcukImg from "./img/artists/selcuk.png";
import gianlucaImg from "./img/artists/gianluca.png";
import daryaImg from "./img/artists/darya.png";
import tattoolandLogo from "./img/partners/tattooland.png";
import killerinkLogo from "./img/partners/killerink.png";
import dashaLogo from "./img/partners/tattoodasha.png";
import { FAQ_ITEMS } from "./faq";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const ARTISTS = [
  {
    name: "Max",
    img: maxImg,
    ig: "https://www.instagram.com/maxxonk_tattoo/",
    role: "Chicano, Realism, Portraits",
    bio: "Chicano-inspired realism and portraits — black-and-grey work with smooth gradients and lifelike depth.",
  },
  {
    name: "Eugene",
    img: eugeneImg,
    ig: "https://www.instagram.com/novohatskytattoo/",
    role: "Chicano, Realism, Blackwork",
    bio: "Chicano lettering and portrait realism backed by solid blackwork that stays crisp for years.",
  },
  {
    name: "Daria",
    img: dariaImg,
    ig: "https://www.instagram.com/tattoo.daria/",
    role: "Watercolour, Fine Line, Abstract",
    bio: "Soft watercolour washes, delicate fine-line work, and loose abstract compositions that feel painted onto the skin.",
  },
  {
    name: "Mila",
    img: milaImg,
    ig: "https://www.instagram.com/mila.delger/",
    role: "Freehand, Fine Line, Abstract",
    bio: "Freehand pieces drawn straight onto the skin — fine-line and abstract shapes made to flow with the body.",
  },
  {
    name: "Gianluca",
    img: gianlucaImg,
    ig: "https://www.instagram.com/gianluca_tattooer/",
    role: "Geometric & ornamental blackwork",
    bio: "Geometric, optical and ornamental blackwork with elements of abstract calligraphy, dotwork, and engraving-inspired detail.",
  },
  {
    name: "Darya",
    img: daryaImg,
    ig: "https://www.instagram.com/bazhina_tatoonl/",
    role: "Anime, Manga, Realism",
    bio: "Anime and manga brought to skin — bold graphic linework and colour alongside detailed black-and-grey realism and illustrative graphic art.",
  },
  {
    name: "Selçuk",
    img: selcukImg,
    ig: "https://www.instagram.com/selcukozger.ink/",
    role: "Minimal, Fine Line, Botanical",
    bio: "Minimal fine-line and botanical designs — restrained, elegant, and built to last.",
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

const WORK_ARTIST_INDEX: Record<string, number> = {
  max: 0,
  eugene: 1,
  daria: 2,
  mila: 3,
  gianluca: 4,
  darya: 5,
  selcuk: 6,
};

type Work = { img: string; artistIdx: number };

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
    byArtist[idx].push({ img: url, artistIdx: idx });
  }
  // Interleave round-robin so consecutive cards aren't the same artist.
  const out: Work[] = [];
  const maxLen = Math.max(0, ...byArtist.map((a) => a.length));
  for (let r = 0; r < maxLen; r++)
    for (const arr of byArtist) if (arr[r]) out.push(arr[r]);
  return out;
})();

// Every work grouped by its artist (used by the mobile works lightbox).
const WORKS_BY_ARTIST: string[][] = ARTISTS.map((_, i) =>
  WORKS.filter((w) => w.artistIdx === i).map((w) => w.img),
);

const TICKER =
  "Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — ";

const MENU: { label: string; target: string }[] = [
  { label: "Home", target: "top" },
  { label: "Book", target: "/book" },
  { label: "Artists", target: "/artists" },
  { label: "Reviews", target: "#reviews" },
  { label: "Sponsors", target: "#sponsors" },
  { label: "Contact", target: "/contact" },
];

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

function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.88 && r.bottom > 0) {
        setShown(true);
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };
    check(); // reveal immediately if already in view
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
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
  const items = WORKS;
  const N = items.length;
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(onOpenProfile);
  openRef.current = onOpenProfile;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

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
      const cardW = vw < 640 ? 168 : vw < 1024 ? 216 : 264;
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
      className="pointer-events-none absolute inset-x-0 bottom-[9%] z-20 h-[240px]"
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
          </div>
        ))}
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

type Step = "idle" | "budget" | "instagram" | "done";

// Lead endpoint — the Cloudflare Worker URL. Set VITE_FORM_ENDPOINT at build
// time. If unset, the form still works locally; it just doesn't ship the lead.
const FORM_ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

type LeadContext = { source: string; artist?: string; bodyPart?: string };

// The lead form. Reused in two places so the site keeps one shared "book"
// element: `mode="hero"` renders the centred hero overlay; `mode="modal"`
// renders the exact same field + button flow inside a full-screen booking
// overlay (opened from the Book page, an artist, or a body area).
function LeadForm({
  mode,
  context,
  onClose,
}: {
  mode: "hero" | "modal";
  context: LeadContext;
  onClose?: () => void;
}) {
  const [step, setStep] = useState<Step>("idle");
  const [budget, setBudget] = useState("");
  const [instagram, setInstagram] = useState("");
  const [idleIdx, setIdleIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [loaded, setLoaded] = useState(mode === "modal");
  const [hp, setHp] = useState(""); // honeypot — real users leave it empty
  const inputRef = useRef<HTMLInputElement>(null);
  const shake = useAnimationControls();

  // First-load reveal (hero only) — fade + rise the whole hero in once, on
  // mount. A short timer lets the hidden state paint so the transition runs.
  useEffect(() => {
    if (mode !== "hero") return;
    const id = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(id);
  }, [mode]);

  useEffect(() => {
    if (step !== "idle") return;
    const id = setInterval(() => setIdleIdx((v) => (v + 1) % 2), 2600);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step === "instagram") inputRef.current?.focus();
  }, [step]);

  // Modal: lock page scroll and close on Escape while open.
  useEffect(() => {
    if (mode !== "modal") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mode, onClose]);

  const igHandle = instagram.trim().replace(/^@+/, "");
  const igValid = /^[a-zA-Z0-9._]{1,30}$/.test(igHandle);
  const engaged = step === "budget" || step === "instagram";

  const doShake = () =>
    shake.start({
      x: [0, -10, 9, -8, 6, -3, 0],
      transition: { duration: 0.45, ease: "easeInOut" },
    });

  const next = () => (budget ? setStep("instagram") : doShake());

  // Fire-and-forget: show the success state immediately, ship the lead in the
  // background. A failed request must never cost us the visitor's confirmation.
  const sendLead = () => {
    if (!FORM_ENDPOINT) return;
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        budget,
        instagram: igHandle,
        hp,
        source: context.source,
        artist: context.artist || "",
        bodyPart: context.bodyPart || "",
      }),
    }).catch(() => {});
  };

  const submit = () => {
    if (!igValid) return doShake();
    setStep("done");
    sendLead();
  };

  const big =
    "font-display font-normal text-[1.5rem] leading-none tracking-tight sm:text-[2.4rem] md:text-[4rem]";

  const isIg = step === "instagram";
  const value = isIg ? instagram : fmtBudget(budget);
  const placeholder = isIg
    ? "enter your instagram"
    : step === "idle" && idleIdx === 1
      ? "enter your instagram"
      : "enter your budget";
  const Icon = isIg || (step === "idle" && idleIdx === 1) ? Instagram : Euro;

  const contextLabel = context.artist
    ? `with ${context.artist}`
    : context.bodyPart
      ? context.bodyPart
      : null;

  // ---- Shared inner pieces (identical in both modes) ----
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
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black transition-colors duration-300 md:h-14 md:w-14 ${
          engaged ? "bg-white" : "bg-white/30"
        }`}
      >
        <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
      </span>
      <div className="relative grid items-center" style={{ maxWidth: "80vw" }}>
        {/* Invisible sizer — the field width tracks the text EXACTLY. */}
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
          inputMode={isIg ? "text" : "numeric"}
          placeholder={placeholder}
          data-cursor="text"
          onFocus={() => {
            setFocused(true);
            if (step === "idle") setStep("budget");
          }}
          onBlur={() => {
            setFocused(false);
            if (step === "budget" && !budget) setStep("idle");
          }}
          onChange={(e) =>
            isIg
              ? setInstagram(e.target.value.replace(/\s/g, "").slice(0, 31))
              : setBudget(e.target.value.replace(/\D/g, "").slice(0, 5))
          }
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            isIg ? submit() : next();
          }}
          size={1}
          className={`${big} col-start-1 row-start-1 w-full min-w-0 bg-transparent text-left text-white outline-none placeholder:text-transparent ${value ? "caret-white" : "caret-transparent"}`}
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
    </motion.div>
  );

  const stepButton = (
    <AnimatePresence mode="wait">
      {step === "budget" && (
        <motion.button
          key="next"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={next}
          className="rounded-full bg-white/10 px-7 py-3 text-[14px] text-white/90 backdrop-blur transition hover:bg-white/20"
        >
          Okay, next
        </motion.button>
      )}
      {step === "instagram" && (
        <motion.button
          key="submit"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={submit}
          className="rounded-full bg-white px-8 py-3 text-[14px] font-medium text-black transition hover:bg-white/90"
        >
          Submit
        </motion.button>
      )}
    </AnimatePresence>
  );

  const doneInner = (
    <>
      <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
        <Check className="h-6 w-6" strokeWidth={2.5} />
      </span>
      <h2 className="font-serif text-[2.4rem] leading-[1.05] md:text-[3.4rem]">
        Submission <span className="italic">accepted.</span>
      </h2>
      <p className="mt-3 text-[15px] text-white/70">We'll be in touch shortly.</p>
      <div className="mt-6 space-y-1 text-[13px]">
        <div>
          <span className="text-white/40">budget</span>{" "}
          <span className="text-white/90">€{fmtBudget(budget) || "—"}</span>
        </div>
        <div>
          <span className="text-white/40">instagram</span>{" "}
          <span className="text-white/90">
            {igHandle ? "@" + igHandle : "—"}
          </span>
        </div>
        {contextLabel && (
          <div>
            <span className="text-white/40">
              {context.artist ? "artist" : "placement"}
            </span>{" "}
            <span className="text-white/90">
              {context.artist || context.bodyPart}
            </span>
          </div>
        )}
      </div>
      <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/40">
        We only use your Instagram to get in touch about your request. It isn't
        stored anywhere and is deleted from our records as soon as we've
        contacted you.
      </p>
    </>
  );

  // ---- MODAL MODE ----
  if (mode === "modal") {
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
          {step === "done" ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center"
            >
              {doneInner}
            </motion.div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="font-serif text-[2rem] leading-[1.1] tracking-tight md:text-[2.8rem]">
                  Request a <span className="italic">booking</span>
                </h2>
                {contextLabel && (
                  <p className="mt-3 text-[13px] uppercase tracking-[0.25em] text-white/40">
                    {contextLabel}
                  </p>
                )}
              </div>
              {fieldGroup}
              <div className="mt-8 flex h-12 items-start justify-center">
                {stepButton}
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // ---- HERO MODE ----
  if (step === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 pb-[26vh] text-center"
      >
        {doneInner}
      </motion.div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(26px)",
        transition:
          "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {honeypot}

      {/* Heading — anchored above the centre; blurs (lightly) while a field is
          active and shifts up together with the input. */}
      <h1
        style={{
          top: "calc(50% - 150px)",
          transform: engaged ? "translate(-50%, -40px)" : "translate(-50%, 0)",
          filter: engaged ? "blur(1.8px)" : "blur(0px)",
          opacity: engaged ? 0.4 : 1,
          transition:
            "transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease, opacity 0.5s ease",
        }}
        className="pointer-events-none absolute left-1/2 w-full px-6 text-center font-serif text-[2rem] leading-[1.15] tracking-tight md:text-[2.8rem]"
      >
        Ink With Intent.
        <br />
        <span className="italic">Made to Last.</span>
      </h1>

      {/* Icon + input — anchored at the EXACT vertical + horizontal centre. */}
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2"
        style={{
          transform: engaged
            ? "translate(-50%, calc(-50% - 40px))"
            : "translate(-50%, -50%)",
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        {fieldGroup}
      </div>

      {/* Button — anchored below the centre so it never shifts the input */}
      <div className="pointer-events-auto absolute left-1/2 top-[calc(50%+52px)] flex -translate-x-1/2 justify-center">
        {stepButton}
      </div>
    </div>
  );
}

function Hero() {
  return <LeadForm mode="hero" context={{ source: "hero" }} />;
}
/* -------------------------------------------------------------------------- */
/* APP                                                                        */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* MENU — circular burger button (morphs to a cross) + full-screen overlay     */
/* with a hover text-reveal (line rolls up, siblings dim).                      */
/* -------------------------------------------------------------------------- */

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const t = { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <button
      onClick={onClick}
      data-cursor="pointer"
      aria-label={open ? "Close menu" : "Open menu"}
      className="fixed right-4 top-[9px] z-[60] flex h-12 w-12 items-center justify-center md:right-6 md:h-14 md:w-14"
    >
      <motion.span
        className="absolute h-[2px] w-5 rounded-full bg-white md:w-6"
        animate={open ? { y: 0, rotate: 45 } : { y: -4, rotate: 0 }}
        transition={t}
      />
      <motion.span
        className="absolute h-[2px] w-5 rounded-full bg-white md:w-6"
        animate={open ? { y: 0, rotate: -45 } : { y: 4, rotate: 0 }}
        transition={t}
      />
    </button>
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
  const [hovered, setHovered] = useState<number | null>(null);
  const anyActive = hovered !== null;
  const reveal = { type: "spring", stiffness: 400, damping: 40, mass: 1 } as const;
  const line =
    "block font-display font-normal leading-[0.9] tracking-[-0.03em] text-[14vw] md:text-[7rem]";
  const sections = MENU;

  const go = (item: (typeof MENU)[number]) => {
    onClose();
    if (item.target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (item.target.startsWith("/")) {
      onNavigate(item.target);
    } else {
      document
        .querySelector(item.target)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AnimatePresence onExitComplete={() => setHovered(null)}>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          onMouseLeave={() => setHovered(null)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6"
        >
          <nav className="flex flex-col items-center gap-1 md:gap-2">
            {sections.map((item, i) => {
              const isHovered = hovered === i;
              const color = anyActive
                ? isHovered
                  ? "#FFFFFF"
                  : "#51565A"
                : "#FFFFFF";
              return (
                <motion.div
                  key={item.label}
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
                      {item.label}
                    </span>
                    <span
                      aria-hidden
                      className={`${line} absolute left-0 top-full w-full`}
                      style={{ color, transition: "color 0.2s ease" }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </nav>
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

// Mobile-only horizontal avatar row (desktop uses the vertical ArtistButtons).
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

/* Full-screen, swipeable gallery of a single artist's works. Opened by tapping
   an artist's photo (primarily on mobile). Uses native horizontal scroll-snap
   so swiping feels native and needs no drag maths. */
function WorksLightbox({
  artistIdx,
  onClose,
}: {
  artistIdx: number | null;
  onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [idx, setIdx] = useState(0);
  const open = artistIdx !== null;

  // Reset to the first work whenever a different artist is opened.
  useEffect(() => {
    if (!open) return;
    setIdx(0);
    requestAnimationFrame(() => {
      if (trackRef.current) trackRef.current.scrollLeft = 0;
    });
  }, [artistIdx, open]);

  // Lock page scroll and close on Escape while open.
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
            {works.map((src, i) => (
              <div
                key={i}
                className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4 pb-4"
              >
                <img
                  src={src}
                  alt={`${artist.name} — work ${i + 1}`}
                  draggable={false}
                  className="max-h-full max-w-full rounded-2xl object-contain"
                />
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
  const M = ARTISTS.length;
  const artist = ARTISTS[active];
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
      className="relative flex min-h-screen items-center px-6 py-24 md:px-16"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-center md:gap-14">
        <Reveal className="hidden shrink-0 md:block" y={24}>
          <ArtistButtons active={active} onSelect={onSelect} />
        </Reveal>

        {/* Photo */}
        <Reveal
          className="w-full max-w-[300px] shrink-0 md:max-w-md"
          delay={0.12}
          y={24}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
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
        <Reveal className="md:hidden" delay={0.18} y={20}>
          <ArtistRow active={active} onSelect={onSelect} />
        </Reveal>

        {/* Text */}
        <Reveal className="flex-1" delay={0.24} y={24}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {String(active + 1).padStart(2, "0")} — {artist.role}
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[5.5rem]">
              {artist.name}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              {artist.bio}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onBook({ artist: artist.name })}
                data-cursor="pointer"
                className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black transition hover:bg-white/90"
              >
                Book with {artist.name}
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(active);
                  onNavigate("/artists");
                }}
                data-cursor="pointer"
                className="rounded-full border border-white/25 px-6 py-3 text-[13px] font-medium text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                See {artist.name}'s Portfolio
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

const MAX_PORTFOLIO = 18;

function ArtistsPage({
  active,
  onSelect,
  onOpenWorks,
  onBook,
}: {
  active: number;
  onSelect: (i: number) => void;
  onOpenWorks: (i: number) => void;
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const M = ARTISTS.length;
  const artist = ARTISTS[active];
  const works = (WORKS_BY_ARTIST[active] || []).slice(0, MAX_PORTFOLIO);

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

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
          Our artists
        </p>
        <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
          Artists
        </h1>

        {/* Artist showcase — mirrors the home page layout */}
        <div className="mt-14 flex w-full flex-col items-center gap-10 md:flex-row md:justify-center md:gap-14">
          <div className="hidden shrink-0 md:block">
            <ArtistButtons active={active} onSelect={onSelect} />
          </div>

          {/* Photo — desktop only; on mobile the small-avatar carousel is the
              only artist picker. */}
          <div className="hidden w-full max-w-[300px] shrink-0 md:block md:max-w-md">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
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

          {/* Mobile-only horizontal selector */}
          <div className="md:hidden">
            <ArtistRow active={active} onSelect={onSelect} />
          </div>

          {/* Text */}
          <motion.div
            key={active}
            className="flex-1"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
              {String(active + 1).padStart(2, "0")} — {artist.role}
            </p>
            <h2 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4rem]">
              {artist.name}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">
              {artist.bio}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onBook({ artist: artist.name })}
                data-cursor="pointer"
                className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black transition hover:bg-white/90"
              >
                Book with {artist.name}
              </button>
              <a
                href={artist.ig}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="pointer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-[13px] font-medium text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                <Instagram className="h-4 w-4" strokeWidth={2} />
                Instagram
              </a>
            </div>
          </motion.div>
        </div>

        {/* Works grid */}
        <section className="mt-16">
          <h2 className="text-center font-serif text-[1.7rem] leading-[1] tracking-tight md:text-[2.2rem]">
            {artist.name}'s work
          </h2>
          {works.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {works.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onOpenWorks(active)}
                  data-cursor="pointer"
                  className="group relative aspect-square w-full overflow-hidden rounded-xl ring-1 ring-white/10 outline-none"
                >
                  <img
                    src={src}
                    alt={`${artist.name} — work ${i + 1}`}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-[14px] text-white/40">
              Portfolio coming soon.
            </p>
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
    <div className="mb-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
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
      className={`relative h-[560px] overflow-hidden md:h-[720px] ${className}`}
      style={{ WebkitMaskImage: REVIEW_MASK, maskImage: REVIEW_MASK }}
    >
      <div
        className="tfd-marquee absolute inset-x-0 top-0 flex flex-col"
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
            What people say
          </p>
          <h2 className="mb-12 text-center font-serif text-[2.6rem] leading-[0.95] tracking-tight md:mb-16 md:text-[4.5rem]">
            Reviews
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
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
  return (
    <section id="sponsors" className="relative px-6 py-24 md:px-16 md:py-32">
      <div className="mx-auto w-full max-w-6xl border-t border-white/10">
        {SPONSORS.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.08} y={20}>
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
                {s.tag}
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
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT PAGE — /contact route                                              */
/* -------------------------------------------------------------------------- */

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      data-cursor="pointer"
      aria-label="Back to home"
      className="fixed right-4 top-[9px] z-[60] flex h-12 w-12 items-center justify-center md:right-6 md:h-14 md:w-14"
    >
      <ArrowLeft className="h-6 w-6 text-white md:h-7 md:w-7" strokeWidth={2} />
    </button>
  );
}

function ContactPage({
  onNavigate,
}: {
  onNavigate: (path: string) => void;
}) {
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
      setError("Please add your name, a valid email and a message.");
      return;
    }
    setError("");
    setSent(true);
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, hp, source: "contact" }),
      }).catch(() => {});
    }
  };

  const field =
    "w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none transition focus:border-white/40";

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
          Get in touch
        </p>
        <h1 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
          Contact
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-white/60">
          Looking to book a tattoo? Appointments are requested on the{" "}
          <button
            onClick={() => onNavigate("/")}
            data-cursor="pointer"
            className="text-white underline underline-offset-4 transition hover:text-white/70"
          >
            home page
          </button>
          . For everything else — collaborations, press or general questions —
          drop us a line below.
        </p>

        {sent ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </span>
            <h2 className="font-serif text-[2rem] leading-[1.05] md:text-[2.6rem]">
              Message <span className="italic">sent.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-white/40">
              We only use your email to reply to your message. It isn't stored
              anywhere and is deleted from our records as soon as we've been in
              touch.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 flex flex-col gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              data-cursor="text"
              className={field}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              data-cursor="text"
              className={field}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message"
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
            <button
              type="submit"
              data-cursor="pointer"
              className="mt-2 self-start rounded-full bg-white px-8 py-3 text-[14px] font-medium text-black transition hover:bg-white/90"
            >
              Send message
            </button>
          </form>
        )}

        <div className="mt-14 border-t border-white/10 pt-6">
          <p className="mb-1 text-[11px] uppercase tracking-[0.25em] text-white/40">
            Partnerships & collaborations
          </p>
          <a
            href="mailto:studio@thefourdeuces.nl"
            data-cursor="pointer"
            className="text-[15px] text-white/80 transition hover:text-white"
          >
            studio@thefourdeuces.nl
          </a>
        </div>

        <p className="mt-8 text-[13px] text-white/40">
          By contacting us you agree to our{" "}
          <button
            onClick={() => onNavigate("/terms")}
            data-cursor="pointer"
            className="text-white/70 underline underline-offset-4 transition hover:text-white"
          >
            Terms &amp; Conditions
          </button>
          .
        </p>
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
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.06]"
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
  { key: "head", geo: "head", label: "Head & scalp", pain: 4, duration: "2–4 h", note: "Thin skin over bone — sharp and intense." },
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
  { key: "head", geo: "head", label: "Head & scalp", pain: 4, duration: "2–4 h", note: "Thin skin over bone — sharp and intense." },
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
  const byGeo: Record<string, BodyRegion> = {};
  regions.forEach((r) => {
    byGeo[r.geo] = r;
  });
  return (
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
  );
}

function BodyPain({
  onBook,
}: {
  onBook?: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const [view, setView] = useState<View>("front");
  const [selected, setSelected] = useState<string | null>(null);
  const regions = REGION_SETS[view];
  const region = regions.find((r) => r.key === selected) || null;

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
          <ViewBtn value="front" label="Front" />
          <ViewBtn value="back" label="Back" />
        </div>
        <div className="h-[520px] w-[156px] md:h-[620px] md:w-[186px]">
          <BodyMap regions={regions} selected={selected} onSelect={setSelected} />
        </div>
      </div>

      {/* Info panel */}
      <div className="w-full md:w-96 md:self-center md:border-l md:border-white/10 md:pl-12">
        {region ? (
          <div>
            <p className="mb-2 text-[12px] uppercase tracking-[0.3em] text-white/40">
              Selected area
            </p>
            <h3 className="font-serif text-[2.4rem] leading-[1] md:text-[3rem]">
              {region.label}
            </h3>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mb-2 text-[12px] uppercase tracking-[0.25em] text-white/40">
                  Pain level
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
                    {PAIN_LEVELS[region.pain].label}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1 text-[12px] uppercase tracking-[0.25em] text-white/40">
                  Typical session
                </p>
                <p className="text-[18px] text-white/90">{region.duration}</p>
              </div>

              <p className="max-w-md text-[14px] leading-relaxed text-white/55">
                {region.note}
              </p>

              {onBook && (
                <button
                  type="button"
                  onClick={() => onBook({ bodyPart: region.label })}
                  data-cursor="pointer"
                  className="rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black transition hover:bg-white/90"
                >
                  Book this area
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden h-full flex-col justify-center md:flex">
            <h3 className="font-serif text-[1.8rem] leading-[1.1] text-white/80 md:text-[2.2rem]">
              Tap a body <span className="italic">area</span>
            </h3>
            <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/50">
              Select any part of the body to see how much it typically hurts and
              how long a session tends to take. Switch between front and back
              with the toggle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookPage({
  onNavigate,
  onBook,
}: {
  onNavigate: (path: string) => void;
  onBook: (ctx: { artist?: string; bodyPart?: string }) => void;
}) {
  const sectionHeading =
    "text-center font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.8rem]";

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-5xl">
        <p className="mb-4 text-center text-[12px] uppercase tracking-[0.3em] text-white/40">
          Book an appointment
        </p>
        <h1 className="text-center font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
          Book
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
          Tell us your budget and Instagram and we'll get back to you to arrange
          the details.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => onBook({})}
            data-cursor="pointer"
            className="rounded-full bg-white px-8 py-3.5 text-[14px] font-medium text-black transition hover:bg-white/90"
          >
            Request a booking
          </button>
        </div>

        {/* ---- Does it hurt? ---- */}
        <section className="mt-20">
          {/* Desktop lead */}
          <div className="hidden md:block">
            <h2 className={sectionHeading}>
              Does it <span className="italic">hurt?</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
              Pain is personal, but some spots are famously tougher than others.
              Here's a rough guide by area — tap a part of the body to see more,
              then book that spot right here.
            </p>
          </div>
          {/* Mobile lead */}
          <div className="md:hidden">
            <h2 className={sectionHeading}>
              Tap a body <span className="italic">area</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
              Select any part of the body to see how much it typically hurts and
              how long a session tends to take. Switch between front and back
              with the toggle.
            </p>
          </div>
          <BodyPain onBook={onBook} />
        </section>

        {/* ---- FAQ ---- */}
        <section className="mx-auto mt-24 max-w-3xl">
          <h2 className={sectionHeading}>FAQ</h2>

          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {FAQ_ITEMS.map((item, i) => (
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

          <div className="mt-14">
            <h3 className="mb-1 text-[12px] uppercase tracking-[0.25em] text-white/40">
              Downloads
            </h3>
            <p className="mb-5 text-[13px] text-white/40">
              Available in Dutch (Nederlands) only.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <DownloadCard
                href="/docs/nazorginstructie-tatoeage.pdf"
                title="Aftercare instructions"
                sub="Nazorginstructie · PDF · NL"
              />
              <DownloadCard
                href="/docs/informatie-risicos-tatoeage-pmu.pdf"
                title="Information about risks"
                sub="Risico-informatie (PMU) · PDF · NL"
              />
            </div>
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 text-[14px] text-white/50">
            For full details, please read our{" "}
            <button
              onClick={() => onNavigate("/terms")}
              data-cursor="pointer"
              className="text-white underline underline-offset-4 transition hover:text-white/70"
            >
              Terms &amp; Conditions
            </button>
            .
          </p>
        </section>
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
    "font-serif text-[2rem] leading-[1] tracking-tight md:text-[2.8rem]";
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
          Legal
        </p>
        <h1 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
          Terms &amp; <span className="italic">Privacy</span>
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55">
          The rules of the studio, and how we look after your data.
        </p>

        <section className="mt-16">
          <h2 className={sectionHead}>Terms &amp; Conditions</h2>
          <LegalGroup data={TERMS} />
        </section>

        <section className="mt-24">
          <h2 className={sectionHead}>Privacy Policy</h2>
          <LegalGroup data={PRIVACY} />
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
        Please rotate your <span className="italic">device.</span>
      </h2>
      <p className="max-w-sm text-[14px] leading-relaxed text-white/60">
        The Four Deuces is best experienced in portrait. Turn your phone upright
        to continue.
      </p>
    </div>
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

export default function App() {
  const [consent, setConsent] = useState<Consent | null>(() =>
    typeof localStorage !== "undefined"
      ? (localStorage.getItem(CONSENT_KEY) as Consent | null)
      : null,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArtist, setActiveArtist] = useState(0);
  const [worksArtist, setWorksArtist] = useState<number | null>(null);
  const [booking, setBooking] = useState<{
    artist?: string;
    bodyPart?: string;
  } | null>(null);
  const [route, setRoute] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Returning visitor who already accepted → start analytics on load.
  useEffect(() => {
    if (consent === "accepted") loadClarity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decideConsent = (choice: Consent) => {
    setConsent(choice);
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* ignore */
    }
    if (choice === "accepted") loadClarity();
  };

  const navigate = (path: string) => {
    setMenuOpen(false);
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
      setRoute(path);
    }
    window.scrollTo(0, 0);
  };

  const path = route.replace(/\/+$/, "") || "/";
  const page =
    path === "/contact"
      ? "contact"
      : path === "/book" || path === "/guide"
        ? "book"
        : path === "/artists"
          ? "artists"
          : path === "/terms"
            ? "terms"
            : "home";
  const isHome = page === "home";

  const openProfile = (i: number) => {
    setActiveArtist(i);
    smoothScrollToId("artists", 950);
  };

  const openBooking = (ctx: { artist?: string; bodyPart?: string } = {}) => {
    setMenuOpen(false);
    setBooking(ctx);
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-[#050505] text-white">
      {/* ===================== HEADER ===================== */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-start justify-between px-4 py-4 md:px-6 md:py-5">
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

      {isHome ? (
        <>
          <MenuButton open={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
          <Menu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            onNavigate={navigate}
          />
        </>
      ) : (
        <BackButton onClick={() => navigate("/")} />
      )}

      {isHome ? (
        <>
          {/* ============ FIRST SCREEN: hero + carousel ============ */}
          <section className="relative min-h-screen overflow-hidden">
            <main className="pointer-events-none relative z-30 min-h-screen">
              <Hero />
            </main>
            <Carousel onOpenProfile={openProfile} />
          </section>

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

          {/* ===================== FOOTER ===================== */}
          <footer className="px-6 py-14 md:px-16">
            <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
              <p className="font-serif text-[24px] leading-none tracking-tight text-white/70">
                The Four <span className="italic">Deuces</span>
              </p>
              <p className="text-[13px] leading-relaxed text-white/40">
                Designed &amp; developed by{" "}
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
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/30">
                <button
                  onClick={() => navigate("/terms")}
                  data-cursor="pointer"
                  className="transition hover:text-white/70"
                >
                  Terms &amp; Privacy
                </button>
                <span className="text-white/15">·</span>
                <span>© 2020–{new Date().getFullYear()} The Four Deuces</span>
              </div>
            </div>
          </footer>
        </>
      ) : page === "contact" ? (
        <ContactPage onNavigate={navigate} />
      ) : page === "book" ? (
        <BookPage onNavigate={navigate} onBook={openBooking} />
      ) : page === "artists" ? (
        <ArtistsPage
          active={activeArtist}
          onSelect={setActiveArtist}
          onOpenWorks={setWorksArtist}
          onBook={openBooking}
        />
      ) : (
        <TermsPage />
      )}

      {/* ===================== WORKS LIGHTBOX ===================== */}
      <WorksLightbox
        artistIdx={worksArtist}
        onClose={() => setWorksArtist(null)}
      />

      {/* ===================== BOOKING OVERLAY ===================== */}
      <AnimatePresence>
        {booking && (
          <LeadForm
            key="booking"
            mode="modal"
            context={{ source: "book", ...booking }}
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
                We use cookies to understand how you use our site. Accept to
                help us improve.{" "}
                <button
                  onClick={() => navigate("/terms")}
                  data-cursor="pointer"
                  className="text-white/80 underline underline-offset-2"
                >
                  Privacy Policy
                </button>
              </p>
              <button
                onClick={() => decideConsent("declined")}
                className="rounded-full px-4 py-2 text-[12px] text-white/70 transition hover:text-white"
              >
                Decline
              </button>
              <button
                onClick={() => decideConsent("accepted")}
                className="rounded-full bg-white px-5 py-2 text-[12px] font-medium text-black transition hover:bg-white/90"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor />
      <RotateNotice />
    </div>
  );
}
