"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ja, Dictionary } from "../i18n/dictionaries/ja";
import { en } from "../i18n/dictionaries/en";

type Locale = "ja" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

const dictionaries: Record<Locale, Dictionary> = { ja, en };

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ja");

  useEffect(() => {
    const saved = localStorage.getItem("web-daw-locale") as Locale;
    if (saved && (saved === "ja" || saved === "en")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("web-daw-locale", newLocale);
  }, []);

  const t = useCallback(
    (keyPath: string): string => {
      const dict = dictionaries[locale];
      const keys = keyPath.split(".");
      let value: any = dict;

      for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          console.warn(`Translation key not found: ${keyPath}`);
          return keyPath;
        }
      }

      return value as string;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dict: dictionaries[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
