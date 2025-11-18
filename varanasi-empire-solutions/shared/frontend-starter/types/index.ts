/**
 * Authentication Types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

/**
 * API Response Types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Common Types
 */
export interface TableColumn<T> {
  id: string;
  label: string;
  accessor: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface SidebarLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
  children?: SidebarLink[];
}

export interface NotificationMessage {
  id?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * Form Types
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  required?: boolean;
  validation?: Record<string, any>;
  options?: { label: string; value: string }[];
}

/**
 * Error Types
 */
export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, any>;
}

/**
 * Request/Response Interceptor Types
 */
export interface RequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
  timeout?: number;
}

export interface ResponseError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, any>;
}
