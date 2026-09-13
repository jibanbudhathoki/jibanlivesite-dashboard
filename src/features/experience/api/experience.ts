import { apiClient } from "@/src/lib/apiClient";
import {
  Experience,
  CreateExperiencePayload,
  UpdateExperiencePayload,
} from "../types";

export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await apiClient.get("/v1/admin/experience", {
      params: { _t: new Date().getTime() },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch experiences", error);
    return [];
  }
};

export const createExperience = async (
  data: CreateExperiencePayload,
): Promise<Experience> => {
  const response = await apiClient.post("/v1/admin/experience", data);
  if (response.data.success === false)
    throw new Error(response.data.message || "Failed to create experience");
  return response.data.data || response.data;
};

export const updateExperience = async (
  id: string,
  data: UpdateExperiencePayload,
): Promise<Experience> => {
  const response = await apiClient.patch(`/v1/admin/experience/${id}`, data);
  if (response.data.success === false)
    throw new Error(response.data.message || "Failed to update experience");
  return response.data.data || response.data;
};

export const deleteExperience = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/v1/admin/experience/${id}`);
  if (response.data.success === false)
    throw new Error(
      response.data.message ||
        response.data.error ||
        "Failed to delete experience",
    );
};
