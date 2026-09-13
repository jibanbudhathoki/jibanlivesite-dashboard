export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  featured?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateSkillPayload = Omit<
  Skill,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateSkillPayload = Partial<CreateSkillPayload>;
