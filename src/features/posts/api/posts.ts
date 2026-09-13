import { apiClient } from "@/src/lib/apiClient";
import { CreatePostPayload, Post, UpdatePostPayload } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<ApiResponse<Post[]>>(
    `/v1/admin/posts?_t=${new Date().getTime()}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to fetch posts");
  }
  return response.data.data;
};

export const createPost = async (data: CreatePostPayload): Promise<Post> => {
  const response = await apiClient.post<ApiResponse<Post>>(
    "/v1/admin/posts",
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to create post");
  }
  return response.data.data;
};

export const updatePost = async ({
  id,
  data,
}: {
  id: string;
  data: UpdatePostPayload;
}): Promise<Post> => {
  const response = await apiClient.patch<ApiResponse<Post>>(
    `/v1/admin/posts/${id}`,
    data,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to update post");
  }
  return response.data.data;
};

export const deletePost = async (id: string): Promise<void> => {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/v1/admin/posts/${id}`,
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Failed to delete post");
  }
};
