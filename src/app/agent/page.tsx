"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Copy,
  Check,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function AgentDashboardPage() {
  const { t, formatPrice } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [agreeing, setAgreeing] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);

  useEffect(() => {
    loadAgentProfile();
  }, []);

  async function loadAgentProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/me");
      const json = await res.json();
      if (json.success) {
        setData(json);
        // Show agreement prompt if agent hasn't accepted agreement
        if (!json.agent.agreementAcceptedAt) {
          setShowAgreementModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = () => {
    if (!data?.agent?.referralLink) return;
    navigator.clipboard.writeText(data.agent.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAcceptAgreement = async () => {
    setAgreeing(true);
    try {
      const res = await fetch("/api/agent/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: "v1.0" }),
      });
      if (res.ok) {
        setShowAgreementModal(false);
        loadAgentProfile();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAgreeing(false);
    }
  };

  const ap = t.agentPortal;

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-500">
        {ap.loadingDashboard}
      </div>
    );
  }

  if (!data?.agent) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">{ap.accountNotActive}</h2>
        <p className="text-xs text-slate-500">
          {ap.accountNotActiveDesc}
        </p>
        <Link
          href="/become-agent"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          {ap.applyNow}
        </Link>
      </div>
    );
  }

  const { agent, stats } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Welcome & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
              {ap.partnerBadge}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                agent.status === "active"
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {ap.statusLabel}: {agent.status}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {ap.tierLabel}: {agent.tier}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            {ap.title} — {agent.companyName || agent.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {ap.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/agent/leads"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <Users className="w-4 h-4" />
            <span>{ap.manageLeads}</span>
          </Link>
          <Link
            href="/agent/commissions"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition"
          >
            <DollarSign className="w-4 h-4" />
            <span>{ap.myCommissions}</span>
          </Link>
        </div>
      </div>

      {/* Referral Link Share Box */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{ap.referralBoxTitle}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold mt-0.5">
              {ap.agentCode}: <span className="font-mono text-emerald-300">{agent.refCode}</span>
            </h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:block">
            {ap.referralHint}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-2xl border border-white/10">
          <input
            type="text"
            readOnly
            value={agent.referralLink}
            className="bg-transparent text-xs text-slate-200 px-3 py-1 flex-1 font-mono outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? ap.copied : ap.copyLink}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">{ap.totalLeads}</span>
          <div className="text-2xl font-black text-slate-900">{stats.totalLeads}</div>
          <span className="text-[11px] text-slate-500">{ap.totalLeadsSub}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-blue-600">{ap.activeLeads}</span>
          <div className="text-2xl font-black text-blue-700">{stats.activeLeads}</div>
          <span className="text-[11px] text-blue-500">{ap.activeLeadsSub}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600">{ap.pendingCommission}</span>
          <div className="text-xl sm:text-2xl font-black text-amber-700">
            {formatPrice(stats.pendingCommission)}
          </div>
          <span className="text-[11px] text-amber-500">{ap.pendingCommissionSub}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600">{ap.approvedCommission}</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600">
            {formatPrice(stats.approvedCommission)}
          </div>
          <span className="text-[11px] text-emerald-500">{ap.approvedCommissionSub}</span>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link
          href="/agent/leads"
          className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{ap.pipelineCardTitle}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {ap.pipelineCardDesc}
          </p>
        </Link>

        <Link
          href="/agent/commissions"
          className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">{ap.commissionCardTitle}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {ap.commissionCardDesc}
          </p>
        </Link>
      </div>

      {/* Agreement Modal Prompt if not signed yet */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">{ap.agreementTitle}</h2>
                <p className="text-xs text-slate-400">{ap.agreementSubtitle}</p>
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>{ap.agreementTerm1}</p>
              <p>{ap.agreementTerm2}</p>
              <p>{ap.agreementTerm3}</p>
              <p>{ap.agreementTerm4}</p>
            </div>

            <button
              onClick={handleAcceptAgreement}
              disabled={agreeing}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50"
            >
              {agreeing ? ap.agreementProcessing : ap.agreementBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
