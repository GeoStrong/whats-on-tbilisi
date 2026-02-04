"use client";

import React, { Suspense, useRef } from "react";
import { Button } from "../ui/button";
import useAddSearchQuery from "@/lib/hooks/useAddSearchQuery";
import DisplayedActivities from "./displayedActivities";
import Spinner from "../general/spinner";

const DisplayActivitiesBtn: React.FC = () => {
  const displayActivitiesBtnRef = useRef<HTMLButtonElement>(null!);
  const { searchParams, handleSearch } = useAddSearchQuery();
  const displayIsActive = searchParams.get("display-activities");

  return (
    <>
      {displayIsActive && (
        <DisplayedActivities
          buttonRef={displayActivitiesBtnRef}
          setSearchParams={handleSearch}
          open={Boolean(displayIsActive)}
        />
      )}
      <Button
        onClick={() => {
          handleSearch("display-activities", "true");
        }}
        className="rounded-full px-8 py-6 text-base font-bold text-white md:p-8"
      >
        Display all Activities
      </Button>
    </>
  );
};

const DisplayActivitiesBtnWrapper: React.FC = () => (
  <Suspense fallback={<Spinner />}>
    <DisplayActivitiesBtn />
  </Suspense>
);

export default DisplayActivitiesBtnWrapper;
