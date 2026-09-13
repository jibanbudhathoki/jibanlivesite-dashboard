import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "../services/services.service";
import { Service, CreateServicePayload, UpdateServicePayload } from "../types";

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
    onMutate: async (payload: CreateServicePayload) => {
      await queryClient.cancelQueries({ queryKey: servicesKeys.lists() });
      const previousServices = queryClient.getQueryData<Service[]>(servicesKeys.lists()) || [];
      const optimisticService: Service = {
        id: "temp-" + Date.now(),
        title: payload.title,
        description: payload.description,
        features: payload.features || [],
        icon: payload.icon || "",
        sortOrder: payload.sortOrder ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Service[]>(servicesKeys.lists(), [optimisticService, ...previousServices]);
      return { previousServices };
    },
    onError: (_err, _payload, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(servicesKeys.lists(), context.previousServices);
      }
    },
    onSuccess: (savedService) => {
      queryClient.setQueryData<Service[]>(servicesKeys.lists(), (old) => {
        if (!old) return [savedService];
        return old.map((s) => (s.id.startsWith("temp-") ? savedService : s));
      });
    },
    onSettled: () => {
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
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: servicesKeys.lists() });
      const previousServices = queryClient.getQueryData<Service[]>(servicesKeys.lists()) || [];
      queryClient.setQueryData<Service[]>(servicesKeys.lists(), (old) => {
        if (!old) return [];
        return old.map((s) => (s.id === id ? { ...s, ...payload, updatedAt: new Date().toISOString() } : s));
      });
      return { previousServices };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousServices) {
        queryClient.setQueryData(servicesKeys.lists(), context.previousServices);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
};

export const useDeleteServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: servicesKeys.lists() });
      const previousServices = queryClient.getQueryData(servicesKeys.lists());
      queryClient.setQueryData(servicesKeys.lists(), (old: any[] | undefined) =>
        old ? old.filter((s) => s.id !== id) : []
      );
      return { previousServices };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(servicesKeys.lists(), context?.previousServices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: servicesKeys.lists() });
    },
  });
};
