/**
 * useUsers Hook
 * Handles users data fetching and mutations
 */

import {
  createUser,
  deleteUser,
  getUserById,
  getAdmins,
  getUsers,
  updateUser,
} from "@/api/userApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const USERS_QUERY_KEY = "users";

export const useUsers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getUsers(params);
      const rawData = response?.data?.records || response?.data || [];
      
      const records = Array.isArray(rawData) ? rawData : [];
      
      return records.map(user => ({
        id: user?.id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        isActive: Boolean(user?.isActive),
        createdAt: user?.createdAt,
        ...user
      }));
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAdmins = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["admins", params],
    queryFn: async () => {
      const response = await getAdmins(params);
      // Structure: [[user1, user2], totalCount]
      const [records = [], count = 0] = response?.data || [[], 0];
      
      return records.map(user => ({
        id: user?.id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        isActive: Boolean(user?.isActive),
        createdAt: user?.createdAt,
        ...user
      }));
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useUserById = (id, options = {}) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getUserById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("messages.customerCreated");
    },
    onError: () => {
      toast.error("messages.customerCreateFailed");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("messages.customerUpdated");
    },
    onError: () => {
      toast.error("messages.customerUpdateFailed");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      toast.success("messages.customerDeleted");
    },
    onError: () => {
      toast.error("messages.customerDeleteFailed");
    },
  });
};
