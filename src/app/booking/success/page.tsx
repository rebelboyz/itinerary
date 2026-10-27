"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Car,
  Users,
  Printer,
  Download,
  Phone,
  Compass,
  ArrowRight,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";
import { useI18n } from "@/context/I18nContext";
import { localizeItem } from "@/i18n/translations";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { t, locale, formatPrice } = useI18n();
  const bookingIdParam = searchParams.get("booking_id");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        const found = (data.bookings || []).find((b: any) => b.id === bookingIdParam) || data.bookings?.[0];
        setBooking(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [bookingIdParam]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Compass className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
        <h2 className="text-sm font-bold text-slate-800">
          {locale === "zh"
            ? "正在生成行程凭证与电子单据..."
            : locale === "en"
            ? "Generating Itinerary Documents..."
            : "Menyiapkan Dokumen Itinerary..."}
        </h2>
      </div>
    );
  }

  const trip = booking?.trip;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Success Badge Banner */}
      <div className="bg-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg shadow-emerald-600/10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-9 h-9 text-emerald-300" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-2.5 py-0.5 rounded">
            {t.voucher.successBadge}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.voucher.successTitle}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {t.voucher.successDesc}
          </p>
        </div>
      </div>

      {/* Printable Itinerary Voucher Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Itinerary<span className="text-emerald-600">ID</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {t.voucher.officialVoucher}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {t.voucher.bookingNo} <strong className="text-slate-800">{booking?.midtransOrderId || booking?.id}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.voucher.printBtn}</span>
            </button>
            <Link
              href="/plan"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              {t.voucher.newTripBtn}
            </Link>
          </div>
        </div>

        {/* Customer & Trip Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">{t.voucher.booker}</span>
            <strong className="text-slate-900">{booking?.customerName || booking?.user?.name}</strong>
            <div className="text-[11px] text-slate-500">{booking?.customerEmail || booking?.user?.email}</div>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">{t.voucher.fleetPax}</span>
            <strong className="text-slate-900">{trip?.numPax} {locale === "zh" ? "人" : "Pax"} ({trip?.tripType})</strong>
            <div className="text-[11px] text-slate-500">{trip?.vehicleType?.name ? localizeItem(trip.vehicleType.name, locale) : "Avanza / Innova"}</div>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">{t.voucher.pickupPoint}</span>
            <strong className="text-slate-900">{trip?.pickupPoint}</strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">{t.voucher.totalCost}</span>
            <strong className="text-emerald-700 text-sm font-bold">
              {formatPrice(booking?.totalAmount || 0)}
            </strong>
            <div className="text-[10px] text-emerald-600 font-semibold uppercase">{t.voucher.paidStatus}</div>
          </div>
        </div>

        {/* Day-by-day Itinerary Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{t.voucher.timelineTitle}</span>
          </h3>

          <div className="space-y-4 border-l-2 border-emerald-500/30 pl-4 sm:pl-6 ml-2">
            {(trip?.days || []).map((day: any, idx: number) => (
              <div key={day.id || idx} className="relative space-y-2">
                <div className="absolute -left-[23px] sm:-left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    {t.builder.dayPrefix} {day.dayNumber}: {day.title}
                  </h4>
                </div>

                <div className="space-y-1.5 pl-2">
                  {(day.items || []).map((item: any, itemIdx: number) => {
                    const rawName = item.destination?.name || item.activity?.name || item.note || "Destinasi Terjadwal";
                    return (
                      <div
                        key={item.id || itemIdx}
                        className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium text-slate-800">
                            {localizeItem(rawName, locale)}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.destination?.region || "East Java"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support & Field Contact */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-teal-900">
          <div className="space-y-0.5">
            <div className="font-bold flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-600" />
              <span>{t.voucher.hotlineTitle}</span>
            </div>
            <p className="text-[11px] text-teal-700">
              {t.voucher.hotlineDesc}
            </p>
          </div>
          <a
            href="https://wa.me/6281110001"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 text-center shrink-0 transition"
          >
            {t.voucher.callHotline}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-xs text-slate-500">Memuat voucher...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

