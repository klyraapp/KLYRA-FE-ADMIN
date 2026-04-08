/**
 * Services API
 * Handles all service-related API calls
 * Supports priceRuleIds array for pricing rule linkage
 */

import api from "@/utils/axiosMiddleware";

const SERVICES_ENDPOINT = "/services";

/**
 * Builds FormData from a plain object,
 * handling arrays (e.g. priceRuleIds) by appending each item individually.
 */
const buildServiceFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    if (val === undefined || val === null) return;

    if (key === "priceRuleIds" && Array.isArray(val)) {
      val.forEach((id) => {
        formData.append("priceRuleIds[]", id);
      });
    } else {
      formData.append(key, val);
    }
  });

  return formData;
};

export const getServices = (params = {}) => {
  return api.get(SERVICES_ENDPOINT, { params });
};

export const getServicesAdmin = (params = {}) => {
  return api.get(`${SERVICES_ENDPOINT}/admin`, { params });
};

export const getServiceById = (id) => {
  return api.get(`${SERVICES_ENDPOINT}/${id}`);
};

export const createService = (data) => {
  const formData = buildServiceFormData(data);
  return api.post(SERVICES_ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateService = (id, data) => {
  const formData = buildServiceFormData(data);
  return api.patch(`${SERVICES_ENDPOINT}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteService = (id) => {
  return api.delete(`${SERVICES_ENDPOINT}/${id}`);
};
