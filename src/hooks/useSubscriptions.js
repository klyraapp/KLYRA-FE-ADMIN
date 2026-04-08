/**
 * useSubscriptions Hook
 * Handles subscriptions data fetching and mutations
 */

import {
  getSubscriptions,
  updateSubscription,
  updateSubscriptionPaymentMethod
} from "@/api/subscriptionsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const SUBSCRIPTIONS_QUERY_KEY = "subscriptions";

export const useSubscriptions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [SUBSCRIPTIONS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getSubscriptions(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const subscriptions = data[0];
        const totalCount = data[1] || 0;
        
        const normalizedSubscriptions = Array.isArray(subscriptions) 
          ? subscriptions.map(sub => ({
              id: sub?.id,
              status: sub?.status?.toUpperCase() || 'PENDING',
              contactFirstName: sub?.contactFirstName || '',
              contactLastName: sub?.contactLastName || '',
              contactEmail: sub?.contactEmail || '',
              recurringIntervalType: sub?.recurringIntervalType || 'MONTHLY',
              nextScheduledDate: sub?.nextScheduledDate,
              nextInvoicingDate: sub?.nextInvoicingDate,
              createdAt: sub?.createdAt,
              updatedAt: sub?.updatedAt,
              ...sub
            }))
          : [];

        return {
          subscriptions: normalizedSubscriptions,
          totalCount,
        };
      }

      return { subscriptions: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_QUERY_KEY] });
      toast.success("messages.subscriptionUpdated");
    },
    onError: () => {
      toast.error("messages.subscriptionUpdateFailed");
    },
  });
};

export const useUpdateSubscriptionPaymentMethod = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, paymentMethodId }) =>
      updateSubscriptionPaymentMethod(id, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTIONS_QUERY_KEY] });
      toast.success("messages.paymentMethodUpdated");
    },
    onError: () => {
      toast.error("messages.paymentMethodUpdateFailed");
    },
  });
};
