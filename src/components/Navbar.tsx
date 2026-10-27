"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Shield, User, LogOut, Globe, ChevronDown, Coins, Bookmark } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale, currency, setCurrency, t } = useI18n();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const handleQuickSwitch = async (email: string) => {
    const passwords: Record<string, string> = {
      "admin@itinerary.id": "admin123",
      "cs@itinerary.id": "cs123456",
      "guide@itinerary.id": "guide123",
      "finance@itinerary.id": "finance123",
      "john@example.com": "customer123",
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: passwords[email] }),
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      if (data.user.role === "admin") router.push("/admin");
      else if (data.user.role === "cs") router.push("/cs");
      else if (data.user.role === "guide") router.push("/guide");
      else if (data.user.role === "finance") router.push("/finance");
      else router.push("/plan");
      router.refresh();
    }
  };

  const languageLabels = {
    en: "English (EN)",
    zh: "简体中文 (ZH)",
    id: "Indonesia (ID)",
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Itinerary<span className="text-emerald-600">ID</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-wider uppercase text-emerald-700">
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

          {/* Right section: Language selector, Currency, Quick role & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="uppercase">{locale}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 hidden group-hover:block z-50">
                <button
                  onClick={() => setLocale("en")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition ${
                    locale === "en" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 text-slate-900 font-semibold"
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {locale === "en" && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => setLocale("zh")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition ${
                    locale === "zh" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 text-slate-900 font-semibold"
                  }`}
                >
                  <span>🇨🇳 简体中文</span>
                  {locale === "zh" && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => setLocale("id")}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition ${
                    locale === "id" ? "bg-emerald-50 text-emerald-800 font-bold" : "hover:bg-slate-50 text-slate-900 font-semibold"
                  }`}
                >
                  <span>🇮🇩 Indonesia</span>
                  {locale === "id" && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
                </button>
              </div>
            </div>

            {/* Currency Switcher */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-1 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>{currency}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-28 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 hidden group-hover:block z-50">
                {(["USD", "CNY", "IDR"] as const).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition ${
                      currency === curr
                        ? "bg-amber-50 text-amber-900 font-bold"
                        : "hover:bg-slate-50 text-slate-900 font-semibold"
                    }`}
                  >
                    <span>{curr}</span>
                    {currency === curr && <span className="text-[10px] text-amber-600 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Role Switcher for local dev ease */}
            <div className="relative group hidden lg:block">
              <button className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 transition">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {t.nav.role}: <strong className="uppercase text-emerald-700">{currentUser?.role || "GUEST"}</strong>
                </span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-slate-500" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 hidden group-hover:block z-50">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  {t.nav.quickSwitch}
                </div>
                <button
                  onClick={() => handleQuickSwitch("admin@itinerary.id")}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-900 rounded-md hover:bg-amber-50 hover:text-amber-800 flex items-center justify-between"
                >
                  <span>Admin</span>
                  <span className="text-[10px] text-slate-500">Master Config</span>
                </button>
                <button
                  onClick={() => handleQuickSwitch("cs@itinerary.id")}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-900 rounded-md hover:bg-blue-50 hover:text-blue-800 flex items-center justify-between"
                >
                  <span>Customer Support</span>
                  <span className="text-[10px] text-slate-500">Leads Pipeline</span>
                </button>
                <button
                  onClick={() => handleQuickSwitch("guide@itinerary.id")}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-900 rounded-md hover:bg-purple-50 hover:text-purple-800 flex items-center justify-between"
                >
                  <span>Tour Guide</span>
                  <span className="text-[10px] text-slate-500">Field & Expense</span>
                </button>
                <button
                  onClick={() => handleQuickSwitch("finance@itinerary.id")}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-900 rounded-md hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                >
                  <span>Finance</span>
                  <span className="text-[10px] text-slate-500">Reconcile & Margin</span>
                </button>
                <button
                  onClick={() => handleQuickSwitch("john@example.com")}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-slate-900 rounded-md hover:bg-slate-100 text-slate-900 flex items-center justify-between border-t border-slate-100 mt-1 pt-1.5"
                >
                  <span>Customer (John)</span>
                  <span className="text-[10px] text-slate-500">Booker</span>
                </button>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden xl:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">{currentUser.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  title={t.nav.logout}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.nav.login}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
