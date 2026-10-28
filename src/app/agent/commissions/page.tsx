"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function AgentCommissionsPage() {
  const { t, formatPrice, locale } = useI18n();
  const ac = t.agentCommissions;

  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  async function loadCommissions() {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/commissions");
      const json = await res.json();
      if (json.success) {
        setCommissions(json.commissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Aggregate totals
  const totalEarned = commissions.reduce(
    (sum, c) => (c.status === "paid" ? sum + parseFloat(c.amount) : sum),
    0
  );

  const totalApproved = commissions.reduce(
    (sum, c) => (c.status === "approved" || c.status === "payable" ? sum + parseFloat(c.amount) : sum),
    0
  );

  const totalPending = commissions.reduce(
    (sum, c) => (c.status === "pending" ? sum + parseFloat(c.amount) : sum),
    0
  );

  const getStatusLabel = (status: string) => {
    if (status === "paid") return ac.statusPaid;
    if (status === "approved" || status === "payable") return ac.statusApproved;
    if (status === "pending") return ac.statusPending;
    return ac.statusVoid;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="text-xs text-emerald-600 font-semibold hover:underline">
              {ac.backToDashboard}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {ac.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {ac.subtitle}
          </p>
        </div>

        <Link
          href="/agent/leads"
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition self-start sm:self-auto"
        >
          <span>{ac.openPipeline}</span>
        </Link>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">{ac.totalEarned}</span>
          <div className="text-2xl font-black text-slate-900">{formatPrice(totalEarned)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{ac.totalEarnedSub}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600">{ac.readyPayout}</span>
          <div className="text-2xl font-black text-emerald-600">{formatPrice(totalApproved)}</div>
          <span className="text-[11px] text-emerald-500">{ac.readyPayoutSub}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600">{ac.pendingReview}</span>
          <div className="text-2xl font-black text-amber-700">{formatPrice(totalPending)}</div>
          <span className="text-[11px] text-amber-500">{ac.pendingReviewSub}</span>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">
            {locale === "zh" ? "订单佣金明细列表" : locale === "en" ? "Booking Commission Breakdown" : "Daftar Komisi Per Booking"}
          </h2>
          <span className="text-xs text-slate-400">
            {commissions.length} {locale === "zh" ? "条记录" : locale === "en" ? "records" : "transaksi"}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            {locale === "zh" ? "正在加载佣金记录..." : locale === "en" ? "Loading commission records..." : "Memuat rincian komisi..."}
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">
              {locale === "zh" ? "暂无佣金记录" : locale === "en" ? "No Commissions Yet" : "Belum Ada Komisi"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {ac.emptyCommissions}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">{ac.bookingId} / {ac.customer}</th>
                  <th className="px-6 py-3">{ac.tripName}</th>
                  <th className="px-6 py-3 text-right">{ac.tripTotal}</th>
                  <th className="px-6 py-3 text-right">{ac.commissionAmount}</th>
                  <th className="px-6 py-3 text-center">{ac.status}</th>
                  <th className="px-6 py-3">{ac.payoutRef}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 font-mono text-xs">
                        {comm.booking?.midtransOrderId || "Booking"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {comm.booking?.customerName || "Customer"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {comm.booking?.trip?.title || "Custom Adventure"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {comm.booking?.trip?.numPax} Pax • {comm.booking?.trip?.startDate ? new Date(comm.booking.trip.startDate).toLocaleDateString() : ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-medium">
                      {formatPrice(parseFloat(comm.booking?.totalAmount || 0))}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-black text-emerald-600 text-sm">
                        {formatPrice(parseFloat(comm.amount))}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Rate: {(parseFloat(comm.rateApplied) * 100).toFixed(0)}% Reserve
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          comm.status === "paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : comm.status === "approved"
                            ? "bg-blue-100 text-blue-800"
                            : comm.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {getStatusLabel(comm.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                      {comm.payout ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-800">
                            Ref: {comm.payout.reference}
                          </div>
                          <div className="text-slate-400">
                            Via {comm.payout.method} • {new Date(comm.payout.paidAt).toLocaleDateString()}
                          </div>
                        </div>
                      ) : comm.status === "approved" ? (
                        <span className="text-blue-600 font-semibold">
                          {locale === "zh" ? "等待财务批次打款" : locale === "en" ? "Ready for payout batch" : "Siap masuk batch payout"}
                        </span>
                      ) : comm.status === "pending" ? (
                        <span className="text-slate-400">
                          {locale === "zh" ? "等待行程结束" : locale === "en" ? "Awaiting trip completion" : "Menunggu trip selesai"}
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold">{comm.voidReason || ac.statusVoid}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
