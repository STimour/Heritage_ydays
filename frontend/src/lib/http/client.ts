import { ApiErrorShape } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor({ message, status }: ApiErrorShape) {
    super(message);
    this.status = status;
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = "Une erreur est survenue";
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
