import { GiSettingsKnobs } from "react-icons/gi";
import React, { useState } from "react";
import DiscoverClearFilters from "./discoverClearFilters";
import DiscoverCategories from "./discoverCategories";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DiscoverFiltersProps {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}

const DiscoverFilters: React.FC<DiscoverFiltersProps> = ({
  setSearch,
  setSelectedDate,
}) => {
  const { searchParams } = useAddSearchQuery();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("categories")
      ? searchParams.get("categories")!.split(",")
      : [],
  );

  return (
    <>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger className="flex w-full justify-center">
            <div className="flex items-center justify-center gap-3 rounded-md border bg-white p-3 shadow-md dark:bg-gray-900">
              <GiSettingsKnobs />
              Open Filters
            </div>
          </SheetTrigger>
          <SheetContent className="w-full text-black dark:bg-gray-800 dark:text-white">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <Accordion type="single" collapsible>
                <AccordionItem value="categories">
                  <AccordionTrigger className="text-lg">
                    Select Categories
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-xl bg-white p-4 shadow-md dark:bg-slate-800 md:block md:w-64">
                      <DiscoverCategories
                        selectedCategories={selectedCategories}
                        onSelectedCategories={setSelectedCategories}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <SheetFooter className="flex w-full flex-row items-center justify-end gap-3">
              <SheetClose className="rounded-md border px-4 py-2 dark:bg-gray-900">
                Close
              </SheetClose>
              <DiscoverClearFilters
                onSearch={setSearch}
                onSelectDate={setSelectedDate}
                onSelectedCategories={setSelectedCategories}
              />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden h-fit w-full rounded-xl bg-white p-4 shadow-md dark:bg-slate-800 md:w-64 lg:block">
        <div className="mb-4">
          <DiscoverClearFilters
            onSearch={setSearch}
            onSelectDate={setSelectedDate}
            onSelectedCategories={setSelectedCategories}
          />
        </div>
        <DiscoverCategories
          selectedCategories={selectedCategories}
          onSelectedCategories={setSelectedCategories}
        />
      </div>
    </>
  );
};
export default DiscoverFilters;
