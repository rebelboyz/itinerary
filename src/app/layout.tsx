import type { Metadata, Viewport } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/context/I18nContext";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itinerary ID — East Java Custom Tour & Travel",
  description:
    "Susun rencana liburan Jawa Timur (Bromo, Ijen, Tumpak Sewu) dengan estimasi biaya real-time transparan dan armada terpercaya.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${geistMono.variable} min-h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans w-full max-w-full relative">
        <I18nProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0 w-full max-w-full">{children}</main>
          <Footer />
          <BottomNav />
        </I18nProvider>
      </body>
    </html>
  );
}
