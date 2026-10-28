"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Mail,
  Phone,
  Globe,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

export default function AgentLeadsPage() {
  const { t, locale } = useI18n();
  const al = t.agentLeads;

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [copiedTripId, setCopiedTripId] = useState<string | null>(null);

  // Form states for adding manual lead
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("China");
  const [message, setMessage] = useState("");
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Note state for existing lead
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  async function loadLeads() {
    setLoading(true);
    try {
      const url = statusFilter === "all" ? "/api/agent/leads" : `/api/agent/leads?status=${statusFilter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setLeads(json.leads || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/agent/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          country,
          message,
          nextFollowUpAt: nextFollowUpAt || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create manual lead");
      }

      setShowAddModal(false);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setNextFollowUpAt("");
      loadLeads();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadLeads();
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev: any) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (leadId: string) => {
    if (!newNote.trim()) return;
    setAddingNote(true);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: newNote.trim() }),
      });
      if (res.ok) {
        setNewNote("");
        loadLeads();
        // Update selectedLead activities locally
        setSelectedLead((prev: any) => ({
          ...prev,
          activities: [
            {
              id: Date.now().toString(),
              type: "agent_note",
              body: newNote.trim(),
              createdAt: new Date().toISOString(),
            },
            ...(prev.activities || []),
          ],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNote(false);
    }
  };

  const handleCopyCheckoutLink = (tripId: string) => {
    const origin = window.location.origin;
    const checkoutLink = `${origin}/checkout?trip_id=${tripId}`;
    navigator.clipboard.writeText(checkoutLink);
    setCopiedTripId(tripId);
    setTimeout(() => setCopiedTripId(null), 2000);
  };

  const filterTabs = [
    { key: "all", label: al.filterAll },
    { key: "new", label: al.filterNew },
    { key: "contacted", label: al.filterContacted },
    { key: "quoted", label: al.filterQuoted },
    { key: "booked", label: al.filterWon },
    { key: "lost", label: al.filterLost },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/agent" className="text-xs text-emerald-600 font-semibold hover:underline">
              {al.backToDashboard}
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {al.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {al.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{al.addManualBtn}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-semibold">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl capitalize transition shrink-0 ${
              statusFilter === tab.key
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Leads Grid & Timeline Detail */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          {locale === "zh" ? "正在加载线索管线..." : locale === "en" ? "Loading leads pipeline..." : "Memuat data pipeline lead..."}
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">{al.emptyLeads}</h3>
          <p className="text-xs text-slate-400">
            {al.modalAddSubtitle}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List Section */}
          <div className="lg:col-span-7 space-y-4">
            {leads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const hasTrip = lead.trips && lead.trips.length > 0;
              const latestTrip = hasTrip ? lead.trips[0] : null;

              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`bg-white rounded-2xl border p-5 space-y-3 cursor-pointer transition ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                      : "border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{lead.name}</h3>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({lead.source === "website" ? al.sourceWebsite : al.sourceManual})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : lead.status === "contacted"
                          ? "bg-amber-100 text-amber-800"
                          : lead.status === "quoted"
                          ? "bg-indigo-100 text-indigo-800"
                          : lead.status === "booked" || lead.status === "paid" || lead.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  {lead.message && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                      {lead.message}
                    </p>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>
                        {al.exclusiveLock}:{" "}
                        {lead.lockedUntil
                          ? new Date(lead.lockedUntil).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {latestTrip ? (
                        <button
                          onClick={() => handleCopyCheckoutLink(latestTrip.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 transition"
                        >
                          {copiedTripId === latestTrip.id ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedTripId === latestTrip.id ? al.copiedAlert : al.copyCheckoutLink}</span>
                        </button>
                      ) : (
                        <Link
                          href={`/plan?lead=${lead.id}`}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{al.makeProposal}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline & Detail Drawer */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-6">
            {selectedLead ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base">{selectedLead.name}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 uppercase">
                      {selectedLead.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedLead.email} • {selectedLead.phone || "-"}
                  </p>
                </div>

                {/* Status Transitions */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {locale === "zh" ? "更新跟进阶段：" : locale === "en" ? "Update Follow-Up Stage:" : "Ubah Tahap Follow-Up:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {["new", "contacted", "negotiating", "lost"].map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedLead.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                          selectedLead.status === st
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Proposal CTA */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>{al.makeProposal}</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    {locale === "zh"
                      ? "打开定制规划器，为该游客生成中英文行程方案与官方报价。"
                      : locale === "en"
                      ? "Launch the custom itinerary planner to craft tailored routes and generate checkout proposals."
                      : "Buka builder kustom untuk merancang rute Bromo/Ijen dan mengirimkan penawaran harga resmi."}
                  </p>
                  <Link
                    href={`/plan?lead=${selectedLead.id}`}
                    className="block text-center py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm"
                  >
                    {al.makeProposal}
                  </Link>
                </div>

                {/* Notes Input */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {locale === "zh" ? "添加沟通跟进备注：" : locale === "en" ? "Add Communication Note:" : "Tambah Catatan Percakapan:"}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder={al.addNotePlaceholder}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleAddNote(selectedLead.id)}
                      disabled={addingNote || !newNote.trim()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition disabled:opacity-50"
                    >
                      {addingNote ? al.savingNote : al.saveNote}
                    </button>
                  </div>
                </div>

                {/* Activities Timeline */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {al.activitiesTimeline}
                  </span>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {(selectedLead.activities || []).map((act: any) => (
                      <div key={act.id} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold capitalize text-slate-600">{act.type.replace("_", " ")}</span>
                          <span>{new Date(act.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700">{act.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-slate-400">
                {locale === "zh"
                  ? "在左侧选择一位游客线索查看跟进详情与历史记录。"
                  : locale === "en"
                  ? "Select a lead on the left to view timeline & follow-up details."
                  : "Pilih salah satu lead di sebelah kiri untuk melihat rincian riwayat & follow-up."}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">{al.modalAddTitle}</h2>
                <p className="text-xs text-slate-400">{al.modalAddSubtitle}</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateManualLead} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{al.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mr. Zhang / Sarah"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{al.emailLabel}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="zhang@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{al.phoneLabel}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+86..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{al.countryLabel}</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="China, Singapore, etc."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{al.followUpLabel}</label>
                  <input
                    type="date"
                    value={nextFollowUpAt}
                    onChange={(e) => setNextFollowUpAt(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{al.reqLabel}</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={al.addNotePlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  {al.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition disabled:opacity-50"
                >
                  {submitting ? al.submitting : al.createLeadBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
