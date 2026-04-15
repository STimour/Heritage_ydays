import { ApiErrorShape } from "@/types/api";
import { BACKEND_API_BASE_URL } from "@/lib/http/config";

type HttpOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor({ message, status }: ApiErrorShape) {
    super(message);
    this.status = status;
  }
}

function resolveUrl(path: string): string {
  return `${BACKEND_API_BASE_URL}${path}`;
}

export async function http<T>(path: string, init?: HttpOptions): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(resolveUrl(path), {
    ...init,
    headers,
    credentials: "include",
    cache: init?.cache ?? "no-store",
  });

  if (!res.ok) {
    let message = "Une erreur est survenue";

    if (init?.auth && res.status === 401) {
      await fetch("/api/auth/logout", { method: "POST" });
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch {
      // no-op
    }
    throw new ApiError({ status: res.status, message });
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
