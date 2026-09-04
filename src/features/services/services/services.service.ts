import { apiClient } from "@/src/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { Service, CreateServicePayload, UpdateServicePayload } from "../types";

export const servicesService = {
  getServices: async (): Promise<Service[]> => {
    const response = await apiClient.get<{ success: boolean; data: Service[] }>(
      endpoints.services,
    );
    return response.data.data;
  },

  createService: async (payload: CreateServicePayload): Promise<Service> => {
    const response = await apiClient.post<{ success: boolean; data: Service }>(
      endpoints.services,
      payload,
    );
    return response.data.data;
  },

  updateService: async (
    id: string,
    payload: UpdateServicePayload,
  ): Promise<Service> => {
    const response = await apiClient.patch<{ success: boolean; data: Service }>(
      `${endpoints.services}/${id}`,
      payload,
    );
    return response.data.data;
  },

  deleteService: async (id: string): Promise<void> => {
    await apiClient.delete(`${endpoints.services}/${id}`);
  },
};
