"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Calendar, Bookmark, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t, locale } = useI18n();

  const navItems = [
    {
      href: "/",
      label: t.nav.home || "Beranda",
      icon: Compass,
      active: pathname === "/",
    },
    {
      href: "/plan",
      label: locale === "zh" ? "定制行程" : locale === "en" ? "Build Trip" : "Buat Trip",
      icon: Calendar,
      active: pathname === "/plan",
      highlight: true,
    },
    {
      href: "/itineraries",
      label: t.nav.myTrips || "Trip Saya",
      icon: Bookmark,
      active: pathname === "/itineraries",
    },
    {
      href: "/#inquire",
      label: locale === "zh" ? "咨询客服" : locale === "en" ? "Inquiry" : "Tanya CS",
      icon: MessageCircle,
      active: pathname === "/#inquire",
    },
    {
      href: "/login",
      label: locale === "zh" ? "我的账户" : locale === "en" ? "Account" : "Akun",
      icon: User,
      active:
        pathname === "/login" ||
        pathname === "/admin" ||
        pathname === "/cs" ||
        pathname === "/guide" ||
        pathname === "/finance",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-1 bottom-nav-fixed flex flex-col justify-center w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-0.5 px-0.5 rounded-xl transition touch-manipulation h-[52px] ${
                item.active
                  ? "text-emerald-700 font-extrabold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {item.highlight ? (
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center mb-0.5 shadow-xs transition ${
                    item.active
                      ? "bg-emerald-600 text-white shadow-emerald-500/30"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div
                  className={`p-1 rounded-lg mb-0.5 ${
                    item.active ? "bg-emerald-50 text-emerald-700" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              )}
              <span
                className={`text-[10px] sm:text-[11px] leading-tight text-center truncate max-w-full ${
                  item.active ? "font-bold text-emerald-800" : "font-medium text-slate-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

