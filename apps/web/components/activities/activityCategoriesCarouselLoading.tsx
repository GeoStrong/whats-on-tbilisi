import React from "react";
import { Skeleton } from "../ui/skeleton";

const ActivityCategoriesCarouselLoading: React.FC = () => {
  return (
    <div className="w-full px-2 md:px-20">
      <div className="my-5 flex gap-3 dark:border-gray-600 dark:bg-gray-900 md:gap-8">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-7 w-28" />
        <Skeleton className="hidden h-7 w-28 md:block" />
        <Skeleton className="hidden h-7 w-28 md:block" />
        <Skeleton className="hidden h-7 w-28 md:block" />
        <Skeleton className="hidden h-7 w-28 md:block" />
      </div>
    </div>
  );
};
export default ActivityCategoriesCarouselLoading;
