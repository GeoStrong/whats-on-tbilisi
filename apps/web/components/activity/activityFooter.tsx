"use client";

import React, { useMemo } from "react";
import { Category, ActivityEntity } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import ActivityCard from "../activities/activityCard";
import { useActivitiesByCategory } from "@/lib/hooks/useActivities";
import { redirect } from "next/navigation";

const ActivityFooter: React.FC<{
  categories: (Category | null)[];
  activityId: string;
}> = ({ categories, activityId }) => {
  // const { isMobile } = useScreenSize();
  const firstCategory = categories[0]?.id;
  const secondCategory = categories[1]?.id;

  // Fetch activities in parallel using React Query (automatic caching and deduplication)
  const { data: firstCategoryActivities = [] } = useActivitiesByCategory(
    firstCategory || null,
  );
  const { data: secondCategoryActivities = [] } = useActivitiesByCategory(
    secondCategory || null,
  );

  // Filter out current activity
  const firstActivities = useMemo(
    () =>
      firstCategoryActivities.filter((activity) => activity.id !== activityId),
    [firstCategoryActivities, activityId],
  );

  const secondActivities = useMemo(
    () =>
      secondCategoryActivities.filter(
        (activity) => activity.id !== activityId,
      ),
    [secondCategoryActivities, activityId],
  );

  return (
    <footer className="py-4">
      {firstActivities.length !== 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="font-bold">More Activities like this</h3>
          <Carousel opts={{ dragFree: true }}>
            <CarouselContent>
              {firstActivities.map((activity) => {
                if (activity.id === activityId) return null;
                return (
                  <CarouselItem
                    key={activity.id}
                    className="md:basis-1/3"
                    onClick={() => {
                      redirect(`/activities/${activity.id}`);
                    }}
                  >
                    <ActivityCard activity={activity} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* {(isMobile || firstActivities.length > 3) && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )} */}
          </Carousel>
        </div>
      )}
      {secondCategory && secondActivities.length !== 0 && (
        <div className="mt-10 flex flex-col gap-3">
          <h3 className="font-bold">
            Discover More {categories[1]?.name} Activities
          </h3>
          <Carousel>
            <CarouselContent>
              {secondActivities.map((activity) => {
                if (activity.id === activityId) return null;
                return (
                  <CarouselItem
                    key={activity.id}
                    className="md:basis-1/3"
                    onClick={() => {
                      redirect(`/activities/${activity.id}`);
                    }}
                  >
                    <ActivityCard activity={activity} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {/* {(isMobile || secondActivities.length > 3) && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )} */}
          </Carousel>
        </div>
      )}
    </footer>
  );
};
export default ActivityFooter;
