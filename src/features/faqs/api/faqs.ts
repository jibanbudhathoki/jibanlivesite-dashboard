import { apiClient } from "@/src/lib/apiClient";
import { CreateFaqPayload, Faq, UpdateFaqPayload } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getFaqs = async (): Promise<Faq[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Faq[]>>(
      `/v1/admin/faqs?_t=${Date.now()}`,
    );
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
  } catch (err: any) {
    // If it's 401, apiClient interceptor will handle redirect to login
    if (err.response?.status === 401) {
      throw err;
    }
    // Fallback to public faqs endpoint if admin fetch encounters an issue
    try {
      const pubRes = await apiClient.get<ApiResponse<Faq[]>>(`/v1/faqs?_t=${Date.now()}`);
      if (pubRes.data && Array.isArray(pubRes.data.data)) {
        return pubRes.data.data;
      }
    } catch {
      // ignore public fallback error
    }
    throw err;
  }
  return [];
};

export const createFaq = async (data: CreateFaqPayload): Promise<Faq> => {
  const response = await apiClient.post<ApiResponse<Faq>>(
    "/v1/admin/faqs",
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create FAQ");
  }
  return response.data.data;
};

export const updateFaq = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateFaqPayload;
}): Promise<Faq> => {
  const response = await apiClient.patch<ApiResponse<Faq>>(
    `/v1/admin/faqs/${id}`,
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update FAQ");
  }
  return response.data.data;
};

export const deleteFaq = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/v1/admin/faqs/${id}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete FAQ");
  }
};
