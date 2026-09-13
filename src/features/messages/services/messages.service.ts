import { apiClient } from "@/src/lib/apiClient";
import { endpoints } from "@/lib/endpoints";
import { ContactMessage, MessagesResponse } from "../types";

export const messagesService = {
  getMessages: async (unreadOnly?: boolean): Promise<MessagesResponse> => {
    const url = unreadOnly ? `${endpoints.messages}?unread=true` : endpoints.messages;
    const response = await apiClient.get<{
      success: boolean;
      data: ContactMessage[];
      meta: MessagesResponse["meta"];
    }>(url);
    return {
      data: response.data.data || [],
      meta: response.data.meta || {
        page: 1,
        limit: 20,
        total: (response.data.data || []).length,
        unread: (response.data.data || []).filter((m) => !m.isRead).length,
      },
    };
  },

  markAsRead: async (id: string): Promise<ContactMessage> => {
    const response = await apiClient.patch<{
      success: boolean;
      data: ContactMessage;
    }>(`${endpoints.messages}/${id}/read`);
    return response.data.data;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await apiClient.delete<{ success: boolean; data: { deleted: boolean } }>(
      `${endpoints.messages}/${id}`
    );
  },
};
