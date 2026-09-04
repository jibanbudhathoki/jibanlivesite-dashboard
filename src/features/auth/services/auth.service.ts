import { apiClient } from '@/src/lib/apiClient';
import { endpoints } from '@/lib/endpoints';
import { LoginCredentials, AuthResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(endpoints.auth.login, credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};
