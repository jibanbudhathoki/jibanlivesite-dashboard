import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import { CreateProjectPayload, UpdateProjectPayload, Project } from "../types";

export const PROJECTS_QUERY_KEY = ["projects"];

export const useProjectsQuery = () => {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectPayload) => createProject(data),
    onMutate: async (newProject: CreateProjectPayload) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY) || [];
      const optimisticProject: Project = {
        ...newProject,
        id: "temp-" + Date.now(),
        coverKey: newProject.coverKey,
        demoUrl: newProject.demoUrl,
        repoUrl: newProject.repoUrl,
        startedAt: newProject.startedAt,
        completedAt: newProject.completedAt,
        images: newProject.images || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, [optimisticProject, ...previousProjects]);
      return { previousProjects };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECTS_QUERY_KEY, context.previousProjects);
      }
    },
    onSuccess: (savedProject) => {
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old) => {
        if (!old) return [savedProject];
        return old.map((p) => (p.id.startsWith("temp-") ? savedProject : p));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectPayload;
    }) => updateProject({ id, data }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData<Project[]>(PROJECTS_QUERY_KEY) || [];
      queryClient.setQueryData<Project[]>(PROJECTS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      });
      return { previousProjects };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(PROJECTS_QUERY_KEY, context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PROJECTS_QUERY_KEY });
      const previousProjects = queryClient.getQueryData(PROJECTS_QUERY_KEY);
      queryClient.setQueryData(PROJECTS_QUERY_KEY, (old: Project[] | undefined) =>
        old ? old.filter((p) => p.id !== id) : []
      );
      return { previousProjects };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(PROJECTS_QUERY_KEY, context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
  });
};
