"use client";

import React from "react";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { MdApps } from "react-icons/md";

const AllActivitiesCategoryButton: React.FC = () => {
  const { handleSearch, searchParams } = useAddSearchQuery();
  // Button is active if no category param
  const activeCategory = searchParams.get("category");
  const isActive = !activeCategory;

  return (
    <div className="px-2 py-1">
      <button
        className={`relative flex items-center gap-3 rounded-full border px-4 py-1 shadow-md dark:border-gray-600 md:py-3 ${isActive ? "bg-primary text-white" : "bg-white text-primary"}`}
        onClick={() => {
          // Remove all category search params
          handleSearch("category", "");
        }}
        aria-label="Show all activities"
      >
        <MdApps className="text-xl" />
        <span className="text-sm font-semibold">All Activities</span>
      </button>
    </div>
  );
};

export default AllActivitiesCategoryButton;
