"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Building,
  Sparkles,
  ArrowRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function BecomeAgentPage() {
  const { t, locale } = useI18n();
  const ba = t.becomeAgent;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("China");
  const [companyName, setCompanyName] = useState("");
  const [channels, setChannels] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("wise");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agents/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          country,
          companyName,
          channels: { description: channels },
          payoutMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit partner application");
      }

      setSubmitted(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during submission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ba.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {ba.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {ba.subtitle}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">{ba.benefit3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ba.benefit3Desc}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <h3 className="font-bold text-sm text-white">{ba.benefit1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ba.benefit1Desc}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">{ba.benefit2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ba.benefit2Desc}
            </p>
          </div>
        </div>

        {/* Form or Success Box */}
        {submitted ? (
          <div className="bg-slate-900 border border-emerald-500/30 p-8 sm:p-10 rounded-3xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">{ba.successTitle}</h2>
            <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              {ba.successDesc}{" "}
              <strong className="text-emerald-400 font-mono text-base">{submitted.agent?.refCode}</strong>.
            </p>
            <p className="text-xs text-slate-400">
              {ba.loginPrompt}
            </p>
            <div className="pt-4 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
              >
                {ba.loginBtn}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">{ba.formTitle}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {ba.formSubtitle}
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Li Wei / John Smith"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.passwordLabel}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.phoneLabel}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+86 / +1 / +62..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.countryLabel}</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="China, Singapore, Malaysia, USA, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.companyLabel}</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Silk Road Travel Ltd."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {ba.channelsLabel}
                </label>
                <textarea
                  rows={2}
                  value={channels}
                  onChange={(e) => setChannels(e.target.value)}
                  placeholder={ba.channelsPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{ba.payoutMethodLabel}</label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="wise">{ba.payoutWise}</option>
                  <option value="bank_transfer">{ba.payoutBank}</option>
                  <option value="paypal">{ba.payoutPaypal}</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Link href="/login" className="text-xs text-slate-400 hover:text-white">
                  {ba.alreadyPartner}
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition disabled:opacity-50"
                >
                  <span>{loading ? ba.submittingBtn : ba.submitBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
