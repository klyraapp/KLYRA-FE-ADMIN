/**
 * Subscriptions API Service
 * Handles all subscription-related API calls
 */

import api from "@/utils/axiosMiddleware";

const SUBSCRIPTIONS_ENDPOINT = "/subscription";

export const getSubscriptions = (params = {}) => {
  return api.get(`${SUBSCRIPTIONS_ENDPOINT}/admin`, { params });
};

export const getSubscriptionById = (id) => {
  return api.get(`${SUBSCRIPTIONS_ENDPOINT}/${id}`);
};

export const updateSubscription = (id, data) => {
  return api.patch(`${SUBSCRIPTIONS_ENDPOINT}/${id}`, data);
};

export const updateSubscriptionPaymentMethod = (id, paymentMethodId) => {
  return api.patch(`${SUBSCRIPTIONS_ENDPOINT}/${id}/payment-method`, {
    paymentMethodId,
  });
};
