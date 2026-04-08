/**
 * Bookings API Service
 * Handles all booking-related API calls
 */

import api from "@/utils/axiosMiddleware";

const BOOKINGS_ENDPOINT = "/bookings";

export const getBookings = (params = {}) => {
  return api.get(`${BOOKINGS_ENDPOINT}/admin`, { params });
};

export const getBookingById = (id) => {
  return api.get(`${BOOKINGS_ENDPOINT}/${id}`);
};

export const createBooking = (data) => {
  return api.post(BOOKINGS_ENDPOINT, data);
};

export const updateBooking = (id, data) => {
  return api.patch(`${BOOKINGS_ENDPOINT}/${id}`, data);
};

export const updateBookingStatus = (id, status) => {
  return api.patch(`${BOOKINGS_ENDPOINT}/${id}/status`, { status });
};

export const deleteBooking = (id) => {
  return api.delete(`${BOOKINGS_ENDPOINT}/${id}`);
};

export const getDisabledDates = () => {
  return api.get(`${BOOKINGS_ENDPOINT}/calendar/disabled-dates`);
};
