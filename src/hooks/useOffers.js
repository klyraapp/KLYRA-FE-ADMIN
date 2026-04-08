/**
 * useOffers Hook
 * Handles special offers data fetching and mutations
 */

import {
  createOffer,
  deleteOffer,
  getOfferById,
  getOffers,
  updateOffer,
} from "@/api/offersApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const OFFERS_QUERY_KEY = "offers";

export const useOffers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [OFFERS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getOffers(params);
      return response?.data || [[], 0];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useOfferById = (id, options = {}) => {
  return useQuery({
    queryKey: [OFFERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getOfferById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
      toast.success("messages.offerCreated");
    },
    onError: () => {
      toast.error("messages.offerCreateFailed");
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateOffer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
      toast.success("messages.offerUpdated");
    },
    onError: () => {
      toast.error("messages.offerUpdateFailed");
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteOffer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_QUERY_KEY] });
      toast.success("messages.offerDeleted");
    },
    onError: () => {
      toast.error("messages.offerDeleteFailed");
    },
  });
};
