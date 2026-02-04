"use client";

import { useMemo } from "react";
import { ActivityEntity } from "@/lib/types";
import {
  useActivitiesFromFollowedUsers,
  useActivities,
} from "@/lib/hooks/useActivities";
import useGetUserProfile from "./useGetUserProfile";

const useFeedActivities = () => {
  const { user } = useGetUserProfile();
  const { data: followedActivities = [], isLoading: isLoadingFollowed } =
    useActivitiesFromFollowedUsers(user?.id || null);
  const { data: recentActivities = [], isLoading: isLoadingRecent } =
    useActivities({ limit: 20 });

  // Use activities from followed users if available, otherwise fallback to recent
  const activities = useMemo<ActivityEntity[] | null>(() => {
    if (!user?.id) return null;
    if (followedActivities.length > 0) {
      return followedActivities;
    }
    return recentActivities;
  }, [user?.id, followedActivities, recentActivities]);

  const isLoading = isLoadingFollowed || isLoadingRecent;

  return { activities, isLoading };
};

export default useFeedActivities;

