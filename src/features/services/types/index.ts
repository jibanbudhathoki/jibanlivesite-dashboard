export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateServicePayload = Omit<
  Service,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateServicePayload = Partial<CreateServicePayload>;
