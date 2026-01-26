"use client";

import React, { useEffect, useState } from "react";
import ActivityParticipation from "../activities/activityParticipation";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { Button } from "../ui/button";
import { deleteActivityByUser } from "@/lib/functions/supabaseFunctions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ActivityUpdate from "./activityUpdate";
import { Category, ActivityEntity, ActivityCategories } from "@/lib/types";
import { checkUserParticipation } from "@/lib/profile/profile";
import { useInvalidateActivities } from "@/lib/hooks/useActivities";
import { useRouter } from "next/navigation";

const ActivityHeaderButtons: React.FC<{
  activity: ActivityEntity;
  categories: (Category | null)[];
}> = ({ activity, categories }) => {
  const { user } = useGetUserProfile();
  const [isUserParticipant, setIsUserParticipant] = useState<boolean>(false);
  const { invalidateAll: invalidateAllActivities } = useInvalidateActivities();
  const router = useRouter();

  const isUserHost = activity.user_id === user?.id;

  const deleteActivityHandler = async () => {
    if (!user?.id) return;
    await deleteActivityByUser(user.id, activity.id);
    // Refresh any cached activity lists/maps
    invalidateAllActivities();
    // Navigate away from the now-deleted activity page
    router.push("/activities");
  };

  const categoryIds = categories.map(
    (category) => category?.id,
  ) as ActivityCategories[];

  const updatedActivity = {
    ...activity,
    categories: categoryIds,
  };

  useEffect(() => {
    (async () => {
      if (!user) return;
      const participant = await checkUserParticipation(user.id, activity.id);

      setIsUserParticipant(participant);
    })();
  }, [activity.id, user]);

  return (
    <>
      <div className="fixed bottom-24 left-0 flex w-full justify-center md:static md:bottom-0 md:justify-end">
        {user?.id !== undefined && isUserHost && (
          <div className="flex w-full flex-row justify-between gap-2 px-6 md:justify-end">
            <ActivityUpdate user={user!} activity={updatedActivity} />

            <Dialog>
              <DialogTrigger className="h-10 w-1/2 rounded-md bg-red-600 px-8 py-1 text-white shadow-lg md:w-auto">
                Delete
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-center md:w-2/3">
                  <DialogTitle>
                    Are you absolutely sure you want to delete?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your activity and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row justify-end gap-3">
                  <DialogClose>Close</DialogClose>
                  <Button variant="destructive" onClick={deleteActivityHandler}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {isUserParticipant ? (
          <p className="rounded-md border p-4 text-lg font-bold shadow-md">
            You are
            <span className="pl-2 text-green-600">Going</span>
          </p>
        ) : (
          user?.id !== undefined &&
          !isUserHost && (
            <ActivityParticipation activityId={activity.id} isBtnLarge />
          )
        )}
      </div>
    </>
  );
};
export default ActivityHeaderButtons;
