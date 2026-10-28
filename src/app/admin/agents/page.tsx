"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Check,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [commissionRules, setCommissionRules] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  // Edit states
  const [editTier, setEditTier] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editRuleId, setEditRuleId] = useState("");
  const [editRefCode, setEditRefCode] = useState("");
  const [editReason, setEditReason] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, [statusFilter]);

  async function loadAgents() {
    setLoading(true);
    try {
      const url = statusFilter === "all" ? "/api/agents" : `/api/agents?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setAgents(json.agents || []);
        setCommissionRules(json.commissionRules || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAgent = (agent: any) => {
    setSelectedAgent(agent);
    setEditTier(agent.tier);
    setEditStatus(agent.status);
    setEditRuleId(agent.commissionRuleId || "");
    setEditRefCode(agent.refCode);
    setEditReason("");
    setUpdateError(null);
  };

  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;
    setUpdating(true);
    setUpdateError(null);

    try {
      const res = await fetch(`/api/agents/${selectedAgent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: editTier,
          status: editStatus,
          commissionRuleId: editRuleId || null,
          refCode: editRefCode,
          reason: editReason || `Admin update tier to ${editTier}, status to ${editStatus}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui agen");
      }

      setSelectedAgent(null);
      loadAgents();
    } catch (err: any) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickApprove = async (agentId: string) => {
    try {
      await fetch(`/api/agents/${agentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "active",
          tier: "agent",
          reason: "Quick approve from pending list",
        }),
      });
      loadAgents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-blue-600 font-semibold hover:underline">
              ← Kembali ke Admin Hub
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Kelola Mitra & Agen Afiliasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tinjau pendaftaran calon agen baru, setujui status kemitraan, kelola tier (affiliate vs agent), dan pantau kinerja penjualan.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {["all", "pending", "active", "suspended"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                statusFilter === st
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Daftar Mitra Agen</h2>
          <span className="text-xs text-slate-400">{agents.length} mitra terdaftar</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">Memuat data mitra...</div>
        ) : agents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Tidak Ada Agen Pada Filter Ini</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Nama Agen / Perusahaan</th>
                  <th className="px-6 py-3">Kontak & Negara</th>
                  <th className="px-6 py-3">Kode Referral</th>
                  <th className="px-6 py-3">Tier</th>
                  <th className="px-6 py-3">Performa</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {agents.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{ag.companyName || ag.user?.name}</div>
                      <div className="text-[11px] text-slate-400">PJ: {ag.user?.name}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div>{ag.user?.email}</div>
                      <div className="text-[11px] text-slate-400">{ag.country} • {ag.user?.phone || "-"}</div>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-emerald-700">
                      {ag.refCode}
                    </td>

                    <td className="px-6 py-4">
                      <span className="capitalize px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[11px]">
                        {ag.tier}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {ag._count?.leads || 0} Leads
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {ag._count?.commissions || 0} Booking Berkomisi
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          ag.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : ag.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ag.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      {ag.status === "pending" && (
                        <button
                          onClick={() => handleQuickApprove(ag.id)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleSelectAgent(ag)}
                        className="px-3 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Agent Drawer/Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  Kelola Mitra: {selectedAgent.companyName || selectedAgent.user?.name}
                </h2>
                <p className="text-xs text-slate-400">Sesuaikan status, tier, dan aturan komisi mitra</p>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {updateError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {updateError}
              </div>
            )}

            <form onSubmit={handleSaveAgent} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Kemitraan</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active (Disetujui)</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tier Program</label>
                  <select
                    value={editTier}
                    onChange={(e) => setEditTier(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="affiliate">Affiliate (Link saja)</option>
                    <option value="agent">Agent (Pipeline & Input Manual)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Aturan Komisi (Commission Rule)</label>
                <select
                  value={editRuleId}
                  onChange={(e) => setEditRuleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Default Sesuai Tier</option>
                  {commissionRules.map((rule) => (
                    <option key={rule.id} value={rule.id}>
                      {rule.name} (Share: {(parseFloat(rule.payoutShare) * 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Referral Unik</label>
                <input
                  type="text"
                  value={editRefCode}
                  onChange={(e) => setEditRefCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alasan Perubahan (Dicatat di AuditLog)</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  placeholder="Contoh: Mitra telah menandatangani kontrak kerjasama offline"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition disabled:opacity-50"
                >
                  {updating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

