"use client";

import React, { useEffect, useState } from "react";
import ActivityCategoriesCarousel from "./activityCategoriesCarousel";
import { Category } from "@/lib/types";
import { useCategories } from "@/lib/hooks/useCategories";
import { getActivitiesByCategoryId } from "@/lib/functions/supabaseFunctions";
import ActivityCategoriesCarouselLoading from "./activityCategoriesCarouselLoading";

interface CategoryWithCount extends Category {
  _activityCount?: number;
}

const SmartActivityCategoriesCarousel: React.FC = () => {
  const { data: categories = [], isLoading } = useCategories();
  const [sortedCategories, setSortedCategories] = useState<CategoryWithCount[]>(
    [],
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      setSortedCategories([]);
      return;
    }

    let isCancelled = false;

    (async () => {
      try {
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            try {
              const activities = await getActivitiesByCategoryId(
                String(category.id),
              );
              // Only count activities with status 'active' or 'pending'
              const filtered = activities.filter(
                (activity) =>
                  activity.status === "active" || activity.status === "pending",
              );
              return {
                ...category,
                _activityCount: filtered.length,
              } as CategoryWithCount;
            } catch {
              return {
                ...category,
                _activityCount: 0,
              } as CategoryWithCount;
            }
          }),
        );

        if (isCancelled) return;

        // Sort: categories with activities first, then by count descending, then by name
        const sorted = [...categoriesWithCounts].sort((a, b) => {
          const aCount = a._activityCount ?? 0;
          const bCount = b._activityCount ?? 0;
          if (aCount === 0 && bCount > 0) return 1;
          if (bCount === 0 && aCount > 0) return -1;
          if (bCount !== aCount) return bCount - aCount;
          return a.name.localeCompare(b.name);
        });

        setSortedCategories(sorted);
      } catch (error) {
        console.error("Failed to compute category activity counts:", error);
        if (!isCancelled) {
          setSortedCategories(categories as CategoryWithCount[]);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [categories]);

  if (isLoading && sortedCategories.length === 0) {
    return <ActivityCategoriesCarouselLoading />;
  }

  if (!sortedCategories.length) {
    return null;
  }

  return <ActivityCategoriesCarousel categories={sortedCategories} />;
};

export default SmartActivityCategoriesCarousel;
