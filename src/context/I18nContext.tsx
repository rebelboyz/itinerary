"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, translations, Translations } from "@/i18n/translations";
import { formatIDR, formatUSD, formatCNY } from "@/lib/utils";

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  currency: "USD" | "CNY" | "IDR";
  setCurrency: (cur: "USD" | "CNY" | "IDR") => void;
  t: Translations;
  formatPrice: (amountInIdr: number | string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // PRD §8: Default language is English (EN)
  const [locale, setLocaleState] = useState<Locale>("en");
  const [currency, setCurrencyState] = useState<"USD" | "CNY" | "IDR">("USD");

  useEffect(() => {
    // Check saved preference in localStorage
    const saved = localStorage.getItem("itinerary_locale") as Locale;
    if (saved && (saved === "en" || saved === "zh" || saved === "id")) {
      setLocaleState(saved);
      if (saved === "zh") setCurrencyState("CNY");
      else if (saved === "id") setCurrencyState("IDR");
      else setCurrencyState("USD");
    } else {
      // Auto-detect browser language
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith("zh")) {
        setLocaleState("zh");
        setCurrencyState("CNY");
      } else if (navLang.startsWith("id")) {
        setLocaleState("id");
        setCurrencyState("IDR");
      } else {
        setLocaleState("en");
        setCurrencyState("USD");
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("itinerary_locale", newLocale);

    // Auto update matching currency
    if (newLocale === "zh") {
      setCurrencyState("CNY");
    } else if (newLocale === "id") {
      setCurrencyState("IDR");
    } else {
      setCurrencyState("USD");
    }
  };

  const setCurrency = (newCurrency: "USD" | "CNY" | "IDR") => {
    setCurrencyState(newCurrency);
  };

  const formatPrice = (amountInIdr: number | string) => {
    if (currency === "CNY") return formatCNY(amountInIdr);
    if (currency === "USD") return formatUSD(amountInIdr);
    return formatIDR(amountInIdr);
  };

  const t = translations[locale] || translations.en;

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        currency,
        setCurrency,
        t,
        formatPrice,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Return safe fallback if used outside provider
    return {
      locale: "en" as Locale,
      setLocale: () => {},
      currency: "USD" as const,
      setCurrency: () => {},
      t: translations.en,
      formatPrice: (amount: number | string) => formatIDR(amount),
    };
  }
  return context;
}

