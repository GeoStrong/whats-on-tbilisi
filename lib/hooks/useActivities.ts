"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActivities,
  getActivitiesByCategoryId,
  getActivitiesFromFollowedUsers,
  getActivitiesByUserId,
  getActivityById,
} from "@/lib/functions/supabaseFunctions";
import { queryKeys } from "@/lib/react-query/queryKeys";
import {
  PaginationParams,
  ActivityFilters,
} from "@/lib/functions/supabaseFunctions";

/**
 * Hook to fetch all activities with optional pagination and server-side filtering
 * Uses React Query for caching and deduplication
 */
export const useActivities = (
  params?: PaginationParams & { filters?: ActivityFilters },
) => {
  return useQuery({
    queryKey: queryKeys.activities.list(params),
    queryFn: async () => {
      const result = await getActivities(params);
      return Array.isArray(result) ? result : result.data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - activities change frequently
  });
};

/**
 * Hook to fetch a single activity by ID
 */
export const useActivity = (activityId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.activities.detail(activityId || ""),
    queryFn: async () => {
      if (!activityId) return null;
      const result = await getActivityById(activityId);
      return Array.isArray(result) && result.length > 0 ? result[0] : null;
    },
    enabled: !!activityId,
  });
};

/**
 * Hook to fetch activities by category ID
 */
export const useActivitiesByCategory = (categoryId: string | null) => {
  return useQuery({
    queryKey: queryKeys.activities.byCategory(categoryId || ""),
    queryFn: async () => {
      if (!categoryId) return [];
      return await getActivitiesByCategoryId(categoryId);
    },
    enabled: !!categoryId,
  });
};

/**
 * Hook to fetch activities from users that the current user follows
 */
export const useActivitiesFromFollowedUsers = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.activities.fromFollowedUsers(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      return await getActivitiesFromFollowedUsers(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook to fetch activities by user ID
 */
export const useActivitiesByUserId = (userId: string | null) => {
  return useQuery({
    queryKey: queryKeys.activities.byUserId(userId || ""),
    queryFn: async () => {
      if (!userId) return [];
      return await getActivitiesByUserId(userId);
    },
    enabled: !!userId,
  });
};

/**
 * Utility hook to invalidate activities cache
 * Useful after creating/updating/deleting activities
 */
export const useInvalidateActivities = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
    },
    invalidateList: (filters?: Parameters<typeof queryKeys.activities.list>[0]) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.list(filters),
      });
    },
    invalidateActivity: (id: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.detail(id),
      });
    },
    invalidateByCategory: (categoryId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byCategory(categoryId),
      });
    },
    invalidateByUserId: (userId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.activities.byUserId(userId),
      });
    },
  };
};

