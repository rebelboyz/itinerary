"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Itinerary<span className="text-emerald-400">ID</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform penyusun itinerary custom Jawa Timur terpercaya dengan kalkulasi biaya transparan real-time, armada lengkap, dan garansi pembatalan fleksibel 48 jam.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Surabaya & Malang, Jawa Timur, Indonesia</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Destinasi Utama</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Gunung Bromo & Penanjakan</li>
              <li>Kawah Ijen & Blue Fire</li>
              <li>Air Terjun Tumpak Sewu</li>
              <li>Air Terjun Madakaripura</li>
              <li>Taman Nasional Baluran</li>
              <li>Kota Wisata Batu & Malang</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Kebijakan & Jaminan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Full Refund ≥ 48 Jam</span>
              </li>
              <li className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400" />
                <span>BBM, Tol & Supir Sudah Termasuk</span>
              </li>
              <li>Pembayaran Aman Midtrans Snap (PCI-DSS)</li>
              <li>Pemandu Resmi Bersertifikat</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Internal Portals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/admin" className="hover:text-emerald-400 transition">Admin Dashboard</Link></li>
              <li><Link href="/cs" className="hover:text-emerald-400 transition">CS Lead Pipeline</Link></li>
              <li><Link href="/guide" className="hover:text-emerald-400 transition">Guide Field App (PWA)</Link></li>
              <li><Link href="/finance" className="hover:text-emerald-400 transition">Finance & Margin Review</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Itinerary ID. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-4">
            <span>Mata uang transaksi: IDR</span>
            <span>•</span>
            <span>Bahasa: English / Mandarin / Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

