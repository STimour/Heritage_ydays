/**
 * Authentication API endpoints
 * Backend endpoints to implement: POST /api/auth/register, POST /api/auth/login
 */

import { apiPost, setAuthToken, clearAuthToken } from './index';
import { User } from '@/types';

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Auth response with token
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Register new user
 * Route: POST /api/auth/register
 */
export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/auth/register', data);
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
}

/**
 * Login user
 * Route: POST /api/auth/login
 */
export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await apiPost<AuthResponse>('/auth/login', data);
  if (response.token) {
    setAuthToken(response.token);
  }
  return response;
}

/**
 * Get current user
 * Route: GET /api/auth/me
 */
export async function getCurrentUser(): Promise<User> {
  return apiPost<User>('/auth/me');
}

/**
 * Logout
 */
export function logout(): void {
  clearAuthToken();
}
