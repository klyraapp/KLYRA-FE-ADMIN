/**
 * Analytics API
 * Handles all analytics-related API calls
 */

import api from "@/utils/axiosMiddleware";

const ANALYTICS_ENDPOINT = "/analytics-and-stats";

export const getDashboardStats = () => {
  return api.get(`${ANALYTICS_ENDPOINT}/dashboard`);
};

export const getAnalyticsStats = () => {
  return api.get(`${ANALYTICS_ENDPOINT}/analytics`);
};
