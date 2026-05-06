/**
 * useBookings Hook
 * Handles bookings data fetching and mutations
 */

import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  getCalendarBookings,
  getDisabledDates,
  updateBooking,
  updateBookingStatus,
} from "@/api/bookingsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const BOOKINGS_QUERY_KEY = "bookings";
const CALENDAR_BOOKINGS_QUERY_KEY = "calendarBookings";

export const useBookings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getBookings(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const bookings = data[0];
        const totalCount = data[1] || 0;
        
        const normalizedBookings = Array.isArray(bookings) 
          ? bookings.map(booking => ({
              id: booking?.id,
              bookingNumber: booking?.bookingNumber || 'N/A',
              status: booking?.status || 'PENDING',
              contactFirstName: booking?.contactFirstName || '',
              contactLastName: booking?.contactLastName || '',
              contactEmail: booking?.contactEmail || '',
              totalAmount: booking?.totalAmount || 0,
              bookingDate: booking?.bookingDate,
              startTime: booking?.startTime,
              ...booking
            }))
          : [];

        return {
          bookings: normalizedBookings,
          totalCount,
        };
      }

      return { bookings: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useBookingById = (id, options = {}) => {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getBookingById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingCreated");
    },
    onError: () => {
      toast.error("messages.bookingCreateFailed");
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingUpdated");
    },
    onError: () => {
      toast.error("messages.bookingUpdateFailed");
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingStatusUpdated");
    },
    onError: () => {
      toast.error("messages.bookingStatusUpdateFailed");
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingDeleted");
    },
    onError: () => {
      toast.error("messages.bookingDeleteFailed");
    },
  });
};

export const useCalendarBookings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [CALENDAR_BOOKINGS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getCalendarBookings(params);
      const rawData = response?.data;
      if (!rawData) return { bookings: [], totalCount: 0 };

      let bookings = [];
      let totalCount = 0;

      if (Array.isArray(rawData)) {
        // Handle [bookings, count] or [booking1, booking2]
        if (Array.isArray(rawData[0])) {
          bookings = rawData[0];
          totalCount = rawData[1] || bookings.length;
        } else {
          bookings = rawData;
          totalCount = rawData.length;
        }
      } else if (rawData.bookings && Array.isArray(rawData.bookings)) {
        // Handle { bookings: [], totalCount: n }
        bookings = rawData.bookings;
        totalCount = rawData.totalCount || rawData.bookings.length;
      } else if (rawData.data && Array.isArray(rawData.data)) {
        // Handle { data: [], totalCount: n }
        bookings = rawData.data;
        totalCount = rawData.totalCount || rawData.count || rawData.data.length;
      }

      return {
        bookings,
        totalCount,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useDisabledDates = (serviceId, options = {}) => {
  return useQuery({
    queryKey: ["disabledDates", serviceId],
    queryFn: async () => {
      const response = await getDisabledDates(serviceId);
      return response?.data || { disabledDates: [], sundayOff: false, saturdayOff: false };
    },
    enabled: Boolean(serviceId),
    staleTime: 30 * 60 * 1000, // 30 mins
    ...options,
  });
};
