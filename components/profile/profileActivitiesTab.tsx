"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { fetchSavedActivities } from "@/lib/profile/profile";
import { ActivityEntity, UserParticipationHistory } from "@/lib/types";
import {
  getActivitiesByUserId,
  getUserParticipationHistory,
} from "@/lib/functions/supabaseFunctions";
import ProfileActivitiesCard from "./profileActivitiesCard";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ParticipationHistory from "../general/participationHistory";

const ProfileActivitiesTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [myActivities, setMyActivities] = useState<ActivityEntity[]>([]);
  const [savedActivities, setSavedActivities] = useState<ActivityEntity[]>([]);
  const [participationHistory, setParticipationHistory] = useState<
    UserParticipationHistory[] | null
  >(null);

  useEffect(() => {
    (async () => {
      const savedActivities = await fetchSavedActivities(userId);
      setSavedActivities(savedActivities);
      const myActivities = await getActivitiesByUserId(userId);
      setMyActivities(myActivities);
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      const history = await getUserParticipationHistory(userId);
      if (!history) return;
      setParticipationHistory(history);
    })();
  }, [userId]);

  return (
    <>
      <TabsContent value="activities" className="space-y-4">
        <Tabs defaultValue="my-activities">
          <div className="flex w-full justify-center">
            <TabsList>
              <TabsTrigger className="text-base" value="my-activities">
                My Actviities
              </TabsTrigger>
              <TabsTrigger className="text-base" value="my-participations">
                My Participation History
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
          <TabsContent value="my-participations">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg">
                  Your Participation History
                </CardTitle>
                <CardDescription className="text-base">
                  You can explore your participation history here.
                </CardDescription>
              </CardHeader>
              <CardDescription className="px-3 pb-5">
                <ParticipationHistory participations={participationHistory} />
              </CardDescription>
            </Card>
          </TabsContent>
          <TabsContent value="my-bookmarks">
            <ProfileActivitiesCard
              activities={savedActivities}
              title="Activities you've bookmarked for later."
              description="You can explore your bookmarked activities here."
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </>
  );
};
export default ProfileActivitiesTab;
