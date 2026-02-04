import { useEffect } from "react";
import { preloadActivityImages, preloadUserAvatars } from "../utils/imagePreloader";
import type { ActivityEntity, UserProfile } from "../types";

/**
 * Hook to preload images for activities
 * Call this when activities are loaded to improve perceived performance
 */
export const usePreloadActivityImages = (
  activities: ActivityEntity[] | null | undefined,
) => {
  useEffect(() => {
    if (!activities || activities.length === 0) return;

    // Preload images for above-fold activities
    preloadActivityImages(activities).catch((error) => {
      console.error("Error preloading activity images:", error);
    });
  }, [activities]);
};

/**
 * Hook to preload user avatars
 * Call this when user lists are loaded
 */
export const usePreloadUserAvatars = (
  users: Array<{ avatar_path?: string | null }> | null | undefined,
  size?: number,
) => {
  useEffect(() => {
    if (!users || users.length === 0) return;

    const avatarPaths = users.map((user) => user.avatar_path);
    preloadUserAvatars(avatarPaths, size).catch((error) => {
      console.error("Error preloading user avatars:", error);
    });
  }, [users, size]);
};




