/**
 * useServiceLocations Hook
 * Manages fetching and state of service locations.
 */

import { useLocation } from "@/context/LocationContext";

/**
 * Hook to fetch and manage active service locations.
 * Now uses LocationContext for shared state.
 * @returns {object} { locations, isLoading, error, refreshLocations }
 */
export const useServiceLocations = () => {
  const { locations, isLoading, error, refreshLocations } = useLocation();

  return {
    locations,
    isLoading,
    error,
    refreshLocations,
  };
};
