export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

export type UpdateProfilePayload = Partial<Omit<Profile, 'id'>>;
