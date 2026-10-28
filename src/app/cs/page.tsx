"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  User,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function CsPipelinePage() {
  const { locale } = useI18n();
  const [leads, setLeads] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  async function loadLeads() {
    setLoading(true);
    try {
      const url = statusFilter === "all" ? "/api/leads" : `/api/leads?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (st: string) => {
    if (st === "new") {
      return {
        label: locale === "zh" ? "新线索" : locale === "en" ? "New" : "Baru",
        className: "bg-blue-100 text-blue-800",
      };
    }
    if (st === "contacted") {
      return {
        label: locale === "zh" ? "已沟通" : locale === "en" ? "Contacted" : "Dihubungi",
        className: "bg-amber-100 text-amber-800",
      };
    }
    if (st === "won" || st === "booked" || st === "paid" || st === "completed") {
      return {
        label: locale === "zh" ? "已成交" : locale === "en" ? "Won" : "Closing",
        className: "bg-emerald-100 text-emerald-800",
      };
    }
    return {
      label: locale === "zh" ? "流失" : locale === "en" ? "Lost" : "Lost",
      className: "bg-slate-100 text-slate-600",
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded">
            {locale === "zh" ? "专属客服工单系统" : locale === "en" ? "Customer Support Pipeline" : "Customer Support Pipeline"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {locale === "zh" ? "游客咨询需求与线索收件箱" : locale === "en" ? "Inquiry Inbox & Customer Leads" : "Inbox Inquiry & Lead Pelanggan"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {locale === "zh"
              ? "接收来自官网首页及海外渠道的定制游需求，通过微信/WhatsApp跟进，一键转为定制行程。"
              : locale === "en"
              ? "Receive inquiries from domestic/international travelers, follow up via WhatsApp/Email, and convert into custom trips."
              : "Terima inquiry masuk dari wisatawan internasional/domestik, follow-up melalui WhatsApp/email, dan ubah menjadi booking itinerary."}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {["all", "new", "contacted", "won", "lost"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                statusFilter === st
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {st === "all"
                ? locale === "zh" ? "全部" : locale === "en" ? "All" : "Semua"
                : st === "new"
                ? locale === "zh" ? "待跟进" : locale === "en" ? "New" : "New"
                : st === "contacted"
                ? locale === "zh" ? "已联系" : locale === "en" ? "Contacted" : "Contacted"
                : st === "won"
                ? locale === "zh" ? "已成单" : locale === "en" ? "Won" : "Won"
                : locale === "zh" ? "已失效" : locale === "en" ? "Lost" : "Lost"}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">
          {locale === "zh" ? "正在加载咨询工单..." : locale === "en" ? "Loading inquiries..." : "Memuat data inquiry..."}
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">
            {locale === "zh" ? "当前筛选条件下暂无咨询" : locale === "en" ? "No Inquiries Found" : "Belum Ada Inquiry pada Filter Ini"}
          </h3>
          <p className="text-xs text-slate-400">
            {locale === "zh"
              ? "来自首页咨询表单的新需求将实时自动显示在此处。"
              : locale === "en"
              ? "New inquiries from homepage forms will appear here automatically."
              : "Inquiry baru dari formulir beranda akan muncul di sini secara otomatis."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {leads.map((lead) => {
            const badge = getStatusBadge(lead.status);
            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{lead.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.email}</span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    {lead.phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    {lead.country && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.country}</span>
                      </div>
                    )}
                  </div>

                  {lead.message && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{locale === "zh" ? "需求备注 / 留言：" : locale === "en" ? "Trip Notes:" : "Catatan Permintaan:"}</span>
                      </div>
                      {lead.message}
                    </div>
                  )}
                </div>

                {/* Action Pipeline Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-[11px] text-slate-400">
                      {locale === "zh" ? "状态：" : locale === "en" ? "Status:" : "Status:"}
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(lead.id, "contacted")}
                      className="px-2 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[10px] transition"
                    >
                      Contacted
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(lead.id, "won")}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[10px] transition"
                    >
                      Won
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(lead.id, "lost")}
                      className="px-2 py-1 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 font-semibold text-[10px] transition"
                    >
                      Lost
                    </button>
                  </div>

                  {/* Convert to Trip */}
                  <Link
                    href={`/plan?lead=${lead.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{locale === "zh" ? "创建定制方案" : locale === "en" ? "Convert to Trip" : "Convert to Trip"}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
