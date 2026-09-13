export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessagesResponse {
  data: ContactMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    unread: number;
  };
}
