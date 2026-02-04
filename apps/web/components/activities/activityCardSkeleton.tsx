"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * Skeleton component that matches the exact dimensions of ActivityCard
 */
const ActivityCardSkeleton: React.FC = () => {
  return (
    <Card className="dark:border-slate-700 dark:bg-slate-800">
      <div className="relative p-0">
        {/* Image - matches h-48 from ActivityCard */}
        <div className="group relative h-48 w-full overflow-hidden rounded-t-xl">
          <Skeleton className="h-full w-full rounded-t-xl" />
          {/* Category badges overlay */}
          <div className="absolute top-0 flex h-4 w-full justify-end px-2 text-right">
            <div className="flex w-2/3 flex-wrap items-center justify-end gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Title - matches px-4 md:px-6 text-xl md:text-2xl pt-4 from ActivityCard */}
        <div className="px-4 pt-4 md:px-6">
          <Skeleton className="h-6 w-3/4 md:h-7" />
        </div>
      </div>

      {/* Content - matches CardContent flex items-center justify-between p-4 md:p-6 */}
      <div className="flex items-center justify-between px-4 pb-0 pt-3 md:px-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
        {/* Location button */}
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Footer - matches CardFooter flex flex-col items-start gap-3 p-4 md:p-6 pt-0 */}
      <div className="flex flex-col items-start gap-3 px-4 pb-4 pt-0 md:px-6 md:pb-6">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-36" />
      </div>
    </Card>
  );
};

export default ActivityCardSkeleton;
