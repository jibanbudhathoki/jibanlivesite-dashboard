import { apiClient } from "@/src/lib/apiClient";

export interface Media {
  id: string;
  filename: string;
  mediaKey: string;
  url: string;
  mimetype: string;
  size: number;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getMedia = async (): Promise<Media[]> => {
  const response = await apiClient.get<ApiResponse<Media[]>>(
    `/v1/admin/media?_t=${new Date().getTime()}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch media");
  }
  return response.data.data;
};

export const uploadMedia = async (
  file: File,
  alt?: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (alt) {
    formData.append("alt", alt);
  }

  const response = await apiClient.post<ApiResponse<string>>(
    "/v1/admin/media/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to upload media");
  }
  return response.data.data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/v1/admin/media/${id}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete media");
  }
};
