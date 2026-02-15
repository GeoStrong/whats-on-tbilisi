"use client";

import React, { useEffect, useState } from "react";
import {
  getActivitiesByUserId,
  getFeedPostsByUserId,
  getUserParticipationHistory,
} from "@/lib/functions/supabaseFunctions";
import {
  ActivityEntity,
  FeedPostWithActivity,
  UserParticipationHistory,
  UserProfile,
} from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import ActivityCard from "../activities/activityCard";
import { BsCalendar2Event } from "react-icons/bs";
import { FiFileText } from "react-icons/fi";
import FeedPost from "../feed/FeedPost";
import ParticipationHistory from "../general/participationHistory";
import { useTranslation } from "react-i18next";

const UsersBody: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { t } = useTranslation(["users"]);
  const [postedActivities, setPostedActivities] = useState<
    ActivityEntity[] | null
  >(null);
  const [participationHistory, setParticipationHistory] = useState<
    UserParticipationHistory[] | null
  >(null);
  const [userPosts, setUserPosts] = useState<FeedPostWithActivity[] | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const activities = await getActivitiesByUserId(user.id);
      setPostedActivities(activities);
    })();
  }, [user.id]);

  useEffect(() => {
    (async () => {
      const posts = await getFeedPostsByUserId(user.id);
      setUserPosts(posts);
    })();
  }, [user.id]);

  useEffect(() => {
    (async () => {
      const history = await getUserParticipationHistory(user.id);
      if (!history) return;
      setParticipationHistory(history);
    })();
  }, [user.id]);

  return (
    <div className="my-5 w-full">
      <Tabs
        defaultValue="activities"
        className="flex w-full flex-col rounded-xl py-5 dark:bg-gray-900"
      >
        <div className="flex w-full justify-center">
          <TabsList>
            <TabsTrigger
              className="flex items-center gap-2 text-base"
              value="activities"
            >
              <BsCalendar2Event />
              {t("users:activities")}
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-2 text-base"
              value="posts"
            >
              <FiFileText />
              {t("users:posts")}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="activities" className="text-center">
          <Tabs
            defaultValue="posted"
            className="flex w-full flex-col rounded-xl py-5 dark:bg-gray-900"
          >
            <div className="flex w-full justify-center">
              <TabsList>
                <TabsTrigger className="text-base" value="posted">
                  {t("users:postedActivities")}
                </TabsTrigger>
                <TabsTrigger className="text-base" value="participation">
                  {t("users:participationHistory")}
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="posted">
              <div className="grid w-full grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3">
                {postedActivities?.length === 0 && (
                  <p className="col-span-full text-center text-lg">
                    {t("users:noActivitiesPosted")}
                  </p>
                )}
                {postedActivities?.map((activity) => (
                  <div
                    key={activity.id}
                    onClick={() => {
                      redirect(`/activities/${activity.id}`);
                    }}
                  >
                    <ActivityCard activity={activity} />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="participation" className="text-center">
              <ParticipationHistory participations={participationHistory} />
            </TabsContent>
          </Tabs>
        </TabsContent>
        <TabsContent
          value="posts"
          className="rounded-xl border shadow-md dark:bg-gray-800 md:p-4"
        >
          <h3 className="mt-3 text-center text-xl font-bold">
            {t("users:usersPosts", { userName: user.name })}
          </h3>
          <div className="my-3">
            {userPosts &&
              userPosts.map((post) => (
                <FeedPost key={post.id} user={user} post={post} />
              ))}
            {userPosts?.length === 0 && (
              <p className="col-span-full text-center text-lg">
                {t("users:noPostsYet")}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default UsersBody;
