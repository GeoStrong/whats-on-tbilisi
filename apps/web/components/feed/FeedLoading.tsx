"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FeedPostSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl bg-card p-2 dark:bg-slate-800 md:p-4">
      {/* Post Header - Author Info */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar - size 12 = 48px */}
          <Skeleton className="h-12 w-12 rounded-full" />
          <div>
            {/* Author name */}
            <Skeleton className="mb-1 h-5 w-32" />
            {/* Date */}
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Post Comment - Sometimes present */}
      <div className="mb-4 rounded-lg bg-muted p-3">
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Engagement and Link */}
      <div className="flex items-center justify-between border-t pt-4 dark:border-slate-700">
        <div className="flex items-center gap-4">
          {/* Like button skeleton */}
          <Skeleton className="h-8 w-16" />
          {/* Dislike button skeleton */}
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
};

const FeedLoading: React.FC = () => {
  return (
    <div className="relative mt-6 grid w-full grid-cols-1 gap-5 md:grid-cols-6 lg:gap-6">
      <div className="sticky left-0 top-20 col-span-2 hidden h-80 flex-col items-center justify-start rounded-xl border p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 md:flex">
        {/* Avatar - size 20 = 80px (w-20 h-20) */}
        <Skeleton className="h-20 w-20 rounded-full" />
        {/* Name */}
        <Skeleton className="mt-5 h-6 w-24" />
        {/* Stats - matches UsersRealtimeFollows structure */}
        <div className="mt-4 w-full">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-center">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-1 text-center">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-1 text-center">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        {/* Button */}
        <Skeleton className="mt-4 h-9 w-full rounded-md" />
      </div>

      <div className="overflow-y-auto rounded-xl border p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 md:col-span-4 md:col-start-3">
        <Skeleton className="mx-auto mb-6 h-10 w-40 rounded-md md:h-12 md:w-52" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <FeedPostSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedLoading;
