/**
 * RBAC API Service
 * Handles all RBAC-related API calls for roles and permissions
 */

import api from "@/utils/axiosMiddleware";

const ROLES_ENDPOINT = "/roles";
const APP_COMPONENTS_ENDPOINT = "/app-components";
const PERMISSIONS_ENDPOINT = "/permissions";

/**
 * Fetches all roles from the backend.
 * @returns {Promise} Axios response with roles data.
 */
const fetchRoles = (params = {}) => api.get(ROLES_ENDPOINT, { params });

/**
 * Creates a new role with the given data.
 * @param {object} data - Role creation payload.
 * @param {string} data.name - Role name.
 * @param {number[]} data.permissions - Array of permission IDs.
 * @returns {Promise} Axios response.
 */
const createNewRole = (data) => api.post(ROLES_ENDPOINT, data);

/**
 * Updates an existing role.
 * @param {number} id - Role ID.
 * @param {object} data - Role update payload.
 * @returns {Promise} Axios response.
 */
const updateExistingRole = (id, data) =>
  api.patch(`${ROLES_ENDPOINT}/${id}`, data);

/**
 * Deletes a role by ID.
 * @param {number} id - Role ID.
 * @returns {Promise} Axios response.
 */
const deleteExistingRole = (id) =>
  api.delete(`${ROLES_ENDPOINT}/${id}`);

/**
 * Fetches all available permissions (app-components).
 * @returns {Promise} Axios response with permissions data.
 */
const fetchAppComponents = () => api.get(APP_COMPONENTS_ENDPOINT);

/**
 * Fetches all permissions (legacy endpoint).
 * @returns {Promise} Axios response with permissions data.
 */
const fetchPermissions = () => api.get(PERMISSIONS_ENDPOINT);

/**
 * Updates a user's roles and permissions.
 * @param {number} userId - User ID.
 * @param {object} data - Update payload.
 * @param {number[]} data.roles - Array of role IDs.
 * @param {number[]} data.permissions - Array of permission IDs.
 * @returns {Promise} Axios response.
 */
const updateUserRoles = (userId, data) =>
  api.put(`/users/${userId}`, data);

export {
  fetchRoles,
  createNewRole,
  updateExistingRole,
  deleteExistingRole,
  fetchAppComponents,
  fetchPermissions,
  updateUserRoles,
};
