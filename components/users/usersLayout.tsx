import React from "react";
import UsersHeader from "./usersHeader";
import { getUserById } from "@/lib/auth/auth";
import UsersBody from "./usersBody";
import Link from "next/link";
import UserNotFoundClient from "./userNotFoundClient";

interface UsersLayoutProps {
  userId: string;
}

const UsersLayout: React.FC<UsersLayoutProps> = async ({ userId }) => {
  const userProfile = await getUserById(userId);

  if (!userProfile) {
    return <UserNotFoundClient />;
  }

  return (
    <>
      <UsersHeader user={userProfile} />
      <UsersBody user={userProfile} />
    </>
  );
};
export default UsersLayout;
