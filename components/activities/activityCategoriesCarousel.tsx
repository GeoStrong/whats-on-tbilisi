"use client";

import React, { Suspense } from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import ActivityCategory from "./activityCategory";
import { Category } from "@/lib/types";
import ActivityCategoriesCarouselLoading from "./activityCategoriesCarouselLoading";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <>
      <div className="sticky top-[3.4rem] z-30 border-b bg-white px-2 py-3 dark:border-gray-600 dark:bg-gray-900 md:px-20">
        <Carousel opts={{ dragFree: true }}>
          <CarouselContent className="cursor-grab">
            {categories.map((category) => (
              <CarouselItem className="basis-auto pl-2" key={category.id}>
                <ActivityCategory category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
};

const ActivityCategoriesCarousel: React.FC<CategoriesProps> = ({
  categories,
}) => {
  return (
    <Suspense fallback={<ActivityCategoriesCarouselLoading />}>
      <Categories categories={categories} />
    </Suspense>
  );
};

export default ActivityCategoriesCarousel;
