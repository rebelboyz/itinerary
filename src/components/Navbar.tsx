"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, User, LogOut, Globe, ChevronDown, Coins, Bookmark } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, currency, setCurrency, t } = useI18n();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCurrOpen, setIsCurrOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/");
    router.refresh();
  };

  const languageLabels = {
    en: "English (EN)",
    zh: "简体中文 (ZH)",
    id: "Indonesia (ID)",
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 w-full max-w-full shadow-xs">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 min-w-0 shrink">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Compass className="w-4 h-4 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 truncate block">
                Itinerary<span className="text-emerald-600">ID</span>
              </span>
              <span className="hidden sm:block text-xs font-semibold tracking-wider uppercase text-emerald-700">
                East Java Specialist
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link
              href="/"
              className={`hover:text-emerald-600 transition ${
                pathname === "/" ? "text-emerald-600 font-semibold" : ""
              }`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/plan"
              className={`hover:text-emerald-600 transition ${
                pathname === "/plan" ? "text-emerald-600 font-semibold" : ""
              }`}
            >
              {t.nav.builder}
            </Link>
            <Link
              href="/itineraries"
              className={`hover:text-emerald-600 transition flex items-center gap-1.5 ${
                pathname === "/itineraries" ? "text-emerald-600 font-semibold" : ""
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.nav.myTrips}</span>
            </Link>
            <Link href="/#inquire" className="hover:text-emerald-600 transition">
              {t.nav.inquiry}
            </Link>

            {/* Role Links */}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-200"
              >
                {t.nav.admin}
              </Link>
            )}
            {currentUser?.role === "cs" && (
              <Link
                href="/cs"
                className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-200"
              >
                {t.nav.cs}
              </Link>
            )}
            {currentUser?.role === "guide" && (
              <Link
                href="/guide"
                className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full text-xs font-bold border border-purple-200"
              >
                {t.nav.guide}
              </Link>
            )}
            {currentUser?.role === "finance" && (
              <Link
                href="/finance"
                className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200"
              >
                {t.nav.finance}
              </Link>
            )}
          </nav>

          {/* Right section: Language selector, Currency, & Auth */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Transparent backdrop for outside tap */}
            {(isLangOpen || isCurrOpen) && (
              <div
                className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-xs"
                onClick={() => {
                  setIsLangOpen(false);
                  setIsCurrOpen(false);
                }}
              />
            )}

            {/* Language Switcher Dropdown (Clickable on Mobile & Desktop) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCurrOpen(false);
                }}
                className={`flex items-center gap-1 text-xs sm:text-sm font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition touch-manipulation min-h-[36px] sm:min-h-[38px] ${
                  isLangOpen
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20"
                    : "bg-slate-100 hover:bg-slate-200 active:bg-slate-200 text-slate-800 border-slate-200"
                }`}
                aria-label="Pilih Bahasa"
              >
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-100 mb-1">
                    Language / 语言 / Bahasa
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("en");
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-3 text-sm rounded-xl flex items-center justify-between transition touch-manipulation min-h-[44px] ${
                      locale === "en" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">🇬🇧</span>
                      <span>English</span>
                    </span>
                    {locale === "en" && <span className="text-xs text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("zh");
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-3 text-sm rounded-xl flex items-center justify-between transition touch-manipulation min-h-[44px] ${
                      locale === "zh" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">🇨🇳</span>
                      <span>简体中文</span>
                    </span>
                    {locale === "zh" && <span className="text-xs text-emerald-600 font-bold">✓</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale("id");
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-3 text-sm rounded-xl flex items-center justify-between transition touch-manipulation min-h-[44px] ${
                      locale === "id" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">🇮🇩</span>
                      <span>Indonesia</span>
                    </span>
                    {locale === "id" && <span className="text-xs text-emerald-600 font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Currency Switcher (Clickable on Mobile & Desktop) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCurrOpen(!isCurrOpen);
                  setIsLangOpen(false);
                }}
                className={`flex items-center gap-1 text-xs sm:text-sm font-bold px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border transition touch-manipulation min-h-[36px] sm:min-h-[38px] ${
                  isCurrOpen
                    ? "bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-500/20"
                    : "bg-slate-100 hover:bg-slate-200 active:bg-slate-200 text-slate-800 border-slate-200"
                }`}
                aria-label="Pilih Mata Uang"
              >
                <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{currency}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isCurrOpen ? "rotate-180" : ""}`} />
              </button>

              {isCurrOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 border-b border-slate-100 mb-1">
                    Currency
                  </div>
                  {(["USD", "CNY", "IDR"] as const).map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => {
                        setCurrency(curr);
                        setIsCurrOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-sm rounded-xl flex items-center justify-between transition touch-manipulation min-h-[40px] ${
                        currency === curr
                          ? "bg-amber-50 text-amber-900 font-bold"
                          : "hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold"
                      }`}
                    >
                      <span>{curr}</span>
                      {currency === curr && <span className="text-xs text-amber-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile / Account (Clickable & Sticky on Mobile & Desktop) */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Link
                  href={
                    currentUser.role === "admin"
                      ? "/admin"
                      : currentUser.role === "cs"
                      ? "/cs"
                      : currentUser.role === "guide"
                      ? "/guide"
                      : currentUser.role === "finance"
                      ? "/finance"
                      : "/itineraries"
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition min-h-[34px] sm:min-h-[38px] touch-manipulation shrink-0"
                  title={currentUser.name}
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700" />
                  <span className="text-xs font-bold max-w-[50px] sm:max-w-[80px] truncate">
                    {currentUser.name?.split(" ")[0] || (locale === "zh" ? "我的" : locale === "en" ? "Profile" : "Profil")}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title={t.nav.logout}
                  className="p-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition min-h-[34px] sm:min-h-[38px] flex items-center"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition min-h-[34px] sm:min-h-[38px] touch-manipulation shrink-0"
                title={locale === "zh" ? "我的账户 / 登录" : locale === "en" ? "Profile / Login" : "Profil / Masuk"}
              >
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs font-bold">{locale === "zh" ? "我的" : locale === "en" ? "Profile" : "Profil"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
