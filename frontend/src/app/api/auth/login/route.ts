import { NextResponse } from "next/server";
import { BACKEND_API_BASE_URL } from "@/lib/http/config";
import { AUTH_COOKIE_NAME, getSessionCookieOptions } from "@/lib/auth/constants";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as LoginPayload;

  const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    let message = "Identifiants invalides.";
    try {
      const data = await backendResponse.json();
      message = data.message ?? message;
    } catch {
      // no-op
    }
    return NextResponse.json({ message }, { status: backendResponse.status });
  }

  const data = (await backendResponse.json()) as AuthResponse;
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, data.token, getSessionCookieOptions());
  return response;
}
