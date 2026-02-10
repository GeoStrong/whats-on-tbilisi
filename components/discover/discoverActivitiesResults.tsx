"use client";

import React from "react";
import { ActivityEntity } from "@/lib/types";
import ActivityCard from "@/components/activities/activityCard";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface DiscoverActivitiesResultsProps {
  activities: ActivityEntity[] | undefined;
  isLoading: boolean;
  query: string;
}

const DiscoverActivitiesResults: React.FC<DiscoverActivitiesResultsProps> = ({
  activities,
  isLoading,
  query,
}) => {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Search className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-lg">Search for activities by name, location, or description</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">No activities found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="cursor-pointer"
          onClick={() => redirect(`/activities/${activity.id}`)}
        >
          <ActivityCard activity={activity} />
        </div>
      ))}
    </div>
  );
};

export default DiscoverActivitiesResults;
