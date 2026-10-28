import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth-token";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Referral tracking: 30-day cookie (PRD §4.2 Jalur A)
  const refParam = searchParams.get("ref");
  let response = NextResponse.next();
  if (refParam) {
    response.cookies.set("refCode", refParam.toUpperCase().trim(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }

  // 2. Protected paths
  const isAdminPath = pathname.startsWith("/admin");
  const isCsPath = pathname.startsWith("/cs");
  const isGuidePath = pathname.startsWith("/guide");
  const isFinancePath = pathname.startsWith("/finance");
  const isAgentPath = pathname.startsWith("/agent");

  if (!isAdminPath && !isCsPath && !isGuidePath && !isFinancePath && !isAgentPath) {
    return response;
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifySessionToken(sessionCookie);

  // If token is invalid, tampered with, or expired
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const redirectRes = NextResponse.redirect(loginUrl);
    redirectRes.cookies.delete(SESSION_COOKIE_NAME);
    return redirectRes;
  }

  const role = user.role;

  // Admin can access everything
  if (role === "admin") {
    return response;
  }

  // Non-admins can only access their specific role area
  if (isAdminPath) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isCsPath && role !== "cs") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isGuidePath && role !== "guide") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isFinancePath && role !== "finance") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isAgentPath && role !== "agent") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
