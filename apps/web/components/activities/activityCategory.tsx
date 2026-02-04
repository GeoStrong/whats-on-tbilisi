"use client";

import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { Category } from "@/lib/types";
import React, { useEffect, useState } from "react";
import DynamicIcon from "../ui/dynamicIcon";
import { CategoryChip } from "@whatson/ui";
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

  return (
    <div className="px-2 py-1">
      <CategoryChip
        label={category.name}
        color={category.color}
        count={activityQuantity}
        isActive={Boolean(categoryIsActive)}
        onPress={() => {
          if (categoryIsActive) return handleSearch("category", "");
          return handleSearch("category", category.id.toLocaleString());
        }}
        icon={<DynamicIcon name={category.icon} />}
      />
    </div>
  );
};
export default ActivityCategory;
