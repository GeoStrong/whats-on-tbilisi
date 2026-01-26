"use client";

import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const { latLng, isFullscreen } = useSelector((state: RootState) => state.map);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  // Enable/disable floating pin based on dialog state
  useEffect(() => {
    dispatch(mapActions.setIsFloatingEnabled(isMapDialogOpen));
  }, [isMapDialogOpen, dispatch]);

  // Sync latLng from redux to form state when it changes
  React.useEffect(() => {
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

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Location Section Header */}
      <div className="flex flex-col items-center gap-2 md:flex-row">
        <FaMapMarkerAlt className="text-lg text-primary" />
        <h3 className="text-lg font-semibold">Where will it happen?</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="md:ml-auto"
          onClick={() => setIsMapDialogOpen(true)}
        >
          <FaSearchLocation className="mr-2" />
          Pin exact meeting point
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
            placeholder="Search address or landmark..."
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
        <p className="text-sm text-red-500">
          {errors.location || errors.googleLocation}
        </p>
      )}

      {/* Date & Time Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Date */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-date"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaCalendarAlt className="text-primary" />
            Date & Time *
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
          {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
        </div>

        {/* Start Time */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-time"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaClock className="text-primary" />
            Start Time *
          </label>
          <Input
            id="wizard-time"
            name="time"
            type="time"
            value={formState.time}
            onChange={(e) => updateFormState({ time: e.target.value })}
            className="dark:border-gray-600"
          />
          {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
        </div>

        {/* End Time */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-endTime"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaClock className="text-gray-400" />
            End Time
          </label>
          <Input
            id="wizard-endTime"
            name="endTime"
            type="time"
            value={formState.endTime}
            onChange={(e) => updateFormState({ endTime: e.target.value })}
            className="dark:border-gray-600"
          />
        </div>
      </div>

      {/* Additional Details Row */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Price Per Person - placeholder for future */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-maxAttendees"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaUsers className="text-primary" />
            Max Participants
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
            placeholder="No limit"
            className="dark:border-gray-600"
          />
        </div>

        {/* Target Audience */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-targetAudience"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaUsers className="text-gray-400" />
            Target Audience
          </label>
          <Input
            id="wizard-targetAudience"
            name="targetAudience"
            value={formState.targetAudience || ""}
            onChange={(e) =>
              updateFormState({ targetAudience: e.target.value })
            }
            placeholder="e.g., Adults, Students"
            className="dark:border-gray-600"
          />
        </div>

        {/* Link */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-link"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaLink className="text-gray-400" />
            External Link
          </label>
          <Input
            id="wizard-link"
            name="link"
            type="url"
            value={formState.link}
            onChange={(e) => updateFormState({ link: e.target.value })}
            placeholder="Optional URL"
            className="dark:border-gray-600"
          />
        </div>
      </div>

      {/* Map Dialog for Mobile/Full Selection */}
      <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              Choose the exact location
            </DialogTitle>
            <DialogDescription>
              Click on the map to set your meeting point
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
              Confirm Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep2;
