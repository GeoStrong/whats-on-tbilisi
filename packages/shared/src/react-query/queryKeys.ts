/**
 * Centralized query keys for React Query
 * Ensures consistent key structure across the application
 */

export const queryKeys = {
  // Activities
  activities: {
    all: ["activities"] as const,
    lists: () => [...queryKeys.activities.all, "list"] as const,
    list: (filters?: {
      categories?: string[];
      search?: string;
      date?: string;
      limit?: number;
      offset?: number;
    }) => [...queryKeys.activities.lists(), filters] as const,
    details: () => [...queryKeys.activities.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.activities.details(), id] as const,
    byCategory: (categoryId: string) =>
      [...queryKeys.activities.all, "category", categoryId] as const,
    byUserId: (userId: string) =>
      [...queryKeys.activities.all, "user", userId] as const,
    fromFollowedUsers: (userId: string) =>
      [...queryKeys.activities.all, "followed", userId] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.categories.details(), id] as const,
    byActivityId: (activityId: string | number) =>
      [...queryKeys.categories.all, "activity", activityId] as const,
  },

  // Comments
  comments: {
    all: ["comments"] as const,
    byActivity: (activityId: string) =>
      [...queryKeys.comments.all, "activity", activityId] as const,
  },

  // Feed Posts
  feedPosts: {
    all: ["feedPosts"] as const,
    lists: () => [...queryKeys.feedPosts.all, "list"] as const,
    list: (userId?: string) =>
      [...queryKeys.feedPosts.lists(), userId] as const,
    details: () => [...queryKeys.feedPosts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.feedPosts.details(), id] as const,
    byUserId: (userId: string) =>
      [...queryKeys.feedPosts.all, "user", userId] as const,
    fromFollowedUsers: (userId: string) =>
      [...queryKeys.feedPosts.all, "followed", userId] as const,
    byActivityId: (activityId: string, userId?: string) =>
      [...queryKeys.feedPosts.all, "activity", activityId, userId] as const,
  },
} as const;




