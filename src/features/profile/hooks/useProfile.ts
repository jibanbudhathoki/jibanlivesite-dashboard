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
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
