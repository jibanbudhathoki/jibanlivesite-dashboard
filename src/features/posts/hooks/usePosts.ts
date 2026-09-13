import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPosts, createPost, updatePost, deletePost } from "../api/posts";
import { CreatePostPayload, UpdatePostPayload, Post } from "../types";

export const POSTS_QUERY_KEY = ["posts"];

export const usePostsQuery = () => {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: getPosts,
  });
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostPayload) => createPost(data),
    onMutate: async (newPost: CreatePostPayload) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY) || [];
      const optimisticPost: Post = {
        ...newPost,
        id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, [optimisticPost, ...previousPosts]);
      return { previousPosts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
    },
    onSuccess: (savedPost) => {
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old) => {
        if (!old) return [savedPost];
        return old.map((p) => (p.id.startsWith("temp-") ? savedPost : p));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
};

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostPayload }) =>
      updatePost({ id, data }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY) || [];
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      });
      return { previousPosts };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
};

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData(POSTS_QUERY_KEY);
      queryClient.setQueryData(POSTS_QUERY_KEY, (old: Post[] | undefined) =>
        old ? old.filter((post) => post.id !== id) : []
      );
      return { previousPosts };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(POSTS_QUERY_KEY, context?.previousPosts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
};
