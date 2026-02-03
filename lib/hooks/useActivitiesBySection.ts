"use client";

import { useMemo } from "react";
import { ActivityEntity } from "../types";

/**
 * Categorizes activities into sections based on status
 * - featured: featured flag (can overlap with other sections)
 * - ongoing: pending status
 * - future: active status
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

    const featured: ActivityEntity[] = [];
    const ongoing: ActivityEntity[] = [];
    const future: ActivityEntity[] = [];
    const past: ActivityEntity[] = [];

    activities.forEach((activity) => {
      const status = activity.status || "active";

      if (activity.featured) {
        featured.push(activity);
      }

      if (status === "inactive") {
        past.push(activity);
      } else if (status === "pending") {
        ongoing.push(activity);
      } else {
        future.push(activity);
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
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
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
