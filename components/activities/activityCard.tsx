"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import { Category, ActivityEntity } from "@/lib/types";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";
import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";
import { BiTimeFive } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import useMapZoom from "@/lib/hooks/useMapZoom";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import UserCard from "../users/userCard";

interface ActivityCardProps {
  activity: ActivityEntity;
  setSearchParams?: (query: string, value: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  setSearchParams,
}) => {
  const [categories, setCategories] = useState<(Category | null)[]>([]);
  const { handleLocationClick } = useMapZoom(activity.id);

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
      className="flex h-full cursor-pointer flex-col transition-all duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800"
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
        <CardTitle className="px-4 pt-4 text-left text-xl leading-tight md:px-6 md:text-2xl">
          {activity.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="min-w-0 flex-1">
          {/* <p className="break-words text-base leading-snug">
            {activity.location && activity.location.toLocaleString()}
          </p> */}
          {/* {activity.hostName && (
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.hostName}
            </p>
          )} */}
        </div>
        {/* {activity.googleLocation && (
          <Link
            href="/map"
            onClick={(e) => {
              e.stopPropagation();
              if (activity.googleLocation) {
                handleLocationClick(activity.googleLocation);
              }
            }}
            className="flex-shrink-0 rounded-md border-2 border-primary bg-transparent p-2 transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label={`View location on map: ${activity.location}`}
          >
            <ImLocation2 className="text-primary" aria-hidden="true" />
          </Link>
        )} */}
        <p className="flex items-center gap-1 text-base text-muted-foreground">
          <ImLocation2 className="flex-shrink-0" />
          <span>
            {activity.location.length <= 30
              ? activity.location
              : activity.location.slice(0, 30) + "..."}
          </span>
        </p>
        <p className="flex items-center gap-1 text-base text-muted-foreground">
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
      </CardContent>
      <CardFooter className="mt-auto block w-full border-t px-4 py-2 md:px-6 md:py-4">
        {activity.user_id && (
          <UserCard userId={activity.user_id} displayFollowButton={false} />
        )}
      </CardFooter>
    </Card>
  );
};
export default ActivityCard;
