import { apiClient } from '@/src/lib/apiClient';
import { endpoints } from '@/lib/endpoints';
import { Profile, UpdateProfilePayload } from '../types';

export const profileService = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<{ success: boolean; data: Profile }>(endpoints.profile);
    return response.data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<Profile> => {
    const response = await apiClient.put<{ success: boolean; data: Profile }>(endpoints.profile, payload);
    return response.data.data;
  },
};
