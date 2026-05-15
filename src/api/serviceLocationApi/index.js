/**
 * Service Location API
 * Handles all service-location related API calls.
 */

import api from "@/utils/axiosMiddleware";

const SERVICE_LOCATION_ENDPOINT = "/service-location";

/**
 * Fetches all active service locations.
 * @returns {Promise} Axios response with active service locations data.
 */
export const getActiveServiceLocations = () => {
  return api.get(`${SERVICE_LOCATION_ENDPOINT}/active`);
};
