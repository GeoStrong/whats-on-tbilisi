"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ActivityCard from "./activityCard";
import { ActivityEntity } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PastActivityCarouselProps {
  activities: ActivityEntity[];
  onSearch?: (query: string, value: string) => void;
}

const PastActivityCarousel: React.FC<PastActivityCarouselProps> = ({
  activities,
  onSearch,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!isClient || activities.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {activities.map((activity) => (
            <CarouselItem
              key={activity.id}
              className="basis-2/3 pl-2 sm:basis-1/2 md:pl-3 lg:basis-1/3 xl:basis-1/4"
            >
              <div className="h-full">
                <ActivityCard
                  activity={activity}
                  variant="past"
                  setSearchParams={onSearch}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        {activities.length > 1 && (
          <>
            <CarouselPrevious className="left-0 md:left-2" />
            <CarouselNext className="right-0 md:right-2" />
          </>
        )}
      </Carousel>

      {/* Carousel Indicators */}
      {activities.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          {/* Dot Indicators */}
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(activities.length / 4) }).map(
              (_, i) => (
                <button
                  key={i}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    i === Math.floor(current / 4)
                      ? "w-6 bg-primary"
                      : "bg-muted-foreground/40 hover:bg-muted-foreground/60",
                  )}
                  onClick={() => api?.scrollTo(i * 4)}
                  aria-label={`Go to carousel page ${i + 1}`}
                />
              ),
            )}
          </div>

          {/* Progress Counter */}
          <span className="text-xs text-muted-foreground">
            {current + 1} – {Math.min(current + 4, activities.length)} of{" "}
            {activities.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default PastActivityCarousel;
