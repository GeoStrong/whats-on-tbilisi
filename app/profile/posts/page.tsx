"use client";

import React from "react";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { redirect } from "next/navigation";
import ProfilePosts from "@/components/profile/profilePosts";

const ProfilePostsPage: React.FC = () => {
  const { isAuthenticated, user } = useGetUserProfile();

  if (!isAuthenticated) redirect("/");

  return <div className="p-2">{user && <ProfilePosts userId={user.id} />}</div>;
};

export default ProfilePostsPage;
