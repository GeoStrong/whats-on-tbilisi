import React from "react";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { categories } from "@/lib/data/categories";

interface DiscoverCategoriesProps {
  selectedCategories: string[];
  onSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const DiscoverCategories: React.FC<DiscoverCategoriesProps> = ({
  selectedCategories,
  onSelectedCategories,
}) => {
  const { handleSearch } = useAddSearchQuery();

  const toggleCategory = (cat: string) => {
    let updated = [...selectedCategories];

    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
    } else {
      updated.push(cat);
    }

    onSelectedCategories(updated);
    handleSearch("categories", updated.length ? updated.join(",") : "");
  };

  return (
    <>
      <h2 className="mb-4 font-semibold">Categories</h2>

      <div className="flex h-44 flex-col gap-3 overflow-y-auto pr-2">
        {categories.map((category) => {
          return (
            <Label
              key={category.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <Input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="h-4 w-4 checked:bg-primary"
              />
              {category.name}
            </Label>
          );
        })}
      </div>
    </>
  );
};
export default DiscoverCategories;
