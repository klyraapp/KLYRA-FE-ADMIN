/**
 * useAppSettings Hook
 * Manages fetching and updating application settings
 */

import useToast from "@/hooks/useToast";
import { selectIsSuperAdmin } from "@/redux/reducers/permissionSlice";
import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAppSettings, updateAppSettings } from "../services/appSettingsService";

const APP_SETTINGS_QUERY_KEY = "appSettings";

/**
 * Hook to fetch all app settings
 * @param {Object} params - Query parameters (used by super admins)
 * @param {number|string|null} pathLocationId - Path-based location ID (used by regular admins)
 * @param {Object} options - React Query options
 */
export const useAppSettings = (params = {}, pathLocationId = null, options = {}) => {
  const isSuperAdmin = useSelector(selectIsSuperAdmin);

  return useQuery({
    queryKey: [APP_SETTINGS_QUERY_KEY, params, pathLocationId],
    queryFn: async () => {
      const response = await getAppSettings(params, pathLocationId);
      return response?.data;
    },
    enabled: (isSuperAdmin ? !!pathLocationId : !pathLocationId) && (options.enabled !== false),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to update app settings
 */
export const useUpdateAppSettings = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateAppSettings(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [APP_SETTINGS_QUERY_KEY, id] });
      toast.success("messages.settingsUpdated");
    },
    onError: () => {
      toast.error("messages.settingsUpdateFailed");
    },
  });
};
