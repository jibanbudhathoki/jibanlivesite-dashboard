export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  description?: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateEducationPayload = Omit<Education, "id" | "createdAt" | "updatedAt">;
export type UpdateEducationPayload = Partial<CreateEducationPayload>;
