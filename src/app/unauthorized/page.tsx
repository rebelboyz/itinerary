import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 sm:py-24 text-center space-y-4 w-full max-w-full overflow-x-hidden">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Akses Terbatas (Unauthorized)
      </h1>
      <p className="text-xs text-slate-500 leading-relaxed">
        Akun Anda saat ini tidak memiliki izin untuk membuka halaman internal ini. Silakan login dengan akun yang memiliki hak akses yang sesuai.
      </p>
      <div className="pt-2 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          <span>Halaman Login</span>
        </Link>
      </div>
    </div>
  );
}

