"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  getCategoriesByActivityId,
} from "@/lib/functions/supabaseFunctions";
import { queryKeys } from "@/lib/react-query/queryKeys";

/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      return await getCategories();
    },
    staleTime: 1000 * 60 * 60, // 1 hour - categories rarely change
  });
};

/**
 * Hook to fetch a single category by ID
 */
export const useCategory = (categoryId: string | number | null) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId || ""),
    queryFn: async () => {
      if (!categoryId) return null;
      const result = await getCategoryById(categoryId);
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch categories by activity ID
 */
export const useCategoriesByActivityId = (
  activityId: string | number | null,
) => {
  return useQuery({
    queryKey: queryKeys.categories.byActivityId(activityId || ""),
    queryFn: async () => {
      if (!activityId) return [];
      return await getCategoriesByActivityId(activityId);
    },
    enabled: !!activityId,
  });
};

/**
 * Utility hook to invalidate categories cache
 */
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
    invalidateCategory: (id: string | number) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(id),
      });
    },
    invalidateByActivity: (activityId: string | number) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.byActivityId(activityId),
      });
    },
  };
};
