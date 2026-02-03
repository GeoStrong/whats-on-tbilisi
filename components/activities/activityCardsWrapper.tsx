"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import ActivityCard from "./activityCard";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { usePathname } from "next/navigation";
import ActivityCardsLoading from "./activityCardsLoading";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";
import { useActivitiesBySection } from "@/lib/hooks/useActivitiesBySection";
import ActivitySection from "./activitySection";
import ActivityDescription from "./activityDescription";

const ActivityCards: React.FC = () => {
  const { activities, activeActivity } = useActivitiesFilter();
  const { featured, ongoing, future, past } =
    useActivitiesBySection(activities);
  const [gridStyles, setGridStyles] = useState<string>("");
  const pathname = usePathname();
  const { handleSearch } = useAddSearchQuery();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setGridStyles(
      pathname === "/map"
        ? "lg:grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    );
  }, [pathname]);

  // Don't show sections on map view, use original single list
  if (pathname === "/map") {
    return (
      <>
        <h2 className="section-title mt-3 text-xl md:mt-1">
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
          </div>
        )}
      </>
    );
  }

  // Show sectioned view for activities page
  const hasAnyActivities =
    featured.length > 0 ||
    ongoing.length > 0 ||
    future.length > 0 ||
    past.length > 0;

  if (activities === null) {
    return (
      <div className="mt-5">
        <ActivityCardsLoading />
      </div>
    );
  }

  if (!hasAnyActivities) {
    return (
      <p className="mt-3 text-center">
        No activities found for the selected category. Try another{" "}
        <span className="text-primary">category</span>.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <ActivitySection
        title="🌟 Featured Activities"
        description="Trending events with the most engagement"
        activities={featured}
        variant="featured"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />

      <ActivitySection
        title="Upcoming Activities"
        description="Events happening soon"
        activities={future}
        variant="upcoming"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />
      <ActivitySection
        title="Ongoing Activities"
        description="Registrations are open now"
        activities={ongoing}
        variant="ongoing"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />

      <ActivitySection
        title="Past Activities"
        description="Browse your activity history"
        activities={past}
        variant="past"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />

      {activeActivity && (
        <ActivityDescription
          buttonRef={buttonRef}
          activity={activeActivity}
          setSearchParams={handleSearch}
          open={Boolean(activeActivity)}
        />
      )}
    </div>
  );
};

const ActivityCardsWrapper: React.FC = () => (
  <Suspense fallback={<ActivityCardsLoading />}>
    <ActivityCards />
  </Suspense>
);

export default ActivityCardsWrapper;
