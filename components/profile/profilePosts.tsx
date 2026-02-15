"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useFeedPostsByUserId } from "@/lib/hooks/useFeedPosts";
import FeedPost from "../feed/FeedPost";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import FeedPostSkeleton from "../feed/FeedLoading";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ParticipationHistory from "../general/participationHistory";
import { UserParticipationHistory } from "@/lib/types";
import { getUserParticipationHistory } from "@/lib/functions/supabaseFunctions";
import { useTranslation } from "react-i18next";

const ProfilePosts: React.FC<{ userId: string }> = ({ userId }) => {
  const { t } = useTranslation(["profile"]);
  const { user } = useGetUserProfile();
  const { data: posts = [], isLoading } = useFeedPostsByUserId(userId);
  const [participationHistory, setParticipationHistory] = useState<
    UserParticipationHistory[] | null
  >(null);

  useEffect(() => {
    (async () => {
      const history = await getUserParticipationHistory(userId);
      if (!history) return;
      setParticipationHistory(history);
    })();
  }, [userId]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="my-posts">
        <div className="flex w-full justify-center">
          <TabsList>
            <TabsTrigger className="text-base" value="my-posts">
              {t("profile:posts.myPosts")}
            </TabsTrigger>
            <TabsTrigger className="text-base" value="my-participations">
              {t("profile:posts.myParticipationHistory")}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="my-posts">
          <Card className="border-none shadow-none hover:shadow-none dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("profile:posts.feedPostsTitle")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("profile:posts.feedPostsDescription")}
              </CardDescription>
            </CardHeader>
            {isLoading ? (
              <CardDescription className="p-3">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <FeedPostSkeleton key={i} />
                  ))}
                </div>
              </CardDescription>
            ) : posts.length === 0 ? (
              <CardDescription className="md:p-4">
                <p className="col-span-2 py-8 text-center text-muted-foreground">
                  {t("profile:posts.noPostsYet")}
                </p>
              </CardDescription>
            ) : (
              <CardDescription className="space-y-6 md:p-4">
                {posts.map((post) => (
                  <FeedPost key={post.id} user={user} post={post} />
                ))}
              </CardDescription>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="my-participations">
          <Card className="border-none shadow-none hover:shadow-none dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("profile:posts.participationTitle")}
              </CardTitle>
              <CardDescription className="text-base">
                {t("profile:posts.participationDescription")}
              </CardDescription>
            </CardHeader>
            <CardDescription className="px-3 pb-5">
              <ParticipationHistory participations={participationHistory} />
            </CardDescription>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePosts;
