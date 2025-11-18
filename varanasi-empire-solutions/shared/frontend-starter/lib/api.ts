import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse, RequestConfig } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'auth_token';
const REFRESH_TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_REFRESH_KEY || 'auth_refresh_token';

/**
 * Create axios instance with default config
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          setToken(token);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API request wrapper with type safety
 */
export async function apiRequest<T = unknown>(
  url: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: Record<string, any>;
    config?: RequestConfig;
  } = {}
): Promise<T> {
  try {
    const { method = 'GET', data, params, config = {} } = options;

    const response = await apiClient.request<ApiResponse<T>>({
      url,
      method,
      data,
      params,
      timeout: config.timeout,
    });

    if (response.success === false) {
      throw new Error(response.message || 'API request failed');
    }

    return response.data as T;
  } catch (error) {
    if (!options.config?.skipErrorHandling) {
      throw error;
    }
    throw error;
  }
}

/**
 * GET request
 */
export function get<T = unknown>(
  url: string,
  params?: Record<string, any>,
  config?: RequestConfig
): Promise<T> {
  return apiRequest<T>(url, { method: 'GET', params, config });
}

/**
 * POST request
 */
export function post<T = unknown>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return apiRequest<T>(url, { method: 'POST', data, config });
}

/**
 * PUT request
 */
export function put<T = unknown>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return apiRequest<T>(url, { method: 'PUT', data, config });
}

/**
 * DELETE request
 */
export function remove<T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<T> {
  return apiRequest<T>(url, { method: 'DELETE', config });
}

/**
 * PATCH request
 */
export function patch<T = unknown>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return apiRequest<T>(url, { method: 'PATCH', data, config });
}

/**
 * Token management
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function setRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

export function clearAuthTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export default apiClient;
