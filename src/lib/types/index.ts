export interface User {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  bio?: string;
  phone?: string;
  location?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  password_confirm: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  data?: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
}

export interface RegisterResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user: User;
    verification_sent: boolean;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirm: string;
}

export interface PasswordResetResponse {
  status: "success" | "error";
  message: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  status: "success" | "error";
  message: string;
  verified: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface ApiErrorResponse {
  status: "error";
  error: ApiError;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  status: "success";
  data: T[];
  meta: PaginationMeta;
}

export interface Session {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  is_authenticated: boolean;
}

export interface FormValidation {
  field: string;
  isValid: boolean;
  errors: string[];
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  timestamp: number;
}

export interface RouteParams {
  [key: string]: string | string[];
}

export interface NavigationGuard {
  canActivate: (route: any) => boolean | Promise<boolean>;
  canDeactivate?: (route: any) => boolean | Promise<boolean>;
}

export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
}
