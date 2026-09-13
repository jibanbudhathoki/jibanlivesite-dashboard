export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverKey?: string;
  coverUrl?: string;
  tags: string[];
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePostPayload = Omit<Post, "id" | "coverUrl" | "createdAt" | "updatedAt">;

export type UpdatePostPayload = Partial<CreatePostPayload>;
