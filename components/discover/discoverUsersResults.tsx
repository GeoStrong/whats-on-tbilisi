"use client";

import React from "react";
import { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import UserCard from "../users/userCard";

interface DiscoverUsersResultsProps {
  users: UserProfile[] | undefined;
  isLoading: boolean;
  query: string;
}

const DiscoverUsersResults: React.FC<DiscoverUsersResultsProps> = ({
  users,
  isLoading,
  query,
}) => {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Users className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-lg">Search for users by name or email</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border p-4 dark:border-slate-700"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">No users found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-md dark:bg-slate-800">
      {users.map((user) => (
        <div key={user.id} className="border-b p-3 last:border-0">
          <UserCard userId={user.id} />
        </div>
      ))}
    </div>
  );
};

export default DiscoverUsersResults;
