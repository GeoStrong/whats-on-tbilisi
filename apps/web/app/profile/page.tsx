"use client";

import React from "react";
import ProfileActivities from "@/components/profile/profileActivities";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { redirect } from "next/navigation";

const ProfileActivitiesPage: React.FC = () => {
  const { isAuthenticated, user } = useGetUserProfile();

  if (!isAuthenticated) redirect("/");

  return (
    <div className="p-2">{user && <ProfileActivities userId={user.id} />}</div>
  );
};

export default ProfileActivitiesPage;
