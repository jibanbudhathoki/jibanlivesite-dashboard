import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../api/skills';
import { CreateSkillPayload, UpdateSkillPayload, Skill } from '../types';

export const SKILLS_QUERY_KEY = ['skills'] as const;

export const useSkillsQuery = () => {
  return useQuery({
    queryKey: SKILLS_QUERY_KEY,
    queryFn: getSkills,
  });
};

export const useCreateSkillMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSkillPayload) => createSkill(data),
    onMutate: async (newSkill) => {
      await queryClient.cancelQueries({ queryKey: SKILLS_QUERY_KEY });
      const previousSkills = queryClient.getQueryData<Skill[]>(SKILLS_QUERY_KEY) || [];
      const optimisticItem: Skill = {
        id: `temp-${Date.now()}`,
        name: newSkill.name,
        category: newSkill.category,
        proficiency: newSkill.proficiency,
        icon: newSkill.icon,
        featured: newSkill.featured,
        sortOrder: newSkill.sortOrder,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Skill[]>(SKILLS_QUERY_KEY, [...previousSkills, optimisticItem]);
      return { previousSkills };
    },
    onError: (_err, _newSkill, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(SKILLS_QUERY_KEY, context.previousSkills);
      }
    },
    onSuccess: (savedSkill) => {
      queryClient.setQueryData<Skill[]>(SKILLS_QUERY_KEY, (old) =>
        old ? old.map((s) => (s.id.startsWith('temp-') ? savedSkill : s)) : [savedSkill]
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
};

export const useUpdateSkillMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSkillPayload }) => 
      updateSkill(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: SKILLS_QUERY_KEY });
      const previousSkills = queryClient.getQueryData<Skill[]>(SKILLS_QUERY_KEY);
      queryClient.setQueryData<Skill[]>(SKILLS_QUERY_KEY, (old) =>
        old ? old.map((s) => (s.id === id ? { ...s, ...payload, updatedAt: new Date().toISOString() } : s)) : []
      );
      return { previousSkills };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(SKILLS_QUERY_KEY, context.previousSkills);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
};

export const useDeleteSkillMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: SKILLS_QUERY_KEY });
      const previousSkills = queryClient.getQueryData<Skill[]>(SKILLS_QUERY_KEY);
      queryClient.setQueryData<Skill[]>(SKILLS_QUERY_KEY, (old) =>
        old ? old.filter((s) => s.id !== id) : []
      );
      return { previousSkills };
    },
    onError: (err, id, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(SKILLS_QUERY_KEY, context.previousSkills);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SKILLS_QUERY_KEY });
    },
  });
};
