export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateFaqPayload = Omit<Faq, "id" | "createdAt" | "updatedAt">;

export type UpdateFaqPayload = Partial<CreateFaqPayload>;
