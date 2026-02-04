import ProfileLayout from "@/components/profile/profileLayout";
import React from "react";

const ProfileLayoutPage: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <div className="mt-4 min-h-dvh w-full rounded-xl dark:bg-gray-900">
      <div className="w-full px-2 py-8">
        <ProfileLayout>{children}</ProfileLayout>
      </div>
    </div>
  );
};

export default ProfileLayoutPage;
