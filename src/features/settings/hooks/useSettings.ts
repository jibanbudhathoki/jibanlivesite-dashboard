import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../services/settings.service";
import { UpdateSiteSettingsPayload } from "../types";

export const SETTINGS_QUERY_KEY = ["site_settings"] as const;

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: settingsService.getSettings,
  });
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSiteSettingsPayload) =>
      settingsService.updateSettings(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      const previousSettings = queryClient.getQueryData(SETTINGS_QUERY_KEY);
      queryClient.setQueryData(SETTINGS_QUERY_KEY, (old: any) => ({
        ...old,
        ...payload,
      }));
      return { previousSettings };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
};
