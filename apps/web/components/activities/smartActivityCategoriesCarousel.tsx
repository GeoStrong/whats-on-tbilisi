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
              return {
                ...category,
                _activityCount: activities.length,
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

        const sorted = [...categoriesWithCounts].sort((a, b) => {
          const aCount = a._activityCount ?? 0;
          const bCount = b._activityCount ?? 0;
          return bCount - aCount;
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
