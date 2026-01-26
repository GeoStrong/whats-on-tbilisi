import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ActivityEntity } from "@/lib/types";
import { redirect } from "next/navigation";
import ActivityCard from "../activities/activityCard";

interface ProfileActivitiesCardProps {
  activities: ActivityEntity[];
  title: string;
  description: string;
}

const ProfileActivitiesCard: React.FC<ProfileActivitiesCardProps> = ({
  activities,
  title,
  description,
}) => {
  return (
    <>
      <Card className="border-none shadow-none hover:shadow-none dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        {activities.length === 0 ? (
          <CardDescription className="p-3">
            <p className="col-span-2 py-8 text-center text-muted-foreground">
              There are no activities found!
            </p>
          </CardDescription>
        ) : (
          <CardDescription className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => {
                  redirect(`/activities/${activity.id}`);
                }}
              >
                <ActivityCard activity={activity} />
              </div>
            ))}
          </CardDescription>
        )}
      </Card>
    </>
  );
};
export default ProfileActivitiesCard;
