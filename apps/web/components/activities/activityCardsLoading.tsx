"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityCardSkeleton from "./activityCardSkeleton";

const ActivityCardsLoading: React.FC = () => {
  return (
    <div className="mt-3 w-full">
      <Skeleton className="mb-8 h-96 w-full" />
      <Skeleton className="h-7 w-64" />

      <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ActivityCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
export default ActivityCardsLoading;
