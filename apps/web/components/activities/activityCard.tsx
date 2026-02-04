"use client";

import React, { useEffect, useState } from "react";
import { ActivityCard as SharedActivityCard } from "@whatson/ui";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import { Category, ActivityEntity } from "@/lib/types";
import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import UserCard from "../users/userCard";

type ActivityVariant = "featured" | "ongoing" | "upcoming" | "past";

interface ActivityCardProps {
  activity: ActivityEntity;
  variant?: ActivityVariant;
  setSearchParams?: (query: string, value: string) => void;
}

export const determineActivityVariant = (
  activity: ActivityEntity,
): ActivityVariant => {
  const status = activity.status || "active";

  if (status === "inactive") return "past";
  if (status === "pending") return "ongoing";
  return "upcoming";
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  variant = determineActivityVariant(activity),
  setSearchParams,
}) => {
  const [categories, setCategories] = useState<(Category | null)[]>([]);

  useEffect(() => {
    (async () => {
      const categories = await getCategoriesByActivityId(activity.id);
      setCategories(categories || []);
    })();
  }, [activity.id]);

  const { imageUrl: activityImage } = useOptimizedImage(activity.image, {
    quality: 50,
    width: 800,
    height: 600,
    fallback: defaultActivityImg.src,
  });

  return (
    <SharedActivityCard
      activity={activity}
      variant={variant}
      categories={categories.filter(Boolean) as Category[]}
      imageUrl={activityImage}
      onPress={() => {
        if (setSearchParams)
          return setSearchParams("activity", activity.id.toString());
      }}
      footer={
        activity.user_id ? (
          <UserCard userId={activity.user_id} displayFollowButton={false} />
        ) : null
      }
    />
  );
};
export default ActivityCard;
