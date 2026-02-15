import React from "react";
import { Button } from "../ui/button";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["discover"]);
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
        className="flex justify-between rounded-lg border bg-gray-200 px-4 py-2 text-sm dark:bg-gray-600"
      >
        <span>{t("discover:clearAllFilters")}</span> <span>×</span>
      </Button>
    </>
  );
};
export default DiscoverClearFilters;
