"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import useScreenSize from "@/lib/hooks/useScreenSize";
import ActivityCardsWrapper from "../activities/activityCardsWrapper";
import SmartActivityCategoriesCarousel from "../activities/smartActivityCategoriesCarousel";

interface CreateActivityProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  setSearchParams: (query: string, value: string) => void;
  open?: boolean;
}

const DisplayedActivities: React.FC<CreateActivityProps> = ({
  buttonRef,
  setSearchParams,
  open = false,
}) => {
  const { isMobile } = useScreenSize();

  return (
    <>
      <Drawer
        direction={isMobile ? "bottom" : "right"}
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSearchParams("display-activities", "");
        }}
      >
        <DrawerTrigger ref={buttonRef} className="hidden"></DrawerTrigger>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerPortal>
          <DrawerContent className="mx-[-1px] flex h-full w-full flex-col border-0 bg-white">
            <div className="flex h-dvh w-full flex-col overflow-y-auto">
              <DrawerHeader className="relative">
                <DrawerTitle className="mt-3 text-center text-xl font-bold">
                  All Activities
                </DrawerTitle>
                <DrawerDescription className="text-left text-base"></DrawerDescription>
              </DrawerHeader>
              <div className="flex flex-col gap-3 p-4">
                {isMobile && <SmartActivityCategoriesCarousel />}
                <ActivityCardsWrapper />
              </div>
              <DrawerFooter className="flex flex-col gap-2 md:flex-row-reverse">
                <DrawerClose className="h-12 bg-transparent p-2">
                  Cancel
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </>
  );
};
export default DisplayedActivities;
