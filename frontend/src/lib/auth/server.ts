import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";

export type ServerSession = {
  token: string;
};

export async function getServerAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
}

export async function getServerSession(): Promise<ServerSession | null> {
  const token = await getServerAuthToken();
  if (!token) {
    return null;
  }
  return { token };
}
