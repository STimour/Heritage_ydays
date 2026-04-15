import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getExpiredSessionCookieOptions } from "@/lib/auth/constants";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, "", getExpiredSessionCookieOptions());
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/login";
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set(AUTH_COOKIE_NAME, "", getExpiredSessionCookieOptions());
  return response;
}
