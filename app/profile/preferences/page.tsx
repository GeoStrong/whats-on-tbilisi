"use client";

import React from "react";
import ProfilePreferences from "@/components/profile/profilePreferences";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { redirect } from "next/navigation";

const ProfilePreferencesPage: React.FC = () => {
  const { isAuthenticated } = useGetUserProfile();

  if (!isAuthenticated) redirect("/");

  return (
    <div className="p-2">
      <ProfilePreferences />
    </div>
  );
};

export default ProfilePreferencesPage;
