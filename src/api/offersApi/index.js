/**
 * Offers API Service
 * Handles all special offers-related API calls
 */

import api from "@/utils/axiosMiddleware";

const OFFERS_ENDPOINT = "/offers";

export const getOffers = (params = {}) => {
  return api.get(`${OFFERS_ENDPOINT}/admin`, { params });
};

export const getOfferById = (id) => {
  return api.get(`${OFFERS_ENDPOINT}/${id}`);
};

export const createOffer = (data) => {
  return api.post(OFFERS_ENDPOINT, data);
};

export const updateOffer = (id, data) => {
  return api.patch(`${OFFERS_ENDPOINT}/${id}`, data);
};

export const deleteOffer = (id) => {
  return api.delete(`${OFFERS_ENDPOINT}/${id}`);
};
