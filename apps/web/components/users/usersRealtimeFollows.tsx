"use client";
import {
  fetchAllFollowersByUserId,
  fetchAllFollowingsByUserId,
} from "@/lib/profile/profile";
import { RootState } from "@/lib/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getActivitiesByUserId } from "@/lib/functions/supabaseFunctions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FollowersEntity } from "@/lib/types";
import UserCard from "./userCard";
import { Skeleton } from "../ui/skeleton";

const UsersRealtimeFollows: React.FC<{
  userId: string;
  userName: string;
}> = ({ userId, userName }) => {
  const [postedActivitiesNumber, setPostedActivitiesNumber] = useState<
    number | null
  >(null);
  const [followers, setFollowers] = useState<FollowersEntity[] | null>(null);
  const [followings, setFollowings] = useState<FollowersEntity[] | null>(null);
  const { lastChangedUserId, lastChangedAt } = useSelector(
    (state: RootState) => state.follower,
  );
  const [openFollowDialog, setOpenFollowDialog] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"Followers" | "Following">(
    "Followers",
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      const userFollowers = await fetchAllFollowersByUserId(userId);
      const userFollowings = await fetchAllFollowingsByUserId(userId);
      if (!mounted) return;
      setFollowers(userFollowers);
      setFollowings(userFollowings);
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!lastChangedAt) return;
    if (lastChangedUserId !== userId) return;

    let mounted = true;
    (async () => {
      const userFollowers = await fetchAllFollowersByUserId(userId);
      const userFollowings = await fetchAllFollowingsByUserId(userId);

      if (!mounted) return;
      setFollowers(userFollowers);
      setFollowings(userFollowings);
    })();

    return () => {
      mounted = false;
    };
  }, [lastChangedAt, lastChangedUserId, userId]);

  useEffect(() => {
    (async () => {
      const activities = await getActivitiesByUserId(userId);
      setPostedActivitiesNumber(activities.length);
    })();
  }, [userId]);

  //   useEffect(() => {
  //     const channel = supabase
  //       .channel("realtime follows")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "INSERT",
  //           schema: "public",
  //           table: "followers",
  //         },
  //         () => {
  //           setFollowers(userFollowers + 1);
  //         },
  //       )
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "DELETE",
  //           schema: "public",
  //           table: "followers",
  //         },
  //         () => {
  //           setFollowers(userFollowers - 1);
  //         },
  //       )
  //       .subscribe();

  //     return () => {
  //       supabase.removeChannel(channel);
  //     };
  //   }, [supabase]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1 text-center">
          <p className="flex justify-center text-lg font-bold">
            {postedActivitiesNumber === null ? (
              <Skeleton className="h-6 w-4" />
            ) : (
              postedActivitiesNumber
            )}
          </p>
          <p className="text-base">Activities</p>
        </div>
        <button
          className="space-y-1 text-center"
          onClick={() => {
            setOpenFollowDialog(true);
            setActiveTab("Followers");
          }}
        >
          <p className="flex justify-center text-lg font-bold">
            {followers === null ? (
              <Skeleton className="h-6 w-4" />
            ) : (
              followers.length
            )}
          </p>
          <p className="text-base">Followers</p>
        </button>
        <button
          className="space-y-1 text-center"
          onClick={() => {
            setOpenFollowDialog(true);
            setActiveTab("Following");
          }}
        >
          <p className="flex justify-center text-lg font-bold">
            {followings === null ? (
              <Skeleton className="h-6 w-4" />
            ) : (
              followings.length
            )}
          </p>
          <p className="text-base">Following</p>
        </button>
      </div>
      <Dialog open={openFollowDialog} onOpenChange={setOpenFollowDialog}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="w-[90%] rounded-md dark:bg-gray-900 md:w-full">
          <DialogHeader>
            <DialogTitle className="text-center">{userName}</DialogTitle>
            <DialogDescription>
              <Tabs defaultValue={activeTab} className="h-96">
                <TabsList className="flex w-full justify-center">
                  <TabsTrigger value="Followers" className="text-base">
                    Followers
                  </TabsTrigger>
                  <TabsTrigger value="Following" className="text-base">
                    Following
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="Followers"
                  className="mt-5 space-y-2 overflow-y-auto text-base text-black dark:text-white"
                >
                  {followers?.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No Followers
                    </p>
                  )}
                  {followers?.map((user) => (
                    <UserCard key={user.user_id} userId={user.follower_id} />
                  ))}
                </TabsContent>
                <TabsContent
                  value="Following"
                  className="mt-5 space-y-2 overflow-y-auto text-base text-black dark:text-white"
                >
                  {followings?.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      No Followings
                    </p>
                  )}
                  {followings?.map((user) => (
                    <UserCard key={user.user_id} userId={user.user_id} />
                  ))}
                </TabsContent>
              </Tabs>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default UsersRealtimeFollows;
