"use client";

import React, { useRef } from "react";
import { ActivityList, SectionHeader } from "@whatson/ui";
import ActivityCard from "./activityCard";
import ActivityDescription from "./activityDescription";
import ActivityCardsLoading from "./activityCardsLoading";
import PastActivityCarousel from "./pastActivityCarousel";
import { ActivityEntity } from "@/lib/types";

type ActivityVariant = "featured" | "ongoing" | "upcoming" | "past";

interface ActivitySectionProps {
  title: string;
  description?: string;
  activities: ActivityEntity[] | null | undefined;
  variant?: ActivityVariant;
  isLoading?: boolean;
  gridStyles?: string;
  onSearch?: (query: string, value: string) => void;
  activeActivity?: ActivityEntity | null;
  showActivityDescription?: boolean;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  title,
  description,
  activities,
  variant = "upcoming",
  isLoading = false,
  gridStyles = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  onSearch,
  activeActivity,
  showActivityDescription = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Don't render section if no activities
  if (!activities || activities.length === 0) {
    return null;
  }

  // Extract emoji from title (first character if emoji, otherwise empty)
  const titleParts = title.split(" ");
  const emoji = /\p{Emoji}/u.test(titleParts[0]) ? titleParts.shift() : "";
  const titleText = titleParts.join(" ");

  return (
    <section className="mt-10 scroll-mt-16">
      {/* Section Header */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex-1">
          <SectionHeader
            title={`${emoji ? `${emoji} ` : ""}${titleText}`}
            description={description}
            count={activities.length}
          />
        </div>
      </div>

      {/* Accent Bar */}
      <div className="section-accent-bar mb-6" />

      {/* Content */}
      {isLoading ? (
        <div className="mt-5">
          <ActivityCardsLoading />
        </div>
      ) : variant === "past" ? (
        <PastActivityCarousel activities={activities} onSearch={onSearch} />
      ) : (
        <div className="space-y-6">
          <ActivityList
            activities={activities}
            variant={variant}
            gridClassName={`grid gap-5 ${gridStyles}`}
            onPressActivity={(activity) =>
              onSearch?.("activity", activity.id.toString())
            }
            renderCard={(activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                variant={variant}
                setSearchParams={onSearch}
              />
            )}
          />

          {showActivityDescription && activeActivity && (
            <ActivityDescription
              buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
              activity={activeActivity}
              setSearchParams={onSearch || (() => {})}
              open={Boolean(activeActivity)}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default ActivitySection;
