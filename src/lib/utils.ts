import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIDR(amount: number | string): string {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(numeric || 0);
}

export function formatUSD(amountInIdr: number | string, rate = 16000): string {
  const numeric = typeof amountInIdr === "string" ? parseFloat(amountInIdr) : amountInIdr;
  const inUSD = (numeric || 0) / rate;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(inUSD);
}

export function formatCNY(amountInIdr: number | string, rate = 2200): string {
  const numeric = typeof amountInIdr === "string" ? parseFloat(amountInIdr) : amountInIdr;
  const inCNY = (numeric || 0) / rate;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(inCNY);
}

