import { createContext, useContext } from "react";
import { DEFAULT_LANG, t as translate, type Lang } from "./i18n";

// Current UI language, provided at the app root and read by any component.
export const LangContext = createContext<Lang>(DEFAULT_LANG);
export const useLang = () => useContext(LangContext);

// Returns a translate function bound to the current language: t("nav.home").
export const useT = () => {
  const lang = useLang();
  return (key: string) => translate(lang, key);
};
