import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "../services/services.service";
import { CreateServicePayload, UpdateServicePayload } from "../types";

export const servicesKeys = {
  all: ["services"] as const,
  lists: () => [...servicesKeys.all, "list"] as const,
};

export const useServicesQuery = () => {
  return useQuery({
    queryKey: servicesKeys.lists(),
    queryFn: servicesService.getServices,
  });
};

export const useCreateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      servicesService.createService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
};

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServicePayload;
    }) => servicesService.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
};
