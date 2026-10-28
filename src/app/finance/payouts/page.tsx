"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  CheckCircle2,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileCheck,
  ExternalLink,
  Plus,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";

export default function FinancePayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [approvedCommissions, setApprovedCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBatchModal, setShowBatchModal] = useState(false);

  // Batch Form State
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedCommissionIds, setSelectedCommissionIds] = useState<string[]>([]);
  const [method, setMethod] = useState("wise");
  const [reference, setReference] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [fxRate, setFxRate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);

  useEffect(() => {
    loadPayouts();
  }, []);

  async function loadPayouts() {
    setLoading(true);
    try {
      const res = await fetch("/api/finance/payouts");
      const json = await res.json();
      if (json.success) {
        setPayouts(json.payouts || []);
        setApprovedCommissions(json.approvedCommissions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter commissions for selected agent in modal
  const agentCommissions = approvedCommissions.filter(
    (c) => c.agentId === selectedAgentId
  );

  const handleSelectAllForAgent = () => {
    setSelectedCommissionIds(agentCommissions.map((c) => c.id));
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || selectedCommissionIds.length === 0) {
      setBatchError("Pilih agen dan minimal satu komisi untuk dicairkan.");
      return;
    }
    setSubmitting(true);
    setBatchError(null);

    try {
      const res = await fetch("/api/finance/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgentId,
          commissionIds: selectedCommissionIds,
          method,
          reference,
          proofUrl: proofUrl || null,
          fxRate: fxRate || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat batch payout");
      }

      setShowBatchModal(false);
      setSelectedAgentId("");
      setSelectedCommissionIds([]);
      setReference("");
      setProofUrl("");
      loadPayouts();
    } catch (err: any) {
      setBatchError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/finance" className="text-xs text-emerald-600 font-semibold hover:underline">
              ← Kembali ke Finance Hub
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Batch Payout Komisi Mitra Agen
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kompilasi komisi agen berstatus approved (trip selesai), ekspor data pencairan, dan catat bukti pembayaran.
          </p>
        </div>

        <button
          onClick={() => setShowBatchModal(true)}
          disabled={approvedCommissions.length === 0}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm disabled:opacity-50 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Batch Payout Baru</span>
        </button>
      </div>

      {/* Approved Commissions Ready for Payout */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Komisi Approved Siap Dicairkan ({approvedCommissions.length})</span>
            </h2>
            <p className="text-xs text-emerald-800">
              Trip telah ditandai completed dan melewati masa tunggu tanpa sengketa.
            </p>
          </div>
          <div className="text-sm font-extrabold text-emerald-900">
            Total Siap Bayar:{" "}
            {formatIDR(
              approvedCommissions.reduce((sum, c) => sum + parseFloat(c.amount), 0)
            )}
          </div>
        </div>

        {approvedCommissions.length === 0 ? (
          <div className="text-xs text-emerald-700 py-3 text-center">
            Semua komisi approved telah diproses payout. Belum ada antrian baru.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {approvedCommissions.map((c) => (
              <div key={c.id} className="p-3 bg-white rounded-xl border border-emerald-100 shadow-xs text-xs space-y-1">
                <div className="font-bold text-slate-900 truncate">
                  {c.agent?.companyName || c.agent?.user?.name} ({c.agent?.refCode})
                </div>
                <div className="text-slate-500 text-[11px]">
                  Booking: {c.booking?.midtransOrderId} • {c.booking?.customerName}
                </div>
                <div className="text-emerald-700 font-extrabold text-sm pt-1 border-t border-slate-50">
                  {formatIDR(parseFloat(c.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Payout Batches Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Riwayat Batch Payout yang Telah Ditransfer</h2>
          <span className="text-xs text-slate-400">{payouts.length} batch</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Memuat riwayat payout...</div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Belum Ada Riwayat Payout</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Saat Anda membuat batch transfer komisi ke agen, riwayat dan bukti pembayaran akan tersimpan di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Tanggal / Referensi</th>
                  <th className="px-6 py-3">Penerima (Mitra Agen)</th>
                  <th className="px-6 py-3">Metode Bayar</th>
                  <th className="px-6 py-3">Jml Komisi Dilibatkan</th>
                  <th className="px-6 py-3 text-right">Total Ditransfer</th>
                  <th className="px-6 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 font-mono text-xs">
                        {p.reference || "PAYOUT"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {p.agent?.companyName || p.agent?.user?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {p.agent?.refCode} • {p.agent?.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4 capitalize">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px]">
                        {p.method}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {p.commissions?.length || 0} booking
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-extrabold text-emerald-600 text-sm">
                        {formatIDR(parseFloat(p.totalAmount))}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        <span>Paid</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Buat Batch Pembayaran Payout (AC10)</h2>
                <p className="text-xs text-slate-400">Pilih mitra agen dan komisi yang telah disetujui</p>
              </div>
              <button
                onClick={() => setShowBatchModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {batchError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {batchError}
              </div>
            )}

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Mitra Agen</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => {
                    setSelectedAgentId(e.target.value);
                    setSelectedCommissionIds([]);
                  }}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Pilih Agen dengan Komisi Siap Cair --</option>
                  {Array.from(new Set(approvedCommissions.map((c) => c.agentId))).map((agId) => {
                    const c = approvedCommissions.find((item) => item.agentId === agId);
                    return (
                      <option key={agId} value={agId}>
                        {c?.agent?.companyName || c?.agent?.user?.name} ({c?.agent?.refCode})
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedAgentId && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Daftar Komisi Milik Agen Ini:</span>
                    <button
                      type="button"
                      onClick={handleSelectAllForAgent}
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      Pilih Semua
                    </button>
                  </div>

                  <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    {agentCommissions.map((comm) => (
                      <label
                        key={comm.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-100 hover:border-emerald-400 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCommissionIds.includes(comm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCommissionIds((prev) => [...prev, comm.id]);
                              } else {
                                setSelectedCommissionIds((prev) => prev.filter((id) => id !== comm.id));
                              }
                            }}
                            className="rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-bold text-slate-800">{comm.booking?.midtransOrderId}</span>
                            <span className="text-slate-400 text-[11px] block">{comm.booking?.customerName}</span>
                          </div>
                        </div>
                        <span className="font-black text-emerald-600">{formatIDR(parseFloat(comm.amount))}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Transfer</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="wise">Wise (Internasional)</option>
                    <option value="bank_transfer">Transfer Bank (BCA / Mandiri)</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Referensi Transfer *</label>
                  <input
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Contoh: WISE-8271928"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tautan Bukti Transfer / Resi (Opsional)</label>
                <input
                  type="text"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://... atau nomor bukti"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50"
                >
                  {submitting ? "Memproses..." : "Tandai Paid & Simpan Payout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
