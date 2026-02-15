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
import { useTranslation } from "react-i18next";

const ActivityHeaderButtons: React.FC<{
  activity: ActivityEntity;
  categories: (Category | null)[];
}> = ({ activity, categories }) => {
  const { t } = useTranslation(["activity"]);
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
                {t("activity:delete")}
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="text-center md:w-2/3">
                  <DialogTitle>{t("activity:areYouSureDelete")}</DialogTitle>
                  <DialogDescription>
                    {t("activity:deleteWarning")}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-row justify-end gap-3">
                  <DialogClose>{t("activity:close")}</DialogClose>
                  <Button variant="destructive" onClick={deleteActivityHandler}>
                    {t("activity:delete")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {isUserParticipant && activity.status === "inactive" ? (
          <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4 text-lg font-bold shadow-md dark:bg-yellow-900">
            <p className="text-center text-sm text-yellow-500">
              {t("activity:activityParticipation:participated")}
            </p>
          </div>
        ) : isUserParticipant ? (
          <p className="rounded-md border p-4 text-lg font-bold shadow-md">
            {t("activity:activityParticipation.going")}
            <span className="pl-2 text-green-600">
              {t("activity:youAreGoing")}
            </span>
          </p>
        ) : (
          user?.id !== undefined &&
          !isUserHost &&
          activity.status !== "inactive" && (
            <ActivityParticipation activityId={activity.id} isBtnLarge />
          )
        )}
        {!isUserHost &&
          activity.status === "inactive" &&
          !isUserParticipant && (
            <div className="rounded-md border border-yellow-500 bg-yellow-50 p-4 text-lg font-bold shadow-md dark:bg-yellow-900">
              <p className="text-center text-sm text-yellow-500">
                {t("activity:participationEnded")}
              </p>
            </div>
          )}
      </div>
    </>
  );
};
export default ActivityHeaderButtons;
