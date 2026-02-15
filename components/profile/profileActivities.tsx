"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { fetchSavedActivities } from "@/lib/profile/profile";
import { ActivityEntity } from "@/lib/types";
import { getActivitiesByUserId } from "@/lib/functions/supabaseFunctions";
import ProfileActivitiesCard from "./profileActivitiesCard";
import { useTranslation } from "react-i18next";

const ProfileActivities: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation(["profile"]);
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
                {t("profile:activities.myActivities")}
              </TabsTrigger>
              <TabsTrigger className="text-base" value="my-bookmarks">
                {t("profile:activities.myBookmarks")}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="my-activities">
            <ProfileActivitiesCard
              activities={myActivities}
              title={t("profile:activities.postedTitle")}
              description={t("profile:activities.postedDescription")}
            />
          </TabsContent>
          <TabsContent value="my-bookmarks">
            <ProfileActivitiesCard
              activities={savedActivities}
              title={t("profile:activities.bookmarksTitle")}
              description={t("profile:activities.bookmarksDescription")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
export default ProfileActivities;
