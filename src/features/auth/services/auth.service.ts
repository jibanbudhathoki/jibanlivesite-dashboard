import { apiClient } from "@/src/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { LoginCredentials, AuthResponse } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      endpoints.login,
      credentials,
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get(endpoints.me);
    return response.data;
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      endpoints.changePassword,
      payload
    );
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  changeEmail: async (payload: { newEmail: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      endpoints.changeEmail,
      payload
    );
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; data?: { token?: string; expiresIn: string } }> => {
    const response = await apiClient.post(
      endpoints.forgotPassword,
      { email }
    );
    return response.data;
  },

  resetPassword: async (payload: { email: string; newPassword: string; token?: string; recoveryKey?: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      endpoints.resetPassword,
      payload
    );
    if (response.data?.data?.token) {
      localStorage.setItem("token", response.data.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
};
