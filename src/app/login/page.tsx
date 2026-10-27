"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal melakukan login");
      }

      const role = data.user.role;
      if (role === "admin") router.push("/admin");
      else if (role === "cs") router.push("/cs");
      else if (role === "guide") router.push("/guide");
      else if (role === "finance") router.push("/finance");
      else router.push("/plan");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 w-full max-w-full overflow-x-hidden">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <Compass className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Akun Itinerary ID
          </h1>
          <p className="text-xs text-slate-500">
            Akses portal pelanggan atau sistem manajemen operasional internal.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <span>Memverifikasi...</span> : <span>Masuk ke Akun</span>}
          </button>
        </form>

        {/* Demo Fast Login Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Akun Uji Coba (Seed Data):</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal lowercase">klik untuk isi otomatis</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@itinerary.id", "admin123")}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-left border border-amber-200 transition"
            >
              👨‍💼 Admin Master
              <span className="block text-[10px] text-amber-700 font-normal">admin@itinerary.id</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("cs@itinerary.id", "cs123456")}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold text-left border border-blue-200 transition"
            >
              🎧 CS Leads
              <span className="block text-[10px] text-blue-700 font-normal">cs@itinerary.id</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("guide@itinerary.id", "guide123")}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold text-left border border-purple-200 transition"
            >
              🚙 Tour Guide
              <span className="block text-[10px] text-purple-700 font-normal">guide@itinerary.id</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("finance@itinerary.id", "finance123")}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-left border border-emerald-200 transition"
            >
              💰 Finance
              <span className="block text-[10px] text-emerald-700 font-normal">finance@itinerary.id</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("john@example.com", "customer123")}
              className="col-span-2 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-left border border-slate-300 transition flex items-center justify-between"
            >
              <span>🧳 Customer (John Traveler)</span>
              <span className="text-[10px] text-slate-600 font-normal">john@example.com / customer123</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

