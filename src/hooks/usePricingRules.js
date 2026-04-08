/**
 * usePricingRules Hook
 * Handles pricing rules data fetching and mutations
 * Response format: [[...rules], totalCount]
 */

import {
  addChildRule,
  createPricingRule,
  deletePricingRule,
  getPricingRules,
  updatePricingRule,
} from "@/api/pricingRulesApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const PRICING_RULES_QUERY_KEY = "pricingRules";

export const usePricingRules = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [PRICING_RULES_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getPricingRules(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const rules = data[0];
        const totalCount = data[1] || 0;
        return {
          rules: Array.isArray(rules) ? rules : [],
          totalCount,
        };
      }

      return { rules: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const usePricingRulesList = (options = {}) => {
  return useQuery({
    queryKey: [PRICING_RULES_QUERY_KEY, "list"],
    queryFn: async () => {
      const response = await getPricingRules();
      const data = response?.data;

      if (Array.isArray(data)) {
        const rules = data[0];
        return Array.isArray(rules) ? rules : [];
      }

      return [];
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useCreatePricingRule = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createPricingRule,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PRICING_RULES_QUERY_KEY],
      });
      toast.success("messages.pricingRuleCreated");
    },
    onError: () => {
      toast.error("messages.pricingRuleCreateFailed");
    },
  });
};

export const useUpdatePricingRule = (options = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updatePricingRule(id, data),
    onSuccess: () => {
      if (!options.skipInvalidation) {
        queryClient.invalidateQueries({
          queryKey: [PRICING_RULES_QUERY_KEY],
        });
        toast.success("messages.pricingRuleUpdated");
      }
    },
    onError: () => {
      if (!options.skipInvalidation) {
        toast.error("messages.pricingRuleUpdateFailed");
      }
    },
  });
};

export const useDeletePricingRule = (options = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deletePricingRule,
    onSuccess: () => {
      if (!options.skipInvalidation) {
        queryClient.invalidateQueries({
          queryKey: [PRICING_RULES_QUERY_KEY],
        });
        toast.success("messages.pricingRuleDeleted");
      }
    },
    onError: () => {
      if (!options.skipInvalidation) {
        toast.error("messages.pricingRuleDeleteFailed");
      }
    },
  });
};
export const useAddChildRule = (options = {}) => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ parentId, data }) => addChildRule(parentId, data),
    onSuccess: () => {
      if (!options.skipInvalidation) {
        queryClient.invalidateQueries({
          queryKey: [PRICING_RULES_QUERY_KEY],
        });
        toast.success("messages.pricingRuleUpdated");
      }
    },
    onError: () => {
      if (!options.skipInvalidation) {
        toast.error("messages.pricingRuleUpdateFailed");
      }
    },
  });
};
