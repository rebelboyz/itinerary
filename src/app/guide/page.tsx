"use client";

import React, { useEffect, useState } from "react";
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Car,
  Receipt,
  Phone,
  MessageCircle,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function GuidePortalPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New expense modal/form
  const [category, setCategory] = useState("fuel");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [expenseSuccess, setExpenseSuccess] = useState(false);

  useEffect(() => {
    loadGuideData();
  }, []);

  async function loadGuideData() {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([
        fetch("/api/bookings").then((r) => r.json()),
        fetch("/api/expenses").then((r) => r.json()),
      ]);

      const allBookings = bRes.bookings || [];
      setBookings(allBookings);
      if (allBookings.length > 0) {
        setSelectedBooking(allBookings[0]);
      }
      setExpenses(eRes.expenses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setIsSubmittingExpense(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          category,
          amount,
          note,
        }),
      });

      if (res.ok) {
        setExpenseSuccess(true);
        setAmount("");
        setNote("");
        const eRes = await fetch("/api/expenses").then((r) => r.json());
        setExpenses(eRes.expenses || []);
        setTimeout(() => setExpenseSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-xs text-slate-500">Memuat portal tour guide & driver...</div>;
  }

  const trip = selectedBooking?.trip;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Mobile-Friendly Guide Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-md space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded">
          Mobile Guide & Driver Portal (PWA)
        </span>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
          Penugasan Lapangan & Pencatatan Pengeluaran
        </h1>
        <p className="text-xs text-purple-200">
          Akses rincian rute per hari, koordinasi langsung dengan pelanggan via WhatsApp, dan laporkan bukti biaya lapangan (BBM/Tol/Tiket).
        </p>
      </div>

      {/* Select Active Assigned Booking if multiple */}
      {bookings.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {bookings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBooking(b)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedBooking?.id === b.id
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {b.trip?.title} ({b.customerName || b.user?.name})
            </button>
          ))}
        </div>
      )}

      {selectedBooking ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Itinerary Details (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Quick Customer Action Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tamu Wisata:</span>
                  <div className="font-extrabold text-sm text-slate-900">
                    {selectedBooking.customerName || selectedBooking.user?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {trip?.numPax} Orang • Armada: {trip?.vehicleType?.name}
                  </div>
                </div>

                {/* WhatsApp Quick Chat */}
                {selectedBooking.customerPhone && (
                  <a
                    href={`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm shadow-emerald-600/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Tamu</span>
                  </a>
                )}
              </div>

              {/* Navigation link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Jemput: <strong>{trip?.pickupPoint}</strong></span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trip?.pickupPoint || "Surabaya")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Buka Maps
                </a>
              </div>
            </div>

            {/* Day Schedule Timeline */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Rute & Destinasi Lapangan:</span>
              </h3>

              <div className="space-y-4 border-l-2 border-purple-300 pl-4 ml-1.5">
                {(trip?.days || []).map((day: any, idx: number) => (
                  <div key={day.id || idx} className="relative space-y-1.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-purple-600 border-2 border-white" />
                    <h4 className="text-xs font-bold text-slate-900">
                      Hari {day.dayNumber}: {day.title}
                    </h4>

                    <div className="space-y-1 pl-1">
                      {(day.items || []).map((item: any, itemIdx: number) => (
                        <div
                          key={item.id || itemIdx}
                          className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-between"
                        >
                          <span>{item.destination?.name || item.activity?.name || "Kunjungan Wisata"}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{item.destination?.region}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Submit Expense Form & List (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Form Input Expense */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-purple-600" />
                <span>Catat Pengeluaran Lapangan</span>
              </h3>

              {expenseSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pengeluaran berhasil dicatat dan diajukan ke tim Finance!</span>
                </div>
              )}

              <form onSubmit={handleSubmitExpense} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kategori Pengeluaran *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm"
                  >
                    <option value="fuel" className="text-slate-900 bg-white font-semibold py-1">BBM / Bensin Mobil</option>
                    <option value="toll" className="text-slate-900 bg-white font-semibold py-1">Tiket Tol Trans-Jawa</option>
                    <option value="ticket" className="text-slate-900 bg-white font-semibold py-1">Tiket Wisata Tambahan</option>
                    <option value="meal" className="text-slate-900 bg-white font-semibold py-1">Makan Driver / Guide</option>
                    <option value="accommodation" className="text-slate-900 bg-white font-semibold py-1">Akomodasi Darurat</option>
                    <option value="other" className="text-slate-900 bg-white font-semibold py-1">Pengeluaran Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Jumlah Biaya (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Contoh: 250000"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Keterangan / Catatan Bukti
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="SPBU Probolinggo (Pertalite / Dexlite)"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingExpense}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md shadow-purple-600/20 disabled:opacity-50"
                >
                  {isSubmittingExpense ? "Mengirim..." : "+ Simpan & Ajukan ke Finance"}
                </button>
              </form>
            </div>

            {/* List Submitted Expenses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Riwayat Pengeluaran Saya ({expenses.length})
              </h3>

              {expenses.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">Belum ada pengeluaran dicatat.</div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {expenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 capitalize">{exp.category}</div>
                        <div className="text-[11px] text-slate-500">{exp.note || "Tanpa catatan"}</div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-slate-900">{formatIDR(exp.amount)}</div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            exp.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : exp.status === "rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {exp.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          Belum ada penugasan booking aktif untuk akun Guide ini.
        </div>
      )}
    </div>
  );
}

