"use client";

import React from "react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FiShare } from "react-icons/fi";
import Share from "../general/share";
import { Category, ActivityEntity } from "@/lib/types";
import BookmarkButton from "../general/bookmarkButton";
import ActivityHeaderButtons from "./activityHeaderButtons";
import ActivityEngagement from "./activityEngagement";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";

const ActivityHeader: React.FC<{
  activity: ActivityEntity;
  categories: (Category | null)[];
}> = ({ activity, categories }) => {
  const { user } = useGetUserProfile();

  return (
    <>
      <header className="sticky top-20 z-40 mt-5 flex items-center justify-start gap-5 rounded-xl border bg-white px-2 py-4 shadow-md dark:bg-gray-800 md:static md:px-6">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 md:hidden"
          >
            <IoMdArrowRoundBack />
          </Link>
        </div>
        <div className="flex w-full items-center justify-between gap-3 md:flex-col md:items-start md:justify-start">
          <h2 className="text-xl font-bold md:text-3xl">{activity.title}</h2>
          <div className="flex gap-3">
            <ActivityEngagement
              user={user || null}
              activityId={activity.id}
              activityLikes={activity.likes || 0}
              activityDislikes={activity.dislikes || 0}
            />
            <BookmarkButton activityId={activity.id} />

            <Share activity={activity}>
              <FiShare className="text-lg md:text-2xl" />
            </Share>
          </div>
        </div>
        <ActivityHeaderButtons activity={activity} categories={categories} />
      </header>
    </>
  );
};
export default ActivityHeader;
