export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  sortOrder?: number;
}

export type CreateSocialPayload = Omit<SocialLink, "id">;
export type UpdateSocialPayload = Partial<CreateSocialPayload>;
