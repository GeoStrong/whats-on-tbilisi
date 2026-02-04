"use client";

import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFeedPost,
  getFeedPostsFromFollowedUsers,
  getFeedPostById,
  updateFeedPost,
  deleteFeedPost,
  checkIfActivityPosted,
  getFeedPostsByUserId,
} from "../data/supabaseFunctions";
import { queryKeys } from "../react-query/queryKeys";
import { UserProfile } from "../types";

/**
 * Hook to fetch feed posts from users that the current user follows
 */
export const useFeedPosts = (userId: string | null) => {
  // Memoize the query key to prevent unnecessary re-renders
  const queryKey = useMemo(
    () => queryKeys.feedPosts.fromFollowedUsers(userId || ""),
    [userId],
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      try {
        const result = await getFeedPostsFromFollowedUsers(userId);
        return result || [];
      } catch (error) {
        console.error("Error in useFeedPosts queryFn:", error);
        // Return empty array on error instead of throwing to prevent infinite retries
        return [];
      }
    },
    enabled: !!userId,
    staleTime: Infinity, // Never consider data stale - prevent automatic background refetches
    gcTime: 1000 * 60 * 10, // 10 minutes - keep in cache longer
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    // When the feed page mounts again (e.g., after posting from activity page),
    // always refetch so newly created posts are included.
    refetchOnMount: true,
    refetchOnReconnect: false, // Don't refetch on reconnect
    retry: false, // Don't retry on failure to prevent infinite loops
  });

  // Debug logging - removed to prevent infinite loops
  // Query state logging should be done in components if needed

  return query;
};

/**
 * Hook to fetch a single feed post by ID
 */
export const useFeedPost = (postId: string | null) => {
  return useQuery({
    queryKey: queryKeys.feedPosts.detail(postId || ""),
    queryFn: async () => {
      if (!postId) return null;
      return await getFeedPostById(postId);
    },
    enabled: !!postId,
  });
};

/**
 * Hook to create a new feed post
 */
export const useCreateFeedPost = (user: UserProfile) => {
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({
      activityId,
      comment,
    }: {
      activityId: string;
      comment?: string | null;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      return await createFeedPost(activityId, userId, comment);
    },
    onSuccess: useCallback(() => {
      if (!userId) return;

      // Mark the followed-users feed as stale so the next mount refetches it
      queryClient.invalidateQueries({
        queryKey: queryKeys.feedPosts.fromFollowedUsers(userId),
      });

      // Keep broader aggregates in sync via invalidation
      queryClient.invalidateQueries({
        queryKey: queryKeys.feedPosts.all,
      });
    }, [queryClient, userId]),
  });
};

/**
 * Hook to update a feed post's comment
 */
export const useUpdateFeedPost = (user: UserProfile) => {
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({
      postId,
      comment,
    }: {
      postId: string;
      comment: string | null;
    }) => {
      if (!userId) throw new Error("User not authenticated");
      return await updateFeedPost(postId, userId, comment);
    },
    onSuccess: useCallback(
      (
        updatedPost: unknown,
        variables: { postId: string; comment: string | null },
      ) => {
        if (!userId) return;

        const postId = variables.postId;
        const newComment = variables.comment;

        // Update single-post detail cache if it exists
        queryClient.setQueryData(
          queryKeys.feedPosts.detail(postId),
          (oldData: unknown) => {
            if (!oldData || typeof oldData !== "object")
              return updatedPost || oldData;
            return {
              ...(oldData as Record<string, unknown>),
              comment: newComment,
            };
          },
        );

        // Update the comment field inside the followed-users feed list cache
        queryClient.setQueryData(
          queryKeys.feedPosts.fromFollowedUsers(userId),
          (oldData: unknown) => {
            if (!Array.isArray(oldData)) return oldData;
            return oldData.map((post: any) =>
              post?.id === postId ? { ...post, comment: newComment } : post,
            );
          },
        );
      },
      [queryClient, userId],
    ),
  });
};

/**
 * Hook to delete a feed post
 */
export const useDeleteFeedPost = (user: UserProfile) => {
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!userId) throw new Error("User not authenticated");
      return await deleteFeedPost(postId, userId);
    },
    onSuccess: useCallback(() => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.feedPosts.fromFollowedUsers(userId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.feedPosts.all,
        });
      }
    }, [queryClient, userId]),
  });
};

export const useCheckActivityPosted = (
  user: UserProfile,
  activityId: string | null,
) => {
  const userId = user?.id;

  const queryKey = useMemo(
    () => queryKeys.feedPosts.byActivityId(activityId || "", userId || ""),
    [activityId, userId],
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!activityId || !userId) return null;
      return await checkIfActivityPosted(activityId, userId);
    },
    enabled: !!activityId && !!userId,
  });
};

/**
 * Hook to fetch feed posts by user ID
 */
export const useFeedPostsByUserId = (userId: string | null) => {
  const queryKey = useMemo(
    () => queryKeys.feedPosts.byUserId(userId || ""),
    [userId],
  );

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) {
        return [];
      }
      try {
        const result = await getFeedPostsByUserId(userId);
        return result || [];
      } catch (error) {
        console.error("Error in useFeedPostsByUserId queryFn:", error);
        return [];
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
