import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../api/education";
import { CreateEducationPayload, UpdateEducationPayload, Education } from "../types";

export const EDUCATION_QUERY_KEY = ["educations"];

export const useEducationsQuery = () => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEY,
    queryFn: getEducations,
  });
};

export const useCreateEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEducationPayload) => createEducation(data),
    onMutate: async (newEdu: CreateEducationPayload) => {
      await queryClient.cancelQueries({ queryKey: EDUCATION_QUERY_KEY });
      const previousEducation = queryClient.getQueryData<Education[]>(EDUCATION_QUERY_KEY) || [];
      const optimisticEdu: Education = {
        ...newEdu,
        id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Education[]>(EDUCATION_QUERY_KEY, [optimisticEdu, ...previousEducation]);
      return { previousEducation };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousEducation) {
        queryClient.setQueryData(EDUCATION_QUERY_KEY, context.previousEducation);
      }
    },
    onSuccess: (savedEdu) => {
      queryClient.setQueryData<Education[]>(EDUCATION_QUERY_KEY, (old) => {
        if (!old) return [savedEdu];
        return old.map((e) => (e.id.startsWith("temp-") ? savedEdu : e));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
};

export const useUpdateEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationPayload }) =>
      updateEducation({ id, data }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: EDUCATION_QUERY_KEY });
      const previousEducation = queryClient.getQueryData<Education[]>(EDUCATION_QUERY_KEY) || [];
      queryClient.setQueryData<Education[]>(EDUCATION_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((e) => (e.id === id ? { ...e, ...data, updatedAt: new Date().toISOString() } : e));
      });
      return { previousEducation };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousEducation) {
        queryClient.setQueryData(EDUCATION_QUERY_KEY, context.previousEducation);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
};

export const useDeleteEducationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: EDUCATION_QUERY_KEY });
      const previousEducation = queryClient.getQueryData(EDUCATION_QUERY_KEY);
      queryClient.setQueryData(EDUCATION_QUERY_KEY, (old: Education[] | undefined) =>
        old ? old.filter((edu) => edu.id !== id) : []
      );
      return { previousEducation };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(EDUCATION_QUERY_KEY, context?.previousEducation);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: EDUCATION_QUERY_KEY });
    },
  });
};
