"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Car,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function HomePage() {
  const { t, locale } = useI18n();

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCountry, setInquiryCountry] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          country: inquiryCountry,
          message: inquiryMessage,
        }),
      });

      if (res.ok) {
        setInquirySuccess(true);
        setInquiryName("");
        setInquiryEmail("");
        setInquiryPhone("");
        setInquiryCountry("");
        setInquiryMessage("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const destinations = [
    {
      name:
        locale === "zh"
          ? "布罗莫火山日出 (Penanjakan观景台)"
          : locale === "en"
          ? "Mount Bromo Sunrise & Penanjakan"
          : "Gunung Bromo & Penanjakan",
      region: "Probolinggo / Pasuruan",
      category:
        locale === "zh"
          ? "壮美日出与古老火山口"
          : locale === "en"
          ? "Epic Sunrise & Ancient Caldera"
          : "Sunrise & Kaldera Purba",
      desc:
        locale === "zh"
          ? "在标志性高点观赏震撼的金色日出，俯瞰冒着白烟的布罗莫与雄伟塞梅鲁火山。"
          : locale === "en"
          ? "Witness dramatic golden sunrise overlooking the active smoking Bromo crater and Mt. Semeru."
          : "Menyaksikan golden sunrise dramatis berlatar asap kawah Bromo dan puncak Semeru yang megah.",
      tag: locale === "zh" ? "必游推荐" : locale === "en" ? "Must Visit" : "Wajib Dikunjungi",
    },
    {
      name:
        locale === "zh"
          ? "宜珍火山与蓝色火焰 (Blue Fire)"
          : locale === "en"
          ? "Ijen Crater & Electric Blue Fire"
          : "Kawah Ijen & Blue Fire",
      region: "Banyuwangi",
      category:
        locale === "zh"
          ? "全球罕见幽蓝火焰与巨型酸性湖"
          : locale === "en"
          ? "Electric Blue Flames & Acid Lake"
          : "Api Biru & Danau Asam",
      desc:
        locale === "zh"
          ? "在暗夜探访罕见的蓝色硫磺火焰，破晓时分迎接碧绿如宝石的巨大酸性火山口湖。"
          : locale === "en"
          ? "Marvel at the world-famous electric blue sulfur flames and the turquoise acidic crater lake."
          : "Fenomena langka dunia berupa nyala api belerang biru elektrik di danau kawah asam toska terluas.",
      tag: locale === "zh" ? "全球顶级" : locale === "en" ? "Top International" : "Top International",
    },
    {
      name:
        locale === "zh"
          ? "千层瀑布 (Tumpak Sewu Waterfall)"
          : locale === "en"
          ? "Tumpak Sewu Thousand Waterfalls"
          : "Air Terjun Tumpak Sewu",
      region: "Lumajang / Malang",
      category:
        locale === "zh"
          ? "巨型环形雨林瀑布群"
          : locale === "en"
          ? "Colossal Curtain Waterfall"
          : "Tirai Air Terjun Raksasa",
      desc:
        locale === "zh"
          ? "被誉为印尼尼亚加拉的绝景瀑布，半环形水幕倾泻于翠绿险峻的峡谷与滴水洞穴之中。"
          : locale === "en"
          ? "Indonesia's Niagara waterfall with lush emerald canyon walls and mystical Goa Tetes cave."
          : "Niagara-nya Indonesia dengan tebing hijau megah dan pemandangan lembah mistis Goa Tetes.",
      tag: locale === "zh" ? "网红地标" : locale === "en" ? "Viral Instagram" : "Viral Instagram",
    },
    {
      name:
        locale === "zh"
          ? "马达卡利普拉峡谷瀑布"
          : locale === "en"
          ? "Madakaripura Canyon Waterfall"
          : "Air Terjun Madakaripura",
      region: "Probolinggo",
      category:
        locale === "zh"
          ? "两百米落差幽深峡谷"
          : locale === "en"
          ? "200m Deep Hidden Gorge"
          : "Ngarai Abadi Mahapatih",
      desc:
        locale === "zh"
          ? "高达200米的神奇瀑布隐匿于狭长峭壁之间，相传为满者伯夷名将加查马达隐修之地。"
          : locale === "en"
          ? "A breathtaking 200m waterfall nestled inside towering cliffs of eternal rain."
          : "Air terjun setinggi 200 meter di dalam dinding ngarai sempit yang basah dan magis.",
      tag: locale === "zh" ? "人文自然" : locale === "en" ? "Nature Wonder" : "Wisata Sejarah & Alam",
    },
  ];

  return (
    <div className="space-y-20 pb-20 w-full max-w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-20 pb-28">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 sm:mb-6">
              {t.hero.title1}{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent block sm:inline">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8">{t.hero.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/plan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/30 transition transform active:scale-98 min-h-[48px] touch-manipulation"
              >
                <Compass className="w-5 h-5 text-emerald-950 shrink-0" />
                <span>{t.hero.ctaBuilder}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#inquire"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-6 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition min-h-[48px] touch-manipulation"
              >
                <span>{t.hero.ctaInquiry}</span>
              </a>
            </div>

            {/* Guarantees bar */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.hero.guaranteeRefund}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.hero.guaranteeAllInclusive}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.hero.guaranteeFleet}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Model Transparency Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            {t.features.whyChoose}
          </h2>
          <p className="text-sm text-slate-600">{t.features.whyChooseSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold text-2xl">
              🛣️
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{t.features.card1Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.features.card1Desc}</p>
          </div>

          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 font-bold text-2xl">
              🚙
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{t.features.card2Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.features.card2Desc}</p>
          </div>

          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold text-2xl">
              🛡️
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{t.features.card3Title}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t.features.card3Desc}</p>
          </div>
        </div>
      </section>

      {/* Destinations Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.destinations.sectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">{t.destinations.sectionSubtitle}</p>
          </div>
          <Link
            href="/plan"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group self-start sm:self-auto min-h-[38px]"
          >
            <span>{t.destinations.planNow}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition group"
            >
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg mb-3">
                  {dest.tag}
                </span>
                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition mb-1.5 text-base sm:text-lg">
                  {dest.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm mb-3 font-medium">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dest.region}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{dest.desc}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500 truncate">{dest.category}</span>
                <Link
                  href="/plan"
                  className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-800 shrink-0 min-h-[36px] flex items-center"
                >
                  {t.destinations.addToTrip} &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry Form (CS Lead Pipeline) */}
      <section id="inquire" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
              {t.inquiry.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 mb-3">
              {t.inquiry.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t.inquiry.desc}</p>
          </div>

          {inquirySuccess ? (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">{t.inquiry.successTitle}</h3>
              <p className="text-xs text-slate-300">{t.inquiry.successDesc}</p>
              <button
                onClick={() => setInquirySuccess(false)}
                className="mt-4 text-xs font-semibold text-emerald-400 hover:underline"
              >
                {t.inquiry.sendAnother}
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.inquiry.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. David Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.inquiry.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={inquiryEmail}
                    onChange={(e) => setInquiryEmail(e.target.value)}
                    placeholder="david@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.inquiry.phoneLabel}</label>
                  <input
                    type="tel"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+86 138 0000 0000 / +62 812..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t.inquiry.countryLabel}</label>
                  <input
                    type="text"
                    value={inquiryCountry}
                    onChange={(e) => setInquiryCountry(e.target.value)}
                    placeholder="China, Singapore, Malaysia, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t.inquiry.messageLabel}</label>
                <textarea
                  rows={3}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder={t.inquiry.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInquiry}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {submittingInquiry ? (
                  <span>{t.inquiry.submitting}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.inquiry.submitBtn}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
