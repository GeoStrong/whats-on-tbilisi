"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import { Category, ActivityEntity } from "@/lib/types";
import { ImLocation2 } from "react-icons/im";
import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";
import { MdDateRange } from "react-icons/md";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import UserCard from "../users/userCard";
import useMapZoom from "@/lib/hooks/useMapZoom";

type ActivityVariant = "featured" | "ongoing" | "upcoming" | "past";

interface ActivityCardProps {
  activity: ActivityEntity;
  variant?: ActivityVariant;
  setSearchParams?: (query: string, value: string) => void;
}

const getVariantStyles = (variant: ActivityVariant): string => {
  const baseStyles = "transition-all duration-250";

  const variants: Record<ActivityVariant, string> = {
    featured: `${baseStyles} shadow-lg hover:shadow-xl`,
    ongoing: `${baseStyles}  shadow-md hover:shadow-lg`,
    upcoming: `${baseStyles} hover:border-primary`,
    past: `${baseStyles} shadow-sm`,
  };

  return variants[variant] || variants.upcoming;
};

const getStatusBadgeStyles = (variant: ActivityVariant): string => {
  const baseStyles =
    "absolute top-0 left-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm";

  const variants: Record<ActivityVariant, string> = {
    featured: `${baseStyles} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200`,
    ongoing: `${baseStyles} bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 animate-pulse`,
    upcoming: `${baseStyles} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200`,
    past: `${baseStyles} bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300`,
  };

  return variants[variant];
};

import { MdStar, MdLiveTv, MdEvent, MdCheckCircle } from "react-icons/md";

const getStatusBadgeLabel = (variant: ActivityVariant): React.ReactNode => {
  const labels: Record<ActivityVariant, React.ReactNode> = {
    featured: (
      <>
        <MdStar className="mr-1 inline" /> Featured
      </>
    ),
    ongoing: (
      <>
        <MdLiveTv className="mr-1 inline" /> Live
      </>
    ),
    upcoming: (
      <>
        <MdEvent className="mr-1 inline" /> Coming
      </>
    ),
    past: (
      <>
        <MdCheckCircle className="mr-1 inline" /> Completed
      </>
    ),
  };
  return labels[variant];
};

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
  const {
    /* handleLocationClick */
  } = useMapZoom(activity.id);

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
    <Card
      className={`flex h-full cursor-pointer flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-slate-800 ${getVariantStyles(variant)}`}
      onClick={() => {
        if (setSearchParams)
          return setSearchParams("activity", activity.id.toString());
      }}
      key={activity.id}
      role="article"
      aria-label={`Activity: ${activity.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (setSearchParams)
            setSearchParams("activity", activity.id.toString());
        }
      }}
    >
      <CardHeader className="relative flex-shrink-0 p-0">
        <div className="group relative aspect-video w-full overflow-hidden rounded-t-xl bg-white">
          <OptimizedImage
            src={activityImage}
            width={100}
            height={100}
            quality={50}
            alt={activity.title || "Activity image"}
            priority={false}
            className={`transform rounded-t-xl transition-transform duration-300 group-hover:scale-105`}
            objectFit={`${!activityImage ? "contain" : "cover"}`}
            containerClassName="h-full w-full"
          />
        </div>

        {/* Status Badge */}
        <div className={getStatusBadgeStyles(variant)}>
          <span>{getStatusBadgeLabel(variant)}</span>
        </div>

        {/* Category Badges */}
        <div className="absolute top-0 flex h-4 w-full justify-end px-2 text-right">
          <div className="flex w-2/3 flex-wrap items-center justify-end gap-2">
            {categories.map((category) => (
              <span
                key={category?.id}
                className={`rounded-full text-center bg-${category?.color} px-3 py-1 text-sm font-medium text-white`}
              >
                {category?.name}
              </span>
            ))}
          </div>
        </div>
        <CardTitle className="px-4 pt-4 text-left text-lg font-semibold leading-tight md:px-5 md:py-3 md:text-xl">
          {activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-3 md:px-5 md:py-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImLocation2 className="flex-shrink-0" />
            <span>
              {activity.location.length <= 30
                ? activity.location
                : activity.location.slice(0, 30) + "..."}
            </span>
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <MdDateRange className="flex-shrink-0" />
            <span>
              {activity.date &&
                new Date(activity.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              ,
            </span>
            <span>{activity.time && activity.time.toLocaleString()}</span>
          </p>
          {activity.likes !== undefined && activity.likes > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              ❤️ {activity.likes} {activity.likes === 1 ? "like" : "likes"}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto block w-full border-t border-border/50 px-4 py-2 md:px-5 md:py-3">
        {activity.user_id && (
          <UserCard userId={activity.user_id} displayFollowButton={false} />
        )}
      </CardFooter>
    </Card>
  );
};
export default ActivityCard;
