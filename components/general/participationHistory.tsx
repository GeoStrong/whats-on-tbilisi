import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { UserParticipationHistory } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../users/userAvatar";

const ParticipationHistory: React.FC<{
  participations: UserParticipationHistory[] | null;
}> = ({ participations }) => {
  return (
    <>
      {participations && participations.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          {participations.map((participation, index) => (
            <div
              key={index}
              className="border p-4 shadow-md dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                <div className="space-y-1">
                  <Link
                    href={`/users/${participation.userId}`}
                    className="flex items-center gap-2 text-base"
                  >
                    <UserAvatar
                      avatarPath={participation.userAvatar}
                      size={8}
                    />
                    <strong>{participation.userName}</strong>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      participation.participationDate || "",
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-sm">
                  {participation.activityStatus === "active" ? (
                    <span className="font-semibold">will attend</span>
                  ) : participation.activityStatus === "inactive" ? (
                    <span className="font-semibold text-muted-foreground">
                      attended
                    </span>
                  ) : (
                    <span className="font-semibold text-orange-500">
                      is attending
                    </span>
                  )}
                </p>
                <div className="space-y-1">
                  <Link
                    href={`/activities/${participation.activityId}`}
                    className="flex items-center gap-2 rounded-xl border p-1 px-2"
                  >
                    {participation.activityTitle}
                    <BsArrowUpRight />
                  </Link>
                  <p className="text-sm text-muted-foreground md:text-right">
                    {new Date(
                      participation.activityDate || "",
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-center text-muted-foreground">
          No participation activity from followed users.
        </p>
      )}
    </>
  );
};
export default ParticipationHistory;
