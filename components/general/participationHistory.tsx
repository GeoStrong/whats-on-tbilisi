"use client";

import React, { useState } from "react";
import { MdAccessTime, MdLocationOn, MdPeople } from "react-icons/md";
import { HiOutlineTicket, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { BsCalendarEvent } from "react-icons/bs";
import { UserParticipationHistory } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../users/userAvatar";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import OptimizedImage from "../ui/optimizedImage";
import defaultActivityImg from "@/public/images/default-activity-img.png";
import useOptimizedImage from "@/lib/hooks/useOptimizedImage";

interface StatusConfig {
  label: string;
  description: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
}

const getStatusConfig = (
  status?: "active" | "inactive" | "pending",
): StatusConfig => {
  switch (status) {
    case "active":
      return {
        label: "Upcoming",
        description: "Will attend",
        bgColor: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800",
        dotColor: "bg-blue-500",
      };
    case "inactive":
      return {
        label: "Completed",
        description: "Attended",
        bgColor: "bg-slate-50 dark:bg-slate-800/50",
        textColor: "text-slate-600 dark:text-slate-400",
        borderColor: "border-slate-200 dark:border-slate-700",
        dotColor: "bg-slate-400",
      };
    case "pending":
    default:
      return {
        label: "Live Now",
        description: "Currently attending",
        bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
        textColor: "text-emerald-700 dark:text-emerald-300",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        dotColor: "bg-emerald-500",
      };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatTime = (timeString: string) => {
  if (!timeString) return "";
  try {
    // Handle time string that might be just "HH:MM" or full date
    const date = new Date(
      timeString.includes("T") ? timeString : `2000-01-01T${timeString}`,
    );
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timeString;
  }
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Single participation card component
const ParticipationCard: React.FC<{
  participation: UserParticipationHistory;
  showUser?: boolean;
}> = ({ participation, showUser = true }) => {
  const statusConfig = getStatusConfig(participation.activityStatus);

  const { imageUrl: activityImage } = useOptimizedImage(
    participation.activityImage,
    {
      quality: 50,
      width: 400,
      height: 300,
      fallback: defaultActivityImg.src,
    },
  );

  return (
    <Card
      className={`group overflow-hidden border transition-all duration-300 hover:shadow-xl ${statusConfig.borderColor}`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Activity Image */}
          <Link
            href={`/activities/${participation.activityId}`}
            className="relative aspect-video h-36 shrink-0 overflow-hidden sm:aspect-square sm:h-auto sm:w-40"
          >
            <OptimizedImage
              src={activityImage}
              width={160}
              height={160}
              quality={50}
              alt={participation.activityTitle || "Activity"}
              className="transition-transform duration-300 group-hover:scale-105"
              objectFit="cover"
              containerClassName="h-full w-full"
            />
            {/* Status overlay badge */}
            <div className="absolute left-2 top-2">
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} backdrop-blur-sm`}
              >
                <span
                  className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusConfig.dotColor}`}
                />
                {statusConfig.label}
              </div>
            </div>
          </Link>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between p-4">
            {/* Top: User info and time */}
            <div>
              {showUser && (
                <div className="mb-3 flex items-center gap-2">
                  <Link
                    href={`/users/${participation.userId}`}
                    className="shrink-0"
                  >
                    <UserAvatar
                      avatarPath={participation.userAvatar}
                      size={8}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/users/${participation.userId}`}
                      className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {participation.userName}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {statusConfig.description} ·{" "}
                      {formatRelativeTime(participation.participationDate)}
                    </p>
                  </div>
                </div>
              )}

              {/* Activity Title */}
              <Link
                href={`/activities/${participation.activityId}`}
                className="mb-2 block"
              >
                <h3 className="line-clamp-2 font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {participation.activityTitle}
                </h3>
              </Link>

              {/* Categories */}
              {participation.activityCategories &&
                participation.activityCategories.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {participation.activityCategories
                      .slice(0, 3)
                      .map((category, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {category}
                        </Badge>
                      ))}
                    {participation.activityCategories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{participation.activityCategories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
            </div>

            {/* Bottom: Activity details */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <BsCalendarEvent className="h-3.5 w-3.5" />
                <span>{formatDate(participation.activityDate)}</span>
              </div>
              {participation.activityTime && (
                <div className="flex items-center gap-1">
                  <MdAccessTime className="h-3.5 w-3.5" />
                  <span>
                    {formatTime(participation.activityTime.toString())}
                  </span>
                </div>
              )}
              {participation.activityLocation && (
                <div className="flex items-center gap-1">
                  <MdLocationOn className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">
                    {participation.activityLocation}
                  </span>
                </div>
              )}
              {participation.participantCount !== undefined &&
                participation.participantCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MdPeople className="h-3.5 w-3.5" />
                    <span>
                      {participation.participantCount}{" "}
                      {participation.participantCount === 1
                        ? "participant"
                        : "participants"}
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Empty state component
const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-16 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
    <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5">
      <HiOutlineTicket className="h-10 w-10 text-primary/60" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-foreground">
      No participation history
    </h3>
    <p className="max-w-sm text-center text-sm text-muted-foreground">
      {message ||
        "Start exploring activities and join events to build your participation history."}
    </p>
    <Button variant="outline" className="mt-6" asChild>
      <Link href="/activities">Discover Activities</Link>
    </Button>
  </div>
);

// Filter tabs for status
type FilterTab = "all" | "upcoming" | "live" | "completed";

const ParticipationHistory: React.FC<{
  participations: UserParticipationHistory[] | null;
  showUser?: boolean;
  emptyMessage?: string;
  showFilters?: boolean;
  initialLimit?: number;
}> = ({
  participations,
  showUser = true,
  emptyMessage,
  showFilters = true,
  initialLimit = 5,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
  const [showAll, setShowAll] = useState(false);

  if (!participations || participations.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  // Filter participations based on active tab
  const filteredParticipations = participations.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "upcoming") return p.activityStatus === "active";
    if (activeFilter === "live") return p.activityStatus === "pending";
    if (activeFilter === "completed") return p.activityStatus === "inactive";
    return true;
  });

  // Limit display if not showing all
  const displayedParticipations = showAll
    ? filteredParticipations
    : filteredParticipations.slice(0, initialLimit);

  const hasMore = filteredParticipations.length > initialLimit;

  // Count for each filter
  const counts = {
    all: participations.length,
    upcoming: participations.filter((p) => p.activityStatus === "active")
      .length,
    live: participations.filter((p) => p.activityStatus === "pending").length,
    completed: participations.filter((p) => p.activityStatus === "inactive")
      .length,
  };

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "upcoming", label: "Upcoming", count: counts.upcoming },
    { key: "live", label: "Live", count: counts.live },
    { key: "completed", label: "Past", count: counts.completed },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setShowAll(false);
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeFilter === tab.key
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {showFilters && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {counts.upcoming}
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
              Upcoming
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {counts.live}
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              Live Now
            </p>
          </div>
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-300">
              {counts.completed}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed
            </p>
          </div>
          <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-950/30">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {counts.all}
            </p>
            <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
              Total
            </p>
          </div>
        </div>
      )}

      {/* Participation List */}
      {filteredParticipations.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No {activeFilter !== "all" ? activeFilter : ""} participations found
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedParticipations.map((participation, index) => (
            <ParticipationCard
              key={`${participation.activityId}-${index}`}
              participation={participation}
              showUser={showUser}
            />
          ))}
        </div>
      )}

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                Show Less <HiChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show {filteredParticipations.length - initialLimit} More{" "}
                <HiChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParticipationHistory;
