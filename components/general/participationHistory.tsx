"use client";

import React from "react";
import { UserParticipationHistory } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../users/userAvatar";
import { Card, CardContent } from "../ui/card";
import { formatRelativeTime } from "@/lib/functions/helperFunctions";
import FeedActivityCard from "../feed/FeedActivityCard";
import { useTranslation } from "react-i18next";

const ParticipationCard: React.FC<{
  participation: UserParticipationHistory;
}> = ({ participation }) => {
  return (
    <Card className="overflow-hidden border-none shadow-none">
      <CardContent className="p-0">
        <div className="p-2 md:p-4">
          <div className="justify flex w-full items-start gap-3">
            <Link href={`/users/${participation.userId}`} className="shrink-0">
              <UserAvatar avatarPath={participation.userAvatar} size={12} />
            </Link>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-foreground">
                <Link
                  href={`/activities/${participation.activity?.id}`}
                  className="hover:text-primary"
                >
                  {participation.userName}{" "}
                  <span className="font-light">is joining </span>
                  &quot;{participation.activity.title}&quot;
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatRelativeTime(participation.participationDate)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 p-2">
          <FeedActivityCard activity={participation.activity} />
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation(["emptyStates", "feed"]);

  return (
    <div className="mt-2 flex flex-col items-center justify-center border border-slate-200 px-6 py-16 dark:border-slate-700">
      <h3 className="mb-2 text-lg font-semibold">
        {t("emptyStates:noParticipationHistory")}
      </h3>
      <p className="max-w-sm text-center text-sm text-muted-foreground">
        {message || t("feed:startExploringParticipation")}
      </p>
    </div>
  );
};

const ParticipationHistory: React.FC<{
  participations: UserParticipationHistory[] | null;
  showUser?: boolean;
  emptyMessage?: string;
}> = ({ participations, emptyMessage }) => {
  if (!participations || participations.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <>
      {participations.map((p, idx) => (
        <ParticipationCard key={`${p.activity?.id}-${idx}`} participation={p} />
      ))}
    </>
  );
};

export default ParticipationHistory;
