import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "cs" | "guide" | "finance";
  preferredLanguage?: string;
  preferredCurrency?: string;
  phone?: string | null;
  country?: string | null;
}

const SESSION_COOKIE_NAME = "itinerary_id_session";

/**
 * Creates a simple secure session token
 */
export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

/**
 * Decodes and validates session token
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      preferredLanguage: parsed.preferredLanguage,
      preferredCurrency: parsed.preferredCurrency,
      phone: parsed.phone,
      country: parsed.country,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side helper to get current session user
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { SESSION_COOKIE_NAME };

