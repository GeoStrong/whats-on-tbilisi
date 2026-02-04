"use client";

import {
  Category,
  ActivityEntity,
  UserProfile,
  ActivityParticipantsEntity,
} from "@/lib/types";
import OptimizedImage from "@/components/ui/optimizedImage";
import React, { useEffect, useState } from "react";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import ActivityDetails from "./activityDetails";
import Link from "next/link";
import Socials from "../general/socials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import useMapZoom from "@/lib/hooks/useMapZoom";
import {
  fetchAllParticipantsByActivityId,
  fetchUserInfo,
} from "@/lib/profile/profile";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import ActivityComments from "./activityComments";
import { useOptimizedImage } from "@/lib/hooks/useOptimizedImage";
import ActivityParticipants from "./activityParticipants";
import UserFollowButton from "../general/userFollowButton";
import ActivityLocation from "./activityLocation";
import defaultUserImg from "@/public/images/default-user.png";
import Image from "next/image";

interface ActivityBodyProps {
  categories: (Category | null)[];
  activity: ActivityEntity;
}

const ActivityBody: React.FC<ActivityBodyProps> = ({
  activity,
  categories,
}) => {
  const { handleLocationClick } = useMapZoom(activity.id);
  const [host, setHost] = useState<UserProfile | null>();
  const { user } = useGetUserProfile();
  const [activityParticipants, setActivityParticipants] = useState<
    ActivityParticipantsEntity[] | null
  >(null);

  const { imageUrl: activityImage } = useOptimizedImage(activity.image, {
    quality: 50,
    width: 800,
    height: 600,
    fallback: defaultActivityImg.src,
  });

  const { imageUrl: hostImage } = useOptimizedImage(host?.avatar_path || "", {
    quality: 50,
    width: 100,
    height: 100,
  });

  useEffect(() => {
    (async () => {
      const host = (await fetchUserInfo(activity.user_id!)) as UserProfile;
      setHost(host);
    })();
  }, [categories, activity.image, activity.user_id]);

  useEffect(() => {
    (async () => {
      if (!activity.id) return;
      const participants = await fetchAllParticipantsByActivityId(activity.id);
      setActivityParticipants(participants);
    })();
  }, [activity.id]);

  return (
    <div className="mb-10 mt-5 flex w-full flex-col gap-5 md:flex-row">
      <div className="md:w-3/4">
        <div className="flex flex-col gap-5 rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800 md:px-6">
          <div className="rounded-md">
            <OptimizedImage
              src={activityImage}
              width={800}
              height={600}
              alt="activity"
              quality={50}
              objectFit="cover"
              priority={true}
              objectPosition="center"
              className="rounded-md"
              containerClassName="max-h-96 w-full"
            />
          </div>
          <div className="w-full">
            <h3 className="my-3 text-base font-semibold md:text-xl">
              About the activity
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <span
                    key={category?.id}
                    className={`rounded-full bg-${category?.color} px-2 py-1 text-sm text-white`}
                  >
                    {category?.name}
                  </span>
                ))}
              </div>
              <Badge
                variant={`${activity.status === "active" ? "success" : activity.status === "inactive" ? "destructive" : "default"}`}
              >
                {activity.status?.toUpperCase()}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground md:text-lg">
              {activity.description}
            </p>
            <h3 className="mt-3 text-base font-semibold md:text-xl">
              Activity Details:
            </h3>
            <div className="mt-2 flex w-full flex-col justify-between md:flex-row">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ActivityDetails
                    detail="📍 Address"
                    value={activity.location}
                  />
                  <Link
                    href="/map"
                    className="text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (activity.googleLocation) {
                        handleLocationClick(activity.googleLocation);
                      }
                    }}
                  >
                    See Map ↗️
                  </Link>
                </div>
                <ActivityDetails
                  detail="⌚ Time"
                  value={activity.time as string}
                />
                <ActivityDetails
                  detail="📅 Date"
                  value={
                    activity.date &&
                    new Date(activity.date).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                      weekday: "short",
                      day: "numeric",
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              {activity.tags &&
                activity.tags.map((tag) => (
                  <span key={tag} className="font-bold">
                    #{tag}
                  </span>
                ))}
            </div>
            <h3 className="mt-3 text-base font-semibold md:text-xl">
              Share with your friends
            </h3>
            <Socials />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 md:w-1/4">
        <div className="max-h-40 rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800 lg:col-span-1">
          <h3 className="font-bold md:text-lg">Host</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={hostImage || ""}
                className="object-cover object-top"
              />
              <AvatarFallback>
                <Image
                  src={defaultUserImg.src}
                  alt="Default Avatar"
                  width={20}
                  height={20}
                  className="h-12 w-12 object-cover"
                />
              </AvatarFallback>
            </Avatar>
            <Link
              href={
                user?.id === activity.user_id
                  ? "/profile#account"
                  : `/users/${host?.id}`
              }
              className="flex w-full items-center justify-between gap-2"
            >
              <span className="text-center text-base">{host?.name}</span>
            </Link>
            {activity.user_id && user?.id !== activity.user_id && (
              <UserFollowButton userId={activity.user_id} />
            )}
          </div>
        </div>
        <div className="rounded-xl bg-white px-3 py-4 shadow-md dark:bg-gray-800 lg:col-span-1">
          <h3 className="font-bold md:text-lg">Additional Info</h3>
          <div className="flex items-center gap-2">
            <div className="mt-2 flex flex-col">
              {activity.link && (
                <ActivityDetails
                  detail="🔗 Link"
                  value={
                    <Link
                      href={activity.link}
                      className="text-blue-500 underline"
                      target="_blank"
                    >
                      Learn More
                    </Link>
                  }
                />
              )}
              <ActivityDetails
                detail="👥 Target Audience"
                value={activity.targetAudience}
              />
              <ActivityDetails
                detail="🔢 Max Attendees"
                value={activity.maxAttendees}
              />
              <ActivityDetails
                detail="Participants"
                value={activity.participants?.length}
              />
            </div>
          </div>
        </div>
        <ActivityLocation activity={activity} />
        <ActivityComments user={user} activity={activity} />
        {activityParticipants && activityParticipants.length > 0 && (
          <ActivityParticipants
            isHost={user?.id === activity.user_id}
            participants={activityParticipants}
          />
        )}
      </div>
    </div>
  );
};
export default ActivityBody;
