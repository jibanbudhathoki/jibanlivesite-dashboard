import { apiClient } from "@/src/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { SiteSettings, UpdateSiteSettingsPayload } from "../types";

export const settingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    const response = await apiClient.get<{ success: boolean; data: SiteSettings }>(
      endpoints.settings
    );
    return response.data.data;
  },

  updateSettings: async (
    payload: UpdateSiteSettingsPayload
  ): Promise<SiteSettings> => {
    const response = await apiClient.put<{ success: boolean; data: SiteSettings }>(
      endpoints.settings,
      payload
    );
    return response.data.data;
  },
};
