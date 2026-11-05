import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PRIVATE_PREFIXES = ["/create-event", "/manage-events", "/joined-events", "/profile"];
const AUTH_PAGES = ["/login", "/register"];


export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(getSessionCookie(request));

  if (!hasSession && PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-event/:path*",
    "/manage-events/:path*",
    "/joined-events/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
