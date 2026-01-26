"use client";

import React, { useEffect, useState } from "react";
import MapWrapper from "../map/map";
import { ActivityEntity, Category } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { env } from "@/lib/utils/env";
import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";

const ActivityLocation: React.FC<{ activity: ActivityEntity }> = ({
  activity,
}) => {
  const [category, setCategory] = useState<Category | null>(null);
  const mapKey = env.googleMapsApiKey || "";

  useEffect(() => {
    (async () => {
      const categories = await getCategoriesByActivityId(activity.id);
      setCategory(categories?.[0] || null);
    })();
  }, [activity.id]);

  return (
    <>
      <div className="w-full rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 font-bold md:text-lg">Location on map</h3>

        {mapKey ? (
          <MapWrapper
            API_KEY={mapKey}
            height="h-52"
            displayActivities={false}
            selectedActivityLocation={[
              {
                key: activity.id,
                location: activity.googleLocation!,
                categoryColor: category?.color,
                categoryIcon: category?.icon,
              },
            ]}
            displayMapButtons={false}
          />
        ) : (
          <Skeleton className="h-40 w-full" />
        )}
      </div>
    </>
  );
};
export default ActivityLocation;
