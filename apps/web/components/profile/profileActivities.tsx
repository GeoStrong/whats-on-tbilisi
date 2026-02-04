"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { fetchSavedActivities } from "@/lib/profile/profile";
import { ActivityEntity } from "@/lib/types";
import { getActivitiesByUserId } from "@/lib/functions/supabaseFunctions";
import ProfileActivitiesCard from "./profileActivitiesCard";

const ProfileActivities: React.FC<{ userId: string }> = ({ userId }) => {
  const [myActivities, setMyActivities] = useState<ActivityEntity[]>([]);
  const [savedActivities, setSavedActivities] = useState<ActivityEntity[]>([]);

  useEffect(() => {
    (async () => {
      const savedActivities = await fetchSavedActivities(userId);
      setSavedActivities(savedActivities);
      const myActivities = await getActivitiesByUserId(userId);
      setMyActivities(myActivities);
    })();
  }, [userId]);

  return (
    <>
      <div className="space-y-4">
        <Tabs defaultValue="my-activities">
          <div className="flex w-full justify-center">
            <TabsList>
              <TabsTrigger className="text-base" value="my-activities">
                My Actviities
              </TabsTrigger>
              <TabsTrigger className="text-base" value="my-bookmarks">
                My Bookmarks
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="my-activities">
            <ProfileActivitiesCard
              activities={myActivities}
              title="Activities you posted"
              description="You can explore activities you posted"
            />
          </TabsContent>
          <TabsContent value="my-bookmarks">
            <ProfileActivitiesCard
              activities={savedActivities}
              title="Activities you've bookmarked for later."
              description="You can explore your bookmarked activities here."
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
export default ProfileActivities;
