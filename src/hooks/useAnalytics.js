/**
 * useAnalytics Hook
 * Handles analytics data fetching
 */

import { getAnalyticsStats, getDashboardStats } from "@/api/analyticsApi";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEY = "dashboardStats";
const ANALYTICS_QUERY_KEY = "analyticsStats";

export const useDashboardData = (options = {}) => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: async () => {
      const response = await getDashboardStats();
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAnalyticsData = (options = {}) => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEY],
    queryFn: async () => {
      const response = await getAnalyticsStats();
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
