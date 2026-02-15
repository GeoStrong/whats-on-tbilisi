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
import { useTranslation } from "react-i18next";

const ActivityCards: React.FC = () => {
  const { activities, activeActivity } = useActivitiesFilter();
  const { featured, ongoing, future, past } =
    useActivitiesBySection(activities);
  const [gridStyles, setGridStyles] = useState<string>("");
  const pathname = usePathname();
  const { handleSearch } = useAddSearchQuery();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation(["activity"]);

  useEffect(() => {
    setGridStyles(
      pathname === "/map"
        ? "lg:grid-cols-1"
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    );
  }, [pathname]);

  if (pathname === "/map") {
    return (
      <>
        {activities === null && (
          <div className="mt-5">
            <ActivityCardsLoading />
          </div>
        )}
        {activities?.length === 0 ? (
          <p className="mt-3 text-center">
            {t("activity:noActivitiesFound")}{" "}
            <span className="text-primary">{t("activity:category")}</span>.
          </p>
        ) : (
          <div className={`mt-3 grid w-full grid-cols-1 gap-5 md:grid-cols-2`}>
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
        {t("activity:noActivitiesFound")}{" "}
        <span className="text-primary">{t("activity:category")}</span>.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <ActivitySection
        title={t("activity:featuredActivities")}
        description={t("activity:featuredActivitiesDescription")}
        activities={featured}
        variant="featured"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />

      <ActivitySection
        title={t("activity:upcomingActivities")}
        description={t("activity:upcomingActivitiesDescription")}
        activities={future}
        variant="upcoming"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />
      <ActivitySection
        title={t("activity:ongoingActivities")}
        description={t("activity:ongoingActivitiesDescription")}
        activities={ongoing}
        variant="ongoing"
        gridStyles={gridStyles}
        onSearch={handleSearch}
      />

      <ActivitySection
        title={t("activity:pastActivities")}
        description={t("activity:pastActivitiesDescription")}
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
