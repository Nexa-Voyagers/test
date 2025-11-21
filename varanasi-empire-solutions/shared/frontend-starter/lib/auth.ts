import { post, getToken, setToken, setRefreshToken, clearAuthTokens } from './api';
import { AuthCredentials, AuthResponse, RegisterCredentials, User } from '@/types';

// Demo mode - set to true to bypass backend API
const DEMO_MODE = true;

const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  role: 'admin',
  avatar: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_TOKEN = 'demo-token-' + Date.now();

/**
 * Login user with email and password
 */
export async function loginUser(credentials: AuthCredentials): Promise<AuthResponse> {
  // Demo mode - accept any credentials
  if (DEMO_MODE) {
    const response: AuthResponse = {
      user: { ...DEMO_USER, email: credentials.email },
      token: DEMO_TOKEN,
      refreshToken: DEMO_TOKEN,
    };
    setToken(response.token);
    setRefreshToken(response.refreshToken);
    return response;
  }

  try {
    const response = await post<AuthResponse>('/auth/login', credentials);

    // Store tokens
    setToken(response.token);
    setRefreshToken(response.refreshToken);

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Register new user
 */
export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  // Demo mode - accept any credentials
  if (DEMO_MODE) {
    const response: AuthResponse = {
      user: { ...DEMO_USER, email: credentials.email, name: credentials.name },
      token: DEMO_TOKEN,
      refreshToken: DEMO_TOKEN,
    };
    setToken(response.token);
    setRefreshToken(response.refreshToken);
    return response;
  }

  try {
    const { confirmPassword, ...data } = credentials;
    const response = await post<AuthResponse>('/auth/register', data);

    // Store tokens
    setToken(response.token);
    setRefreshToken(response.refreshToken);

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  if (DEMO_MODE) {
    clearAuthTokens();
    return;
  }

  try {
    await post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthTokens();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User> {
  if (DEMO_MODE) {
    return DEMO_USER;
  }

  try {
    return await post<User>('/auth/me');
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
}

/**
 * Refresh authentication token
 */
export async function refreshAuthToken(): Promise<AuthResponse> {
  try {
    const response = await post<AuthResponse>('/auth/refresh');

    // Store new tokens
    setToken(response.token);
    setRefreshToken(response.refreshToken);

    return response;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
}

/**
 * Check if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  return Boolean(getToken());
}

/**
 * Verify token validity
 */
export function isTokenValid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;

    if (!exp) return true;

    // Check if token expires in next 5 minutes
    return Date.now() < (exp * 1000 - 5 * 60 * 1000);
  } catch {
    return false;
  }
}

/**
 * Decode JWT token (without verification)
 */
export function decodeToken(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

export default {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  refreshAuthToken,
  isUserAuthenticated,
  isTokenValid,
  decodeToken,
};
