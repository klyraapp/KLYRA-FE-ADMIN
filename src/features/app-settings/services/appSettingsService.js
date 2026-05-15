/**
 * App Settings Service
 * Handles API calls for application-level variables
 */

import api from "@/utils/axiosMiddleware";

const APP_SETTINGS_ENDPOINT = "/app-settings";

/**
 * Fetch all app settings.
 * - Super admins: GET /v2/app-settings/{serviceLocationId}
 * - Regular admins: GET /app-settings (with ?serviceLocationId=...)
 *
 * @param {Object} params - Query parameters
 * @param {number|string} [pathLocationId] - If provided, uses path-based v2 endpoint
 * @returns {Promise}
 */
export const getAppSettings = (params = {}, pathLocationId = null) => {
  if (pathLocationId) {
    // Exact match for /v2/app-settings/{id} (for Super Admins)
    return api.get(`/v2/app-settings/${pathLocationId}`);
  }
  return api.get(APP_SETTINGS_ENDPOINT, { params });
};

/**
 * Update app settings by ID
 * @param {number|string} id 
 * @param {Object} data 
 * @returns {Promise}
 */
export const updateAppSettings = (id, data) => {
  return api.patch(`${APP_SETTINGS_ENDPOINT}/${id}`, data);
};
