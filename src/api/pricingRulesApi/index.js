/**
 * Pricing Rules API
 * Handles all pricing rule-related API calls
 * Endpoints: GET, POST, PATCH, DELETE /pricing-rules
 */

import api from "@/utils/axiosMiddleware";

const PRICING_RULES_ENDPOINT = "/pricing-rules";

export const getPricingRules = (params = {}) => {
  return api.get(PRICING_RULES_ENDPOINT, { params });
};

export const getPricingRuleById = (id) => {
  return api.get(`${PRICING_RULES_ENDPOINT}/${id}`);
};

export const createPricingRule = (data) => {
  return api.post(PRICING_RULES_ENDPOINT, data);
};

export const updatePricingRule = (id, data) => {
  return api.patch(`${PRICING_RULES_ENDPOINT}/${id}`, data);
};

export const deletePricingRule = (id) => {
  return api.delete(`${PRICING_RULES_ENDPOINT}/${id}`);
};

export const addChildRule = (parentId, data) => {
  return api.post(`${PRICING_RULES_ENDPOINT}/${parentId}/child`, data);
};

