export type UserRole = "customer" | "admin" | "cs" | "guide" | "finance" | "agent";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  preferredLanguage?: string;
  preferredCurrency?: string;
  phone?: string | null;
  country?: string | null;
}

export const SESSION_COOKIE_NAME = "itinerary_id_session";
const SESSION_SECRET = process.env.NEXTAUTH_SECRET || "itinerary-id-super-secret-key-32-chars-long-minimum-jwt";

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function signData(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bufferToBase64Url(signature);
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token using Web Crypto
 * Format: <payload_base64url>.<signature_base64url>
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload = {
    ...user,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const enc = new TextEncoder();
  const data = bufferToBase64Url(enc.encode(JSON.stringify(payload)).buffer);
  const signature = await signData(data, SESSION_SECRET);
  return `${data}.${signature}`;
}

/**
 * Validates HMAC-SHA256 signature and decodes session token using Web Crypto.
 * Rejects modified tokens or expired sessions.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) {
      return null;
    }
    const [data, signature] = parts;
    const expectedSig = await signData(data, SESSION_SECRET);

    if (signature !== expectedSig) {
      return null;
    }

    const raw = atob(data.replace(/-/g, "+").replace(/_/g, "/"));
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
