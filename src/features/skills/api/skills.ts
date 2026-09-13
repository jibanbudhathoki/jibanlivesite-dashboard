import { apiClient } from "@/src/lib/apiClient";
import { Skill, CreateSkillPayload, UpdateSkillPayload } from "../types";

export const getSkills = async (): Promise<Skill[]> => {
  try {
    const response = await apiClient.get("/v1/admin/skills", {
      params: { _t: new Date().getTime() }
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error("Failed to fetch skills", error);
    return [];
  }
};

export const createSkill = async (data: CreateSkillPayload): Promise<Skill> => {
  const response = await apiClient.post("/v1/admin/skills", data);
  if (response.data.success === false)
    throw new Error(response.data.message || "Failed to create skill");
  return response.data.data || response.data;
};

export const updateSkill = async (
  id: string,
  data: UpdateSkillPayload,
): Promise<Skill> => {
  const response = await apiClient.patch(`/v1/admin/skills/${id}`, data);
  if (response.data.success === false)
    throw new Error(response.data.message || "Failed to update skill");
  return response.data.data || response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/v1/admin/skills/${id}`);
  if (response.data.success === false)
    throw new Error(
      response.data.message || response.data.error || "Failed to delete skill",
    );
};
