/**
 * useAppSettings Hook
 * Manages fetching and updating application settings
 */

import useToast from "@/hooks/useToast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAppSettings, updateAppSettings } from "../services/appSettingsService";

const APP_SETTINGS_QUERY_KEY = "appSettings";

/**
 * Hook to fetch all app settings
 * @param {Object} options 
 */
export const useAppSettings = (options = {}) => {
  return useQuery({
    queryKey: [APP_SETTINGS_QUERY_KEY],
    queryFn: async () => {
      const response = await getAppSettings();
      return response?.data;
    },
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
