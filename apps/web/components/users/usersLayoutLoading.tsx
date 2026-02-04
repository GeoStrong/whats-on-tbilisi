"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const UsersLayoutLoading: React.FC = () => {
  return (
    <div className="mt-10 w-full px-5">
      {/* Header Skeleton */}
      <Card className="dark:border-slate-700 dark:bg-slate-800">
        <div className="p-6">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-32 w-32 rounded-full" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </Card>

      {/* Activities Section */}
      <div className="mt-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="dark:border-slate-700 dark:bg-slate-800">
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="px-6 pt-4">
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="px-6 pt-3 pb-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersLayoutLoading;



