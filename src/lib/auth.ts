import { cookies } from "next/headers";
import {
  SessionUser,
  UserRole,
  SESSION_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
} from "./auth-token";

export type { SessionUser, UserRole };
export { SESSION_COOKIE_NAME, createSessionToken, verifySessionToken };

/**
 * Server-side helper to get current session user in Server Components and Route Handlers
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
