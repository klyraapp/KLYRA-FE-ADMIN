/**
 * App Settings Service
 * Handles API calls for application-level variables
 */

import api from "@/utils/axiosMiddleware";

const APP_SETTINGS_ENDPOINT = "/app-settings";

/**
 * Fetch all app settings
 * @returns {Promise}
 */
export const getAppSettings = () => {
  return api.get(APP_SETTINGS_ENDPOINT);
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
