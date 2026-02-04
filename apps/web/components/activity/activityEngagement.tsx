"use client";

import {
  getActivityReactions,
  getUserReaction,
  toggleActivityReaction,
} from "@/lib/functions/supabaseFunctions";
import { authActions } from "@/lib/store/authSlice";
import { UserProfile } from "@/lib/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillDislike } from "react-icons/ai";
import { AiFillLike } from "react-icons/ai";
import { useDispatch } from "react-redux";

const ActivityEngagement: React.FC<{
  user: UserProfile | null;
  activityId: string;
  activityLikes: number;
  activityDislikes: number;
}> = ({ user, activityId, activityLikes, activityDislikes }) => {
  const [likes, setLikes] = useState<number>(activityLikes);
  const [dislikes, setDislikes] = useState<number>(activityDislikes);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null,
  );
  const dispatch = useDispatch();

  const userId = useMemo(() => user?.id, [user?.id]);

  useEffect(() => {
    if (!userId) return;

    const loadReaction = async () => {
      const reaction = await getUserReaction(activityId, userId);
      setUserReaction(reaction);
    };

    loadReaction();
  }, [activityId, userId]);

  const handleReaction = useCallback(
    async (reaction: "like" | "dislike") => {
      if (!userId) {
        dispatch(authActions.setAuthDialogOpen(true));
        return;
      }

      await toggleActivityReaction(activityId, reaction, userId);

      const updated = await getActivityReactions(activityId);

      setLikes(updated.likes);
      setDislikes(updated.dislikes);

      if (userReaction === reaction) {
        setUserReaction(null);
      } else {
        setUserReaction(reaction);
      }
    },
    [activityId, userId, userReaction, dispatch],
  );

  return (
    <>
      <button
        className={`flex items-center gap-2 ${
          userReaction === "like" ? "text-blue-500" : ""
        }`}
        onClick={() => handleReaction("like")}
      >
        <AiFillLike className="text-lg md:text-2xl" />
        <span>{likes}</span>
      </button>

      <button
        className={`flex items-center gap-2 ${
          userReaction === "dislike" ? "text-red-500" : ""
        }`}
        onClick={() => handleReaction("dislike")}
      >
        <AiFillDislike className="text-lg md:text-2xl" />
        <span>{dislikes}</span>
      </button>
    </>
  );
};

export default ActivityEngagement;
