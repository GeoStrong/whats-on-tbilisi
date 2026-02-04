"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import {
  checkUserFollow,
  handleFollowUser,
  handleUnfollowUser,
} from "@/lib/profile/profile";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { followerActions } from "@/lib/store/followerSlice";
import { Skeleton } from "../ui/skeleton";

const UserFollowButton: React.FC<{ userId: string; className?: string }> = ({
  userId,
  className,
}) => {
  const { user } = useGetUserProfile();
  const [isUserFollowing, setIsUserFollowing] = useState<boolean | null>(null);
  const followerId = user?.id;
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!followerId) return;
      const isFollowing = await checkUserFollow(userId, followerId);
      setIsUserFollowing(isFollowing);
    })();
  }, [dispatch, followerId, userId]);

  const handleClickFollow = async () => {
    if (!followerId) return;
    await handleFollowUser(userId, followerId);
    toast.success("Followed");
    setIsUserFollowing(true);
    dispatch(followerActions.setIsUserFollowing({ userId, isFollowing: true }));
  };

  const handleClickUnfollow = async () => {
    if (!followerId) return;
    await handleUnfollowUser(userId, followerId);
    toast.warning("Unfollowed");
    setIsUserFollowing(false);
    dispatch(
      followerActions.setIsUserFollowing({ userId, isFollowing: false }),
    );
  };

  if (userId === followerId) return;

  return (
    <>
      {isUserFollowing === null ? (
        <Skeleton className="h-8 w-20" />
      ) : isUserFollowing ? (
        <Button
          className={className}
          variant="outline"
          onClick={handleClickUnfollow}
        >
          Unfollow
        </Button>
      ) : (
        <Button className={className} onClick={handleClickFollow}>
          Follow
        </Button>
      )}
    </>
  );
};
export default UserFollowButton;
