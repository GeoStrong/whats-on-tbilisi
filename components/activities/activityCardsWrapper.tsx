"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import ActivityCard from "./activityCard";
import ActivityDescription from "./activityDescription";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { usePathname } from "next/navigation";
import ActivityCardsLoading from "./activityCardsLoading";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";

const ActivityCards: React.FC = () => {
  const { activities, category, activeActivity } = useActivitiesFilter();
  const [gridStyles, setGridStyles] = useState<string>("");
  const pathname = usePathname();
  const { searchParams, handleSearch } = useAddSearchQuery();
  const triggerRef = useRef<HTMLButtonElement>(null!);
  const categoryId = searchParams.get("category");

  useEffect(() => {
    setGridStyles(
      pathname === "/map"
        ? "lg:grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    );
  }, [pathname]);

  return (
    <>
      <h2 className="section-title mt-3 text-xl md:mt-1">
        {/* {categoryId && category.length !== 0 ? category[0].name : "Recent"}{" "}
        activities in Tbilisi */}
        Featured Activities
      </h2>
      {activities === null && (
        <div className="mt-5">
          <ActivityCardsLoading />
        </div>
      )}
      {activities?.length === 0 ? (
        <p className="mt-3 text-center">
          No activities found for the selected category. Try another{" "}
          <span className="text-primary">category</span>.
        </p>
      ) : (
        <div className={`mt-3 grid gap-5 ${gridStyles}`}>
          {activities?.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              setSearchParams={handleSearch}
            />
          ))}
          {activeActivity && pathname !== "/map" && (
            <ActivityDescription
              buttonRef={triggerRef}
              activity={activeActivity}
              setSearchParams={handleSearch}
              open={Boolean(activeActivity)}
            />
          )}
        </div>
      )}
    </>
  );
};

const ActivityCardsWrapper: React.FC = () => (
  <Suspense fallback={<ActivityCardsLoading />}>
    <ActivityCards />
  </Suspense>
);

export default ActivityCardsWrapper;
