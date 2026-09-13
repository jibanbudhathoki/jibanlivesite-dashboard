import { apiClient } from "@/src/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { SocialLink, CreateSocialPayload, UpdateSocialPayload } from "../types";

export const socialsService = {
  getSocials: async (): Promise<SocialLink[]> => {
    const response = await apiClient.get<{ success: boolean; data: SocialLink[] }>(
      endpoints.socials
    );
    return response.data.data;
  },

  createSocial: async (payload: CreateSocialPayload): Promise<SocialLink> => {
    const response = await apiClient.post<{ success: boolean; data: SocialLink }>(
      endpoints.socials,
      payload
    );
    return response.data.data;
  },

  updateSocial: async (
    id: string,
    payload: UpdateSocialPayload
  ): Promise<SocialLink> => {
    const response = await apiClient.patch<{ success: boolean; data: SocialLink }>(
      `${endpoints.socials}/${id}`,
      payload
    );
    return response.data.data;
  },

  deleteSocial: async (id: string): Promise<void> => {
    await apiClient.delete(`${endpoints.socials}/${id}`);
  },
};
