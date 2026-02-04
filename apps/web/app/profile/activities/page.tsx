"use client";

import React from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { redirect } from "next/navigation";
import ProfileActivities from "@/components/profile/profileActivities";

const ProfileActivitiesPage: React.FC = () => {
  const { user, isAuthenticated } = useGetUserProfile();

  if (!isAuthenticated) redirect("/");

  return <>{user && <ProfileActivities userId={user.id} />}</>;
};

export default ProfileActivitiesPage;
