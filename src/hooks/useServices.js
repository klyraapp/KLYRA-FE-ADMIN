/**
 * useServices Hook
 * Handles services data fetching and mutations
 */

import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  getServicesAdmin,
  updateService,
} from "@/api/servicesApi";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const SERVICES_QUERY_KEY = "services";
const SERVICES_ADMIN_QUERY_KEY = "servicesAdmin";

export const useServices = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [SERVICES_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getServices(params);
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useServicesAdmin = (params = {}, options = {}) => {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  return useQuery({
    queryKey: [SERVICES_ADMIN_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getServicesAdmin(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const services = data[0];
        const totalCount = data[1] || 0;
        return {
          services: Array.isArray(services) ? services : [],
          totalCount,
        };
      }

      return { services: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: isSuperAdmin && (options.enabled !== false),
    ...options,
  });
};

export const useServiceById = (id, options = {}) => {
  return useQuery({
    queryKey: [SERVICES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getServiceById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_ADMIN_QUERY_KEY] });
      toast.success("messages.serviceCreated");
    },
    onError: () => {
      toast.error("messages.serviceCreateFailed");
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_ADMIN_QUERY_KEY] });
      toast.success("messages.serviceUpdated");
    },
    onError: () => {
      toast.error("messages.serviceUpdateFailed");
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SERVICES_ADMIN_QUERY_KEY] });
      toast.success("messages.serviceDeleted");
    },
    onError: () => {
      toast.error("messages.serviceDeleteFailed");
    },
  });
};
