"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "./regions";
import { DICTIONARIES, en } from "./dictionaries";

const LANG_KEY = "haquemart_lang";

type Vars = Record<string, string | number>;

/** Resolve a dot-path (e.g. "nav.cart") to a string, or undefined if absent. */
function resolvePath(obj: unknown, path: string): string | undefined {
  const val = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof val === "string" ? val : undefined;
}

interface LocaleContextValue {
  language: LanguageCode;
  dir: "ltr" | "rtl";
  setLanguage: (l: LanguageCode) => void;
  /** Translate a dot-path key; falls back to English, then the key itself. */
  t: (key: string, vars?: Vars) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  // Hydrate from storage after mount — keeps SSR/first paint consistent (en),
  // then upgrades to the saved language without a hydration mismatch.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored && stored in LANGUAGES) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
        setLanguageState(stored as LanguageCode);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Reflect language + direction on <html> for correct RTL/LTR rendering.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGES[language].dir;
  }, [language]);

  const setLanguage = useCallback((l: LanguageCode) => {
    setLanguageState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      let str =
        resolvePath(DICTIONARIES[language], key) ??
        resolvePath(en, key) ??
        key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [language],
  );

  return (
    <LocaleContext.Provider value={{ language, dir: LANGUAGES[language].dir, setLanguage, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
