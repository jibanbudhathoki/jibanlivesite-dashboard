import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesService } from "../services/messages.service";
import { MessagesResponse } from "../types";

export const messagesKeys = {
  all: ["messages"] as const,
  list: (unreadOnly?: boolean) => [...messagesKeys.all, { unreadOnly }] as const,
};

export function useMessagesQuery(unreadOnly?: boolean) {
  return useQuery({
    queryKey: messagesKeys.list(unreadOnly),
    queryFn: () => messagesService.getMessages(unreadOnly),
  });
}

export function useMarkMessageReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: messagesKeys.all });
      const previousData = queryClient.getQueriesData<MessagesResponse>({ queryKey: messagesKeys.all });

      queryClient.setQueriesData<MessagesResponse>(
        { queryKey: messagesKeys.all },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
            meta: {
              ...old.meta,
              unread: Math.max(0, (old.meta?.unread || 1) - 1),
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all });
    },
  });
}

export function useDeleteMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => messagesService.deleteMessage(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: messagesKeys.all });
      const previousData = queryClient.getQueriesData<MessagesResponse>({ queryKey: messagesKeys.all });

      queryClient.setQueriesData<MessagesResponse>(
        { queryKey: messagesKeys.all },
        (old) => {
          if (!old || !old.data) return old;
          const wasUnread = old.data.find((m) => m.id === id && !m.isRead);
          return {
            ...old,
            data: old.data.filter((m) => m.id !== id),
            meta: {
              ...old.meta,
              total: Math.max(0, (old.meta?.total || 1) - 1),
              unread: wasUnread ? Math.max(0, (old.meta?.unread || 1) - 1) : (old.meta?.unread || 0),
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all });
    },
  });
}
