import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../api/experience";
import { CreateExperiencePayload, UpdateExperiencePayload, Experience } from "../types";

export const EXPERIENCE_QUERY_KEY = ["experiences"] as const;

export const useExperiencesQuery = () => {
  return useQuery({
    queryKey: EXPERIENCE_QUERY_KEY,
    queryFn: getExperiences,
  });
};

export const useCreateExperienceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExperiencePayload) => createExperience(data),
    onMutate: async (newExp: CreateExperiencePayload) => {
      await queryClient.cancelQueries({ queryKey: EXPERIENCE_QUERY_KEY });
      const previousExperience = queryClient.getQueryData<Experience[]>(EXPERIENCE_QUERY_KEY) || [];
      const optimisticExp: Experience = {
        ...newExp,
        id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Experience[]>(EXPERIENCE_QUERY_KEY, [optimisticExp, ...previousExperience]);
      return { previousExperience };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousExperience) {
        queryClient.setQueryData(EXPERIENCE_QUERY_KEY, context.previousExperience);
      }
    },
    onSuccess: (savedExp) => {
      queryClient.setQueryData<Experience[]>(EXPERIENCE_QUERY_KEY, (old) => {
        if (!old) return [savedExp];
        return old.map((e) => (e.id.startsWith("temp-") ? savedExp : e));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCE_QUERY_KEY });
    },
  });
};

export const useUpdateExperienceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExperiencePayload;
    }) => updateExperience(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: EXPERIENCE_QUERY_KEY });
      const previousExperience = queryClient.getQueryData<Experience[]>(EXPERIENCE_QUERY_KEY) || [];
      queryClient.setQueryData<Experience[]>(EXPERIENCE_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((e) => (e.id === id ? { ...e, ...payload, updatedAt: new Date().toISOString() } : e));
      });
      return { previousExperience };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousExperience) {
        queryClient.setQueryData(EXPERIENCE_QUERY_KEY, context.previousExperience);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCE_QUERY_KEY });
    },
  });
};

export const useDeleteExperienceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: EXPERIENCE_QUERY_KEY });
      const previousExperience = queryClient.getQueryData(EXPERIENCE_QUERY_KEY);
      queryClient.setQueryData(EXPERIENCE_QUERY_KEY, (old: Experience[] | undefined) =>
        old ? old.filter((exp) => exp.id !== id) : []
      );
      return { previousExperience };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(EXPERIENCE_QUERY_KEY, context?.previousExperience);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCE_QUERY_KEY });
    },
  });
};
