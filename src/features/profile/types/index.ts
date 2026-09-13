export interface StoryBlock {
  id: string;
  image?: string;
  imageAlt?: string;
  content: string; // rich text HTML
  layout?: 'image-left' | 'image-right';
}

export interface AboutStory {
  items?: StoryBlock[];
  storyImage1?: string;
  storyImage2?: string;
  paragraphs1?: string[];
  paragraphs2?: string[];
  storyBio1?: string;
  storyBio2?: string;
  storyBio3?: string;
  storyBio4?: string;
  storyBio5?: string;
}

export interface ProfileMeta {
  firstName?: string;
  lastName?: string;
  introLabel?: string;
  subtitleLine2?: string;
  ctaText?: string;
  ctaHref?: string;
  accentColor?: string;
  heroImageUrl?: string | null;
  aboutStory?: AboutStory;
  [key: string]: unknown;
}

export interface Profile {
  fullName: string;
  headline: string;
  bio: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  avatarKey?: string | null;
  avatarUrl?: string | null;
  resumeKey?: string | null;
  resumeUrl?: string | null;
  availability?: string;
  meta?: ProfileMeta;
  updatedAt?: string;
}

export type UpdateProfilePayload = {
  fullName: string;
  headline?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  avatarKey?: string | null;
  resumeKey?: string | null;
  availability?: string;
  meta?: ProfileMeta;
};
