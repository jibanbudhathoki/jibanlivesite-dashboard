import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "../api/faqs";
import { CreateFaqPayload, UpdateFaqPayload, Faq } from "../types";

export const FAQS_QUERY_KEY = ["faqs"];

export const useFaqsQuery = () => {
  return useQuery({
    queryKey: FAQS_QUERY_KEY,
    queryFn: getFaqs,
  });
};

export const useCreateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFaqPayload) => createFaq(data),
    onMutate: async (newFaq: CreateFaqPayload) => {
      await queryClient.cancelQueries({ queryKey: FAQS_QUERY_KEY });
      const previousFaqs = queryClient.getQueryData<Faq[]>(FAQS_QUERY_KEY) || [];
      const optimisticFaq: Faq = {
        ...newFaq,
        id: "temp-" + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Faq[]>(FAQS_QUERY_KEY, [optimisticFaq, ...previousFaqs]);
      return { previousFaqs };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFaqs) {
        queryClient.setQueryData(FAQS_QUERY_KEY, context.previousFaqs);
      }
    },
    onSuccess: (savedFaq) => {
      queryClient.setQueryData<Faq[]>(FAQS_QUERY_KEY, (old) => {
        if (!old) return [savedFaq];
        return old.map((f) => (f.id.startsWith("temp-") ? savedFaq : f));
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
    },
  });
};

export const useUpdateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFaqPayload }) =>
      updateFaq({ id, data }),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: FAQS_QUERY_KEY });
      const previousFaqs = queryClient.getQueryData<Faq[]>(FAQS_QUERY_KEY) || [];
      queryClient.setQueryData<Faq[]>(FAQS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((f) => (f.id === id ? { ...f, ...data, updatedAt: new Date().toISOString() } : f));
      });
      return { previousFaqs };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFaqs) {
        queryClient.setQueryData(FAQS_QUERY_KEY, context.previousFaqs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
    },
  });
};

export const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: FAQS_QUERY_KEY });
      const previousFaqs = queryClient.getQueryData(FAQS_QUERY_KEY);
      queryClient.setQueryData(FAQS_QUERY_KEY, (old: Faq[] | undefined) =>
        old ? old.filter((faq) => faq.id !== id) : [],
      );
      return { previousFaqs };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(FAQS_QUERY_KEY, context?.previousFaqs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAQS_QUERY_KEY });
    },
  });
};
