import { apiClient } from '@/src/lib/apiClient';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await apiClient.get('/v1/admin/services');
    return response.data;
  } catch (error) {
    // Mocking response for preview if endpoint doesn't exist
    return [
      { id: '1', title: 'Web Development', description: 'Building scalable and responsive modern web applications.' },
      { id: '2', title: 'UI/UX Design', description: 'Crafting intuitive and beautiful user interfaces.' },
      { id: '3', title: 'Technical Consulting', description: 'Expert advice on system architecture and tech stacks.' },
    ];
  }
};

export const createService = async (data: Omit<Service, 'id'>) => {
  const response = await apiClient.post('/v1/admin/services', data);
  return response.data;
};

export const updateService = async (id: string, data: Partial<Service>) => {
  const response = await apiClient.patch(`/v1/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: string) => {
  const response = await apiClient.delete(`/v1/admin/services/${id}`);
  return response.data;
};
