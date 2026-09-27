import { useEffect, useRef, useState } from "react";
import { useLang, useT } from "../lang-context";
import { PILL, Reveal, WHATSAPP_URL } from "../ui";
import { localizeRegion } from "../content";

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

export default function BookPage({
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

