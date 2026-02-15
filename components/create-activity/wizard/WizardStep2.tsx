"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { WizardFormState } from "./types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlacesAutocomplete from "../PlacesAutocomplete";
import MapWrapper from "@/components/map/map";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { mapActions } from "@/lib/store/mapSlice";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaLink,
  FaMapMarkedAlt,
  FaSearchLocation,
  FaCalendarTimes,
  FaCalendarPlus,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import RecurringDatePicker from "../RecurringDatePicker";
import DateObject from "react-date-object";

interface WizardStep2Props {
  formState: WizardFormState;
  updateFormState: (updates: Partial<WizardFormState>) => void;
  errors: Record<string, string>;
  mapKey: string;
}

const WizardStep2: React.FC<WizardStep2Props> = ({
  formState,
  updateFormState,
  errors,
  mapKey,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["create-activity"]);
  const { latLng, isFullscreen } = useSelector((state: RootState) => state.map);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isSameDay, setIsSameDay] = useState(true);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);

  // Enable/disable floating pin based on dialog state
  useEffect(() => {
    dispatch(mapActions.setIsFloatingEnabled(isMapDialogOpen));
  }, [isMapDialogOpen, dispatch]);

  // Sync latLng from redux to form state when it changes
  useEffect(() => {
    if (latLng) {
      updateFormState({ googleLocation: latLng });

      // Reverse geocode to get address
      if (typeof window !== "undefined" && window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address;
            const currentLocation = formState.location || "";

            if (
              !currentLocation ||
              !currentLocation.includes(newAddress.split(",")[0])
            ) {
              updateFormState({ location: newAddress });
            }
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLng]);

  const handleConfirmLocation = () => {
    setIsMapDialogOpen(false);
  };

  const handleToggleSameDay = () => {
    const newIsSameDay = !isSameDay;
    setIsSameDay(newIsSameDay);

    if (newIsSameDay) {
      updateFormState({ endDate: formState.date });
    } else {
      updateFormState({ endDate: "" });
    }
  };

  useEffect(() => {
    if (isSameDay && formState.date) {
      updateFormState({ endDate: formState.date });
    }
  }, [isSameDay, formState.date, updateFormState]); // Ensure endDate updates when date changes and isSameDay is true

  const handleRecurringToggle = () => {
    setIsRecurring(!isRecurring);
    if (!isRecurring) {
      setRecurringDays([]); // Clear recurring days if toggled off
    }
  };

  useEffect(() => {
    updateFormState({ recurringDays });
  }, [recurringDays, updateFormState]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Location Section Header */}
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <FaMapMarkerAlt className="text-lg text-primary" />
        <h3 className="text-lg font-semibold">
          {t("create-activity:step2.locationHeading")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="md:ml-auto"
          onClick={() => setIsMapDialogOpen(true)}
        >
          <FaSearchLocation className="mr-2" />
          {t("create-activity:step2.selectLocation")}
        </Button>
      </div>

      {/* Combined Location Input with Map */}
      <div className="rounded-lg border dark:border-gray-600">
        {/* Search Input */}
        <div className="relative p-3">
          <PlacesAutocomplete
            value={formState.location || ""}
            onChange={(value) => updateFormState({ location: value })}
            onPlaceSelect={(place) => {
              updateFormState({
                location: place.address,
                googleLocation: { lat: place.lat, lng: place.lng },
              });
            }}
            placeholder={t("create-activity:step2.addressPlaceholder")}
            className="dark:border-gray-600"
          />
        </div>

        {/* Inline Map Preview */}
        <div className="h-56 w-full overflow-hidden rounded-b-lg">
          <MapWrapper
            API_KEY={mapKey}
            height="h-56"
            displayActivities={false}
            skipAPIProvider={true}
            displayMapButtons={false}
            showStaticMarker={true}
          />
        </div>

        {/* Coordinates Display */}
        {formState.googleLocation && (
          <div className="flex items-center gap-2 border-t p-2 text-xs text-gray-500 dark:border-gray-600">
            <FaMapMarkedAlt className="text-primary" />
            <span>
              lat: {formState.googleLocation.lat.toFixed(6)}, lng:{" "}
              {formState.googleLocation.lng.toFixed(6)}
            </span>
          </div>
        )}
      </div>
      {(errors.location || errors.googleLocation) && (
        <p className="text-base text-red-500">
          {errors.location || errors.googleLocation}
        </p>
      )}

      {/* Date & Time Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Date */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-date"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaCalendarAlt className="text-primary" />
            {t("create-activity:step2.dateLabel")}
          </label>
          <Input
            id="wizard-date"
            name="date"
            type="date"
            value={formState.date ? String(formState.date) : ""}
            onChange={(e) => updateFormState({ date: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="dark:border-gray-600"
          />
          {errors.date && (
            <p className="text-base text-red-500">{errors.date}</p>
          )}
        </div>

        {/* Start Time */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-time"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaClock className="text-primary" />
            {t("create-activity:step2.startTimeLabel")}
          </label>
          <Input
            id="wizard-time"
            name="time"
            type="time"
            value={formState.time}
            onChange={(e) => updateFormState({ time: e.target.value })}
            className="dark:border-gray-600"
          />
          {errors.time && (
            <p className="text-base text-red-500">{errors.time}</p>
          )}
        </div>

        {/* End Time */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-endTime"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaClock className="text-primary" />
            {t("create-activity:step2.endTimeLabel")}
          </label>
          <Input
            id="wizard-endTime"
            name="endTime"
            type="time"
            value={formState.endTime}
            onChange={(e) => updateFormState({ endTime: e.target.value })}
            className="dark:border-gray-600"
          />
          {errors.endTime && (
            <p className="text-base text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          {/* Same Day Toggle */}
          <div className="flex items-center gap-2">
            <label htmlFor="sameDayToggle" className="text-base font-medium">
              {t("create-activity:step2.endsSameDay")}
            </label>
            <input
              id="sameDayToggle"
              type="checkbox"
              checked={isSameDay}
              onChange={handleToggleSameDay}
            />
          </div>

          {/* End Date */}
          {!isSameDay && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="wizard-endDate"
                className="flex items-center gap-2 text-base font-medium"
              >
                <FaCalendarTimes className="text-primary" />
                {t("create-activity:step2.endDateLabel")}
              </label>
              <Input
                id="wizard-endDate"
                name="endDate"
                type="date"
                value={String(formState.endDate) || ""}
                onChange={(e) => updateFormState({ endDate: e.target.value })}
                min={String(formState.date)}
                className="dark:border-gray-600"
              />
            </div>
          )}
        </div>

        {/* Recurring Activity */}
        {/* <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <label htmlFor="recurringActivity" className="text-base">
              {t("create-activity:step2.isRecurring")}
            </label>
            <input
              type="checkbox"
              id="recurringActivity"
              checked={isRecurring}
              onChange={handleRecurringToggle}
            />
          </div>
          {isRecurring && (
            <div className="recurring-days-picker flex w-full flex-col gap-2">
              <label
                htmlFor="recurringDays"
                className="flex items-center gap-2 text-base font-medium"
              >
                <FaCalendarPlus className="text-primary" />
                {t("create-activity:step2.selectRecurringDays")}
              </label>
              <RecurringDatePicker
                selectedDates={recurringDays}
                onChange={(dates) => {
                  setRecurringDays(dates);
                  updateFormState({ recurringDays: dates });
                }}
              />
            </div>
          )}
        </div> */}

        <div className="flex-1">
          {isRecurring && recurringDays.length > 0 && (
            <div className="selected-dates">
              <h4>{t("create-activity:step2.selectedRecurringDates")}</h4>
              <ul className="mt-2 flex h-28 flex-col gap-1 overflow-y-auto rounded-md border-2 p-2 px-4 dark:border-gray-600">
                {recurringDays.map((date, index) => (
                  <li key={index} className="date-item flex">
                    <span className="inline-block w-32">{date}</span>
                    <button
                      type="button"
                      className="text-sm text-red-500 underline"
                      onClick={() => {
                        const updatedDates = recurringDays.filter(
                          (_, i) => i !== index,
                        );
                        setRecurringDays(updatedDates);
                        updateFormState({ recurringDays: updatedDates });
                      }}
                    >
                      {t("create-activity:step2.removeRecurringDate")}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Additional Details Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Price Per Person - placeholder for future */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-maxAttendees"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaUsers className="text-primary" />
            {t("create-activity:step2.maxParticipants")}
          </label>
          <Input
            id="wizard-maxAttendees"
            name="maxAttendees"
            type="number"
            min={1}
            value={formState.maxAttendees || ""}
            onChange={(e) =>
              updateFormState({
                maxAttendees: e.target.value
                  ? parseInt(e.target.value, 10)
                  : null,
              })
            }
            placeholder={t("create-activity:form.maxAttendeesPlaceholder")}
            className="dark:border-gray-600"
          />
        </div>

        {/* Target Audience */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-targetAudience"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaUsers className="text-gray-400" />
            {t("create-activity:step2.targetAudioLabel")}
          </label>
          <Input
            id="wizard-targetAudience"
            name="targetAudience"
            value={formState.targetAudience || ""}
            onChange={(e) =>
              updateFormState({ targetAudience: e.target.value })
            }
            placeholder={t("create-activity:step2.targetAudiencePlaceholder")}
            className="dark:border-gray-600"
          />
        </div>

        {/* Link */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-link"
            className="flex items-center gap-2 text-base font-medium"
          >
            <FaLink className="text-gray-400" />
            {t("create-activity:step2.externalLink")}
          </label>
          <Input
            id="wizard-link"
            name="link"
            type="url"
            value={formState.link}
            onChange={(e) => updateFormState({ link: e.target.value })}
            placeholder={t("create-activity:step2.externalLinkPlaceholder")}
            className="dark:border-gray-600"
          />
        </div>
      </div>

      {/* Map Dialog for Mobile/Full Selection */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t("create-activity:step2.chooseLocation")}
            </DialogTitle>
            <DialogDescription>
              {t("create-activity:step2.mapInstructions")}
            </DialogDescription>
          </DialogHeader>
          <div className="h-[400px] w-full overflow-hidden rounded-lg">
            <MapWrapper
              API_KEY={mapKey}
              height={`h-[400px] ${isFullscreen && "h-screen"}`}
              displayActivities={false}
              skipAPIProvider={true}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={handleConfirmLocation}>
              {t("create-activity:step2.confirmLocation")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep2;
