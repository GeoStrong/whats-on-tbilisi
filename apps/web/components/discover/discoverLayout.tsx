"use client";

import React, { Suspense, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ActivityCard from "../activities/activityCard";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import useActivitiesFilter from "@/lib/hooks/useActvitiesFilter";
import DiscoverSearch from "./discoverSearch";
import DiscoverFilters from "./discoverFilters";
import { redirect } from "next/navigation";
import DiscoverLoading from "./discoverLoading";

const DiscoverLayout: React.FC = () => {
  const { activities } = useActivitiesFilter();
  const { handleSearch, searchParams } = useAddSearchQuery();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") || "",
  );

  const onDateSelect = (value: string) => {
    setSelectedDate(value);
    handleSearch("date", value);
  };

  const filterOptions = ["All", "Featured", "Ongoing", "Past", "Upcoming"];

  const isActiveFilter = (filter: string) => {
    const currentFilter = searchParams.get("filter");
    // "All" is active when no filter is set or filter is explicitly "all"
    if (filter === "All") {
      return !currentFilter || currentFilter === "all";
    }
    return currentFilter === filter.toLowerCase();
  };

  return (
    <>
      {activities === null ? (
        <DiscoverLoading />
      ) : (
        <div className="p-4 md:p-8">
          <h1 className="mb-8 text-4xl font-bold md:text-5xl">
            Discover Activities
          </h1>

          <div className="flex w-full flex-col gap-4 md:gap-8 lg:flex-row">
            <DiscoverFilters
              setSearch={setSearch}
              setSelectedDate={setSelectedDate}
            />

            <div className="flex-1">
              <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-6 md:block">
                  <DiscoverSearch search={search} onSearch={setSearch} />
                </div>

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

              {activities?.length === 0 && (
                <p className="w-full text-center text-xl">
                  No activities found
                </p>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activities?.map((activity) => (
                  <div
                    key={activity.id}
                    className=""
                    onClick={() => {
                      redirect(`/activities/${activity.id}`);
                    }}
                  >
                    <ActivityCard activity={activity} />
                  </div>
                ))}
              </div>
            </div>
          </div>
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
