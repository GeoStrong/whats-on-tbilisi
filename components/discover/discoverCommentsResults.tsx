"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import type { EnrichedComment } from "@/lib/hooks/useDiscoverSearch";

interface DiscoverCommentsResultsProps {
  comments: EnrichedComment[] | undefined;
  isLoading: boolean;
  query: string;
}

const DiscoverCommentsResults: React.FC<DiscoverCommentsResultsProps> = ({
  comments,
  isLoading,
  query,
}) => {
  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <MessageSquare className="mb-3 h-10 w-10 opacity-40" />
        <p className="text-lg">Search for comments by content</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4 dark:border-slate-700">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">No comments found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  /**
   * Highlight occurrences of the search query inside comment text.
   */
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="rounded bg-yellow-200 px-0.5 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const date = comment.created_at
          ? new Date(comment.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "";

        return (
          <div
            key={comment.id}
            className="rounded-lg border bg-white p-4 transition-colors hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            {/* Header: user + date */}
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <Link
                href={`/users/${comment.user_id}`}
                className="font-medium hover:underline"
              >
                {comment.user_name || "Unknown User"}
              </Link>
              <span className="text-xs">{date}</span>
            </div>

            {/* Comment text */}
            <p className="mb-2 leading-relaxed">{highlightMatch(comment.text)}</p>

            {/* Link to parent activity */}
            <Link
              href={`/activities/${comment.activity_id}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {comment.activity_title || "View Activity"}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DiscoverCommentsResults;
