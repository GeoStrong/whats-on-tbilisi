"use client";

import React from "react";
import { Skeleton } from "@mui/material";

const WizardSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-xl border bg-white shadow-lg dark:bg-gray-800">
      {/* Step Indicator Skeleton */}
      <div className="border-b px-4 py-4 dark:border-gray-700">
        <div className="hidden items-center justify-center gap-4 md:flex">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  className="dark:!bg-slate-700"
                />
                <Skeleton
                  variant="text"
                  width={80}
                  className="dark:!bg-slate-700"
                />
              </div>
              {step < 3 && (
                <Skeleton
                  variant="rectangular"
                  width={64}
                  height={2}
                  className="dark:!bg-slate-700"
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Mobile step indicator */}
        <div className="flex flex-col items-center gap-2 md:hidden">
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <Skeleton
                key={step}
                variant="circular"
                width={32}
                height={32}
                className="dark:!bg-slate-700"
              />
            ))}
          </div>
          <Skeleton variant="text" width={100} className="dark:!bg-slate-700" />
        </div>
      </div>

      {/* Content Area Skeleton - Step 1 Layout */}
      <div className="space-y-6 p-4 md:p-6">
        {/* Hero Image Upload Skeleton */}
        <Skeleton
          variant="rectangular"
          height={200}
          className="w-full rounded-xl dark:!bg-slate-700"
        />

        {/* Title and Description Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton
              variant="text"
              width={100}
              className="dark:!bg-slate-700"
            />
            <Skeleton
              variant="rectangular"
              height={44}
              className="w-full rounded-lg dark:!bg-slate-700"
            />
          </div>
          <div className="space-y-2">
            <Skeleton
              variant="text"
              width={100}
              className="dark:!bg-slate-700"
            />
            <Skeleton
              variant="rectangular"
              height={100}
              className="w-full rounded-lg dark:!bg-slate-700"
            />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-2">
          <Skeleton variant="text" width={150} className="dark:!bg-slate-700" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={80 + Math.random() * 40}
                height={36}
                className="rounded-md dark:!bg-slate-700"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons Skeleton */}
      <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
        <Skeleton
          variant="rectangular"
          width={80}
          height={40}
          className="rounded-md dark:!bg-slate-700"
        />
        <Skeleton variant="text" width={80} className="dark:!bg-slate-700" />
        <Skeleton
          variant="rectangular"
          width={80}
          height={40}
          className="rounded-md dark:!bg-slate-700"
        />
      </div>
    </div>
  );
};

export default WizardSkeleton;
