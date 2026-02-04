import { useMemo } from "react";
import { ActivityEntity } from "../types";
import {
  useActivitiesFromFollowedUsers,
  useActivities,
} from "./useActivities";

const useFeedActivities = (userId: string | null) => {
  const { data: followedActivities = [], isLoading: isLoadingFollowed } =
    useActivitiesFromFollowedUsers(userId || null);
  const { data: recentActivities = [], isLoading: isLoadingRecent } =
    useActivities({ limit: 20 });

  // Use activities from followed users if available, otherwise fallback to recent
  const activities = useMemo<ActivityEntity[] | null>(() => {
    if (!userId) return null;
    if (followedActivities.length > 0) {
      return followedActivities;
    }
    return recentActivities;
  }, [userId, followedActivities, recentActivities]);

  const isLoading = isLoadingFollowed || isLoadingRecent;

  return { activities, isLoading };
};

export default useFeedActivities;

