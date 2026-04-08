/**
 * Payments API Service
 * Handles all payment-related API calls
 */

import api from "@/utils/axiosMiddleware";

const PAYMENTS_ENDPOINT = "/payment";

export const getPayments = (params = {}) => {
  return api.get(PAYMENTS_ENDPOINT, { params });
};
