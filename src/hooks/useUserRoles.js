/**
 * useUserRoles Hook
 * Handles user list fetching and role assignment mutation for the User Roles page
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAdmins } from "@/hooks/useUsers";
import { useRolesList } from "./useRoles";
import { createUser, deleteUser, updateUser } from "@/api/userApi";
import useToast from "@/hooks/useToast";

const USERS_QUERY_KEY = "users";

/**
 * Hook for the User Roles page — provides user list, role list,
 * and a mutation to assign roles to a user.
 *
 * @param {object} userParams - Parameters for user list query.
 * @returns {{
 *   users: Array,
 *   isLoadingUsers: boolean,
 *   roles: Array,
 *   isLoadingRoles: boolean,
 *   assignRoles: Function,
 *   isAssigning: boolean,
 * }}
 */
const useUserRoles = (userParams = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
  } = useAdmins(userParams);

  const users = usersData?.records || [];
  const totalUsers = usersData?.total || 0;

  const {
    data: roles = [],
    isLoading: isLoadingRoles,
  } = useRolesList();

  const {
    mutate: createAdmin,
    isPending: isCreating,
  } = useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success(response?.data?.message || "User created successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create user",
      );
    },
  });

  const {
    mutate: updateAdmin,
    isPending: isUpdating,
  } = useMutation({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success(response?.data?.message || "User updated successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update user",
      );
    },
  });
  const {
    mutate: deleteAdmin,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success(response?.data?.message || "User deleted successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete user",
      );
    },
  });

  return {
    users,
    isLoadingUsers,
    roles,
    isLoadingRoles,
    createAdmin,
    isCreating,
    updateAdmin,
    isUpdating,
    deleteAdmin,
    isDeleting,
  };
};

export default useUserRoles;
