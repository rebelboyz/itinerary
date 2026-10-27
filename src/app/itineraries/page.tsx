"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Calendar,
  Users,
  Car,
  Hotel as HotelIcon,
  MapPin,
  Plus,
  Trash2,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import { localizeItem } from "@/i18n/translations";

function ItinerariesContent() {
  const router = useRouter();
  const { t, locale, formatPrice, currency } = useI18n();

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSavedItineraries() {
      try {
        // 1. Check current session
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const user = sessionData.user || null;
        setCurrentUser(user);

        // 2. Read local storage IDs (for guest / offline tracking)
        let localIds: string[] = [];
        try {
          const raw = localStorage.getItem("saved_itinerary_ids");
          if (raw) localIds = JSON.parse(raw);
        } catch (e) {
          console.error("Local storage read error:", e);
        }

        let combinedTrips: any[] = [];
        const seenIds = new Set<string>();

        // 3. If logged in, fetch user trips from DB
        if (user) {
          const userTripsRes = await fetch("/api/trips");
          const userTripsData = await userTripsRes.json();
          if (userTripsData.trips) {
            userTripsData.trips.forEach((tr: any) => {
              if (!seenIds.has(tr.id)) {
                seenIds.add(tr.id);
                combinedTrips.push(tr);
              }
            });
          }
        }

        // 4. Also fetch any trips saved in localStorage that might have been created as guest
        if (localIds.length > 0) {
          const guestTripsRes = await fetch(`/api/trips?ids=${localIds.join(",")}`);
          const guestTripsData = await guestTripsRes.json();
          if (guestTripsData.trips) {
            guestTripsData.trips.forEach((tr: any) => {
              if (!seenIds.has(tr.id)) {
                seenIds.add(tr.id);
                combinedTrips.push(tr);
              }
            });
          }
        }

        setTrips(combinedTrips);
      } catch (err) {
        console.error("Fetch saved itineraries error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedItineraries();
  }, []);

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg =
      locale === "zh"
        ? "您确定要删除该行程方案吗？"
        : locale === "en"
        ? "Are you sure you want to delete this saved itinerary?"
        : "Apakah Anda yakin ingin menghapus itinerary ini?";

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from state
        setTrips((prev) => prev.filter((t) => t.id !== id));

        // Remove from localStorage
        try {
          const raw = localStorage.getItem("saved_itinerary_ids");
          if (raw) {
            const ids: string[] = JSON.parse(raw);
            const filtered = ids.filter((item) => item !== id);
            localStorage.setItem("saved_itinerary_ids", JSON.stringify(filtered));
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        alert("Gagal menghapus itinerary.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus itinerary.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTripId((prev) => (prev === id ? null : id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{locale === "zh" ? "已确认出发" : locale === "en" ? "Confirmed" : "Terkonfirmasi"}</span>
          </span>
        );
      case "booked":
        return (
          <span className="text-xs font-extrabold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>{locale === "zh" ? "待支付 / 结算中" : locale === "en" ? "Booked" : "Menunggu Pembayaran"}</span>
          </span>
        );
      default:
        return (
          <span className="text-xs font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>{locale === "zh" ? "草稿方案" : locale === "en" ? "Draft Saved" : "Draft / Tersimpan"}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-32 md:pb-10 space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
              {locale === "zh" ? "我的行程管家" : locale === "en" ? "My Travel Portfolio" : "Itinerary Traveler"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bookmark className="w-7 h-7 text-emerald-600" />
            <span>
              {locale === "zh"
                ? "我的定制行程列表"
                : locale === "en"
                ? "My Saved Itineraries"
                : "Daftar Itinerary Saya"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {locale === "zh"
              ? "查看并管理您精心定制的所有东爪哇行程方案。随时继续编辑、核对分段耗时与大本营酒店，或直接完成预订结算。"
              : locale === "en"
              ? "Manage all your custom East Java travel plans. Review driving times, hotel basecamps, or proceed to booking and checkout anytime."
              : "Kelola seluruh rancangan perjalanan custom Jawa Timur Anda. Cek estimasi waktu tempuh, hotel basecamp, dan lanjutkan ke pembayaran kapan saja."}
          </p>
        </div>

        <Link
          href="/plan"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>
            {locale === "zh"
              ? "+ 制作新定制行程"
              : locale === "en"
              ? "+ Design New Itinerary"
              : "+ Rancang Itinerary Baru"}
          </span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="py-20 text-center space-y-3">
          <Compass className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">
            {locale === "zh"
              ? "正在读取您的已保存行程..."
              : locale === "en"
              ? "Loading your saved itineraries..."
              : "Memuat daftar itinerary Anda..."}
          </h3>
        </div>
      )}

      {/* Empty State */}
      {!loading && trips.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <Compass className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              {locale === "zh"
                ? "您还没有保存任何行程"
                : locale === "en"
                ? "No Saved Itineraries Yet"
                : "Belum Ada Itinerary yang Disimpan"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              {locale === "zh"
                ? "使用我们的定制行程规划器，自由组合布罗莫火山、宜珍火山及千层瀑布。系统将实时为您计算透明价格与酒店大本营回路。"
                : locale === "en"
                ? "Use our Custom Itinerary Builder to customize Bromo, Ijen, and Tumpak Sewu. System calculates fair pricing and hotel basecamp circuits automatically."
                : "Gunakan fitur Penyusun Itinerary untuk memilih destinasi Bromo, Ijen, hingga Tumpak Sewu. Tarif transparan dan rute hotel basecamp dihitung otomatis."}
            </p>
          </div>
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs shadow-md shadow-emerald-500/20 transition"
          >
            <span>
              {locale === "zh"
                ? "立即开始定制行程"
                : locale === "en"
                ? "Start Building Itinerary"
                : "Mulai Rancang Itinerary"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* List of Saved Itineraries */}
      {!loading && trips.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>
              {locale === "zh"
                ? `共保存 ${trips.length} 个定制行程方案`
                : locale === "en"
                ? `${trips.length} Saved Itinerar${trips.length > 1 ? "ies" : "y"}`
                : `Total ${trips.length} Rancangan Itinerary`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {trips.map((trip) => {
              const daysCount = (trip.days || []).length || 1;
              const isExpanded = expandedTripId === trip.id;
              const allDestinations: any[] = [];
              (trip.days || []).forEach((d: any) => {
                (d.items || []).forEach((it: any) => {
                  if (it.destination && !allDestinations.find((x) => x.id === it.destination.id)) {
                    allDestinations.push(it.destination);
                  }
                });
              });

              return (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition overflow-hidden"
                >
                  {/* Card Main Body */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Title, Date, Status & Delete */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(trip.status)}
                          <span className="text-xs font-semibold text-slate-400">
                            {new Date(trip.createdAt).toLocaleDateString(
                              locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "id-ID",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {trip.title}
                        </h2>
                      </div>

                      {/* Pricing and Action */}
                      <div className="flex items-center gap-3 self-start sm:self-center">
                        <div className="text-left sm:text-right">
                          <div className="text-lg sm:text-xl font-black text-emerald-600 leading-tight">
                            {formatPrice(trip.totalAmount)}
                          </div>
                          <div className="text-xs font-semibold text-slate-400">
                            {formatPrice(trip.pricePerPax)} / Pax ({trip.numPax} Pax)
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          disabled={deletingId === trip.id}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Itinerary Ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Chips Details Row */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                      {/* Duration */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          {daysCount} {locale === "zh" ? "天" : locale === "en" ? "Days" : "Hari"}
                          {daysCount > 1 ? ` ${daysCount - 1}N` : ""}
                        </span>
                      </div>

                      {/* Pax */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{trip.numPax} Pax</span>
                      </div>

                      {/* Vehicle */}
                      {trip.vehicleType && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold">
                          <Car className="w-3.5 h-3.5 text-amber-600" />
                          <span>{trip.vehicleType.name}</span>
                        </div>
                      )}

                      {/* Hotel Basecamp */}
                      {trip.hotel && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold">
                          <HotelIcon className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="truncate max-w-[160px]">{trip.hotel.name}</span>
                        </div>
                      )}

                      {/* Distance */}
                      {trip.totalDistanceKm > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{trip.totalDistanceKm} km total</span>
                        </div>
                      )}

                      {/* Guide Option Chip */}
                      {trip.withGuide !== false && parseFloat(trip.guideCost || 0) > 0 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 font-semibold">
                          <Users className="w-3.5 h-3.5 text-purple-600" />
                          <span>{locale === "zh" ? "含专业导游" : locale === "en" ? "With Tour Guide" : "Dengan Guide"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-medium">
                          <span>{locale === "zh" ? "仅司机 (无导游)" : locale === "en" ? "Driver Only (No Guide)" : "Tanpa Guide (Hanya Driver)"}</span>
                        </div>
                      )}
                    </div>

                    {/* Visited Destinations Preview */}
                    {allDestinations.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-500">
                          {locale === "zh" ? "游览景点：" : locale === "en" ? "Destinations:" : "Destinasi:"}
                        </span>
                        {allDestinations.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                          >
                            {d.imageUrl && (
                              <img
                                src={d.imageUrl}
                                alt={d.name}
                                className="w-4 h-4 rounded object-cover"
                              />
                            )}
                            <span>{localizeItem(d.name, locale)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleExpand(trip.id)}
                        className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 self-start sm:self-center"
                      >
                        <span>
                          {isExpanded
                            ? locale === "zh"
                              ? "收起每日详细日程"
                              : locale === "en"
                              ? "Hide Daily Schedule"
                              : "Tutup Rincian Jadwal"
                            : locale === "zh"
                            ? "展开每日详细日程与酒店回路"
                            : locale === "en"
                            ? "View Daily Schedule & Hotel Route"
                            : "Lihat Rincian Jadwal & Rute Hotel"}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/checkout?trip_id=${trip.id}`}
                          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition"
                        >
                          <span>
                            {locale === "zh"
                              ? "结算预订 / 查看实时导航"
                              : locale === "en"
                              ? "Checkout / View Route Nav"
                              : "Lanjut ke Checkout / Rute"}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Day-by-Day Accordion */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-slate-50/80 border-t border-slate-200 space-y-3 animate-in fade-in duration-200 text-xs">
                      <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                        {locale === "zh" ? "完整日程明细" : locale === "en" ? "Full Itinerary Breakdown" : "Rincian Jadwal Harian"}
                      </h4>

                      {/* Pickup Point */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                          A
                        </span>
                        <div>
                          <span className="text-slate-400 text-xs block">
                            {locale === "zh" ? "出发地 / 接机地点" : locale === "en" ? "Pickup Point" : "Titik Penjemputan"}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{trip.pickupPoint}</span>
                        </div>
                      </div>

                      {/* Hotel Basecamp Note if chosen */}
                      {trip.hotel && (
                        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center gap-2">
                          <HotelIcon className="w-4 h-4 text-indigo-600 shrink-0" />
                          <div>
                            <span className="text-indigo-600 text-xs block font-semibold">
                              {locale === "zh" ? "大本营酒店" : locale === "en" ? "Operational Basecamp Hotel" : "Hotel Basecamp Utama"}
                            </span>
                            <span className="font-bold text-indigo-950 text-xs sm:text-sm">{trip.hotel.name}</span>
                          </div>
                        </div>
                      )}

                      {/* Days */}
                      {(trip.days || []).map((day: any) => (
                        <div key={day.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                              {locale === "zh" ? `第 ${day.dayNumber} 天` : locale === "en" ? `Day ${day.dayNumber}` : `Hari ke-${day.dayNumber}`}
                            </span>
                            <span className="font-bold text-slate-800 text-xs sm:text-sm">{day.title}</span>
                          </div>

                          <div className="pl-2 space-y-1.5">
                            {(day.items || []).map((item: any) => (
                              <div key={item.id} className="flex items-center gap-2 text-slate-700 text-xs">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-semibold">
                                  {localizeItem(
                                    item.destination?.name || item.activity?.name || item.note || "Destinasi",
                                    locale
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Drop-off Point */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                          B
                        </span>
                        <div>
                          <span className="text-slate-400 text-xs block">
                            {locale === "zh" ? "终点送达 / 离境地点" : locale === "en" ? "Drop-off Point" : "Titik Pengantaran Akhir"}
                          </span>
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">{trip.dropoffPoint}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <Compass className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <h2 className="text-sm font-bold text-slate-800">Loading Itineraries...</h2>
        </div>
      }
    >
      <ItinerariesContent />
    </Suspense>
  );
}

