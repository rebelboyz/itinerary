"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  AlertCircle,
  Clock,
  Car,
  MapPin,
  Star,
  ExternalLink,
  ChevronDown,
  Navigation,
  Hotel as HotelIcon,
  Bed,
  Sparkles,
} from "lucide-react";
import { formatIDR, formatUSD, formatCNY } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { localizeItem } from "@/i18n/translations";
import {
  haversineDistanceKm,
  resolveLocationCoordinates,
  formatDriveTime,
  buildGoogleMapsDirectionUrl,
} from "@/lib/distance";

function getRoadDescription(
  fromName: string,
  toName: string,
  distKm: number,
  locale: string = "id"
): string {
  const f = (fromName || "").toLowerCase();
  const t = (toName || "").toLowerCase();

  // Hotel Check-in / Arrival transfer
  if (
    (f.includes("surabaya") || f.includes("juanda") || f.includes("airport") || f.includes("stasiun")) &&
    (t.includes("hotel") || t.includes("resort") || t.includes("lodge") || t.includes("jiwa") || t.includes("santika") || t.includes("ketapang indah") || t.includes("dialoog") || t.includes("harvest"))
  ) {
    return locale === "zh"
      ? "接机后经由主干道前往酒店办理入住与休整洗漱"
      : locale === "en"
      ? "Direct transfer from pickup location to hotel for check-in & freshening up"
      : "Transfer langsung dari titik jemput ke hotel untuk check-in & mandi";
  }

  // Return to Hotel
  if (
    t.includes("hotel") ||
    t.includes("resort") ||
    t.includes("lodge") ||
    t.includes("jiwa") ||
    t.includes("santika") ||
    t.includes("ketapang indah") ||
    t.includes("dialoog") ||
    t.includes("harvest")
  ) {
    return locale === "zh"
      ? "游览圆满结束，乘专车返回酒店梳洗沐浴与晚间休息"
      : locale === "en"
      ? "Return journey back to hotel basecamp to shower, relax, and dine"
      : "Perjalanan kembali ke hotel untuk mandi, santai, dan istirahat";
  }

  // Depart from Hotel
  if (
    f.includes("hotel") ||
    f.includes("resort") ||
    f.includes("lodge") ||
    f.includes("jiwa") ||
    f.includes("santika") ||
    f.includes("ketapang indah") ||
    f.includes("dialoog") ||
    f.includes("harvest")
  ) {
    return locale === "zh"
      ? "由酒店大堂专车启程前往今日游览景区"
      : locale === "en"
      ? "Departing directly from hotel lobby towards tour destination"
      : "Berangkat dari lobi hotel menuju lokasi wisata";
  }

  if ((f.includes("surabaya") || f.includes("juanda")) && t.includes("bromo")) {
    return locale === "zh"
      ? "经由泗水-巴西鲁安高速（Tol Paspro）直达苏卡普拉婆罗摩山麓"
      : locale === "en"
      ? "Via Surabaya-Pasuruan Highway & Sukapura Bromo ascent"
      : "Tol Surabaya-Pasuruan lanjut rute perbukitan Sukapura Bromo";
  }
  if (f.includes("bromo") && t.includes("madakaripura")) {
    return locale === "zh"
      ? "由苏卡普拉沿盘山峡谷公路直达马达卡里普拉瀑布"
      : locale === "en"
      ? "Sukapura valley descent to Madakaripura gorge"
      : "Turun lereng Sukapura menuju lembah air terjun Madakaripura";
  }
  if (
    (f.includes("bromo") || f.includes("madakaripura") || f.includes("probolinggo")) &&
    (t.includes("ijen") || t.includes("banyuwangi"))
  ) {
    return locale === "zh"
      ? "沿北部海岸主干线（Pantura）穿越锡图博多直抵宜珍山脚"
      : locale === "en"
      ? "Scenic North Coast (Pantura) highway to Ijen foothills"
      : "Jalur Lintas Pantura Probolinggo - Situbondo ke kaki Gunung Ijen";
  }
  if (f.includes("ijen") && (t.includes("ketapang") || t.includes("bali"))) {
    return locale === "zh"
      ? "由帕尔图丁基地沿格拉加公路下山直抵外南梦轮渡码头"
      : locale === "en"
      ? "Paltuding mountain descent via Glagah to Ketapang Ferry Terminal"
      : "Turun dari Paltuding via Glagah langsung ke Pelabuhan Ketapang";
  }
  if (t.includes("tumpak")) {
    return locale === "zh"
      ? "经由玛琅南部丘陵全景大道前往卢马江赛武瀑布"
      : locale === "en"
      ? "Southern Malang scenic highlands to Pronojiwo Lumajang"
      : "Jalur panorama perbukitan Malang Selatan - Pronojiwo Lumajang";
  }
  if (t.includes("baluran")) {
    return locale === "zh"
      ? "沿海岸公路驶入巴鲁兰热带稀树草原国家公园"
      : locale === "en"
      ? "Coastal road directly into Baluran Savanna National Park"
      : "Jalur pesisir utara Situbondo menuju Savana Baluran";
  }
  if (t.includes("batu") || t.includes("malang")) {
    return locale === "zh"
      ? "经由潘达安-玛琅高速公路驶往巴图高原避暑胜地"
      : locale === "en"
      ? "Pandaan-Malang Expressway to Batu Highland tourism zone"
      : "Tol Pandaan-Malang menuju kawasan wisata dataran tinggi Batu";
  }
  if (t.includes("surabaya") || t.includes("juanda")) {
    return locale === "zh"
      ? "驶入跨爪哇高速公路或省际快速干道返回泗水"
      : locale === "en"
      ? "Trans-Java Expressway / provincial arterial highway return to Surabaya"
      : "Jalur Tol Trans-Jawa / jalan arteri provinsi kembali ke Surabaya";
  }
  return distKm > 70
    ? locale === "zh"
      ? "跨省主干道与风景名胜区联络线"
      : locale === "en"
      ? "Intercity arterial road & scenic connection route"
      : "Jalur lintas provinsi dan penghubung destinasi"
    : locale === "zh"
    ? "区域旅游公路与风景区道路"
    : locale === "en"
    ? "Local scenic tourism corridor"
    : "Jalur wisata panorama lokal";
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale, formatPrice } = useI18n();
  const bookingIdParam = searchParams.get("booking_id");
  const tripIdParam = searchParams.get("trip_id");

  const [booking, setBooking] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Customer form fields
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCountry, setCustomerCountry] = useState("Indonesia");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isContactFilled = Boolean(
    customerName.trim().length >= 2 &&
    customerEmail.trim().includes("@") &&
    customerPhone.trim().length >= 5
  );

  useEffect(() => {
    async function fetchTripAndBooking() {
      try {
        if (bookingIdParam) {
          const res = await fetch(`/api/bookings?id=${bookingIdParam}`);
          const data = await res.json();
          const found = data.bookings?.[0];
          if (found) {
            setBooking(found);
            setTrip(found.trip);
            if (found.user) {
              setCustomerName(found.user.name || "");
              setCustomerEmail(found.user.email || "");
              setCustomerPhone(found.user.phone || "");
            }
          }
        } else if (tripIdParam) {
          const res = await fetch(`/api/trips?id=${tripIdParam}`);
          const data = await res.json();
          const found = data.trips?.[0];
          if (found) {
            setTrip(found);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTripAndBooking();
  }, [bookingIdParam, tripIdParam]);

  const activeTrip = trip || booking?.trip;
  const totalAmount = activeTrip?.totalAmount || 0;

  // Calculate sequential point-to-point legs with Hotel as the operational Hub:
  // Day 1: Pickup -> Hotel Check-in & Refresh -> Day 1 Dests -> Return to Hotel for Night Rest
  // Day 2..N-1: Depart Hotel -> Day Dests -> Return to Hotel to shower & rest
  // Day N: Checkout Hotel -> On-the-way Dests -> Dropoff Point
  // Must be called unconditionally before any early returns to respect Rules of Hooks
  const journeySchedule = React.useMemo(() => {
    if (!activeTrip) return null;

    const pickupPointName = activeTrip.pickupPoint || "Surabaya Juanda Airport";
    const dropoffPointName = activeTrip.dropoffPoint || pickupPointName;

    const pickupCoords = resolveLocationCoordinates(
      pickupPointName,
      activeTrip.pickupLat,
      activeTrip.pickupLng
    );
    const dropoffCoords = resolveLocationCoordinates(
      dropoffPointName,
      activeTrip.dropoffLat,
      activeTrip.dropoffLng
    );

    const hotel = activeTrip.hotel;
    const hotelCoords = hotel
      ? resolveLocationCoordinates(hotel.name, hotel.lat, hotel.lng)
      : null;

    let currentPoint = {
      name: pickupPointName,
      coords: pickupCoords,
    };

    let accumulatedDistanceKm = 0;
    const totalDaysCount = (activeTrip.days || []).length || 1;

    const days = (activeTrip.days || []).map((day: any, dIdx: number) => {
      const isFirstDay = dIdx === 0;
      const isLastDay = dIdx === totalDaysCount - 1;
      const items = day.items || [];
      const events: any[] = [];

      // --- HARI 1: TRANSFER PICKUP KE HOTEL UNTUK CHECK-IN & BERSIAP-SIAP ---
      if (isFirstDay && hotel && hotelCoords) {
        const checkinDist = haversineDistanceKm(currentPoint.coords, hotelCoords);
        const checkinDur = formatDriveTime(checkinDist, locale);
        const checkinDirUrl = buildGoogleMapsDirectionUrl(currentPoint.coords, hotelCoords);
        const checkinRoad = getRoadDescription(currentPoint.name, hotel.name, checkinDist, locale);

        events.push({
          type: "hotel_checkin",
          fromName: currentPoint.name,
          toName: hotel.name,
          legDistanceKm: checkinDist,
          legDuration: checkinDur,
          directionUrl: checkinDirUrl,
          roadNote: checkinRoad,
          hotel,
        });

        accumulatedDistanceKm += checkinDist;
        currentPoint = {
          name: hotel.name,
          coords: hotelCoords,
        };
      }

      // --- DESTINASI HARIAN ---
      items.forEach((item: any, itIdx: number) => {
        const dest = item.destination;
        const rawName = dest?.name || item.activity?.name || item.note || "Destinasi Terjadwal";
        const destCoords = resolveLocationCoordinates(rawName, dest?.lat, dest?.lng);

        const legDist = haversineDistanceKm(currentPoint.coords, destCoords);
        const legDur = formatDriveTime(legDist, locale);
        const dirUrl = buildGoogleMapsDirectionUrl(currentPoint.coords, destCoords);
        const roadNote = getRoadDescription(currentPoint.name, rawName, legDist, locale);

        events.push({
          type: "destination",
          item,
          dest,
          rawName,
          fromName: currentPoint.name,
          toName: rawName,
          legDistanceKm: legDist,
          legDuration: legDur,
          roadNote,
          directionUrl: dirUrl,
        });

        accumulatedDistanceKm += legDist;
        currentPoint = {
          name: rawName,
          coords: destCoords,
        };
      });

      // --- RETURN KE HOTEL (HARI 1 ATAU HARI PERTENGAHAN SETELAH TOUR) ---
      if (!isLastDay && hotel && hotelCoords && items.length > 0) {
        const returnDist = haversineDistanceKm(currentPoint.coords, hotelCoords);
        const returnDur = formatDriveTime(returnDist, locale);
        const returnDirUrl = buildGoogleMapsDirectionUrl(currentPoint.coords, hotelCoords);
        const returnRoad = getRoadDescription(currentPoint.name, hotel.name, returnDist, locale);

        events.push({
          type: "hotel_return",
          fromName: currentPoint.name,
          toName: hotel.name,
          legDistanceKm: returnDist,
          legDuration: returnDur,
          directionUrl: returnDirUrl,
          roadNote: returnRoad,
          hotel,
          isNightRest: isFirstDay,
        });

        accumulatedDistanceKm += returnDist;
        currentPoint = {
          name: hotel.name,
          coords: hotelCoords,
        };
      }

      // --- CHECKOUT HOTEL DI HARI TERAKHIR ---
      if (isLastDay && hotel && hotelCoords) {
        events.push({
          type: "hotel_checkout",
          hotel,
        });
      }

      return {
        ...day,
        events,
      };
    });

    // Final Leg: From the last visited destination (or hotel) to Drop-off point
    const finalLegDistanceKm = haversineDistanceKm(currentPoint.coords, dropoffCoords);
    const finalLegDuration = formatDriveTime(finalLegDistanceKm, locale);
    const finalDirectionUrl = buildGoogleMapsDirectionUrl(currentPoint.coords, dropoffCoords);
    const finalRoadNote = getRoadDescription(
      currentPoint.name,
      dropoffPointName,
      finalLegDistanceKm,
      locale
    );
    accumulatedDistanceKm += finalLegDistanceKm;

    return {
      pickup: {
        name: pickupPointName,
        coords: pickupCoords,
      },
      hotel,
      days,
      finalLeg: {
        fromName: currentPoint.name,
        toName: dropoffPointName,
        legDistanceKm: finalLegDistanceKm,
        legDuration: finalLegDuration,
        roadNote: finalRoadNote,
        directionUrl: finalDirectionUrl,
      },
      dropoff: {
        name: dropoffPointName,
        coords: dropoffCoords,
      },
      totalCalculatedDistanceKm: Math.round(accumulatedDistanceKm * 10) / 10,
    };
  }, [activeTrip, locale]);

  const handlePayNow = async () => {
    if (!customerName || !customerEmail) {
      setErrorMsg(
        locale === "zh"
          ? "请填写您的姓名与邮箱，以便接收行程确认单与电子凭证。"
          : locale === "en"
          ? "Please fill in your name and email to receive your travel voucher."
          : "Mohon isi nama dan email untuk pengiriman voucher itinerary."
      );
      return;
    }

    setErrorMsg("");
    setIsProcessingPayment(true);

    try {
      let targetBookingId = booking?.id;

      // If no booking yet, create one
      if (!targetBookingId && trip?.id) {
        const createRes = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripId: trip.id,
            customerName,
            customerEmail,
            customerPhone,
          }),
        });
        const createData = await createRes.json();
        if (createData.booking?.id) {
          targetBookingId = createData.booking.id;
        }
      }

      if (!targetBookingId) {
        throw new Error("Gagal menginisialisasi pesanan.");
      }

      // Call checkout API to get Snap token
      const checkoutRes = await fetch(`/api/bookings/${targetBookingId}/checkout`, {
        method: "POST",
      });
      const checkoutData = await checkoutRes.json();

      if (!checkoutData.success) {
        throw new Error(checkoutData.error || "Gagal membuat transaksi pembayaran");
      }

      // Check if mock / local simulation
      if (checkoutData.isMock || !(window as any).snap) {
        // Mock payment webhook simulation to set status paid
        await fetch("/api/midtrans/notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: checkoutData.orderId,
            status_code: "200",
            gross_amount: String(trip?.totalAmount || booking?.totalAmount || 0),
            transaction_status: "settlement",
            payment_type: "credit_card",
            transaction_id: `mock-tx-${Date.now()}`,
          }),
        });

        // Redirect to success
        router.push(`/booking/success?booking_id=${targetBookingId}&status=confirmed`);
        return;
      }

      // Live Snap popup
      (window as any).snap.pay(checkoutData.token, {
        onSuccess: function () {
          router.push(`/booking/success?booking_id=${targetBookingId}&status=confirmed`);
        },
        onPending: function () {
          router.push(`/booking/success?booking_id=${targetBookingId}&status=pending`);
        },
        onError: function () {
          setErrorMsg("Pembayaran gagal. Silakan coba kembali.");
          setIsProcessingPayment(false);
        },
        onClose: function () {
          setIsProcessingPayment(false);
        },
      });
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses pembayaran.");
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <Compass className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <h2 className="text-sm font-bold text-slate-800">
          {locale === "zh"
            ? "正在加载订单详情..."
            : locale === "en"
            ? "Loading Order Details..."
            : "Memuat Detail Pesanan..."}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.checkout.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t.checkout.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Detailed Journey Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>{t.checkout.contactDetailsTitle}</span>
              </h2>
              {isContactFilled && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locale === "zh" ? "信息已填写" : locale === "en" ? "Contact Info Complete" : "Data Lengkap ✓"}</span>
                </span>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={locale === "zh" ? "例如：张伟" : "e.g. John Doe"}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.checkout.email}
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+86 138 0000 0000 / +62 812..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkout.country}
                  </label>
                  <input
                    type="text"
                    value={customerCountry}
                    onChange={(e) => setCustomerCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Dynamic Trip Journey & Travel Time Breakdown */}
          {activeTrip && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {locale === "zh"
                      ? "详细行程路线与分段耗时预估"
                      : locale === "en"
                      ? "Detailed Route Schedule & Travel Estimates"
                      : "Rincian Rute Perjalanan & Estimasi Waktu Tempuh"}
                  </h3>
                </div>
                {isContactFilled && (
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span>
                      {journeySchedule?.totalCalculatedDistanceKm || activeTrip.totalDistanceKm || 0} km total (
                      {journeySchedule?.hotel
                        ? locale === "zh"
                          ? "大本营智能排程"
                          : locale === "en"
                          ? "Hotel Basecamp Circuit"
                          : "Rute Hotel Basecamp"
                        : locale === "zh"
                        ? "顺路行程"
                        : locale === "en"
                        ? "Sequential Route"
                        : "Rute Berurutan"}
                      )
                    </span>
                  </span>
                )}
              </div>

              {!isContactFilled ? (
                // Prompt to fill contact data first
                <div className="bg-emerald-50/70 rounded-xl border border-dashed border-emerald-300 p-5 text-center space-y-2">
                  <Compass className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="font-bold text-xs text-slate-900">
                    {locale === "zh"
                      ? "填写上方联系人信息后自动展开行程详情"
                      : locale === "en"
                      ? "Complete Contact Information to Unlock Itinerary Breakdown"
                      : "Rincian Estimasi Perjalanan Akan Terbuka Otomatis"}
                  </h4>
                  <p className="text-[11px] text-slate-600 max-w-md mx-auto leading-relaxed">
                    {locale === "zh"
                      ? "请在上方的表格中填写您的姓名、邮箱与电话号码，系统将立即计算从出发接人点按序前往各景点直至终点送达的逐段行车距离、耗时与实景导航。"
                      : locale === "en"
                      ? "Please enter your full name, email, and contact number above. The system will calculate sequential leg-by-leg travel distances, drive times, and navigation routes."
                      : "Silakan isi nama, email, dan no. WhatsApp di atas. Rincian rute berurutan (Jemput → Lokasi 1 → Lokasi 2 → Drop-off) beserta jarak, durasi, dan peta rute akan langsung terbuka."}
                  </p>
                </div>
              ) : (
                // Full Leg-by-leg Sequential Journey Breakdown
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Start Point: Pickup */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                          A
                        </span>
                        <strong className="text-slate-900">
                          {locale === "zh" ? "出发地 / 接机接人地点" : locale === "en" ? "Departure / Pickup Point" : "Titik Penjemputan (Pickup)"}
                        </strong>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {locale === "zh" ? "起点" : "Start Point"}
                      </span>
                    </div>
                    <div className="pl-7">
                      <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{journeySchedule?.pickup.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {locale === "zh"
                          ? `专车司机将驾驶 ${activeTrip.vehicleType?.name || "舒适商务车"}，持标有“${customerName}”的接机牌在约定时间迎候。`
                          : locale === "en"
                          ? `Private tourism driver with ${activeTrip.vehicleType?.name || "private vehicle"} will welcome you with a pickup sign for "${customerName}".`
                          : `Driver dan armada ${activeTrip.vehicleType?.name || "kendaraan private"} siap menjemput Anda tepat waktu dengan nameboard "${customerName}".`}
                      </p>
                    </div>
                  </div>

                  {/* Day-by-Day Destinations & Hotel Basecamp Milestones */}
                  {(journeySchedule?.days || []).map((day: any, dIdx: number) => {
                    const events = day.events || [];
                    return (
                      <div key={day.id || dIdx} className="space-y-3 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {locale === "zh" ? `第 ${day.dayNumber} 天日程` : locale === "en" ? `Day ${day.dayNumber} Schedule` : `Hari ke-${day.dayNumber}`}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{day.title}</span>
                        </div>

                        <div className="space-y-3 pl-2">
                          {events.map((ev: any, evIdx: number) => {
                            // 1. HOTEL CHECK-IN & REFRESH
                            if (ev.type === "hotel_checkin") {
                              return (
                                <div key={`checkin-${evIdx}`} className="space-y-2">
                                  {/* Connecting Drive to Hotel */}
                                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                        <Car className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0 text-[11px]">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800 flex-wrap">
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "从" : locale === "en" ? "From" : "Dari"}</span>
                                          <span className="truncate max-w-[130px] text-slate-900 font-extrabold">{ev.fromName}</span>
                                          <ArrowRight className="w-3 h-3 text-indigo-600 shrink-0" />
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "前往酒店入住" : locale === "en" ? "To Hotel Basecamp" : "Ke Hotel Check-in"}</span>
                                          <span className="truncate max-w-[160px] text-indigo-900 font-extrabold">{ev.toName}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ev.roadNote}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                      <span className="inline-block text-[10px] font-extrabold text-indigo-800 bg-white px-2 py-0.5 rounded shadow-xs border border-indigo-200">
                                        {ev.legDistanceKm} km • {ev.legDuration}
                                      </span>
                                      <a
                                        href={ev.directionUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 transition shrink-0"
                                      >
                                        <span>{locale === "zh" ? "路线导航" : locale === "en" ? "Directions" : "Peta Rute"}</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* Hotel Check-in Milestone Card */}
                                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2 shadow-xs ml-2 sm:ml-4">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2.5 min-w-0">
                                        {ev.hotel?.imageUrl ? (
                                          <img
                                            src={ev.hotel.imageUrl}
                                            alt={ev.hotel.name}
                                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                                          />
                                        ) : (
                                          <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                            <HotelIcon className="w-5 h-5" />
                                          </div>
                                        )}
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="font-extrabold text-xs text-indigo-950 truncate">{ev.hotel?.name}</span>
                                            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                                              {locale === "zh" ? "办理入住 & 休整" : locale === "en" ? "Check-in & Refresh" : "Check-in & Mandi/Istirahat"}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                            {locale === "zh"
                                              ? "专车送抵酒店，办理入住并将大件行李存入房间。您可先沐浴更衣、稍作休整，随后再精力充沛地开启接下来的行程。"
                                              : locale === "en"
                                              ? "Transfer to hotel for room check-in and luggage drop. Freshen up with a shower and relax before departing for excursions."
                                              : "Tamu tiba di hotel untuk check-in dan menaruh koper di kamar. Anda dapat mandi, bersiap-siap santai, dan beristirahat sebelum lanjut ke tour berikutnya."}
                                          </p>
                                        </div>
                                      </div>

                                      {ev.hotel?.googleMapsUrl && (
                                        <a
                                          href={ev.hotel.googleMapsUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[10px] font-bold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 transition border border-slate-200"
                                        >
                                          <MapPin className="w-3 h-3 text-red-500" />
                                          <span>Hotel Maps</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // 2. DESTINATION EXCURSION
                            if (ev.type === "destination") {
                              const { dest, rawName, fromName, toName, legDistanceKm, legDuration, roadNote, directionUrl } = ev;
                              return (
                                <div key={ev.item?.id || `dest-${evIdx}`} className="space-y-2">
                                  {/* Connecting Leg Travel Indicator */}
                                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                        <Navigation className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0 text-[11px]">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800 flex-wrap">
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "从" : locale === "en" ? "From" : "Dari"}</span>
                                          <span className="truncate max-w-[130px] text-slate-900 font-extrabold">{localizeItem(fromName, locale)}</span>
                                          <ArrowRight className="w-3 h-3 text-emerald-600 shrink-0" />
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "前往" : locale === "en" ? "To" : "Ke"}</span>
                                          <span className="truncate max-w-[160px] text-emerald-900 font-extrabold">{localizeItem(toName, locale)}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{roadNote}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                      <span className="inline-block text-[10px] font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded shadow-xs border border-emerald-200">
                                        {legDistanceKm} km • {legDuration}
                                      </span>
                                      <a
                                        href={directionUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 transition shrink-0"
                                      >
                                        <span>{locale === "zh" ? "路线导航" : locale === "en" ? "Directions" : "Peta Rute"}</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* Destination Stop Card */}
                                  <div className="p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition space-y-2 shadow-xs ml-2 sm:ml-4">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-start gap-2.5 min-w-0">
                                        {dest?.imageUrl ? (
                                          <img
                                            src={dest.imageUrl}
                                            alt={rawName}
                                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                                          />
                                        ) : (
                                          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5" />
                                          </div>
                                        )}

                                        <div className="min-w-0">
                                          <div className="font-bold text-xs text-slate-900 truncate">
                                            {localizeItem(rawName, locale)}
                                          </div>
                                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                            <span>{dest?.region || "Jawa Timur"}</span>
                                            <span>•</span>
                                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                              <span>{dest?.rating || 4.9}</span>
                                              <span className="text-[10px] text-slate-400">({dest?.reviewCount || 100})</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {dest?.googleMapsUrl && (
                                        <a
                                          href={dest.googleMapsUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[10px] font-bold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 shrink-0 transition"
                                        >
                                          <MapPin className="w-3 h-3 text-red-500" />
                                          <span>Pin Maps</span>
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // 3. RETURN TO HOTEL (FOR REFRESH & NIGHT REST)
                            if (ev.type === "hotel_return") {
                              return (
                                <div key={`return-${evIdx}`} className="space-y-2">
                                  {/* Connecting Drive to Hotel */}
                                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-start sm:items-center gap-2 min-w-0">
                                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                        <Car className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0 text-[11px]">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-800 flex-wrap">
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "从" : locale === "en" ? "From" : "Dari"}</span>
                                          <span className="truncate max-w-[130px] text-slate-900 font-extrabold">{ev.fromName}</span>
                                          <ArrowRight className="w-3 h-3 text-indigo-600 shrink-0" />
                                          <span className="text-slate-500 font-normal">{locale === "zh" ? "返回酒店休整" : locale === "en" ? "Return to Hotel Base" : "Kembali ke Hotel"}</span>
                                          <span className="truncate max-w-[160px] text-indigo-900 font-extrabold">{ev.toName}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">{ev.roadNote}</div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                      <span className="inline-block text-[10px] font-extrabold text-indigo-800 bg-white px-2 py-0.5 rounded shadow-xs border border-indigo-200">
                                        {ev.legDistanceKm} km • {ev.legDuration}
                                      </span>
                                      <a
                                        href={ev.directionUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 transition shrink-0"
                                      >
                                        <span>{locale === "zh" ? "路线导航" : locale === "en" ? "Directions" : "Peta Rute"}</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>

                                  {/* Return Milestone Card */}
                                  <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/30 flex items-center gap-2.5 ml-2 sm:ml-4 text-xs">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                      <Bed className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-extrabold text-indigo-950 flex items-center gap-2">
                                        <span>{locale === "zh" ? "返回酒店休息与沐浴" : locale === "en" ? "Return to Hotel (Shower & Rest)" : "Kembali ke Hotel (Mandi, Santai & Istirahat)"}</span>
                                      </div>
                                      <p className="text-[11px] text-slate-500 mt-0.5">
                                        {locale === "zh"
                                          ? "今日行程圆满结束，专车送您安全返回酒店。您可以尽情沐浴洗去风尘、享用晚餐并安心过夜休息。"
                                          : locale === "en"
                                          ? "Tour concludes for the day. Driver returns you safely to your hotel to shower, dine comfortably, and enjoy a restful overnight stay."
                                          : "Trip hari ini selesai. Driver mengantar kembali ke hotel. Anda dapat mandi bersih, makan malam santai di hotel, dan istirahat nyaman."}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // 4. CHECKOUT HOTEL
                            if (ev.type === "hotel_checkout") {
                              return (
                                <div key={`checkout-${evIdx}`} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center gap-2.5 ml-2 sm:ml-4 text-xs">
                                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-extrabold text-amber-950 flex items-center gap-2">
                                      <span>{locale === "zh" ? "酒店退房与行李装车" : locale === "en" ? "Hotel Checkout & Luggage Loading" : "Checkout Hotel & Muat Koper ke Mobil"}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-600 mt-0.5">
                                      {locale === "zh"
                                        ? "享用早餐后办理退房手续。专车司机协助您将所有行李稳妥装入车内，准备启程前往终点站。"
                                        : locale === "en"
                                        ? "Complete hotel checkout after breakfast. Driver assists loading all luggage into the vehicle for departure."
                                        : "Tamu menyelesaikan proses checkout hotel. Driver membantu memuat seluruh koper ke bagasi mobil untuk perjalanan kepulangan."}
                                    </p>
                                  </div>
                                </div>
                              );
                            }

                            return null;
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Final Leg to Drop-off Point */}
                  {journeySchedule?.finalLeg && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {/* Final transit leg indicator */}
                      <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-start sm:items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <Navigation className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 flex-wrap">
                              <span className="text-slate-500 font-normal">
                                {locale === "zh" ? "从" : locale === "en" ? "From" : "Dari"}
                              </span>
                              <span className="truncate max-w-[130px] text-slate-900 font-extrabold">
                                {localizeItem(journeySchedule.finalLeg.fromName, locale)}
                              </span>
                              <ArrowRight className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="text-slate-500 font-normal">
                                {locale === "zh" ? "前往送达终点" : locale === "en" ? "To Drop-off" : "Ke Pengantaran Akhir"}
                              </span>
                              <span className="truncate max-w-[160px] text-rose-900 font-extrabold">
                                {journeySchedule.finalLeg.toName}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                              {journeySchedule.finalLeg.roadNote}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="inline-block text-[10px] font-extrabold text-rose-800 bg-white px-2 py-0.5 rounded shadow-xs border border-rose-200">
                            {journeySchedule.finalLeg.legDistanceKm} km • {journeySchedule.finalLeg.legDuration}
                          </span>
                          <a
                            href={journeySchedule.finalLeg.directionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg flex items-center gap-1 transition shrink-0"
                            title={locale === "zh" ? "在谷歌地图中打开导航路线" : locale === "en" ? "Open Driving Route Directions" : "Buka Navigasi Rute Google Maps"}
                          >
                            <span>{locale === "zh" ? "路线导航" : locale === "en" ? "Directions" : "Peta Rute"}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>

                      {/* End Point: Drop-off Card */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                              B
                            </span>
                            <strong className="text-slate-900">
                              {locale === "zh" ? "终点送达 / 离境地点" : locale === "en" ? "Final Destination / Drop-off" : "Titik Pengantaran Akhir (Drop-off)"}
                            </strong>
                          </div>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                            {locale === "zh" ? "终点" : "Finish Point"}
                          </span>
                        </div>
                        <div className="pl-7">
                          <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{journeySchedule?.dropoff.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {locale === "zh"
                              ? "行程圆满结束，司机将协助您办理行李装卸、渡轮码头登船或机场值机指引。"
                              : locale === "en"
                              ? "Trip concludes. Driver assists with luggage unload and smooth ferry or airport transfer."
                              : "Perjalanan selesai. Driver mengantarkan Anda dengan aman dan membantu bagasi hingga proses boarding/transit."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment Method Notice */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{t.checkout.paymentMethodTitle}</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.checkout.paymentHighlight}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t.checkout.paymentDesc}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t.checkout.pciBadge}
              </span>
            </div>
          </div>
        </div>

        {/* Right Summary Column (5 cols) */}
        <div className="lg:col-span-5 sticky top-20 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              {t.checkout.summaryTitle}
            </h2>

            {activeTrip && (
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[11px] text-slate-400">{t.checkout.tripPlanTitle}</div>
                  <div className="font-bold text-slate-900 text-sm">{activeTrip.title}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400">{t.checkout.participants}</span>
                    <div className="font-semibold text-slate-800">{activeTrip.numPax} {locale === "zh" ? "人" : "Pax"} ({activeTrip.tripType})</div>
                  </div>
                  <div>
                    <span className="text-slate-400">{t.checkout.fleet}</span>
                    <div className="font-semibold text-slate-800">{activeTrip.vehicleType?.name ? localizeItem(activeTrip.vehicleType.name, locale) : "Avanza / Innova"}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t.checkout.pickup} <strong>{activeTrip.pickupPoint}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{t.checkout.dropoff} <strong>{activeTrip.dropoffPoint}</strong></span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>{t.checkout.transport} ({activeTrip.totalDistanceKm || 0} km):</span>
                    <span>{formatPrice(activeTrip.transportCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.checkout.hotel}</span>
                    <span>{formatPrice(activeTrip.hotelCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.checkout.tickets}</span>
                    <span>{formatPrice(activeTrip.ticketsCost || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.checkout.guide}</span>
                    <span className={activeTrip.guideCost && parseFloat(activeTrip.guideCost.toString()) > 0 ? "text-slate-800" : "text-emerald-700 font-semibold"}>
                      {activeTrip.guideCost && parseFloat(activeTrip.guideCost.toString()) > 0
                        ? formatPrice(activeTrip.guideCost)
                        : (locale === "zh" ? "仅司机 / 无需导游 (0元)" : locale === "en" ? "Driver Only / No Guide (Rp 0)" : "Tanpa Guide / Driver Only (Rp 0)")}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-slate-200 mt-2">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-bold text-slate-900 text-sm">{t.checkout.totalPayment}</span>
                    <span className="font-extrabold text-xl text-emerald-600">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{locale === "zh" ? "外币估算:" : locale === "en" ? "Est. Currencies:" : "Perkiraan Mata Uang:"}</span>
                    <span>{formatUSD(totalAmount)} / {formatCNY(totalAmount)} (IDR: {formatIDR(totalAmount)})</span>
                  </div>
                </div>
              </div>
            )}

            {/* 48 Hour Cancellation Policy Alert */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t.checkout.cancellationAlertTitle}</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {t.checkout.cancellationAlertDesc}
              </p>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessingPayment}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <span>{t.checkout.connectingGateway}</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>{t.checkout.payBtn} ({formatPrice(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-xs text-slate-500">
          Memuat halaman checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
