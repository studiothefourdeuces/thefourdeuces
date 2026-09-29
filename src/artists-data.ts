// Artist roster + the works gallery (images/videos), plus the derived carousel
// and hero slide sets. Shared by the app shell and the lazily-loaded pages.
import dariaImg from "./img/artists/daria.jpg";
import eugeneImg from "./img/artists/eugene.jpg";
import maxImg from "./img/artists/max.jpg";
import milaImg from "./img/artists/mila.jpg";
import selcukImg from "./img/artists/selcuk.jpg";
import gianlucaImg from "./img/artists/gianluca.jpg";
import daryaImg from "./img/artists/darya.jpg";
import { STYLES, ARTISTS_SEO } from "./content";

export type Artist = {
  name: string;
  img: string;
  ig: string;
  role: string;
  bio: string;
  since?: number; // year they started tattooing (shown only when set)
};

export const ARTISTS: Artist[] = [
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

// Cap on how many works to show per artist on the /artists grid.
export const MAX_PORTFOLIO = 21;

// Per-artist URL slug (e.g. "Selçuk" → "selcuk"), matched by name so it stays
// aligned with ARTISTS regardless of order.
export const artistSlug = (name: string): string =>
  ARTISTS_SEO.find((a) => a.name === name)?.slug ?? name.toLowerCase();

// Slugs aligned to the ARTISTS array order (ARTIST_SLUGS[i] ↔ ARTISTS[i]).
export const ARTIST_SLUGS: string[] = ARTISTS.map((a) => artistSlug(a.name));

// Resolve a URL slug back to an artist index (-1 when unknown).
export const artistIndexBySlug = (slug: string): number =>
  ARTIST_SLUGS.indexOf(slug);

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

export type Work = {
  img: string;
  artistIdx: number;
  video?: string;
  key: string;
};

// Natural numeric sort of filenames so "2.jpg" comes before "10.jpg".
const naturalKey = (path: string) => {
  const file = path.split("/").pop() || "";
  const n = parseInt(file, 10);
  return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
};

export const WORKS: Work[] = (() => {
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
export const WORKS_BY_ARTIST: Work[][] = ARTISTS.map((_, i) =>
  WORKS.filter((w) => w.artistIdx === i),
);

export const WORK_BY_KEY = new Map(WORKS.map((w) => [w.key, w]));

// A representative image for a style — its keyed work, else the first work of a
// mapped artist, else that artist's portrait. Shared by the style page, the
// styles index and the footer.
export function styleImage(style: (typeof STYLES)[number]): string {
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
export const CAROUSEL_WORKS: Work[] = (() => {
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
export const HERO_SLIDES: Work[] = (() => {
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
