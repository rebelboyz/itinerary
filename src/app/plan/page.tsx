"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Compass,
  Calendar,
  Users,
  Car,
  Hotel as HotelIcon,
  MapPin,
  Plus,
  Trash2,
  Check,
  Info,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Utensils,
  Layers,
  Star,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  X,
  Eye,
  Pencil,
} from "lucide-react";
import { formatIDR, formatUSD, formatCNY } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { localizeItem } from "@/i18n/translations";

interface Destination {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  category: string;
  ticketPrice: number;
  description: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  googleMapsUrl?: string;
}

interface VehicleType {
  id: string;
  name: string;
  capacityMin: number;
  capacityMax: number;
  ratePerKm: number;
  description: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  googleMapsUrl?: string;
}

interface Hotel {
  id: string;
  name: string;
  region: string;
  hotelClass: string;
  pricePerRoomPerNight: number;
  paxPerRoom: number;
  description: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  googleMapsUrl?: string;
}

interface Activity {
  id: string;
  name: string;
  ticketPrice: number;
  description: string;
}

interface MealOption {
  id: string;
  name: string;
  pricePerPax: number;
  description: string;
}

interface DayPlan {
  dayNumber: number;
  title: string;
  destinationIds: string[];
  activityIds: string[];
  mealIds: string[];
}

function ItineraryBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadIdParam = searchParams.get("lead") || searchParams.get("leadId");
  const editIdParam = searchParams.get("edit") || searchParams.get("tripId");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTripId, setEditTripId] = useState<string | null>(null);
  const [leadCustomer, setLeadCustomer] = useState<{ id: string; name: string; email: string; phone?: string } | null>(null);
  const { t, locale, formatPrice, currency } = useI18n();

  useEffect(() => {
    if (!leadIdParam) return;
    async function fetchLead() {
      try {
        const res = await fetch(`/api/leads/${leadIdParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.lead) {
            setLeadCustomer({
              id: data.lead.id,
              name: data.lead.name,
              email: data.lead.email,
              phone: data.lead.phone,
            });
            if (data.lead.name) {
              setTitle(`Trip Proposal - ${data.lead.name}`);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load lead details", err);
      }
    }
    fetchLead();
  }, [leadIdParam]);

  // Master data
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [vehicles, setVehicles] = useState<VehicleType[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [meals, setMeals] = useState<MealOption[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Builder state
  const [title, setTitle] = useState(
    locale === "zh"
      ? "我的东爪哇火山定制之旅"
      : locale === "id"
      ? "Petualangan Kustom Jawa Timur Saya"
      : "My East Java Custom Adventure"
  );
  const [tripType, setTripType] = useState<"solo" | "duo" | "private" | "group">("private");
  const [numPax, setNumPax] = useState(2);
  const [startDate, setStartDate] = useState("2026-11-01");
  const [daysCount, setDaysCount] = useState(3);
  const [pickupPoint, setPickupPoint] = useState("Surabaya Juanda Airport (SUB)");
  const [dropoffPoint, setDropoffPoint] = useState("Ketapang Ferry Port (Banyuwangi)");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [includeGuide, setIncludeGuide] = useState<boolean>(true);
  const [guideRatePerDay, setGuideRatePerDay] = useState<number>(500000);

  // Days list
  const [days, setDays] = useState<DayPlan[]>([
    { dayNumber: 1, title: "Day 1: Arrival & Bromo Sunset", destinationIds: [], activityIds: [], mealIds: [] },
    { dayNumber: 2, title: "Day 2: Bromo Sunrise & Tumpak Sewu", destinationIds: [], activityIds: [], mealIds: [] },
    { dayNumber: 3, title: "Day 3: Ijen Blue Fire & Departure", destinationIds: [], activityIds: [], mealIds: [] },
  ]);

  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Pricing calculation state
  const [pricing, setPricing] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [savedTripData, setSavedTripData] = useState<any>(null);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);

  // Load master data and existing trip if in edit mode
  useEffect(() => {
    async function loadAll() {
      try {
        const [destRes, vehRes, hotRes, actRes, mealRes, priceRes] = await Promise.all([
          fetch("/api/destinations").then((r) => r.json()),
          fetch("/api/vehicles").then((r) => r.json()),
          fetch("/api/hotels").then((r) => r.json()),
          fetch("/api/activities").then((r) => r.json()),
          fetch("/api/meals").then((r) => r.json()),
          fetch("/api/price-config").then((r) => r.json()).catch(() => ({})),
        ]);

        const destList = destRes.destinations || [];
        const vehList = vehRes.vehicles || [];
        const hotList = hotRes.hotels || [];
        const actList = actRes.activities || [];
        const mealList = mealRes.meals || [];

        if (priceRes?.configs) {
          const guideCfg = priceRes.configs.find((c: any) => c.key === "guide_rate_per_day");
          if (guideCfg) setGuideRatePerDay(parseFloat(guideCfg.value));
        }

        setDestinations(destList);
        setVehicles(vehList);
        setHotels(hotList);
        setActivities(actList);
        setMeals(mealList);

        // Check if editing existing trip
        let loadedExisting = false;
        if (editIdParam) {
          try {
            const tripRes = await fetch(`/api/trips?id=${editIdParam}`);
            const tripData = await tripRes.json();
            const existingTrip = tripData.trips?.[0];
            if (existingTrip) {
              loadedExisting = true;
              setEditTripId(existingTrip.id);
              setIsEditMode(true);
              if (existingTrip.title) setTitle(existingTrip.title);
              if (existingTrip.tripType) setTripType(existingTrip.tripType);
              if (existingTrip.numPax) setNumPax(existingTrip.numPax);
              if (existingTrip.startDate) {
                setStartDate(new Date(existingTrip.startDate).toISOString().split("T")[0]);
              }
              if (existingTrip.pickupPoint) setPickupPoint(existingTrip.pickupPoint);
              if (existingTrip.dropoffPoint) setDropoffPoint(existingTrip.dropoffPoint);
              if (existingTrip.vehicleTypeId) setSelectedVehicleId(existingTrip.vehicleTypeId);
              if (existingTrip.hotelId) setSelectedHotelId(existingTrip.hotelId);
              setIncludeGuide(existingTrip.withGuide !== false);

              if (existingTrip.days && existingTrip.days.length > 0) {
                setDaysCount(existingTrip.days.length);
                const mappedDays: DayPlan[] = existingTrip.days.map((d: any) => ({
                  dayNumber: d.dayNumber,
                  title: d.title || `Day ${d.dayNumber}`,
                  destinationIds: (d.items || [])
                    .filter((it: any) => it.type === "destination" && it.destinationId)
                    .map((it: any) => it.destinationId),
                  activityIds: (d.items || [])
                    .filter((it: any) => it.type === "activity" && it.activityId)
                    .map((it: any) => it.activityId),
                  mealIds: [],
                }));
                setDays(mappedDays);
              }
            }
          } catch (tripErr) {
            console.error("Failed to load existing trip for edit:", tripErr);
          }
        }

        // If not editing, set standard default selections
        if (!loadedExisting) {
          // Pre-select default vehicle
          if (vehList.length > 0) {
            const rec = vehList.find((v: any) => v.capacityMin <= 2 && v.capacityMax >= 2) || vehList[0];
            setSelectedVehicleId(rec.id);
          }

          // Pre-populate with typical Jawa Timur destinations
          if (destList.length >= 3) {
            const bromo = destList.find((d: any) => d.name.toLowerCase().includes("bromo"));
            const sewu = destList.find((d: any) => d.name.toLowerCase().includes("tumpak"));
            const ijen = destList.find((d: any) => d.name.toLowerCase().includes("ijen"));

            setDays([
              {
                dayNumber: 1,
                title: "Day 1: Surabaya Pickup & Bromo",
                destinationIds: bromo ? [bromo.id] : [destList[0].id],
                activityIds: [],
                mealIds: [],
              },
              {
                dayNumber: 2,
                title: "Day 2: Bromo Sunrise & Tumpak Sewu",
                destinationIds: sewu ? [sewu.id] : [destList[1].id],
                activityIds: [],
                mealIds: [],
              },
              {
                dayNumber: 3,
                title: "Day 3: Ijen Crater Blue Fire & Port Dropoff",
                destinationIds: ijen ? [ijen.id] : [destList[2].id],
                activityIds: [],
                mealIds: [],
              },
            ]);
          }

          if (hotList.length > 0) {
            // Standard hotel default
            const standardHotel = hotList.find((h: any) => h.hotelClass === "standard") || hotList[0];
            setSelectedHotelId(standardHotel.id);
          }
        }
      } catch (err) {
        console.error("Failed to load builder data:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadAll();
  }, [editIdParam]);

  // Sync trip type when pax changes
  const handlePaxChange = (pax: number) => {
    setNumPax(pax);
    if (pax === 1) setTripType("solo");
    else if (pax === 2) setTripType("duo");
    else if (pax <= 5) setTripType("private");
    else setTripType("group");

    // Auto recommend vehicle for this pax
    const rec = vehicles.find((v) => pax >= v.capacityMin && pax <= v.capacityMax);
    if (rec) {
      setSelectedVehicleId(rec.id);
    }
  };

  // Adjust days array when daysCount changes
  const handleDaysCountChange = (count: number) => {
    setDaysCount(count);
    const newDays: DayPlan[] = [];
    for (let i = 1; i <= count; i++) {
      if (days[i - 1]) {
        newDays.push({
          dayNumber: i,
          title: days[i - 1].title || `Day ${i}: East Java Exploration`,
          destinationIds: [...days[i - 1].destinationIds],
          activityIds: [...days[i - 1].activityIds],
          mealIds: [...days[i - 1].mealIds],
        });
      } else {
        newDays.push({
          dayNumber: i,
          title: `Day ${i}: East Java Exploration`,
          destinationIds: [],
          activityIds: [],
          mealIds: [],
        });
      }
    }
    setDays(newDays);
    if (activeDayIndex >= count) setActiveDayIndex(count - 1);
  };

  // Calculate pricing whenever parameters change
  useEffect(() => {
    if (loadingData || !selectedVehicleId) return;

    const allDestIds = days.flatMap((d) => d.destinationIds);
    const allActIds = days.flatMap((d) => d.activityIds);
    const allMealIds = days.flatMap((d) => d.mealIds);

    setIsCalculating(true);

    fetch("/api/trips/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numPax,
        tripDaysCount: daysCount,
        vehicleTypeId: selectedVehicleId,
        hotelId: daysCount > 1 ? (selectedHotelId || null) : null,
        includeGuide,
        days: days.map((d) => ({
          dayNumber: d.dayNumber,
          destinationIds: d.destinationIds,
        })),
        destinationIds: allDestIds,
        activityIds: allActIds,
        mealOptionIds: allMealIds,
        pickupPoint,
        pickupLat: -7.3798, // Surabaya
        pickupLng: 112.7876,
        dropoffPoint,
        dropoffLat: dropoffPoint.includes("Ketapang") ? -8.1485 : -7.3798,
        dropoffLng: dropoffPoint.includes("Ketapang") ? 114.3985 : 112.7876,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) {
          setPricing(data.pricing);
        }
        if (data.guideRatePerDay) {
          setGuideRatePerDay(data.guideRatePerDay);
        }
      })
      .catch((err) => console.error("Calc error:", err))
      .finally(() => setIsCalculating(false));
  }, [
    days,
    numPax,
    daysCount,
    selectedVehicleId,
    selectedHotelId,
    pickupPoint,
    dropoffPoint,
    loadingData,
    includeGuide,
  ]);

  const toggleDestinationInDay = (dayIdx: number, destId: string) => {
    setDays((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const exists = day.destinationIds.includes(destId);
        return {
          ...day,
          destinationIds: exists
            ? day.destinationIds.filter((id) => id !== destId)
            : [...day.destinationIds, destId],
        };
      })
    );
  };

  const toggleActivityInDay = (dayIdx: number, actId: string) => {
    setDays((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const exists = day.activityIds.includes(actId);
        return {
          ...day,
          activityIds: exists
            ? day.activityIds.filter((id) => id !== actId)
            : [...day.activityIds, actId],
        };
      })
    );
  };

  const toggleMealInDay = (dayIdx: number, mealId: string) => {
    setDays((prev) =>
      prev.map((day, idx) => {
        if (idx !== dayIdx) return day;
        const exists = day.mealIds.includes(mealId);
        return {
          ...day,
          mealIds: exists
            ? day.mealIds.filter((id) => id !== mealId)
            : [...day.mealIds, mealId],
        };
      })
    );
  };

  const handleSaveItinerary = async () => {
    if (!pricing) return;
    setIsSavingDraft(true);

    try {
      const endTimestamp = new Date(startDate).getTime() + daysCount * 86400000;
      const endDate = new Date(endTimestamp).toISOString().split("T")[0];

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: editTripId || undefined,
          title,
          tripType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          numPax,
          vehicleTypeId: selectedVehicleId,
          hotelId: daysCount > 1 ? (selectedHotelId || null) : null,
          includeGuide,
          withGuide: includeGuide,
          pickupPoint,
          dropoffPoint,
          leadId: leadIdParam || null,
          customerName: leadCustomer?.name,
          customerEmail: leadCustomer?.email,
          customerPhone: leadCustomer?.phone,
          pricing,
          days: days.map((d) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            items: [
              ...d.destinationIds.map((id) => ({ type: "destination", destinationId: id })),
              ...d.activityIds.map((id) => ({ type: "activity", activityId: id })),
              ...d.mealIds.map((id) => ({ type: "meal", note: "Meal Option" })),
            ],
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.trip?.id) {
        // Store in localStorage for guest & user persistent list
        try {
          const raw = localStorage.getItem("saved_itinerary_ids");
          const existingIds: string[] = raw ? JSON.parse(raw) : [];
          if (!existingIds.includes(data.trip.id)) {
            existingIds.unshift(data.trip.id);
            localStorage.setItem("saved_itinerary_ids", JSON.stringify(existingIds));
          }
        } catch (e) {
          console.error(e);
        }

        setSavedTripData(data.trip);
        setShowSaveSuccessModal(true);
      } else {
        alert(
          locale === "zh"
            ? "保存行程方案失败，请重试。"
            : locale === "en"
            ? "Failed to save itinerary. Please try again."
            : "Gagal menyimpan itinerary. Silakan coba kembali."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan itinerary.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!pricing) return;
    setIsSubmitting(true);

    try {
      const endTimestamp = new Date(startDate).getTime() + daysCount * 86400000;
      const endDate = new Date(endTimestamp).toISOString().split("T")[0];

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: editTripId || undefined,
          title,
          tripType,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          numPax,
          vehicleTypeId: selectedVehicleId,
          hotelId: daysCount > 1 ? (selectedHotelId || null) : null,
          includeGuide,
          withGuide: includeGuide,
          pickupPoint,
          dropoffPoint,
          leadId: leadIdParam || null,
          customerName: leadCustomer?.name,
          customerEmail: leadCustomer?.email,
          customerPhone: leadCustomer?.phone,
          pricing,
          days: days.map((d) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            items: [
              ...d.destinationIds.map((id) => ({ type: "destination", destinationId: id })),
              ...d.activityIds.map((id) => ({ type: "activity", activityId: id })),
              ...d.mealIds.map((id) => ({ type: "meal", note: "Meal Option" })),
            ],
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.trip?.id) {
        // Also save to localStorage
        try {
          const raw = localStorage.getItem("saved_itinerary_ids");
          const existingIds: string[] = raw ? JSON.parse(raw) : [];
          if (!existingIds.includes(data.trip.id)) {
            existingIds.unshift(data.trip.id);
            localStorage.setItem("saved_itinerary_ids", JSON.stringify(existingIds));
          }
        } catch (e) {
          console.error(e);
        }

        // Create booking and redirect to checkout
        const bookingRes = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId: data.trip.id }),
        });
        const bookingData = await bookingRes.json();
        if (bookingData.success && bookingData.booking?.id) {
          router.push(`/checkout?booking_id=${bookingData.booking.id}`);
        } else {
          router.push(`/checkout?trip_id=${data.trip.id}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Gagal melanjutkan ke checkout. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <Compass className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">
          {locale === "zh"
            ? "正在准备定制行程规划器..."
            : locale === "en"
            ? "Preparing Custom Itinerary Builder..."
            : "Menyiapkan Custom Itinerary Builder..."}
        </h2>
        <p className="text-xs text-slate-500">
          {locale === "zh"
            ? "正在加载东爪哇景点数据、车型里程费率及各级酒店价格..."
            : locale === "en"
            ? "Loading East Java destinations, fleet rates, and hotel packages..."
            : "Memuat data destinasi, rate kendaraan, dan hotel Jawa Timur."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-48 md:pb-8 w-full max-w-full overflow-x-hidden">
      {/* Title Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>{t.builder.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.builder.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {t.builder.subtitle}
        </p>
      </div>

      {leadCustomer && (
        <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm text-blue-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>
                {locale === "zh" ? "方案客户：" : locale === "en" ? "Proposal for Lead:" : "Penawaran untuk Lead:"}
              </strong>{" "}
              {leadCustomer.name} ({leadCustomer.email})
            </span>
          </div>
          <span className="px-2 py-0.5 bg-blue-600 text-white font-bold rounded text-[11px]">
            {locale === "zh" ? "代理/客服报价模式" : locale === "en" ? "Agent/CS Proposal Mode" : "Mode Penawaran Agen/CS"}
          </span>
        </div>
      )}

      {isEditMode && (
        <div className="mb-6 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-xs">
          <div className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>{locale === "zh" ? "正在编辑已有行程方案：" : locale === "en" ? "Editing Saved Itinerary:" : "Mode Ubah Itinerary:"}</strong>{" "}
              {title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditTripId(null);
              setIsEditMode(false);
              router.push("/plan");
            }}
            className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-lg text-xs transition self-start sm:self-auto"
          >
            {locale === "zh" ? "退出编辑 (新建空白行程)" : locale === "en" ? "Exit Edit (New Plan)" : "Batal Edit / Buat Baru"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Builder Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Trip Meta Configuration Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{t.builder.detailsTitle}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Jumlah Pax */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.builder.paxLabel}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={numPax}
                    onChange={(e) => handlePaxChange(parseInt(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((p) => (
                      <option key={p} value={p} className="text-slate-900 bg-white font-semibold py-1">
                        {p} {locale === "zh" ? "人" : locale === "en" ? (p === 1 ? "Person" : "Pax") : "Orang"}{" "}
                        {p === 1
                          ? `(${locale === "zh" ? "单人自由行" : "Solo"})`
                          : p === 2
                          ? `(${locale === "zh" ? "双人出行" : "Duo"})`
                          : p <= 5
                          ? `(${locale === "zh" ? "精品私家团" : "Private"})`
                          : `(${locale === "zh" ? "独立团队" : "Group"})`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tanggal Mulai */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.builder.dateLabel}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                />
              </div>

              {/* Durasi Hari */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.builder.durationLabel}
                </label>
                <select
                  value={daysCount}
                  onChange={(e) => handleDaysCountChange(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value={1} className="text-slate-900 bg-white font-semibold py-1">{t.builder.duration1D}</option>
                  <option value={2} className="text-slate-900 bg-white font-semibold py-1">{t.builder.duration2D1N}</option>
                  <option value={3} className="text-slate-900 bg-white font-semibold py-1">{t.builder.duration3D2N}</option>
                  <option value={4} className="text-slate-900 bg-white font-semibold py-1">{t.builder.duration4D3N}</option>
                  <option value={5} className="text-slate-900 bg-white font-semibold py-1">{t.builder.duration5D4N}</option>
                </select>
              </div>
            </div>

            {/* Pickup & Dropoff Point */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.builder.pickupLabel}</span>
                </label>
                <select
                  value={pickupPoint}
                  onChange={(e) => setPickupPoint(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="Surabaya Juanda Airport (SUB)" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "泗水朱安达国际机场 (SUB)"
                      : locale === "en"
                      ? "Surabaya Juanda Airport (SUB)"
                      : "Bandara Juanda Surabaya (SUB)"}
                  </option>
                  <option value="Hotel di Surabaya City" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "泗水市区酒店 / 火车站"
                      : locale === "en"
                      ? "Surabaya City Hotel / Train Station"
                      : "Hotel / Stasiun di Kota Surabaya"}
                  </option>
                  <option value="Malang City / Stasiun Kota Baru" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "玛琅市区酒店 / 玛琅火车站"
                      : locale === "en"
                      ? "Malang City / Kota Baru Train Station"
                      : "Kota Malang / Stasiun Malang"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t.builder.dropoffLabel}</span>
                </label>
                <select
                  value={dropoffPoint}
                  onChange={(e) => setDropoffPoint(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                >
                  <option value="Ketapang Ferry Port (Banyuwangi)" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "外南梦客运码头 (直通巴厘岛)"
                      : locale === "en"
                      ? "Ketapang Ferry Port Banyuwangi (to Bali)"
                      : "Pelabuhan Ketapang Banyuwangi (Arah Bali)"}
                  </option>
                  <option value="Surabaya Juanda Airport (SUB)" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "返回泗水朱安达国际机场 (SUB)"
                      : locale === "en"
                      ? "Return to Surabaya Juanda Airport (SUB)"
                      : "Kembali ke Bandara Juanda Surabaya (SUB)"}
                  </option>
                  <option value="Hotel di Surabaya / Malang" className="text-slate-900 bg-white font-semibold py-1">
                    {locale === "zh"
                      ? "送至泗水或玛琅市内酒店"
                      : locale === "en"
                      ? "Drop hotel in Surabaya / Malang"
                      : "Drop hotel di Surabaya / Malang"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Selection Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.builder.vehicleTitle}</span>
              </h2>
              <span className="text-xs text-slate-500">{t.builder.vehicleNote}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {vehicles.map((v) => {
                const isSelected = selectedVehicleId === v.id;
                const isRecommended = numPax >= v.capacityMin && numPax <= v.capacityMax;

                return (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`rounded-2xl border cursor-pointer transition relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {/* Vehicle Photo */}
                    <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                      {v.imageUrl && (
                        <img
                          src={v.imageUrl}
                          alt={v.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {isRecommended && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white tracking-wide uppercase shadow-sm">
                          {t.builder.recommended}
                        </span>
                      )}
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{v.rating || 4.9}</span>
                        <span className="text-xs text-slate-300">({v.reviewCount || 75})</span>
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <div className="font-bold text-sm text-slate-900">{localizeItem(v.name, locale)}</div>
                      <div className="text-xs text-slate-600">
                        {t.builder.capacity} {v.capacityMin}-{v.capacityMax} Pax
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="font-bold text-emerald-700">
                          {formatPrice(v.ratePerKm)}/km
                        </span>
                        {v.googleMapsUrl && (
                          <a
                            href={v.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            title="Lihat Pool Armada di Google Maps"
                          >
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span>Pool Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotel Selection Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HotelIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{t.builder.hotelTitle}</span>
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {daysCount > 1
                  ? `${daysCount - 1} ${t.builder.hotelNights}`
                  : (locale === "zh" ? "单日游（无需住宿）" : locale === "en" ? "Day Trip (No Hotel)" : "Day Trip (Tanpa Hotel)")}
              </span>
            </div>

            {daysCount <= 1 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {locale === "zh"
                    ? "当日往返行程（1日游）无需酒店住宿。专车由出发点直接接送至各景点并在当天完成送机/送站，酒店费用已自动归零。"
                    : locale === "en"
                    ? "Single-day trips (1-day) do not require hotel accommodations. Driver transports you directly to attractions and drop-off today. Hotel cost is Rp 0."
                    : "Untuk paket 1 hari (day trip), penginapan hotel tidak diperlukan. Armada langsung mengantar dari titik jemput ke objek wisata lalu ke titik dropoff. Biaya hotel otomatis Rp 0."}
                </span>
              </div>
            ) : (
              <>
                <div className="text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 px-3.5 py-2.5 rounded-xl flex items-start sm:items-center gap-2.5 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5 sm:mt-0" />
                  <span>
                    {locale === "zh"
                      ? "智能大本营排程：从接送点出发优先送达酒店办理入住与休整洗漱，再出发展开游览，游览结束后专车返回酒店舒适过夜。"
                      : locale === "en"
                      ? "Intelligent Basecamp Hub: Escorted to hotel to check in, drop luggage & freshen up first before daily excursions, returning for relaxing overnight rest."
                      : "Sistem Basecamp Cerdas: Penjemputan langsung mengantar Anda ke hotel untuk check-in, menaruh koper, & mandi/bersiap terlebih dahulu sebelum tour, serta kembali untuk istirahat malam."}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {hotels.map((h) => {
                    const isSelected = selectedHotelId === h.id;
                    return (
                      <div
                        key={h.id}
                        onClick={() => setSelectedHotelId(h.id)}
                        className={`rounded-2xl border cursor-pointer transition relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        {/* Hotel Photo */}
                        <div className="relative h-28 w-full bg-slate-100 overflow-hidden">
                          {h.imageUrl && (
                            <img
                              src={h.imageUrl}
                              alt={h.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <span className="absolute top-2 left-2 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white/95 px-2 py-0.5 rounded shadow-sm">
                            {h.hotelClass}
                          </span>
                          <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>{h.rating || 4.8}</span>
                            <span className="text-xs text-slate-300">({h.reviewCount || 85})</span>
                          </span>
                        </div>

                        <div className="p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{h.region}</span>
                            {h.googleMapsUrl && (
                              <a
                                href={h.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                title="Buka Lokasi Hotel di Google Maps"
                              >
                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                <span>Lokasi Maps</span>
                              </a>
                            )}
                          </div>
                          <div className="font-bold text-sm text-slate-900 line-clamp-1">{h.name}</div>
                          <div className="text-xs font-bold text-emerald-700 pt-1 border-t border-slate-100">
                            {formatPrice(h.pricePerRoomPerNight)} {locale === "zh" ? "/间/晚" : locale === "en" ? "/room/night" : "/kamar/mlm"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Step 3: Tour Guide Selection Option (Dengan / Tanpa Guide) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <span>{t.builder.guideOptionTitle}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {includeGuide ? t.builder.withGuideTitle : t.builder.withoutGuideTitle}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t.builder.guideOptionSub}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Option A: With Company Tour Guide */}
              <div
                onClick={() => setIncludeGuide(true)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3.5 transition ${
                  includeGuide
                    ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 text-indigo-950 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    includeGuide ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {includeGuide && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">
                      {t.builder.withGuideTitle}
                    </span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                      {t.builder.recommendedBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.builder.withGuideDesc}
                  </p>
                  <div className="text-xs font-extrabold text-indigo-700 pt-1">
                    +{formatPrice(guideRatePerDay)} / {locale === "zh" ? "天" : locale === "en" ? "day" : "hari"}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      ({daysCount} {locale === "zh" ? "天总计" : locale === "en" ? "days total" : "hari"} = {formatPrice(guideRatePerDay * daysCount)})
                    </span>
                  </div>
                </div>
              </div>

              {/* Option B: Without Tour Guide (Self-guided / Driver Only) */}
              <div
                onClick={() => setIncludeGuide(false)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3.5 transition ${
                  !includeGuide
                    ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 text-emerald-950 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    !includeGuide ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {!includeGuide && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900">
                      {t.builder.withoutGuideTitle}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      {t.builder.noGuidePrice}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.builder.withoutGuideDesc}
                  </p>
                  <div className="text-xs font-extrabold text-emerald-700 pt-1">
                    {t.builder.noGuidePrice}
                    <span className="text-xs font-normal text-slate-500 ml-1">
                      ({locale === "zh" ? "无需支付导游费" : locale === "en" ? "No guide fee charged" : "Bebas biaya guide"})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day-by-Day Scheduler Tabs & Items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Days tab header */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto">
              {days.map((d, idx) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition flex items-center gap-1.5 ${
                    activeDayIndex === idx
                      ? "border-emerald-600 text-emerald-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>{t.builder.dayPrefix} {d.dayNumber} {locale === "zh" ? "天" : ""}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold">
                    {d.destinationIds.length + d.activityIds.length} POI
                  </span>
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="p-5 space-y-6">
              {(() => {
                const currentDay = days[activeDayIndex] || {
                  dayNumber: activeDayIndex + 1,
                  title: `Day ${activeDayIndex + 1}: East Java Exploration`,
                  destinationIds: [],
                  activityIds: [],
                  mealIds: [],
                };

                return (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex-1">
                        <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                          {t.builder.dayThemeLabel} ({t.builder.dayPrefix} {currentDay.dayNumber})
                        </label>
                        <input
                          type="text"
                          value={currentDay.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDays((prev) =>
                              prev.map((day, idx) =>
                                idx === activeDayIndex ? { ...day, title: val } : day
                              )
                            );
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
                        />
                      </div>

                      {/* Clear Button */}
                      {(currentDay.destinationIds.length > 0 || currentDay.activityIds.length > 0 || currentDay.mealIds.length > 0) && (
                        <button
                          type="button"
                          onClick={() => {
                            setDays((prev) =>
                              prev.map((day, idx) =>
                                idx === activeDayIndex
                                  ? { ...day, destinationIds: [], activityIds: [], mealIds: [] }
                                  : day
                              )
                            );
                          }}
                          className="self-end sm:self-auto text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
                        >
                          {t.builder.resetDayBtn}
                        </button>
                      )}
                    </div>

                    {/* Destinasi Checklist for this day */}
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>{t.builder.chooseDestinations} ({t.builder.dayPrefix} {currentDay.dayNumber}):</span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            {currentDay.destinationIds.length} {t.builder.selectedCount}
                          </span>
                        </h3>
                        <span className="text-xs font-normal text-slate-500">
                          {t.builder.clickToToggle}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {destinations.map((dest) => {
                          const isAdded = currentDay.destinationIds.includes(dest.id);
                          return (
                            <div
                              key={dest.id}
                              onClick={() => toggleDestinationInDay(activeDayIndex, dest.id)}
                              className={`p-3.5 rounded-2xl border text-xs sm:text-sm text-left cursor-pointer flex items-center justify-between gap-3 transition ${
                                isAdded
                                  ? "border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-500/20"
                                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Destination Photo Thumbnail */}
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                                  {dest.imageUrl ? (
                                    <img
                                      src={dest.imageUrl}
                                      alt={dest.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <MapPin className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <div className="font-bold text-sm text-slate-900 truncate">
                                    {localizeItem(dest.name, locale)}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                    <span>{dest.region}</span>
                                    <span>•</span>
                                    <span className="font-semibold text-emerald-700">
                                      {dest.ticketPrice > 0 ? formatPrice(dest.ticketPrice) : t.builder.ticketFree}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-amber-700 font-bold flex items-center gap-0.5">
                                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                      <span>{dest.rating || 4.9}</span>
                                      <span className="text-slate-400 font-normal">({dest.reviewCount || 120})</span>
                                    </span>
                                    {dest.googleMapsUrl && (
                                      <a
                                        href={dest.googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5"
                                        title="Buka Lokasi Google Maps"
                                      >
                                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                        <span>Maps</span>
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ml-1 transition ${
                                  isAdded
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "border border-slate-300 bg-slate-50"
                                }`}
                              >
                                {isAdded && <Check className="w-4 h-4 stroke-[3]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Optional Activities for this day */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>{t.builder.activitiesTitle}</span>
                          <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                            {currentDay.activityIds.length} {t.builder.selectedCount}
                          </span>
                        </h3>
                        <span className="text-xs text-slate-500">{t.builder.activitiesSub}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activities.map((act) => {
                          const isAdded = currentDay.activityIds.includes(act.id);
                          return (
                            <button
                              type="button"
                              key={act.id}
                              onClick={() => toggleActivityInDay(activeDayIndex, act.id)}
                              className={`p-3 rounded-xl border text-xs sm:text-sm text-left cursor-pointer flex items-center justify-between transition ${
                                isAdded
                                  ? "border-teal-600 bg-teal-50/80 text-teal-950 font-semibold ring-2 ring-teal-500/20"
                                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-sm text-slate-900">{localizeItem(act.name, locale)}</div>
                                <div className="text-xs text-teal-700 font-medium mt-0.5">
                                  +{formatPrice(act.ticketPrice)} {t.builder.perPerson}
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 transition ${
                                  isAdded
                                    ? "bg-teal-600 text-white"
                                    : "border border-slate-300 bg-slate-50"
                                }`}
                              >
                                {isAdded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Meal Add-ons */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>{t.builder.mealsTitle}</span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                            {currentDay.mealIds.length} {t.builder.selectedCount}
                          </span>
                        </h3>
                        <span className="text-xs text-slate-500">{t.builder.mealsSub}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {meals.map((meal) => {
                          const isAdded = currentDay.mealIds.includes(meal.id);
                          return (
                            <button
                              type="button"
                              key={meal.id}
                              onClick={() => toggleMealInDay(activeDayIndex, meal.id)}
                              className={`p-3 rounded-xl border text-xs sm:text-sm text-left cursor-pointer flex items-center justify-between transition ${
                                isAdded
                                  ? "border-amber-600 bg-amber-50/80 text-amber-950 font-semibold ring-2 ring-amber-500/20"
                                  : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                              }`}
                            >
                              <div>
                                <div className="font-semibold text-sm text-slate-900">{localizeItem(meal.name, locale)}</div>
                                <div className="text-xs text-amber-700 font-medium mt-0.5">
                                  +{formatPrice(meal.pricePerPax)} {t.builder.perPerson}
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ml-2 transition ${
                                  isAdded
                                    ? "bg-amber-600 text-white"
                                    : "border border-slate-300 bg-slate-50"
                                }`}
                              >
                                {isAdded && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Sticky Sidebar: Real-Time Pricing Summary (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>{t.builder.pricingTitle}</span>
              </h2>
              {isCalculating ? (
                <span className="text-xs text-emerald-600 animate-pulse font-semibold">
                  {t.builder.calculating}
                </span>
              ) : (
                <span className="text-xs text-slate-400">{t.builder.formulaLabel}</span>
              )}
            </div>

            {/* Price Itemized List */}
            {pricing ? (
              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{t.builder.distanceLabel}</span>
                  <span className="font-semibold text-slate-900">{pricing.distanceKm} km</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.builder.transportLabel} ({pricing.distanceKm} km):</span>
                  <span className="font-semibold text-slate-900">{formatPrice(pricing.transportCost)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.builder.hotelLabel} ({daysCount > 1 ? `${daysCount - 1} ${locale === "zh" ? "晚" : "nights"}` : (locale === "zh" ? "单日" : "Day trip")}):</span>
                  <span className="font-semibold text-slate-900">
                    {pricing.hotelCost > 0 ? formatPrice(pricing.hotelCost) : t.builder.noHotel}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t.builder.ticketsLabel} ({numPax} pax):</span>
                  <span className={`font-semibold ${pricing.ticketsCost > 0 ? "text-slate-900" : "text-slate-400"}`}>
                    {pricing.ticketsCost > 0 ? formatPrice(pricing.ticketsCost) : t.builder.freeOrIncluded}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t.builder.mealsLabel} ({numPax} pax):</span>
                  <span className={`font-semibold ${pricing.mealsCost > 0 ? "text-slate-900" : "text-slate-400"}`}>
                    {pricing.mealsCost > 0 ? formatPrice(pricing.mealsCost) : t.builder.mealsNone}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t.builder.guideLabel} ({daysCount} {locale === "zh" ? "天" : locale === "en" ? "days" : "hari"}):</span>
                  <span className={`font-semibold ${pricing.guideCost > 0 ? "text-slate-900" : "text-emerald-700"}`}>
                    {pricing.guideCost > 0 ? formatPrice(pricing.guideCost) : t.builder.withoutGuideSummary}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-500 text-xs">
                  <span>{t.builder.subtotalLabel}</span>
                  <span>{formatPrice(pricing.subtotal)}</span>
                </div>

                <div className="flex justify-between text-emerald-700 text-xs sm:text-sm font-medium">
                  <span>{t.builder.platformFeeLabel || t.builder.marginLabel}:</span>
                  <span>+{formatPrice(pricing.platformFeeAmount || pricing.marginAmount)}</span>
                </div>

                {/* Total Highlight */}
                <div className="pt-3 border-t-2 border-slate-200 mt-2">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900">{t.builder.totalLabel}</span>
                    <span className="text-2xl font-extrabold text-emerald-600">
                      {formatPrice(pricing.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500">
                    <span>{t.builder.perPersonLabel} ({numPax} Pax):</span>
                    <span className="font-bold text-slate-800">{formatPrice(pricing.pricePerPax)}</span>
                  </div>

                  {/* Multi-currency display helper (PRD §8) */}
                  <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-400">
                    <span>{t.builder.foreignCurrencyEstimate}</span>
                    <span className="font-medium text-slate-600">
                      {formatUSD(pricing.pricePerPax)} / {formatCNY(pricing.pricePerPax)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                {locale === "zh"
                  ? "选择目的地以查看实时费用明细。"
                  : locale === "en"
                  ? "Select destinations to view real-time price calculation."
                  : "Pilih destinasi untuk melihat estimasi rincian biaya."}
              </div>
            )}

            {/* Refund & Payment Guarantee */}
            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 space-y-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.builder.refundBadgeTitle}</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                {t.builder.refundBadgeDesc}
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                onClick={handleSaveItinerary}
                disabled={isSavingDraft || isSubmitting || !pricing}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border-2 border-emerald-500/70 hover:border-emerald-600 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-xs"
              >
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>
                  {isSavingDraft
                    ? locale === "zh"
                      ? "正在保存行程方案..."
                      : locale === "en"
                      ? "Saving Itinerary..."
                      : "Menyimpan Itinerary..."
                    : locale === "zh"
                    ? "💾 保存行程方案 (稍后查看/编辑)"
                    : locale === "en"
                    ? "💾 Save Itinerary to My List"
                    : "💾 Simpan Itinerary (Draft Saya)"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={isSubmitting || isSavingDraft || !pricing}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{t.builder.processingTrip}</span>
                ) : (
                  <>
                    <span>{t.builder.checkoutBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Price & Checkout Bar (docked directly above BottomNav) */}
      <div className="md:hidden fixed bottom-above-nav left-0 right-0 z-40 bg-slate-950/98 backdrop-blur-md border-t border-slate-800 px-4 py-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.35)] flex items-center justify-between gap-3 w-full max-w-full">
        <div className="min-w-0 flex-1">
          <div className="text-xs text-slate-300 truncate flex items-center gap-1.5 font-medium">
            <span>{daysCount} {locale === "zh" ? "天" : locale === "en" ? "Days" : "Hari"}</span>
            <span>•</span>
            <span>{numPax} Pax</span>
          </div>
          <div className="text-base sm:text-lg font-black text-emerald-400 tracking-tight leading-tight mt-0.5">
            {pricing ? formatPrice(pricing.totalAmount) : "..."}
            {pricing && (
              <span className="text-xs font-normal text-slate-400 ml-1">
                ({formatPrice(pricing.pricePerPax)}/pax)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveItinerary}
            disabled={isSavingDraft || isSubmitting || !pricing}
            className="p-2.5 rounded-xl text-slate-200 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 transition disabled:opacity-50 touch-manipulation"
            title="Simpan Draft"
          >
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={isSubmitting || isSavingDraft || !pricing}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 transition flex items-center gap-1.5 shadow-md disabled:opacity-50 touch-manipulation"
          >
            {isSubmitting ? (
              <span>...</span>
            ) : (
              <>
                <span>{t.builder.checkoutBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal: Save Itinerary Success */}
      {showSaveSuccessModal && savedTripData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {locale === "zh"
                    ? "行程方案保存成功！"
                    : locale === "en"
                    ? "Itinerary Saved Successfully!"
                    : "Itinerary Berhasil Disimpan!"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSaveSuccessModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm">
              <div className="font-bold text-slate-900">{savedTripData.title}</div>
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>
                  {daysCount} {locale === "zh" ? "天" : locale === "en" ? "Days" : "Hari"} • {numPax} Pax
                </span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {formatPrice(savedTripData.totalAmount)}
                </span>
              </div>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-200 leading-relaxed">
                {locale === "zh"
                  ? "该行程方案已妥善收录至您的行程列表。您可以随时查看、继续编辑或直接结算预订。"
                  : locale === "en"
                  ? "This customized itinerary is safely preserved in your list. You can view, edit, or proceed to checkout anytime."
                  : "Rancangan itinerary ini telah tersimpan rapi di daftar itinerary Anda. Anda dapat membukanya kembali kapan saja atau langsung checkout."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                type="button"
                onClick={() => router.push("/itineraries")}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4 text-emerald-600" />
                <span>
                  {locale === "zh"
                    ? "查看我的行程列表"
                    : locale === "en"
                    ? "View My Saved Itineraries"
                    : "Lihat Daftar Itinerary Saya"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => router.push(`/checkout?trip_id=${savedTripData.id}`)}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2"
              >
                <span>
                  {locale === "zh"
                    ? "前往结算 / 立即预订"
                    : locale === "en"
                    ? "Proceed to Checkout Now"
                    : "Lanjut ke Checkout Sekarang"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowSaveSuccessModal(false)}
                className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                {locale === "zh" ? "继续编辑当前行程" : locale === "en" ? "Keep Editing Trip" : "Lanjut Merancang"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItineraryBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading Itinerary ID Builder...</p>
          </div>
        </div>
      }
    >
      <ItineraryBuilderContent />
    </Suspense>
  );
}

