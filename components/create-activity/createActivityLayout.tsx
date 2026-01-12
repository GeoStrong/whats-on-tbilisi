"use client";

import React from "react";
import { NewActivityEntity } from "@/lib/types";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { authActions } from "@/lib/store/authSlice";
import CreateActivityLoading from "./createActivityLoading";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import MapWrapper from "../map/map";
import useScreenSize from "@/lib/hooks/useScreenSize";
import CreateActivityMobileMap from "./createActivityMobileMap";
import CreateActivityAlert from "./createActivityAlert";
import useModifyActivity from "@/lib/hooks/useModifyActivity";
import { useEffectOnce } from "react-use";
import { mapActions } from "@/lib/store/mapSlice";
import { APIProvider } from "@vis.gl/react-google-maps";

const CreateActivityLayout: React.FC<{ mapKey: string }> = ({ mapKey }) => {
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useGetUserProfile();
  const { latLng } = useSelector((state: RootState) => state.map);
  const { isMobile } = useScreenSize();
  const { isFullscreen } = useSelector((state: RootState) => state.map);

  const initialValues: NewActivityEntity = {
    title: "",
    description: "",
    date: null,
    time: "",
    endTime: "",
    location: "",
    link: "",
    image: "",
    targetAudience: null,
    maxAttendees: null,
    host: "individual",
    categories: [],
    googleLocation: latLng,
    likes: 0,
    dislikes: 0,
  };

  const {
    formikComponent,
    openCreateActivityAlertRef,
    openMobileMapRef,
    createdActivityId,
    createdActivityTitle,
  } = useModifyActivity({
    user: user,
    latLng: latLng,
    initialValues: initialValues,
    isUpdatingActivity: false,
    enableMapFloating: true,
  });

  useEffectOnce(() => {
    dispatch(mapActions.setLatLng(null));
    dispatch(mapActions.setIsFloatingEnabled(true));
  });

  return (
    <APIProvider apiKey={mapKey} libraries={["places"]}>
      <div className="mt-3 flex w-full flex-col justify-between gap-2 rounded-md bg-white dark:bg-gray-800 lg:max-h-[500px] lg:flex-row">
        {isMobile ? (
          <div className="md:hidden">
            <CreateActivityMobileMap buttonRef={openMobileMapRef} />
          </div>
        ) : (
          <div className="hidden w-full rounded-2xl md:block">
            <MapWrapper
              API_KEY={mapKey}
              height={`h-96 lg:h-[500px] ${isFullscreen && "h-screen lg:h-screen"}`}
              displayActivities={false}
              skipAPIProvider={true}
            />
          </div>
        )}
        <div className="w-full p-3 md:pb-0">
          {isLoading ? (
            <CreateActivityLoading />
          ) : !isAuthenticated || !user ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-center text-xl">
                Please sign up or log in to your account to create an activity
              </p>
              <Button
                className="border"
                variant="ghost"
                onClick={() => {
                  dispatch(authActions.setAuthDialogOpen(true));
                }}
              >
                Sign in
              </Button>
            </div>
          ) : (
            <>{formikComponent}</>
          )}
        </div>
        <CreateActivityAlert
          buttonRef={openCreateActivityAlertRef}
          isActivityCreated={true}
          activityId={createdActivityId || undefined}
          activityTitle={createdActivityTitle || undefined}
        />
      </div>
    </APIProvider>
  );
};
export default CreateActivityLayout;
