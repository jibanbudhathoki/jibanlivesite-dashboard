export interface ProjectImage {
  mediaKey: string;
  alt?: string;
  sortOrder?: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  coverKey?: string;
  coverUrl?: string;
  demoUrl?: string;
  repoUrl?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  startedAt?: string;
  completedAt?: string;
  images: ProjectImage[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectPayload = Omit<
  Project,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateProjectPayload = Partial<CreateProjectPayload>;
