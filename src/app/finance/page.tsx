"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Receipt,
  CreditCard,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function FinancePortalPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  async function loadFinanceData() {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
      ]);

      setBookings(bRes.bookings || []);
      setExpenses(eRes.expenses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateExpenseStatus = async (expenseId: string, status: "approved" | "rejected") => {
    try {
      await fetch(`/api/expenses/${expenseId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      loadFinanceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Financial metrics
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.status === "confirmed" || b.status === "paid" ? sum + parseFloat(b.totalAmount) : sum),
    0
  );

  const totalApprovedExpenses = expenses.reduce(
    (sum, e) => (e.status === "approved" ? sum + parseFloat(e.amount) : sum),
    0
  );

  const netRealizedMargin = totalRevenue - totalApprovedExpenses;

  if (loading) {
    return <div className="py-24 text-center text-xs text-slate-500">Memuat laporan keuangan & pengeluaran...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
            Finance & Cost Reconciliation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Validasi Pembayaran & Rekonsiliasi Margin
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekonsiliasi transaksi pembayaran Midtrans, validasi klaim pengeluaran lapangan guide, dan pantau realisasi profit margin aktual per trip.
          </p>
        </div>

        <button
          onClick={loadFinanceData}
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition"
        >
          Refresh Data
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Total Pendapatan (Gross Revenue)</span>
          <div className="text-2xl font-extrabold text-emerald-600">{formatIDR(totalRevenue)}</div>
          <span className="text-[11px] text-slate-400">Dari pesanan terkonfirmasi Midtrans</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Realisasi Biaya Lapangan Disetujui</span>
          <div className="text-2xl font-extrabold text-rose-600">{formatIDR(totalApprovedExpenses)}</div>
          <span className="text-[11px] text-slate-400">BBM, Tol, Tiket, Akomodasi Lapangan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Margin Bersih Terealisasi</span>
          <div className="text-2xl font-extrabold text-slate-900">{formatIDR(netRealizedMargin)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {totalRevenue > 0 ? `${((netRealizedMargin / totalRevenue) * 100).toFixed(1)}% Realized Margin` : "0%"}
          </span>
        </div>
      </div>

      {/* Section 1: Expenses Pending Approval */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Klaim Pengeluaran Lapangan dari Guide ({expenses.length})</span>
          </h3>
        </div>

        {expenses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">Belum ada pengeluaran yang diajukan.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Trip / Booking</th>
                  <th className="p-3.5">Guide Pelapor</th>
                  <th className="p-3.5">Kategori</th>
                  <th className="p-3.5">Jumlah</th>
                  <th className="p-3.5">Catatan / Bukti</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{exp.booking?.trip?.title}</div>
                      <div className="text-[10px] text-slate-400">Order: {exp.booking?.midtransOrderId}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-800">{exp.submittedBy?.name}</div>
                      <div className="text-[10px] text-slate-400">{exp.submittedBy?.phone}</div>
                    </td>
                    <td className="p-3.5 capitalize font-semibold text-slate-800">{exp.category}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatIDR(exp.amount)}</td>
                    <td className="p-3.5 text-slate-500 max-w-xs">{exp.note || "—"}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          exp.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : exp.status === "rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {exp.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {exp.status === "submitted" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdateExpenseStatus(exp.id, "approved")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] transition"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => handleUpdateExpenseStatus(exp.id, "rejected")}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] transition"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Telah divalidasi</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Paid Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Rekonsiliasi Transaksi Midtrans Masuk</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Trip Terkait</th>
                <th className="p-3.5">Gross Amount (IDR)</th>
                <th className="p-3.5">Status Midtrans</th>
                <th className="p-3.5">Tanggal Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-mono text-[11px] font-bold text-slate-900">
                    {b.midtransOrderId || b.id.substring(0, 8)}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900">{b.customerName || b.user?.name}</div>
                    <div className="text-[10px] text-slate-400">{b.customerEmail || b.user?.email}</div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">{b.trip?.title}</td>
                  <td className="p-3.5 font-bold text-emerald-700">{formatIDR(b.totalAmount)}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.status === "confirmed" || b.status === "paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {b.paidAt ? new Date(b.paidAt).toLocaleString("id-ID") : "Menunggu Settlement"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

