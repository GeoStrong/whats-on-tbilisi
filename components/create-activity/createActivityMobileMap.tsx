"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import MapWrapper from "../map/map";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { env } from "@/lib/utils/env";

interface CreateActivityMobileMapProps {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

const CreateActivityMobileMap: React.FC<CreateActivityMobileMapProps> = ({
  buttonRef,
}) => {
  const { t } = useTranslation(["create-activity"]);
  const { isFullscreen } = useSelector((state: RootState) => state.map);

  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch("/api/use-secret");

  //     const { key } = await response.json();
  //     setMapKey(key);
  //   })();
  // }, []);

  const mapKey = env.googleMapsApiKey || "";

  return (
    <>
      <Dialog>
        <DialogTrigger ref={buttonRef} className="hidden">
          Open
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("create-activity:location.chooseLocation")}
            </DialogTitle>
            <DialogDescription>
              {t("create-activity:location.mapInstructions")}
            </DialogDescription>
          </DialogHeader>
          <MapWrapper
            API_KEY={mapKey}
            height={`h-96 ${isFullscreen && "h-screen"}`}
            displayActivities={false}
          />
          <DialogClose>
            <Button type="button">
              {t("create-activity:location.confirmLocation")}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default CreateActivityMobileMap;
