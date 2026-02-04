"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for UserCard component
 * Matches the structure: avatar (size 8 = 32px), name, follow button
 */
const UserCardSkeleton: React.FC = () => {
  return (
    <div className="mb-4 flex items-center justify-between border-b pb-3 dark:border-b-slate-700">
      <div className="flex items-center gap-4">
        {/* Avatar - size 8 = 32px (w-8 h-8) */}
        <Skeleton className="h-8 w-8 rounded-full" />
        {/* Name */}
        <Skeleton className="h-5 w-32" />
      </div>
      {/* Follow button */}
      <Skeleton className="h-9 w-20 rounded-md" />
    </div>
  );
};

export default UserCardSkeleton;



