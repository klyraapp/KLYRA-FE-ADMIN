/**
 * Analytics API
 * Handles all analytics-related API calls
 */

import api from "@/utils/axiosMiddleware";

const ANALYTICS_ENDPOINT = "/analytics-and-stats";

export const getDashboardStats = (params = {}) => {
  return api.get(`${ANALYTICS_ENDPOINT}/dashboard`, { params });
};

export const getAnalyticsStats = (params = {}) => {
  return api.get(`${ANALYTICS_ENDPOINT}/analytics`, { params });
};
