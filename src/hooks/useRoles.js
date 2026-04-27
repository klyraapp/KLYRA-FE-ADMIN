/**
 * useRoles Hook
 * React Query hooks for role management CRUD operations and app-components
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchRoles,
  createNewRole,
  updateExistingRole,
  deleteExistingRole,
  fetchAppComponents,
  fetchPermissions,
} from "@/api/rbacApi";
import { getRolePermissions } from "@/api/rolesApi";
import useToast from "@/hooks/useToast";

const ROLES_QUERY_KEY = "roles";
const APP_COMPONENTS_QUERY_KEY = "appComponents";
const PERMISSIONS_QUERY_KEY = "permissions";

/**
 * Fetches all roles.
 * @param {object} options - Additional react-query options.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
const useRolesList = (options = {}) => {
  return useQuery({
    queryKey: [ROLES_QUERY_KEY],
    queryFn: async () => {
      const response = await fetchRoles();
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Fetches all available permissions from /api/app-components.
 * @param {object} options - Additional react-query options.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
const useAppComponents = (options = {}) => {
  return useQuery({
    queryKey: [APP_COMPONENTS_QUERY_KEY],
    queryFn: async () => {
      const response = await fetchAppComponents();
      return response?.data?.records || response?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Fetches all permissions from legacy /permissions endpoint.
 * Falls back to this if /app-components is unavailable.
 * @param {object} options - Additional react-query options.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
const usePermissionsList = (options = {}) => {
  return useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await fetchPermissions();
      return response?.data?.records || response?.data || [];
    },
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

/**
 * Create role mutation hook.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
const useCreateRole = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createNewRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      toast.success(response?.data?.message || "Role created successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create role",
      );
    },
  });
};

/**
 * Update role mutation hook.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateExistingRole(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      toast.success(response?.data?.message || "Role updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update role",
      );
    },
  });
};

/**
 * Delete role mutation hook.
 * @returns {import("@tanstack/react-query").UseMutationResult}
 */
const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteExistingRole,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
      toast.success(response?.data?.message || "Role deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete role",
      );
    },
  });
};

/**
 * Fetches permissions for a specific role.
 * @param {number} roleId - Role ID.
 * @param {object} options - Additional react-query options.
 * @returns {import("@tanstack/react-query").UseQueryResult}
 */
const useRolePermissions = (roleId, options = {}) => {
  return useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY, roleId],
    queryFn: async () => {
      const response = await getRolePermissions(roleId);
      return response?.data?.records || response?.data || [];
    },
    enabled: Boolean(roleId),
    staleTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export {
  useRolesList,
  useAppComponents,
  usePermissionsList,
  useRolePermissions,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  ROLES_QUERY_KEY,
  APP_COMPONENTS_QUERY_KEY,
  PERMISSIONS_QUERY_KEY,
};
