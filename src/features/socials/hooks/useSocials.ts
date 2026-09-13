import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { socialsService } from "../services/socials.service";
import { CreateSocialPayload, UpdateSocialPayload, SocialLink } from "../types";

export const SOCIALS_QUERY_KEY = ["socials"] as const;

export const useSocialsQuery = () => {
  return useQuery({
    queryKey: SOCIALS_QUERY_KEY,
    queryFn: socialsService.getSocials,
  });
};

export const useCreateSocialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSocialPayload) =>
      socialsService.createSocial(payload),
    onMutate: async (newSocial) => {
      await queryClient.cancelQueries({ queryKey: SOCIALS_QUERY_KEY });
      const previousSocials = queryClient.getQueryData<SocialLink[]>(SOCIALS_QUERY_KEY) || [];
      const optimisticItem: SocialLink = {
        id: `temp-${Date.now()}`,
        platform: newSocial.platform,
        label: newSocial.label,
        url: newSocial.url,
        sortOrder: newSocial.sortOrder ?? previousSocials.length + 1,
      };
      queryClient.setQueryData<SocialLink[]>(SOCIALS_QUERY_KEY, [...previousSocials, optimisticItem]);
      return { previousSocials };
    },
    onError: (_err, _newSocial, context) => {
      if (context?.previousSocials) {
        queryClient.setQueryData(SOCIALS_QUERY_KEY, context.previousSocials);
      }
    },
    onSuccess: (savedSocial) => {
      queryClient.setQueryData<SocialLink[]>(SOCIALS_QUERY_KEY, (old) =>
        old ? old.map((s) => (s.id.startsWith("temp-") ? savedSocial : s)) : [savedSocial]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
    },
  });
};

export const useUpdateSocialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSocialPayload }) =>
      socialsService.updateSocial(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: SOCIALS_QUERY_KEY });
      const previousSocials = queryClient.getQueryData<SocialLink[]>(SOCIALS_QUERY_KEY);
      queryClient.setQueryData<SocialLink[]>(SOCIALS_QUERY_KEY, (old) =>
        old
          ? old.map((s) => (s.id === id ? { ...s, ...payload } : s))
          : []
      );
      return { previousSocials };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSocials) {
        queryClient.setQueryData(SOCIALS_QUERY_KEY, context.previousSocials);
      }
    },
    onSuccess: (savedSocial) => {
      queryClient.setQueryData<SocialLink[]>(SOCIALS_QUERY_KEY, (old) =>
        old ? old.map((s) => (s.id === savedSocial.id ? savedSocial : s)) : [savedSocial]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
    },
  });
};

export const useDeleteSocialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => socialsService.deleteSocial(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: SOCIALS_QUERY_KEY });
      const previousSocials = queryClient.getQueryData<SocialLink[]>(SOCIALS_QUERY_KEY);
      queryClient.setQueryData<SocialLink[]>(SOCIALS_QUERY_KEY, (old) =>
        old ? old.filter((s) => s.id !== id) : []
      );
      return { previousSocials };
    },
    onError: (_err, _id, context) => {
      if (context?.previousSocials) {
        queryClient.setQueryData(SOCIALS_QUERY_KEY, context.previousSocials);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SOCIALS_QUERY_KEY });
    },
  });
};
