/**
 * Promo Codes API Service
 * Handles all promo code-related API calls
 */

import api from "@/utils/axiosMiddleware";

const PROMO_CODES_ENDPOINT = "/promo-codes";

export const getPromoCodes = (params = {}) => {
  return api.get(PROMO_CODES_ENDPOINT, { params });
};

export const getPromoCodeById = (id) => {
  return api.get(`${PROMO_CODES_ENDPOINT}/${id}`);
};

export const createPromoCode = (data) => {
  return api.post(PROMO_CODES_ENDPOINT, data);
};

export const updatePromoCode = (id, data) => {
  return api.patch(`${PROMO_CODES_ENDPOINT}/${id}`, data);
};

export const deletePromoCode = (id) => {
  return api.delete(`${PROMO_CODES_ENDPOINT}/${id}`);
};

export const validatePromoCode = (code) => {
  return api.post(`${PROMO_CODES_ENDPOINT}/validate`, { code });
};
