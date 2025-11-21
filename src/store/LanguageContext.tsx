"use client";

import { useLocale } from "next-intl";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

type Language = "english" | "arabic" | "french";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const localeToLanguage: Record<string, Language> = {
  en: "english",
  ar: "arabic",
  fr: "french",
};

const languageToLocale: Record<Language, string> = {
  english: "en",
  arabic: "ar",
  french: "fr",
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter(); // ✅ next-intl navigation router
  const pathname = usePathname(); // ✅ current translated pathname
  const locale = useLocale(); // ✅ current locale from next-intl

  const [language, setLanguageState] = useState<Language>(localeToLanguage[locale] || "english");

  // Sync language with locale
  useEffect(() => {
    setLanguageState(localeToLanguage[locale] || "english");
  }, [locale]);

  const setLanguage = (lang: Language) => {
    const nextLocale = languageToLocale[lang];
    setLanguageState(lang);

    // ✅ next-intl router handles locale switching automatically
    router.push({ pathname }, { locale: nextLocale });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
