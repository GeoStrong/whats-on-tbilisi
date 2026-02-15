import Form from "next/form";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { useTranslation } from "react-i18next";

interface DiscoverSearchProps {
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

const DiscoverSearch: React.FC<DiscoverSearchProps> = ({
  search,
  onSearch,
}) => {
  const { handleSearch } = useAddSearchQuery();
  const { t } = useTranslation(["discover"]);

  return (
    <>
      <Form
        action=""
        className="flex flex-col gap-2 md:flex-row md:items-center"
        onClick={(e) => {
          e.preventDefault();
          handleSearch("search", search);
        }}
      >
        <Input
          placeholder={t("discover:searchPlaceholder")}
          className="h-16 placeholder:text-gray-400 dark:bg-gray-800 md:h-12"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button type="submit" className="h-12 w-full md:w-auto">
          {t("discover:searchButton")}
        </Button>
      </Form>
    </>
  );
};
export default DiscoverSearch;
