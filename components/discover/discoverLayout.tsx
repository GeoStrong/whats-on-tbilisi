"use client";

import React, { Suspense, useCallback, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ActivityCard from "../activities/activityCard";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";
import DiscoverSearch from "./discoverSearch";
import DiscoverFilters from "./discoverFilters";
import { redirect } from "next/navigation";
import DiscoverLoading from "./discoverLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  useSearchActivities,
  useSearchUsers,
  useSearchComments,
  useSearchPosts,
  type DiscoverTab,
} from "@/lib/hooks/useDiscoverSearch";
import DiscoverActivitiesResults from "./discoverActivitiesResults";
import DiscoverUsersResults from "./discoverUsersResults";
import DiscoverPostsResults from "./discoverPostsResults";
import DiscoverCommentsResults from "./discoverCommentsResults";
import {
  Search,
  Users,
  FileText,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";

const DiscoverLayout: React.FC = () => {
  const { activities } = useActivitiesFilter();
  const { handleSearch, searchParams } = useAddSearchQuery();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || "",
  );
  const [activeTab, setActiveTab] = useState<DiscoverTab>(
    (searchParams.get("tab") as DiscoverTab) || "activities",
  );

  // Debounced search query (search triggers on user action)
  const searchQuery = searchParams.get("search") || "";

  // Search hooks - each tab's data is fetched independently
  const activitiesSearch = useSearchActivities(searchQuery);
  const usersSearch = useSearchUsers(searchQuery);
  const commentsSearch = useSearchComments(searchQuery);
  const postsSearch = useSearchPosts(searchQuery);

  // Result counts for badges
  const counts = useMemo(
    () => ({
      activities: activitiesSearch.data?.length ?? 0,
      users: usersSearch.data?.length ?? 0,
      posts: postsSearch.data?.length ?? 0,
      comments: commentsSearch.data?.length ?? 0,
    }),
    [
      activitiesSearch.data,
      usersSearch.data,
      postsSearch.data,
      commentsSearch.data,
    ],
  );

  const onDateSelect = (value: string) => {
    setSelectedDate(value);
    handleSearch("date", value);
  };

  const onTabChange = useCallback(
    (value: string) => {
      setActiveTab(value as DiscoverTab);
      handleSearch("tab", value);
    },
    [handleSearch],
  );

  const filterOptions = ["All", "Featured", "Ongoing", "Past", "Upcoming"];

  const isActiveFilter = (filter: string) => {
    const currentFilter = searchParams.get("filter");
    if (filter === "All") {
      return !currentFilter || currentFilter === "all";
    }
    return currentFilter === filter.toLowerCase();
  };

  const hasSearchQuery = searchQuery.trim().length > 0;

  const CountBadge = ({
    count,
    isActive,
  }: {
    count: number;
    isActive: boolean;
  }) =>
    hasSearchQuery && count > 0 ? (
      <span
        className={`ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-xs font-semibold ${isActive ? "text-white" : "text-primary"}`}
      >
        {count}
      </span>
    ) : null;

  return (
    <>
      {activities === null && !hasSearchQuery ? (
        <DiscoverLoading />
      ) : (
        <div className="p-4 md:p-8">
          <h1 className="mb-8 text-4xl font-bold md:text-5xl">Discover</h1>

          {/* Unified Search Bar */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
            <DiscoverSearch search={search} onSearch={setSearch} />
          </div>

          {/* Tabbed Search Sections */}
          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            <div className="flex w-full justify-center">
              <TabsList className="mb-6 flex flex-wrap gap-1 rounded-lg border bg-transparent shadow-md">
                <TabsTrigger
                  value="activities"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Activities</span>
                  <CountBadge
                    count={counts.activities}
                    isActive={activeTab === "activities"}
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Users</span>
                  <CountBadge
                    count={counts.users}
                    isActive={activeTab === "users"}
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Posts</span>
                  <CountBadge
                    count={counts.posts}
                    isActive={activeTab === "posts"}
                  />
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Comments</span>
                  <CountBadge
                    count={counts.comments}
                    isActive={activeTab === "comments"}
                  />
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Activities Tab */}
            <TabsContent value="activities">
              <div className="flex w-full flex-col gap-4 md:gap-8 lg:flex-row">
                <DiscoverFilters
                  setSearch={setSearch}
                  setSelectedDate={setSelectedDate}
                />

                <div className="flex-1">
                  {/* Activity-specific filters */}
                  <div className="mb-6 rounded-xl border bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex flex-wrap justify-center gap-2 md:flex-nowrap md:overflow-x-auto">
                        {filterOptions.map((filter) => (
                          <Button
                            key={filter}
                            variant="outline"
                            onClick={() =>
                              handleSearch("filter", filter.toLowerCase())
                            }
                            className={`whitespace-nowrap rounded-full border-2 px-4 py-2 dark:border-slate-700 dark:bg-slate-800 ${isActiveFilter(filter) ? "bg-primary text-white" : ""}`}
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>

                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateSelect(e.target.value)}
                        className="w-full dark:border-slate-700 dark:bg-slate-800 md:w-[20%]"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  {/* Show search results when searching, otherwise show filtered list */}
                  {hasSearchQuery ? (
                    <DiscoverActivitiesResults
                      activities={activitiesSearch.data}
                      isLoading={activitiesSearch.isLoading}
                      query={searchQuery}
                    />
                  ) : (
                    <>
                      {activities?.length === 0 && (
                        <p className="w-full text-center text-xl">
                          No activities found
                        </p>
                      )}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {activities?.map((activity) => (
                          <div
                            key={activity.id}
                            className="cursor-pointer"
                            onClick={() => {
                              redirect(`/activities/${activity.id}`);
                            }}
                          >
                            <ActivityCard activity={activity} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <DiscoverUsersResults
                users={usersSearch.data}
                isLoading={usersSearch.isLoading}
                query={searchQuery}
              />
            </TabsContent>

            {/* Posts Tab */}
            <TabsContent value="posts">
              <DiscoverPostsResults
                posts={postsSearch.data}
                isLoading={postsSearch.isLoading}
                query={searchQuery}
              />
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments">
              <DiscoverCommentsResults
                comments={commentsSearch.data}
                isLoading={commentsSearch.isLoading}
                query={searchQuery}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

const DiscoverLayoutWrapper: React.FC = () => {
  return (
    <Suspense fallback={<DiscoverLoading />}>
      <DiscoverLayout />
    </Suspense>
  );
};
export default DiscoverLayoutWrapper;
