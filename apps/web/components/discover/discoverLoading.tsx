"use client";

import React from "react";
import { Skeleton } from "../ui/skeleton";
import ActivityCardSkeleton from "../activities/activityCardSkeleton";

const DiscoverLoading: React.FC = () => {
  return (
    <div className="p-4 md:p-8">
      {/* Search Bar */}
      <Skeleton className="h-10 w-full md:w-96" />

      <div className="mt-6 flex flex-col items-center justify-center gap-8 md:items-start lg:flex-row">
        {/* Mobile Filter Button */}
        <Skeleton className="h-12 w-28 md:hidden" />

        {/* Sidebar Filters */}
        <div className="hidden w-64 p-4 lg:block">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-5 h-4 w-24" />
          <Skeleton className="mt-2 h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-24" />
          <Skeleton className="mt-2 h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-16" />
          <Skeleton className="mt-2 h-4 w-20" />
          <Skeleton className="mt-2 h-4 w-24" />
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Search and Filter Bar */}
          <div className="space-y-2 p-6 md:space-y-5">
            <div className="flex flex-col gap-2 md:flex-row">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full md:h-12 md:w-28" />
            </div>
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-14 rounded-full" />
              <Skeleton className="h-10 w-full rounded-full md:hidden" />
            </div>
          </div>

          {/* Activity Cards Grid - matches discoverLayout grid */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <ActivityCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DiscoverLoading;
