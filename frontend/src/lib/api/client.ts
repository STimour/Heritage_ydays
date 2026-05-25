const DEFAULT_API_ORIGIN = 'http://localhost:8080';

function getApiOrigin(): string {
  const origin = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_ORIGIN;
  return origin.replace(/\/+$/, '').replace(/\/api$/i, '');
}

const API_BASE_URL = `${getApiOrigin()}/api`;

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('heritage_token');
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(buildApiUrl(path), {
    headers,
    ...options,
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T;
  return res.json();
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
};
