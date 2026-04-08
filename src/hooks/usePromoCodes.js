/**
 * usePromoCodes Hook
 * Handles promo codes data fetching and mutations
 */

import {
  createPromoCode,
  deletePromoCode,
  getPromoCodeById,
  getPromoCodes,
  updatePromoCode,
} from "@/api/promoCodesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const PROMO_CODES_QUERY_KEY = "promoCodes";

export const usePromoCodes = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [PROMO_CODES_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getPromoCodes(params);
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const usePromoCodeById = (id, options = {}) => {
  return useQuery({
    queryKey: [PROMO_CODES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getPromoCodeById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_CODES_QUERY_KEY] });
      toast.success("messages.promoCodeCreated");
    },
    onError: () => {
      toast.error("messages.promoCodeCreateFailed");
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updatePromoCode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_CODES_QUERY_KEY] });
      toast.success("messages.promoCodeUpdated");
    },
    onError: () => {
      toast.error("messages.promoCodeUpdateFailed");
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMO_CODES_QUERY_KEY] });
      toast.success("messages.promoCodeDeleted");
    },
    onError: () => {
      toast.error("messages.promoCodeDeleteFailed");
    },
  });
};
