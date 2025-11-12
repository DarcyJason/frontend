import { apiClient, ApiClientError } from "./client";
import { API_ENDPOINTS } from "$lib/constants";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  PasswordResetResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  User,
} from "$lib/types";

/**
 * 认证 API 服务
 */
export class AuthService {
  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
      );

      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        apiClient.setAccessToken(response.data.access_token);
      }

      if (response.data?.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }

      if (response.data?.user) {
        localStorage.setItem("user_info", JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw this.handleError(error, "登录失败");
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials,
      );
      return response;
    } catch (error) {
      throw this.handleError(error, "注册失败");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error("登出请求失败:", error);
    } finally {
      // 清除本地存储
      this.clearAuthData();
      apiClient.setAccessToken(null);
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        throw new Error("没有可用的刷新令牌");
      }

      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        {
          refresh_token: refreshToken,
        },
      );

      if (response.data?.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
        apiClient.setAccessToken(response.data.access_token);
      }

      return response;
    } catch (error) {
      // 刷新失败时清除认证数据
      this.clearAuthData();
      throw this.handleError(error, "令牌刷新失败");
    }
  }

  async verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await apiClient.post<VerifyEmailResponse>(
        API_ENDPOINTS.AUTH.VERIFY_EMAIL,
        request,
      );
      return response;
    } catch (error) {
      throw this.handleError(error, "邮箱验证失败");
    }
  }

  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        { email },
      );
      return response;
    } catch (error) {
      throw this.handleError(error, "发送验证邮件失败");
    }
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        request,
      );
      return response;
    } catch (error) {
      throw this.handleError(error, "密码重置请求失败");
    }
  }

  async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<PasswordResetResponse> {
    try {
      const response = await apiClient.post<PasswordResetResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        request,
      );
      return response;
    } catch (error) {
      throw this.handleError(error, "密码重置失败");
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return null;
    }

    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      return null;
    }

    try {
      return JSON.parse(userInfo) as User;
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem("access_token");
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null && this.getCurrentUser() !== null;
  }

  private clearAuthData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
      localStorage.removeItem("auth_state");
    }
  }

  private handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof ApiClientError) {
      return new Error(error.message || defaultMessage);
    }
    if (error instanceof Error) {
      return new Error(error.message || defaultMessage);
    }
    return new Error(defaultMessage);
  }
}

export const authService = new AuthService();
