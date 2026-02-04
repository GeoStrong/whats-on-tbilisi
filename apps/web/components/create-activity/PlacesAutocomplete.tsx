"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { mapActions } from "@whatson/shared/store";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address",
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(value);
  const dispatch = useDispatch();

  // Use the places library from the APIProvider
  const placesLib = useMapsLibrary("places");

  // Sync external value with internal state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Use refs for callbacks to avoid re-initialization
  const onChangeRef = useRef(onChange);
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => {
    onChangeRef.current = onChange;
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onChange, onPlaceSelect]);

  useEffect(() => {
    if (!placesLib || !inputRef.current || autocompleteRef.current) return;

    // Initialize autocomplete
    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "ge" },
      fields: ["formatted_address", "geometry", "name"],
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || "";

        // Update Redux state
        dispatch(
          mapActions.setLatLng({
            lat,
            lng,
          }),
        );

        // Update internal state
        setInputValue(address);

        // Call callbacks
        onChangeRef.current(address);
        onPlaceSelectRef.current({
          address,
          lat,
          lng,
        });
      }
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [placesLib, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default PlacesAutocomplete;
