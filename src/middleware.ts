import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnAdmin = nextUrl.pathname.startsWith("/admin");
  const isOnLogin = nextUrl.pathname === "/admin/login";

  if (isOnAdmin && !isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
