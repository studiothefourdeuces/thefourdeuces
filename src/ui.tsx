// Shared, presentational UI building blocks used by both the app shell and the
// lazily-loaded pages. Keeping them here (rather than in App.tsx) lets the pages
// import them without pulling the whole app into each route chunk.
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { ChevronDown, Download } from "lucide-react";
import { ARTISTS } from "./artists-data";
import { stylePathForToken } from "./content";

export const PILL = (solid: boolean) =>
  `inline-flex w-full max-w-[300px] items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 py-3.5 text-[15px] transition-colors md:w-auto md:max-w-none md:py-3 md:text-[14px] ${
    solid
      ? "border-white/25 bg-white/10 text-white backdrop-blur hover:border-white/50 hover:bg-white/15"
      : "border-white/25 text-white/85 hover:border-white/50 hover:bg-white/5"
  }`;

// Studio WhatsApp Business — direct chat link used by the consultation CTAs.
export const WHATSAPP_URL = "https://wa.me/31645052222";

// A row of pill CTAs. The first item is filled (primary) unless `solid` is set
// explicitly; the rest are outlined. Stacked on mobile, side by side on desktop.
export type CtaItem = {
  label: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  solid?: boolean;
};

export function CtaBar({
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


export type RevealFn = (delaySec: number) => void;
export const revealCbs = new Map<Element, RevealFn>();
let revealIO: IntersectionObserver | null = null;
export const REVEAL_STEP = 0.08; // seconds between staggered items
export const REVEAL_MAX_DELAY = 0.5;

export function revealObserver(): IntersectionObserver {
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

export function Reveal({
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
export function measureGlyphWidths(
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
export function buildRingText(
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

export function TextRing({
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

export function ArtistButtons({
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
export function ArtistRow({
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
export function FadeImg({
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
export function LazyVideo({
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

export function RoleLinks({
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


// Compact FAQ accordion (question + answer), reused on the artists page for the
// styles each artist works in.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
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


export function DownloadCard({
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


export const STUDIO_ADDRESS = "Van Baerlestraat 126H";
export const STUDIO_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=The%20Four%20Deuces%20Van%20Baerlestraat%20126H%201071%20BD%20Amsterdam";

// Render a paragraph, turning any occurrence of the studio address into a link.
export function withAddressLink(text: string): ReactNode {
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

