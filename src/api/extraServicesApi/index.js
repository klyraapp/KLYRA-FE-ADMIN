/**
 * Extra Services API
 * Handles all extra service-related API calls
 */

import api from "@/utils/axiosMiddleware";

const EXTRA_SERVICES_ENDPOINT = "/extra-services";

const buildExtraServiceFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    formData.append(key, val);
  });

  return formData;
};

export const getExtraServices = () => {
  return api.get(EXTRA_SERVICES_ENDPOINT);
};

export const getExtraServiceById = (id) => {
  return api.get(`${EXTRA_SERVICES_ENDPOINT}/${id}`);
};

export const createExtraService = (data) => {
  const formData = buildExtraServiceFormData(data);
  return api.post(EXTRA_SERVICES_ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateExtraService = (id, data) => {
  const formData = buildExtraServiceFormData(data);
  return api.patch(`${EXTRA_SERVICES_ENDPOINT}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteExtraService = (id) => {
  return api.delete(`${EXTRA_SERVICES_ENDPOINT}/${id}`);
};
