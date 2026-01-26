"use client";

import React, { useMemo } from "react";
import { ActivityEntity } from "@/lib/types";
import Link from "next/link";
import { ImLocation2 } from "react-icons/im";
import { BiTimeFive } from "react-icons/bi";
import { MdDateRange } from "react-icons/md";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import { isString } from "@/lib/functions/helperFunctions";

interface FeedActivityCardProps {
  activity: ActivityEntity;
}

const FeedActivityCard: React.FC<FeedActivityCardProps> = ({ activity }) => {
  const { imageUrl: activityImage } = useOptimizedImage(activity?.image, {
    quality: 50,
    width: 300,
    height: 200,
    fallback: defaultActivityImg.src,
  });

  const formattedDate = useMemo(() => {
    if (!activity?.date) return null;
    const date = new Date(activity?.date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [activity?.date]);

  const formattedTime = useMemo(() => {
    if (!activity?.time) return null;
    return isString(activity?.time) ? activity?.time : "";
  }, [activity?.time]);

  return (
    <Link
      href={`/activities/${activity?.id}`}
      className="group mx-4 mb-4 block overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex h-32 w-full flex-shrink-0 overflow-hidden md:h-40 md:w-40 md:rounded-l-lg">
          <OptimizedImage
            src={activityImage}
            width={160}
            height={160}
            containerClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            alt={activity?.title}
            priority={false}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 p-3">
          <h3 className="line-clamp-2 text-base font-semibold group-hover:text-primary md:text-lg">
            {activity?.title}
          </h3>

          {activity?.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {activity?.description}
            </p>
          )}

          <div className="mt-1 flex flex-col gap-1.5 text-xs text-muted-foreground">
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <MdDateRange className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{formattedDate}</span>
              </div>
            )}

            {formattedTime && (
              <div className="flex items-center gap-1.5">
                <BiTimeFive className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{formattedTime}</span>
              </div>
            )}

            {activity?.location && (
              <div className="flex items-center gap-1.5">
                <ImLocation2 className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="line-clamp-1">{activity?.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeedActivityCard;
