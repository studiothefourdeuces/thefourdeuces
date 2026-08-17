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

// Carousel works — each photo in src/img/works is named after its artist
// (e.g. max1.jpg). Map every work to its artist so clicking a work opens that
// artist's profile. Files that don't match an artist (e.g. guest*) are skipped.
const workUrls = import.meta.glob("./img/works/*.jpg", {
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

const WORKS: Work[] = (() => {
  const byArtist: Work[][] = ARTISTS.map(() => []);
  for (const [path, url] of Object.entries(workUrls)) {
    const file = path.split("/").pop() || "";
    const slug = file.replace(/\d+\.jpg$/i, "").toLowerCase();
    const idx = WORK_ARTIST_INDEX[slug];
    if (idx === undefined) continue; // unmapped (e.g. guest*)
    byArtist[idx].push({ img: url, artistIdx: idx });
  }
  // Interleave round-robin so consecutive cards aren't the same artist.
  const out: Work[] = [];
  const maxLen = Math.max(0, ...byArtist.map((a) => a.length));
  for (let r = 0; r < maxLen; r++)
    for (const arr of byArtist) if (arr[r]) out.push(arr[r]);
  return out;
})();

const TICKER =
  "Follow @the.four.deuces on Instagram — Fresh ink, flash drops, and behind-the-chair moments — Tap through to see our latest work — ";

const MENU: { label: string; target: string }[] = [
  { label: "Home", target: "top" },
  { label: "Artists", target: "#artists" },
  { label: "Reviews", target: "#reviews" },
  { label: "Sponsors", target: "#sponsors" },
  { label: "FAQ", target: "/faq" },
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

    // "Inactivity" means no interaction WITH THE CAROUSEL — the pointer moving
    // over it or pressing on it. Auto-scroll resumes 3s after the pointer last
    // touched the carousel (moving the mouse elsewhere doesn't keep it paused).
    const bump = () => {
      lastActivity = performance.now();
    };
    wrap.addEventListener("click", onClick);
    wrap.addEventListener("pointermove", bump, { passive: true });
    wrap.addEventListener("pointerdown", bump, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("click", onClick);
      wrap.removeEventListener("pointermove", bump);
      wrap.removeEventListener("pointerdown", bump);
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
        style={{ transformStyle: "preserve-3d" }}
      >
        {items.map((a, i) => (
          <div
            key={i}
            data-idx={i}
            data-cursor="pointer"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="group absolute left-1/2 top-1/2 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/60"
            style={{
              backfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
          >
            <img
              src={a.img}
              alt={ARTISTS[a.artistIdx].name}
              draggable={false}
              className="pointer-events-none h-full w-full select-none object-cover grayscale transition duration-500 group-hover:grayscale-0"
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

function Hero() {
  const [step, setStep] = useState<Step>("idle");
  const [budget, setBudget] = useState("");
  const [instagram, setInstagram] = useState("");
  const [idleIdx, setIdleIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hp, setHp] = useState(""); // honeypot — real users leave it empty
  const inputRef = useRef<HTMLInputElement>(null);
  const shake = useAnimationControls();

  // First-load reveal — fade + rise the whole hero in once, on mount. A short
  // timer lets the initial (hidden) state paint so the transition actually runs.
  useEffect(() => {
    const id = setTimeout(() => setLoaded(true), 40);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (step !== "idle") return;
    const id = setInterval(() => setIdleIdx((v) => (v + 1) % 2), 2600);
    return () => clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step === "instagram") inputRef.current?.focus();
  }, [step]);

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
      body: JSON.stringify({ budget, instagram: igHandle, hp, source: "hero" }),
    }).catch(() => {});
  };

  const submit = () => {
    if (!igValid) return doShake();
    setStep("done");
    sendLead();
  };

  const big =
    "font-display font-normal text-[2.4rem] leading-none tracking-tight md:text-[4rem]";

  const isIg = step === "instagram";
  const value = isIg ? instagram : fmtBudget(budget);
  const placeholder = isIg
    ? "your instagram"
    : step === "idle" && idleIdx === 1
      ? "your instagram"
      : "your budget";
  const Icon = isIg || (step === "idle" && idleIdx === 1) ? Instagram : Euro;

  if (step === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 pb-[26vh] text-center"
      >
          <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
            <Check className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <h2 className="font-serif text-[2.4rem] leading-[1.05] md:text-[3.4rem]">
            Submission <span className="italic">accepted.</span>
          </h2>
          <p className="mt-3 text-[15px] text-white/70">
            We'll be in touch shortly.
          </p>
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
          </div>
          <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/40">
            We only use your Instagram to get in touch about your request. It
            isn't stored anywhere and is deleted from our records as soon as
            we've contacted you.
          </p>
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
      {/* Honeypot — off-screen, hidden from users & AT; bots that fill it are
          silently dropped by the Worker. */}
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

      {/* Icon + input — anchored at the EXACT vertical + horizontal centre of
          the page; shifts up when a field is active. */}
      <div
        className="pointer-events-auto absolute left-1/2 top-1/2"
        style={{
          transform: engaged
            ? "translate(-50%, calc(-50% - 40px))"
            : "translate(-50%, -50%)",
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
      <motion.div
        animate={shake}
        className="flex items-center gap-3 md:gap-4"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black transition-colors duration-300 md:h-14 md:w-14 ${
            engaged ? "bg-white" : "bg-white/30"
          }`}
        >
          <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.25} />
        </span>
        <div
          className="relative grid items-center"
          style={{ maxWidth: "66vw" }}
        >
          {/* Invisible sizer — the field width tracks the text EXACTLY. (ch
              units over-measure and leave dead space on the right, which shifts
              the whole icon+text group off the page centre.) */}
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
          {/* Ghost placeholder + trailing caret: keeps the placeholder hugging
              the icon (same gap as a typed value) while the blinking caret sits
              AFTER the placeholder text once the field is focused. */}
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
      </div>

      {/* Button — anchored below the centre so it never shifts the input */}
      <div className="pointer-events-auto absolute left-1/2 top-[calc(50%+52px)] flex -translate-x-1/2 justify-center">
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
      </div>
    </div>
  );
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

function ArtistShowcase({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
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
            <a
              href={artist.ig}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-medium text-black transition hover:bg-white/90"
            >
              Book with {artist.name}
            </a>
          </motion.div>
        </Reveal>
      </div>
    </section>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mobile: a single bottom-to-top column with every review. */}
            <FloatingColumn
              items={CHATS}
              dir="up"
              duration={60}
              className="md:hidden"
            />
            {/* Desktop: two columns, split. */}
            <FloatingColumn
              items={left}
              dir="down"
              duration={60}
              className="hidden md:block"
            />
            <FloatingColumn
              items={right}
              dir="up"
              duration={60}
              className="hidden md:block"
            />
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

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "How do I book an appointment?",
    a: "By appointment only — in person, by email, via Instagram, or through this website. We don't take walk-ins. Our official addresses are booking@thefourdeuces.nl and studio@thefourdeuces.nl.",
  },
  {
    q: "Is a deposit required?",
    a: "Yes. A non-refundable deposit is required to secure your appointment, and it goes towards the final price of your tattoo.",
  },
  {
    q: "What is your cancellation policy?",
    a: "We ask for at least 48 hours' notice to cancel or reschedule. Arriving more than 30 minutes late without letting us know may result in cancellation or rescheduling and loss of your deposit.",
  },
  {
    q: "How much does a tattoo cost?",
    a: "Pricing depends on size, complexity and placement, and is discussed during your consultation. Cover-ups and reworks are quoted separately.",
  },
  {
    q: "How can I pay?",
    a: "We accept cash and credit/debit cards, and PayPal may be available by prior agreement. Tips are appreciated but never expected.",
  },
  {
    q: "What is the minimum age?",
    a: "You must be 18 or older, or accompanied by an adult.",
  },
  {
    q: "Do you use numbing cream or anesthetic?",
    a: "No local anesthetics are used.",
  },
  {
    q: "Do you offer touch-ups?",
    a: "One complimentary touch-up is offered within 6 months, subject to the conditions in our Terms & Conditions. This does not apply to guest artists.",
  },
  {
    q: "Can I bring someone with me?",
    a: "Yes, but accompanying persons must remain on the ground floor during your session.",
  },
  {
    q: "How do I take care of my new tattoo?",
    a: "Follow the aftercare instructions carefully — you can download our full aftercare guide below.",
  },
];

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

function FaqPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
          Good to know
        </p>
        <h1 className="font-serif text-[3rem] leading-[0.95] tracking-tight md:text-[4.5rem]">
          FAQ
        </h1>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
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
          <h2 className="mb-1 text-[12px] uppercase tracking-[0.25em] text-white/40">
            Downloads
          </h2>
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

function TermsPage() {
  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28 md:px-16 md:pt-32">
      <div className="mx-auto w-full max-w-3xl">
        <p className="mb-4 text-[12px] uppercase tracking-[0.3em] text-white/40">
          Legal
        </p>
        <h1 className="font-serif text-[2.6rem] leading-[0.95] tracking-tight md:text-[4rem]">
          Terms &amp; Conditions
        </h1>

        <div className="mt-10 space-y-9">
          {TERMS.map((s) => (
            <section key={s.title}>
              <h2 className="mb-3 font-display text-[18px] font-medium text-white/90 md:text-[20px]">
                {s.title}
              </h2>
              <ul className="space-y-2">
                {s.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[15px] leading-relaxed text-white/60"
                  >
                    <span className="mt-[9px] h-[3px] w-[3px] shrink-0 rounded-full bg-white/30" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
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

export default function App() {
  const [cookie, setCookie] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeArtist, setActiveArtist] = useState(0);
  const [route, setRoute] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setRoute(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

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
      : path === "/faq"
        ? "faq"
        : path === "/terms"
          ? "terms"
          : "home";
  const isHome = page === "home";

  const openProfile = (i: number) => {
    setActiveArtist(i);
    smoothScrollToId("artists", 950);
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
          <ArtistShowcase active={activeArtist} onSelect={setActiveArtist} />

          {/* ============ REVIEWS ============ */}
          <Reviews />

          {/* ============ SPONSORS ============ */}
          <Sponsors />
        </>
      ) : page === "contact" ? (
        <ContactPage onNavigate={navigate} />
      ) : page === "faq" ? (
        <FaqPage onNavigate={navigate} />
      ) : (
        <TermsPage />
      )}

      {/* ===================== COOKIE BANNER ===================== */}
      <AnimatePresence>
        {cookie && (
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
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-white/80 underline underline-offset-2"
                >
                  Privacy Policy
                </a>
              </p>
              <button
                onClick={() => setCookie(false)}
                className="rounded-full px-4 py-2 text-[12px] text-white/70 transition hover:text-white"
              >
                Decline
              </button>
              <button
                onClick={() => setCookie(false)}
                className="rounded-full bg-white px-5 py-2 text-[12px] font-medium text-black transition hover:bg-white/90"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Cursor />
    </div>
  );
}
