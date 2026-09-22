import { getStyles, getAbout } from "./content";
import { getFaq } from "./faq";
import { t, type Lang } from "./i18n";

export type SearchResult = {
  type: "style" | "faq" | "about" | "guests";
  title: string;
  snippet: string;
  path: string;
};

const stripTokens = (s: string) =>
  s.replace(/\[\[BOOK\]\]/g, "").replace(/\[\[CONSULT\]\]/g, "").trim();

export function buildSearchIndex(lang: Lang): SearchResult[] {
  const results: SearchResult[] = [];

  getStyles(lang).forEach((s) => {
    results.push({
      type: "style",
      title: s.name,
      snippet: s.lead[0] ?? "",
      path: s.slug,
    });
    s.faq.forEach((f) =>
      results.push({ type: "style", title: f.q, snippet: f.a, path: s.slug }),
    );
  });

  getFaq(lang).forEach((f) =>
    results.push({
      type: "faq",
      title: f.q,
      snippet: stripTokens(f.a),
      path: "/faq",
    }),
  );

  const about = getAbout(lang);
  [
    ...about.intro,
    ...about.why.map((w) => `${w.h}. ${w.p}`),
    ...about.location,
    ...about.transport,
    ...about.parking,
  ].forEach((p) =>
    results.push({
      type: "about",
      title: about.title,
      snippet: p,
      path: "/about",
    }),
  );

  const guestsKeys = [
    "guests.guest.text",
    "guests.careers.text",
    "guests.faq.supplies.a",
    "guests.faq.a1",
    "guests.faq.a2",
    "guests.faq.a3",
    "guests.faq.a4",
    "guests.faq.a5",
    "guests.faq.a6",
    "guests.faq.a7",
    "guests.faq.a8",
  ];
  guestsKeys.forEach((key) => {
    const snippet = t(lang, key);
    if (snippet && snippet !== key) {
      results.push({
        type: "guests",
        title: t(lang, "guests.title"),
        snippet,
        path: "/guests",
      });
    }
  });

  return results;
}

export function searchIndex(
  index: SearchResult[],
  query: string,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.snippet.toLowerCase().includes(q),
    )
    .slice(0, 20);
}