/**
 * Users API Service
 * Handles all user-related API calls
 */

import api from "@/utils/axiosMiddleware";

const USERS_ENDPOINT = "/users";

export const getUsers = (params = {}) => {
  return api.get(USERS_ENDPOINT, { params });
};

export const getUserById = (id) => {
  return api.get(`${USERS_ENDPOINT}/${id}`);
};

export const createUser = (data) => {
  return api.post(USERS_ENDPOINT, data);
};

export const updateUser = (id, data) => {
  return api.put(`${USERS_ENDPOINT}/${id}`, data);
};

export const deleteUser = (id) => {
  return api.delete(`${USERS_ENDPOINT}/${id}`);
};
