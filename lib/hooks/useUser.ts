"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/profile/profile";
import { queryKeys } from "@/lib/react-query/queryKeys";

/**
 * Hook to fetch a user profile by ID
 * Uses React Query for caching and deduplication
 */
export const useUser = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId || ""),
    queryFn: async () => {
      if (!userId) return null;
      return await fetchUserInfo(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes - user profiles don't change often
  });
};

/**
 * Utility hook to invalidate user cache
 * Useful after updating user profile
 */
export const useInvalidateUser = () => {
  const queryClient = useQueryClient();

  return {
    invalidateUser: (userId: string) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  };
};
