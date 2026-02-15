"use client";

import React from "react";
import { FeedPostWithActivity } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import Link from "next/link";
import UserAvatar from "@/components/users/userAvatar";
import { useTranslation } from "react-i18next";

interface DiscoverPostsResultsProps {
  posts: FeedPostWithActivity[] | undefined;
  isLoading: boolean;
  query: string;
}

const DiscoverPostsResults: React.FC<DiscoverPostsResultsProps> = ({
  posts,
  isLoading,
  query,
}) => {
  const { t } = useTranslation(["discover"]);

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <FileText className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-lg">{t("discover:searchForPosts")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="space-y-3 rounded-lg border p-4 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">{t("discover:noPostsFound", { query })}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const date = new Date(post.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={post.id}
            className="rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {/* Author row */}
            <div className="mb-3 flex items-center gap-3">
              <Link href={`/users/${post.user_id}`}>
                <UserAvatar avatarPath={post.author?.avatar_path} size={10} />
              </Link>
              <div>
                <Link
                  href={`/users/${post.user_id}`}
                  className="font-semibold hover:underline"
                >
                  {post.author?.name || "Unknown"}
                </Link>
                <p className="text-xs text-muted-foreground">{date}</p>
              </div>
            </div>

            {/* Post comment */}
            {post.comment && (
              <p className="mb-3 text-sm leading-relaxed">{post.comment}</p>
            )}

            {/* Linked activity */}
            <Link
              href={`/activities/${post.activity_id}`}
              className="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
            >
              📌 {post.activity?.title || "View Activity"}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DiscoverPostsResults;
