import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths
  const isAdminPath = pathname.startsWith("/admin");
  const isCsPath = pathname.startsWith("/cs");
  const isGuidePath = pathname.startsWith("/guide");
  const isFinancePath = pathname.startsWith("/finance");

  if (!isAdminPath && !isCsPath && !isGuidePath && !isFinancePath) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("itinerary_id_session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const raw = Buffer.from(sessionCookie, "base64url").toString("utf-8");
    const user = JSON.parse(raw);

    if (user.exp && user.exp < Date.now()) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = user.role;

    // Role access control:
    // Admin can access everything
    if (role === "admin") {
      return NextResponse.next();
    }

    if (isAdminPath && role !== "admin") {
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

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cs/:path*", "/guide/:path*", "/finance/:path*"],
};

