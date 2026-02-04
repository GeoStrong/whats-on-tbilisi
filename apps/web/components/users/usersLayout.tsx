import React from "react";
import UsersHeader from "./usersHeader";
import { getUserById } from "@/lib/auth/auth";
import UsersBody from "./usersBody";
import Link from "next/link";

interface UsersLayoutProps {
  userId: string;
}

const UsersLayout: React.FC<UsersLayoutProps> = async ({ userId }) => {
  const userProfile = await getUserById(userId);

  if (!userProfile) {
    return (
      <div className="mt-10 h-full w-full text-center">
        <h3 className="mb-3 text-lg">
          The User could not be{" "}
          <span className="dark:linear-dark linear-light">found</span>
        </h3>
        <p className="">
          Please check the URL or go back to the{" "}
          <Link href="/" className="text-primary">
            homepage
          </Link>
        </p>
      </div>
    );
  }

  return (
    <>
      <UsersHeader user={userProfile} />
      <UsersBody user={userProfile} />
    </>
  );
};
export default UsersLayout;
