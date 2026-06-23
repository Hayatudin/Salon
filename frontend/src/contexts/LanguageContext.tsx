"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../data/translations";

type Locale = "en" | "am";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale === "en" || savedLocale === "am") {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  // Helper to retrieve nested translations (e.g. "home.heroTitle")
  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        // Fallback to English if key is missing in Amharic
        let engFallback: any = translations["en"];
        for (const fKey of keys) {
          if (engFallback && typeof engFallback === "object" && fKey in engFallback) {
            engFallback = engFallback[fKey];
          } else {
            return path; // Return the path string if completely missing
          }
        }
        return typeof engFallback === "string" ? engFallback : path;
      }
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
