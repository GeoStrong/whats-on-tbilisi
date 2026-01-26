"use client";

import Link from "next/link";
import React from "react";
import UserAvatar from "./userAvatar";
import UserFollowButton from "../general/userFollowButton";
import { useUser } from "@/lib/hooks/useUser";

const UserCard: React.FC<{
  userId: string;
  children?: React.ReactNode;
  displayFollowButton?: boolean;
}> = ({ userId, children, displayFollowButton = true }) => {
  const { data: activeUser } = useUser(userId);

  return (
    <>
      <div className="flex items-center justify-between">
        <Link
          className="flex items-center gap-4"
          href={userId ? `/users/${userId}` : "#"}
        >
          <UserAvatar avatarPath={activeUser?.avatar_path || ""} size={8} />
          <p className="">{activeUser?.name}</p>
        </Link>
        <div className="flex items-center gap-3">
          {userId && displayFollowButton && (
            <UserFollowButton userId={userId} />
          )}
          {children}
        </div>
      </div>
    </>
  );
};
export default UserCard;
