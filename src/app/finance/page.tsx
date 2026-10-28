"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  Building,
  Plus,
  ArrowRight,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function FinancePortalPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [supplierMarginReport, setSupplierMarginReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cost Line Modal State
  const [showCostModal, setShowCostModal] = useState(false);
  const [costBookingId, setCostBookingId] = useState("");
  const [component, setComponent] = useState("hotel");
  const [listedAmount, setListedAmount] = useState("");
  const [actualCost, setActualCost] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [costNote, setCostNote] = useState("");
  const [savingCost, setSavingCost] = useState(false);

  useEffect(() => {
    loadFinanceData();
  }, []);

  async function loadFinanceData() {
    setLoading(true);
    try {
      const [bRes, eRes, mRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
        fetch("/api/finance/supplier-margin").then((r) => r.json()).catch(() => ({})),
      ]);

      setBookings(bRes.bookings || []);
      setExpenses(eRes.expenses || []);
      if (mRes.success) setSupplierMarginReport(mRes);
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

  const handleCreateCostLine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!costBookingId) return;
    setSavingCost(true);

    try {
      const res = await fetch(`/api/bookings/${costBookingId}/costs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component,
          listedAmount,
          actualCost,
          supplierName,
          note: costNote,
        }),
      });

      if (res.ok) {
        setShowCostModal(false);
        setListedAmount("");
        setActualCost("");
        setSupplierName("");
        setCostNote("");
        loadFinanceData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingCost(false);
    }
  };

  // Financial metrics
  const totalRevenue = bookings.reduce(
    (sum, b) => (b.status === "confirmed" || b.status === "paid" || b.status === "completed" ? sum + parseFloat(b.totalAmount) : sum),
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
            Rekonsiliasi Keuangan & Margin Pemasok
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekonsiliasi pembayaran Midtrans, klaim operasional guide, input biaya nyata supplier, dan kelola batch payout agen.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/finance/payouts"
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm"
          >
            <DollarSign className="w-4 h-4" />
            <span>Kelola Payout Agen</span>
          </Link>
          <button
            onClick={loadFinanceData}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold hover:bg-slate-50 transition"
          >
            Refresh Data
          </button>
        </div>
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
          <span className="text-[11px] text-slate-400">BBM, Tol, Tiket, Akomodasi Lapangan Guide</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500 font-medium">Margin Bersih Operasional</span>
          <div className="text-2xl font-extrabold text-slate-900">{formatIDR(netRealizedMargin)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {totalRevenue > 0 ? `${((netRealizedMargin / totalRevenue) * 100).toFixed(1)}% Realized Margin` : "0%"}
          </span>
        </div>
      </div>

      {/* Section 0: Realized Supplier Margin Breakdown (PRD §5.7 & AC14) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Pengukuran Margin Pemasok Terealisasi (PRD §5.7 & AC14)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Selisih harga jual ke pelanggan vs biaya nyata ke hotel, armada, dan loket tiket.
            </p>
          </div>

          <button
            onClick={() => {
              if (bookings.length > 0) {
                setCostBookingId(bookings[0].id);
                setShowCostModal(true);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Catat Biaya Aktual Supplier</span>
          </button>
        </div>

        {supplierMarginReport?.summary ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Ditagih Pelanggan</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatIDR(supplierMarginReport.summary.totalListed)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Biaya Nyata ke Pemasok</span>
                <span className="font-bold text-rose-700 text-sm">
                  {formatIDR(supplierMarginReport.summary.totalActual)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Spread Margin Pemasok</span>
                <span className="font-bold text-emerald-700 text-sm">
                  {formatIDR(supplierMarginReport.summary.totalSpread)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Rasio Margin Terealisasi</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  {supplierMarginReport.summary.overallMarginPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Component details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(supplierMarginReport.byComponent || []).map((comp: any) => (
                <div key={comp.component} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-slate-800 text-[11px]">{comp.component}</span>
                    <span className="font-extrabold text-emerald-600">{comp.marginPercent.toFixed(1)}% Spread</span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Ditagih: {formatIDR(comp.totalListed)} | Aktual: {formatIDR(comp.totalActual)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-4 text-center">
            Belum ada rincian biaya aktual supplier yang diinput. Klik &ldquo;+ Catat Biaya Aktual Supplier&rdquo; untuk merekonsiliasi tagihan hotel dan tiket.
          </div>
        )}
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
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${exp.status === "approved"
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
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Rekonsiliasi Transaksi Midtrans Masuk</span>
          </h3>
          <span className="text-xs text-slate-400">{bookings.length} pesanan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Trip Terkait</th>
                <th className="p-3.5">Gross Amount</th>
                <th className="p-3.5">Status Booking</th>
                <th className="p-3.5">Tanggal Bayar</th>
                <th className="p-3.5 text-right">Aksi Biaya Supplier</th>
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
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${b.status === "confirmed" || b.status === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {b.paidAt ? new Date(b.paidAt).toLocaleDateString() : "Menunggu Settlement"}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => {
                        setCostBookingId(b.id);
                        setShowCostModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] transition"
                    >
                      + Catat Biaya
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actual Supplier Cost Modal */}
      {showCostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Input Biaya Nyata Supplier (AC14)</h2>
                <p className="text-xs text-slate-400">Catat harga faktual vendor hotel/tiket untuk mengukur spread margin</p>
              </div>
              <button
                onClick={() => setShowCostModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCostLine} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Booking Terkait</label>
                <select
                  value={costBookingId}
                  onChange={(e) => setCostBookingId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  {bookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.midtransOrderId} — {b.customerName} ({formatIDR(b.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Komponen Biaya</label>
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="hotel">Hotel / Akomodasi</option>
                    <option value="vehicle">Armada / BBM / Kendaraan</option>
                    <option value="ticket">Tiket Wisata (Bromo/Ijen)</option>
                    <option value="meal">Makan / Restoran</option>
                    <option value="guide">Guide Pemandu</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pemasok / Vendor</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Contoh: Hotel Jiwa Jawa Bromo"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Ditagih Pelanggan (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={listedAmount}
                    onChange={(e) => setListedAmount(e.target.value)}
                    placeholder="850000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Biaya Nyata ke Supplier (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    placeholder="700000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={costNote}
                  onChange={(e) => setCostNote(e.target.value)}
                  placeholder="Diskon khusus kemitraan 15% dari harga listing..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCostModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingCost}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50"
                >
                  {savingCost ? "Menyimpan..." : "Simpan Biaya Aktual"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
