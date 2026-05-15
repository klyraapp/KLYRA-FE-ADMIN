/**
 * useAnalytics Hook
 * Handles analytics data fetching
 */

import { getAnalyticsStats, getDashboardStats } from "@/api/analyticsApi";
import { useQuery } from "@tanstack/react-query";

const DASHBOARD_QUERY_KEY = "dashboardStats";
const ANALYTICS_QUERY_KEY = "analyticsStats";

export const useDashboardData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getDashboardStats(params);
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useAnalyticsData = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [ANALYTICS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getAnalyticsStats(params);
      return response?.data || null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
