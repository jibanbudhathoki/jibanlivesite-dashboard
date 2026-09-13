import { apiClient } from "@/src/lib/apiClient";
import { CreateProjectPayload, Project, UpdateProjectPayload } from "../types";

// Standard ApiResponse type matching other modules
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getProjects = async (): Promise<Project[]> => {
  // Use cache-busting to prevent stale data
  const response = await apiClient.get<ApiResponse<Project[]>>(
    `/v1/admin/projects?_t=${new Date().getTime()}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch projects");
  }
  return response.data.data;
};

export const createProject = async (
  data: CreateProjectPayload,
): Promise<Project> => {
  const response = await apiClient.post<ApiResponse<Project>>(
    "/v1/admin/projects",
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create project");
  }
  return response.data.data;
};

export const updateProject = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateProjectPayload;
}): Promise<Project> => {
  const response = await apiClient.patch<ApiResponse<Project>>(
    `/v1/admin/projects/${id}`,
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update project");
  }
  return response.data.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/v1/admin/projects/${id}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete project");
  }
};
