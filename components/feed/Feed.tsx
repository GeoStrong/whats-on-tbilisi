"use client";

import React, { useEffect, useMemo, useState } from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import NotAuth from "../auth/notAuth";
import UserAvatar from "../users/userAvatar";
import UsersRealtimeFollows from "../users/usersRealtimeFollows";
import Link from "next/link";
import { Button } from "../ui/button";
import FeedLoading, { FeedPostSkeleton } from "./FeedLoading";
import { useFeedPosts } from "@/lib/hooks/useFeedPosts";
import FeedPost from "./FeedPost";
import { getFollowedUsersParticipation } from "@/lib/functions/supabaseFunctions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserParticipationHistory } from "@/lib/types";
import ParticipationHistory from "../general/participationHistory";

const Feed: React.FC = () => {
  const { user, isLoading: userLoading, isAuthenticated } = useGetUserProfile();
  const [followedParticipations, setFollowedParticipations] = useState<
    UserParticipationHistory[] | null
  >(null);

  const userId = useMemo(() => user?.id || null, [user?.id]);

  const { data: posts = [], isLoading: postsLoading } = useFeedPosts(userId);

  const memoizedPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    (async () => {
      const participantsInfo = await getFollowedUsersParticipation(userId!);
      if (!participantsInfo) return;
      setFollowedParticipations(participantsInfo);
    })();
  }, [followedParticipations, userId]);

  if (userLoading && !user) {
    return (
      <div className="w-full">
        <FeedLoading />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <NotAuth />;
  }

  return (
    <div className="relative mt-6 grid w-full grid-cols-1 gap-5 md:grid-cols-6 lg:gap-6">
      <div className="sticky left-0 top-20 col-span-2 hidden h-80 flex-col items-center justify-start rounded-xl border p-4 shadow-md dark:border-slate-700 dark:bg-slate-800 md:flex">
        <UserAvatar avatarPath={user.avatar_path} size={20} />
        <h3 className="mt-5 text-center font-bold">{user.name}</h3>
        <div className="mt-4 w-full">
          <UsersRealtimeFollows userId={user.id} userName={user.name} />
        </div>
        <Button variant="outline" className="mt-4 w-full" asChild>
          <Link href="/profile">Open Profile</Link>
        </Button>
      </div>

      <div className="overflow-y-auto rounded-xl border shadow-md dark:border-slate-700 dark:bg-slate-800 md:col-span-4 md:col-start-3">
        <h1 className="my-6 text-center text-3xl font-bold md:text-4xl">
          For you
        </h1>
        {postsLoading && !memoizedPosts.length ? (
          <FeedPostSkeleton />
        ) : (
          <>
            {memoizedPosts.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <p className="text-center text-muted-foreground">
                  You don&apos;t have any posts in your feed yet! Start by
                  following users and activities you&apos;re interested in.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/activities">View Activities</Link>
                </Button>
              </div>
            ) : (
              <>
                <Tabs defaultValue="posts" className="">
                  <div className="flex w-full justify-center">
                    <TabsList>
                      <TabsTrigger className="text-base" value="posts">
                        Posts
                      </TabsTrigger>
                      <TabsTrigger className="text-base" value="participation">
                        Participation
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="posts" className="flex flex-col gap-3">
                    {memoizedPosts.map((post) => (
                      <FeedPost key={post.id} user={user} post={post} />
                    ))}
                  </TabsContent>
                  <TabsContent value="participation">
                    <p className="text-center">
                      See where you friends are going
                    </p>
                    <div className="p-4">
                      <ParticipationHistory
                        participations={followedParticipations}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;
