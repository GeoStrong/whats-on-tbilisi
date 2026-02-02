"use client";
import { FiShare } from "react-icons/fi";
import { MdOutlineOpenInNew } from "react-icons/md";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Category, ActivityEntity } from "@/lib/types";
import useScreenSize from "@/lib/hooks/useScreenSize";
import Link from "next/link";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import ActivityParticipation from "./activityParticipation";
import Share from "../general/share";

import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";
import { isString } from "@/lib/functions/helperFunctions";
import BookmarkButton from "../general/bookmarkButton";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { Button } from "../ui/button";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";
import OptimizedImage from "../ui/optimizedImage";
import { checkUserParticipation } from "@/lib/profile/profile";
import { BiRightTopArrowCircle } from "react-icons/bi";
import UserCard from "../users/userCard";

const snapPoints = [0.5, 1];

interface ActivityDescriptionProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  activity: ActivityEntity;
  setSearchParams: (query: string, value: string) => void;
  open?: boolean;
}

const ActivityDescription: React.FC<ActivityDescriptionProps> = ({
  buttonRef,
  activity,
  setSearchParams,
  open = false,
}) => {
  const { isMobile } = useScreenSize();
  const [snap, setSnap] = useState<number | string | null>(1);
  const [categories, setCategories] = useState<(Category | null)[]>([]);
  const { user } = useGetUserProfile();
  const [isUserParticipant, setIsUserParticipant] = useState<boolean>(false);

  const { imageUrl: activityImage } = useOptimizedImage(activity.image, {
    quality: 50,
    width: 800,
    height: 600,
    fallback: defaultActivityImg.src,
  });

  useEffect(() => {
    (async () => {
      const categories = await getCategoriesByActivityId(activity.id);
      if (categories) setCategories(categories || []);
    })();
  }, [activity.id]);

  useEffect(() => {
    (async () => {
      if (user! || !activity) return;
      const participant = await checkUserParticipation(user!.id, activity.id);

      setIsUserParticipant(participant);
    })();
  }, [activity, activity.id, user]);

  return (
    <>
      <Drawer
        snapPoints={isMobile ? snapPoints : [1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        direction={isMobile ? "bottom" : "right"}
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSearchParams("activity", "");
        }}
        fadeFromIndex={0}
      >
        <DrawerTrigger ref={buttonRef} className="hidden"></DrawerTrigger>
        <DrawerPortal>
          <DrawerContent
            headerChildren={
              <Link
                href={`/activities/${activity.id}`}
                className="absolute right-5 top-4 flex items-center gap-2 duration-300 hover:text-primary"
              >
                Open Activity
                <MdOutlineOpenInNew />
              </Link>
            }
            className={`${isMobile ? "w-full" : "w-auto"} mx-[-1px] flex h-full flex-col border-0 bg-white`}
          >
            <div className="flex h-dvh w-full flex-col overflow-y-auto">
              <DrawerHeader className="relative">
                <div className="absolute left-5 top-0 z-20 flex w-[91%] items-center justify-between">
                  <div className="flex gap-2">
                    {categories.map((category) => (
                      <span
                        key={category?.id}
                        className={`rounded-full bg-${category?.color} px-2 py-1 text-xs text-white`}
                      >
                        {category?.name}
                      </span>
                    ))}
                  </div>
                  <BookmarkButton activityId={activity.id} />
                </div>
                <DrawerTitle className="mt-3 text-center text-xl font-bold">
                  {activity.title}
                </DrawerTitle>
                <DrawerDescription className="text-left text-lg">
                  {activity.description}
                </DrawerDescription>
                <div className="mt-5 text-left">
                  {activity?.hostName && (
                    <p className="text-base">
                      Hosted by:{" "}
                      <span className="linear-yellow text-base">
                        {activity?.hostName}
                      </span>
                    </p>
                  )}
                  <p className="">
                    Address:{" "}
                    <span className="text-lg font-bold">
                      {activity.location}
                    </span>
                  </p>

                  <p className="text-md">
                    Time:{" "}
                    <span className="text-lg font-bold">
                      {isString(activity?.time) ? activity.time : ""}
                    </span>
                  </p>
                  {activity.endTime && (
                    <p className="text-md">
                      End Time:{" "}
                      <span className="text-lg font-bold">
                        {isString(activity?.endTime) ? activity.endTime : ""}
                      </span>
                    </p>
                  )}
                  <p className="text-md">
                    Start Date:{" "}
                    <span className="text-lg font-bold">
                      {activity.date &&
                        new Date(activity.date).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                          weekday: "short",
                          day: "numeric",
                        })}
                    </span>
                  </p>
                  {activity.targetAudience && (
                    <p className="">
                      Target Audience:
                      <span className="text-lg font-bold">
                        {" "}
                        {activity.targetAudience}
                      </span>
                    </p>
                  )}
                  <div className="my-3">
                    {user?.id !== activity.user_id && (
                      <UserCard
                        userId={activity.user_id!}
                        displayFollowButton={false}
                      />
                    )}
                  </div>
                  {activity?.image && (
                    <OptimizedImage
                      src={activityImage || defaultActivityImg.src}
                      width={100}
                      height={100}
                      alt="activity"
                      priority={false}
                      containerClassName="mt-5 rounded-xl h-44 w-full"
                      objectFit="cover"
                      quality={50}
                    />
                  )}
                  <p className="de mt-4 flex items-center justify-between gap-2 md:justify-start">
                    Share this activity with friends:
                    <Share activity={activity}>
                      <FiShare className="text-xl" />
                    </Share>
                  </p>
                </div>
              </DrawerHeader>
              <DrawerFooter className="flex flex-col items-center gap-2 md:flex-row-reverse">
                {user?.id !== undefined && activity.user_id === user?.id && (
                  <Link href={`/activities/${activity.id}`}>
                    <Button className="h-12">Modify Activity</Button>
                  </Link>
                )}
                {isUserParticipant ? (
                  <p className="text-lg font-bold">
                    You are
                    <span className="pl-2 text-green-600">Going</span>
                  </p>
                ) : !isUserParticipant &&
                  user?.id !== undefined &&
                  activity.user_id !== user?.id ? (
                  <ActivityParticipation isNested activityId={activity.id} />
                ) : null}
                <DrawerClose className="h-12 bg-transparent p-2">
                  Close
                </DrawerClose>
              </DrawerFooter>
              {snap !== 1 && isMobile && (
                <div className="min-h-96 w-full"></div>
              )}
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
};
export default ActivityDescription;
