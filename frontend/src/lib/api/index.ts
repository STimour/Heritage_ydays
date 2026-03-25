/**
 * HTTP Client configuration for API integration
 * Backend will be at process.env.NEXT_PUBLIC_API_URL
 * For now, uses mocks
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Set auth token
 */
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

/**
 * Clear auth token (logout)
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

/**
 * Fetch wrapper with auth header
 */
export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API Error');
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

/**
 * GET request
 */
export function apiGet<T = any>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export function apiPost<T = any>(
  path: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export function apiPut<T = any>(
  path: string,
  body?: any,
  options?: FetchOptions
): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T = any>(path: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(path, { ...options, method: 'DELETE' });
}

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
};
