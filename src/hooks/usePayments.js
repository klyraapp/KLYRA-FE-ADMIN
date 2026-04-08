/**
 * usePayments Hook
 * Handles payments data fetching
 */

import { getPayments } from "@/api/paymentsApi";
import { useQuery } from "@tanstack/react-query";

const PAYMENTS_QUERY_KEY = "payments";

export const usePayments = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getPayments(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const payments = data[0];
        const totalCount = data[1] || 0;
        return {
          payments: Array.isArray(payments) ? payments : [],
          totalCount,
        };
      }

      return { payments: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};
