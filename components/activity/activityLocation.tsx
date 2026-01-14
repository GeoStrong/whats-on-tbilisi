import React, { useEffect, useState } from "react";
import MapWrapper from "../map/map";
import { ActivityEntity } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { env } from "@/lib/utils/env";

const ActivityLocation: React.FC<{ activity: ActivityEntity }> = ({
  activity,
}) => {
  // const [mapKey, setMapKey] = useState<string>("");

  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch("/api/use-secret");

  //     const { key } = await response.json();
  //     setMapKey(key);
  //   })();
  // }, []);

  const mapKey = env.googleMapsApiKey || "";

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
              { key: activity.id, location: activity.googleLocation! },
            ]}
          />
        ) : (
          <Skeleton className="h-40 w-full" />
        )}
      </div>
    </>
  );
};
export default ActivityLocation;
