import { apiClient } from "@/src/lib/apiClient";
import { CreateEducationPayload, Education, UpdateEducationPayload } from "../types";

// Standard ApiResponse type matching other modules
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getEducations = async (): Promise<Education[]> => {
  // Use cache-busting to prevent stale data
  const response = await apiClient.get<ApiResponse<Education[]>>(
    `/v1/admin/education?_t=${new Date().getTime()}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch educations");
  }
  return response.data.data;
};

export const createEducation = async (
  data: CreateEducationPayload,
): Promise<Education> => {
  const response = await apiClient.post<ApiResponse<Education>>(
    "/v1/admin/education",
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create education");
  }
  return response.data.data;
};

export const updateEducation = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateEducationPayload;
}): Promise<Education> => {
  const response = await apiClient.patch<ApiResponse<Education>>(
    `/v1/admin/education/${id}`,
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update education");
  }
  return response.data.data;
};

export const deleteEducation = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/v1/admin/education/${id}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete education");
  }
};
