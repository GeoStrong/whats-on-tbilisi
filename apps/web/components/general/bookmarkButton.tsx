"use client";

import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { handleSavedActivities, isActivitySaved } from "@/lib/profile/profile";
import React, { useEffect, useState } from "react";
import { BsFillBookmarkFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";
import { toast } from "sonner";
import { Skeleton } from "@mui/material";

const BookmarkButton: React.FC<{ activityId: string }> = ({ activityId }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useGetUserProfile();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) {
        setIsSaved(false);
        setLoading(false);
        return;
      }

      try {
        const saved = await isActivitySaved(user.id, activityId);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error fetching saved:", error);
      }

      setLoading(false);
    };

    fetchSaved();
  }, [user, activityId]);

  const toggleSave = async () => {
    if (!user) {
      return dispatch(authActions.setAuthDialogOpen(true));
    }

    const newState = !isSaved;
    setIsSaved(newState);

    try {
      if (newState) {
        toast.success(`The activity has been saved`);
      } else {
        toast.error("The activity has been unsaved");
      }
      await handleSavedActivities(user, activityId, newState);
    } catch {
      setIsSaved(!newState);
    }
  };

  return (
    <>
      <button disabled={loading} onClick={toggleSave}>
        {loading ? (
          <Skeleton variant="rectangular" width={20} height={30} />
        ) : (
          <BsFillBookmarkFill
            className={`text-lg md:text-2xl ${isSaved ? "text-primary" : ""}`}
          />
        )}
      </button>
    </>
  );
};
export default BookmarkButton;
