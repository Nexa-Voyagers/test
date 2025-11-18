import { getToken, setToken, setRefreshToken, clearAuthTokens } from './api';
import { post } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/login', credentials);

  if (response.token) {
    setToken(response.token);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
  }

  return response;
}

/**
 * Register user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/register', data);

  if (response.token) {
    setToken(response.token);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
  }

  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * Get current user from token
 */
export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    // Decode JWT token (basic decode, should validate on server)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
