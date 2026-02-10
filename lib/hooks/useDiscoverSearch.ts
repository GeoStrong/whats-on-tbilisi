"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import {
  getActivities,
  getActivitiesByUserId,
  searchUsers,
  searchComments,
  searchFeedPosts,
} from "@/lib/functions/supabaseFunctions";
import {
  ActivityEntity,
  UserProfile,
  CommentEntity,
  FeedPostWithActivity,
} from "@/lib/types";

export type DiscoverTab = "activities" | "users" | "posts" | "comments";

export interface EnrichedComment extends CommentEntity {
  activity_title?: string;
  user_name?: string;
}

/**
 * Hook to search activities for the discover page
 */
export const useSearchActivities = (query: string) => {
  return useQuery({
    queryKey: queryKeys.discoverSearch.activities(query),
    queryFn: async (): Promise<ActivityEntity[]> => {
      if (!query.trim()) return [];
      const result = await getActivities({
        limit: 30,
        filters: { search: query, excludePast: false },
      });
      const matchedActivities = Array.isArray(result)
        ? result
        : result.data || [];

      // If the query matches a username, include that user's activities too.
      const matchedUsers = await searchUsers(query);
      if (!matchedUsers.length) return matchedActivities;

      const userActivities = await Promise.all(
        matchedUsers.map((user) => getActivitiesByUserId(user.id)),
      );

      const combined = [...matchedActivities, ...userActivities.flat()];
      const uniqueById = new Map(
        combined.map((activity) => [activity.id, activity]),
      );

      return Array.from(uniqueById.values());
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to search users for the discover page
 */
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: queryKeys.discoverSearch.users(query),
    queryFn: async (): Promise<UserProfile[]> => {
      if (!query.trim()) return [];
      return await searchUsers(query);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to search comments for the discover page
 */
export const useSearchComments = (query: string) => {
  return useQuery({
    queryKey: queryKeys.discoverSearch.comments(query),
    queryFn: async (): Promise<EnrichedComment[]> => {
      if (!query.trim()) return [];
      return await searchComments(query);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook to search feed posts for the discover page
 */
export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: queryKeys.discoverSearch.posts(query),
    queryFn: async (): Promise<FeedPostWithActivity[]> => {
      if (!query.trim()) return [];
      return await searchFeedPosts(query);
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};
