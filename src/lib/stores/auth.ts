import { writable, derived, type Writable } from "svelte/store";
import { authService } from "$lib/api/auth";
import type { User, Session } from "$lib/types";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    initialize: () => {
      if (typeof window === "undefined") return;

      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const userInfo = localStorage.getItem("user_info");

      if (accessToken && userInfo) {
        try {
          const user = JSON.parse(userInfo);
          update((state) => ({
            ...state,
            user,
            accessToken,
            refreshToken: refreshToken || null,
            isAuthenticated: true,
            error: null,
          }));
        } catch (error) {
          console.error("Failed to restore auth state:", error);
        }
      }
    },

    login: async (email: string, password: string) => {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const response = await authService.login({ email, password });

        if (response.data?.user && response.data?.access_token) {
          update((state) => ({
            ...state,
            user: response.data!.user,
            accessToken: response.data!.access_token,
            refreshToken: response.data!.refresh_token || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          }));
        } else {
          throw new Error("Login response data incomplete");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },

    register: async (
      email: string,
      password: string,
      confirmPassword: string,
      username?: string,
    ) => {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const response = await authService.register({
          email,
          password,
          password_confirm: confirmPassword,
          username,
        });

        update((state) => ({
          ...state,
          isLoading: false,
          error: null,
        }));

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },

    logout: async () => {
      update((state) => ({ ...state, isLoading: true }));

      try {
        await authService.logout();
        set(initialState);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Logout failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },

    setUser: (user: User | null) => {
      update((state) => ({
        ...state,
        user,
        isAuthenticated: user !== null,
      }));
    },

    setAccessToken: (token: string | null) => {
      update((state) => ({
        ...state,
        accessToken: token,
      }));
    },

    setError: (error: string | null) => {
      update((state) => ({
        ...state,
        error,
      }));
    },

    setLoading: (isLoading: boolean) => {
      update((state) => ({
        ...state,
        isLoading,
      }));
    },

    reset: () => {
      set(initialState);
    },

    refreshToken: async () => {
      try {
        const response = await authService.refreshToken();
        if (response.data?.access_token) {
          update((state) => ({
            ...state,
            accessToken: response.data!.access_token,
            refreshToken: response.data!.refresh_token || state.refreshToken,
          }));
        }
      } catch (error) {
        // Token refresh failed, clear auth state
        set(initialState);
        throw error;
      }
    },

    verifyEmail: async (token: string) => {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const response = await authService.verifyEmail({ token });
        update((state) => ({
          ...state,
          isLoading: false,
          error: null,
        }));
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Email verification failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },

    forgotPassword: async (email: string) => {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const response = await authService.forgotPassword({ email });
        update((state) => ({
          ...state,
          isLoading: false,
          error: null,
        }));
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Password reset request failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },

    resetPassword: async (
      token: string,
      password: string,
      passwordConfirm: string,
    ) => {
      update((state) => ({ ...state, isLoading: true, error: null }));

      try {
        const response = await authService.resetPassword({
          token,
          password,
          password_confirm: passwordConfirm,
        });
        update((state) => ({
          ...state,
          isLoading: false,
          error: null,
        }));
        return response;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Password reset failed";
        update((state) => ({
          ...state,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
  };
}

export const authStore = createAuthStore();

export const isAuthenticated = derived(
  authStore,
  ($auth) => $auth.isAuthenticated,
);

export const currentUser = derived(authStore, ($auth) => $auth.user);

export const isLoading = derived(authStore, ($auth) => $auth.isLoading);

export const authError = derived(authStore, ($auth) => $auth.error);

export const accessToken = derived(authStore, ($auth) => $auth.accessToken);
