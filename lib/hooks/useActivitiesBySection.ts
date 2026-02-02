"use client";

import { useMemo } from "react";
import { ActivityEntity } from "../types";

/**
 * Categorizes activities into sections based on status and dates
 * - featured: active status, sorted by engagement (likes + comments)
 * - ongoing: pending status
 * - future: active status with date > today
 * - past: inactive status
 */
export const useActivitiesBySection = (
  activities: ActivityEntity[] | null | undefined,
) => {
  const sections = useMemo(() => {
    if (!activities || activities.length === 0) {
      return {
        featured: [],
        ongoing: [],
        future: [],
        past: [],
      };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const featured: ActivityEntity[] = [];
    const ongoing: ActivityEntity[] = [];
    const future: ActivityEntity[] = [];
    const past: ActivityEntity[] = [];

    activities.forEach((activity) => {
      const status = activity.status || "active";
      const activityDate = activity.date ? new Date(activity.date) : null;

      if (!activityDate) {
        // If no date, treat as pending/ongoing
        if (status === "pending") {
          ongoing.push(activity);
        }
        return;
      }

      activityDate.setHours(0, 0, 0, 0); // Normalize to start of day

      if (status === "active") {
        if (activityDate < now) {
          // Past date = featured (already happened, can show engagement)
          featured.push(activity);
        } else {
          // Future date = future section
          future.push(activity);
        }
      } else if (status === "pending") {
        // Pending = ongoing
        ongoing.push(activity);
      } else if (status === "inactive") {
        // Inactive = past
        past.push(activity);
      }
    });

    // Sort featured by engagement (likes) descending
    featured.sort((a, b) => {
      const engagementA = a.likes || 0;
      const engagementB = b.likes || 0;
      return engagementB - engagementA;
    });

    // Sort future by date ascending (upcoming first)
    future.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateA - dateB;
    });

    // Sort ongoing by creation date descending (newest first)
    ongoing.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    // Sort past by date descending (most recent past first)
    past.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });

    return {
      featured,
      ongoing,
      future,
      past,
    };
  }, [activities]);

  return sections;
};
