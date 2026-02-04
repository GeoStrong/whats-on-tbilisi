"use client";

import React from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { redirect } from "next/navigation";
import ProfileAccount from "@/components/profile/profileAccount";

const ProfileAccountPage: React.FC = () => {
  const { user, isAuthenticated } = useGetUserProfile();

  if (!isAuthenticated) redirect("/");

  return <div className="p-2">{user && <ProfileAccount user={user} />}</div>;
};

export default ProfileAccountPage;
