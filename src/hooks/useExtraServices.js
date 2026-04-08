/**
 * useExtraServices Hook
 * Handles extra services data fetching and mutations
 */

import {
  createExtraService,
  deleteExtraService,
  getExtraServiceById,
  getExtraServices,
  updateExtraService,
} from "@/api/extraServicesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const EXTRA_SERVICES_QUERY_KEY = "extraServices";

export const useExtraServices = (options = {}) => {
  return useQuery({
    queryKey: [EXTRA_SERVICES_QUERY_KEY],
    queryFn: async () => {
      const response = await getExtraServices();
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useExtraServiceById = (id, options = {}) => {
  return useQuery({
    queryKey: [EXTRA_SERVICES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getExtraServiceById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateExtraService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createExtraService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXTRA_SERVICES_QUERY_KEY] });
      toast.success("messages.extraServiceCreated");
    },
    onError: () => {
      toast.error("messages.extraServiceCreateFailed");
    },
  });
};

export const useUpdateExtraService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateExtraService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXTRA_SERVICES_QUERY_KEY] });
      toast.success("messages.extraServiceUpdated");
    },
    onError: () => {
      toast.error("messages.extraServiceUpdateFailed");
    },
  });
};

export const useDeleteExtraService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteExtraService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXTRA_SERVICES_QUERY_KEY] });
      toast.success("messages.extraServiceDeleted");
    },
    onError: () => {
      toast.error("messages.extraServiceDeleteFailed");
    },
  });
};
