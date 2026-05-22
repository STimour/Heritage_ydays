import { api } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string }>('/auth/login', { email, password }),

  register: (firstName: string, lastName: string, email: string, password: string) =>
    api.post<{ token: string }>('/auth/register', {
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      password,
    }),
};

export function saveToken(token: string): void {
  localStorage.setItem('heritage_token', token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('heritage_token');
}

export function clearToken(): void {
  localStorage.removeItem('heritage_token');
}
