"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ProfileLayoutLoading: React.FC = () => {
  return (
    <div className="mt-12 w-full px-5">
      {/* Back button Skeleton */}
      <Skeleton className="mb-6 h-6 w-32" />

      {/* Profile Section */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Profile Header Card Skeleton - matches ProfileHeader structure */}
        <Card className="dark:border-slate-700 dark:bg-slate-800 md:w-1/2 lg:w-1/3">
          <div className="p-6">
            <div className="flex flex-col gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  {/* Camera button */}
                  <Skeleton className="absolute bottom-0 right-0 h-10 w-10 rounded-full" />
                </div>
              </div>

              {/* User Info Section */}
              <div className="flex-1 space-y-4">
                {/* Name */}
                <Skeleton className="h-7 w-48" />

                {/* Stats (Activities, Followers, Following) */}
                <div className="justify- flex w-full md:flex">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <Skeleton className="h-4 w-64" />

                {/* Bio */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                {/* Joined date */}
                <Skeleton className="h-4 w-48" />

                {/* Edit button */}
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation and Content Area */}
        <div className="w-full">
          {/* Navigation Skeleton */}
          <div className="mb-6 flex w-full items-center justify-between gap-4 rounded-lg border p-5 shadow-md dark:bg-slate-800 md:gap-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Tab Content Skeleton */}
          <div className="rounded-lg border dark:border-slate-700 dark:bg-slate-800">
            <div className="p-6">
              {/* Tabs Navigation Skeleton */}
              <div className="mb-6 flex w-full justify-center gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Tab Content - Activities Grid */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="px-6 pt-4">
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="px-6 pb-4 pt-3">
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileLayoutLoading;
