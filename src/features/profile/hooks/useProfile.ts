import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';
import { UpdateProfilePayload } from '../types';

export const profileKeys = {
  all: ['profile'] as const,
};

export const useProfileQuery = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: profileService.getProfile,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: profileKeys.all });
      const previousProfile = queryClient.getQueryData(profileKeys.all);
      queryClient.setQueryData(profileKeys.all, (old: any) => ({
        ...old,
        ...payload,
      }));
      return { previousProfile };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(profileKeys.all, context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
