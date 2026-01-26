"use client";

import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { Category } from "@/lib/types";
import React, { useEffect, useState } from "react";
import DynamicIcon from "../ui/dynamicIcon";
import { Badge } from "../ui/badge";
import { getActivitiesByCategoryId } from "@/lib/functions/supabaseFunctions";

const ActivityCategory: React.FC<{ category: Category }> = ({ category }) => {
  const { handleSearch, searchParams } = useAddSearchQuery();
  const [activityQuantity, setActivityQuantity] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const activitiesByCategory = await getActivitiesByCategoryId(category.id);
      setActivityQuantity(activitiesByCategory.length);
    })();
  }, [category.id]);

  const activeCategory = searchParams.get("category");

  const categoryIsActive = activeCategory && activeCategory === category.id;

  const getActiveCategoryStyles = (category: string, categoryColor: string) => {
    if (activeCategory === category) {
      return `bg-${categoryColor} text-white`;
    }
  };

  return (
    <div className="px-2 py-1">
      <button
        className={`relative flex items-center justify-between gap-3 rounded-full border px-4 py-1 shadow-md dark:border-gray-600 md:py-3 ${getActiveCategoryStyles(category.id.toLocaleString(), category.color)}`}
        onClick={() => {
          if (categoryIsActive) return handleSearch("category", "");
          return handleSearch("category", category.id.toLocaleString());
        }}
      >
        {activityQuantity > 0 && (
          <Badge
            className={`${categoryIsActive ? `border-[1px] border-${category.color}/80 bg-white text-${category.color}` : `bg-${category.color} text-white`} hover:bg-${category.color} absolute -right-3 -top-0 flex w-1 items-center justify-center rounded-full text-[10px] font-medium`}
          >
            {activityQuantity}
          </Badge>
        )}
        <DynamicIcon name={category.icon} />
        <span className="text-sm">{category.name}</span>
      </button>
    </div>
  );
};
export default ActivityCategory;
