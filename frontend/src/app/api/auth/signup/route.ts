import { NextResponse } from "next/server";
import { BACKEND_API_BASE_URL } from "@/lib/http/config";
import { AUTH_COOKIE_NAME, getSessionCookieOptions } from "@/lib/auth/constants";

type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

type AuthResponse = {
  token: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as SignupPayload;

  const backendResponse = await fetch(`${BACKEND_API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    }),
    cache: "no-store",
  });

  if (!backendResponse.ok) {
    let message = "Impossible de créer le compte.";
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
