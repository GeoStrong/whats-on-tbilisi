import React from "react";
import { Button } from "../ui/button";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";

interface DiscoverClearFiltersProps {
  onSearch: React.Dispatch<React.SetStateAction<string>>;
  onSelectDate: React.Dispatch<React.SetStateAction<string>>;
  onSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const DiscoverClearFilters: React.FC<DiscoverClearFiltersProps> = ({
  onSearch,
  onSelectDate,
  onSelectedCategories,
}) => {
  const { handleReplace } = useAddSearchQuery();

  const clearFilters = () => {
    onSearch("");
    onSelectDate("");
    onSelectedCategories([]);
    handleReplace(new URLSearchParams());
  };

  return (
    <>
      <Button
        onClick={clearFilters}
        variant="outline"
        className="flex justify-between rounded-lg border bg-gray-200 px-4 py-2 dark:bg-gray-600"
      >
        <span>Cancel all filters</span> <span>×</span>
      </Button>
    </>
  );
};
export default DiscoverClearFilters;
