export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  highlights: string[];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateExperiencePayload = Omit<
  Experience,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateExperiencePayload = Partial<CreateExperiencePayload>;
