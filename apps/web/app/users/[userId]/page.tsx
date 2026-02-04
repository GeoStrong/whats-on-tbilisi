import UsersLayout from "@/components/users/usersLayout";
import React from "react";

interface UsersPageProps {
  params: Promise<{ userId: string }>;
}
const UsersPage: React.FC<UsersPageProps> = async ({ params }) => {
  const { userId } = await params;

  return (
    <>
      <UsersLayout userId={userId} />
    </>
  );
};
export default UsersPage;
