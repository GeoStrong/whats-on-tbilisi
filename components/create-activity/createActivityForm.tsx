"use client";

import { Form, Field, ErrorMessage, FormikProps } from "formik";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ActivityCategories, NewActivityEntity } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import { useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
// import { useLocation } from "react-use";
import Image from "next/image";
import PlacesAutocomplete from "./PlacesAutocomplete";
import RecurringDatePicker from "./RecurringDatePicker";
import { useState } from "react";

interface CreateActivityProps {
  formik: FormikProps<NewActivityEntity>;
  imagePreview: string | null;
  handleImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  latLng: google.maps.LatLngLiteral | null;
  handleOpenMobileMap: () => void;
  displayOpenMapButton: boolean;
}

const CreateActivityForm: React.FC<CreateActivityProps> = ({
  formik,
  imagePreview,
  handleImagePreview,
  latLng,
  handleOpenMobileMap,
  displayOpenMapButton,
}) => {
  // const { pathname } = useLocation();

  // const isCreatePage = pathname === "/create-activity";

  const [isSameDay, setIsSameDay] = useState(true);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);

  useEffect(() => {
    if (latLng) {
      formik.setFieldValue("googleLocation", latLng);

      // Reverse geocode to get address when latLng is set from map click
      // Only reverse geocode if location field is empty or significantly different
      // This prevents overwriting when address is selected from autocomplete
      if (typeof window !== "undefined" && window.google?.maps) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const newAddress = results[0].formatted_address;
            const currentLocation = formik.values.location || "";

            // Only update if location is empty or if the new address is significantly different
            // This allows reverse geocoding on map click while preserving autocomplete selections
            if (
              !currentLocation ||
              !currentLocation.includes(newAddress.split(",")[0])
            ) {
              formik.setFieldValue("location", newAddress);
            }
          }
        });
      }
    }

    formik.setFieldValue("recurringDays", recurringDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latLng, recurringDays]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
      handleImagePreview(URL.createObjectURL(file));
    }
  };

  const handleToggleSameDay = () => {
    setIsSameDay(!isSameDay);
    if (isSameDay) {
      formik.setFieldValue("endDate", formik.values.date);
    } else {
      formik.setFieldValue("endDate", "");
    }
  };

  const handleRecurringToggle = () => {
    setIsRecurring(!isRecurring);
    if (!isRecurring) {
      setRecurringDays([]); // Clear recurring days if toggled off
    }
  };

  return (
    <Form className="h-full overflow-y-scroll pb-5">
      <div
        className={`mb-3 flex w-full flex-col gap-4 p-3`}
        // className={`mb-3 flex w-full flex-col gap-4 p-3 ${isCreatePage ? "md:max-h-[80%]" : "h-1/2"}`}
      >
        {/* Title */}
        <div>
          <label htmlFor="title">Title *</label>
          <Field
            className="dark:border-gray-600"
            as={Input}
            id="title"
            name="title"
            placeholder="Activity title"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description *</label>
          <Field
            className="dark:border-gray-600"
            as={Textarea}
            id="description"
            name="description"
            placeholder="Activity description"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date">Date *</label>
          <Field
            className="dark:border-gray-600"
            as={Input}
            id="date"
            name="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />
          <ErrorMessage
            name="date"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Same Day Toggle */}
        <div className="flex items-center gap-2">
          <label htmlFor="sameDayToggle" className="text-sm font-medium">
            Same Day
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
          <div>
            <label htmlFor="endDate">End Date</label>
            <Field
              className="dark:border-gray-600"
              as={Input}
              id="endDate"
              name="endDate"
              type="date"
              min={formik.values.date}
            />
            <ErrorMessage
              name="endDate"
              component="div"
              className="text-sm text-red-500"
            />
          </div>
        )}

        {/* Time */}
        <div>
          <label htmlFor="time">Time *</label>

          <Field
            as={Input}
            id="time"
            name="time"
            type="time"
            className="dark:border-gray-600"
          />

          <ErrorMessage
            name="time"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* End Time */}
        <div>
          <label htmlFor="endTime">End Time</label>

          <Field
            as={Input}
            id="endTime"
            name="endTime"
            type="time"
            className="dark:border-gray-600"
          />

          <ErrorMessage
            name="endTime"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location">Address *</label>
          <PlacesAutocomplete
            value={formik.values.location || ""}
            onChange={(value) => {
              formik.setFieldValue("location", value);
            }}
            onPlaceSelect={(place) => {
              // Update location field with the selected address
              formik.setFieldValue("location", place.address);
              // Update googleLocation with lat/lng
              formik.setFieldValue("googleLocation", {
                lat: place.lat,
                lng: place.lng,
              });
            }}
            placeholder="Start typing an address..."
            className="dark:border-gray-600"
          />
          <ErrorMessage
            name="location"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Google Location */}
        <div className="flex flex-col">
          <label htmlFor="googleLocation">Google Coordinates *</label>
          <div className="relative">
            <Input
              className="p-3 dark:border-gray-600"
              id="googleLocation"
              name="googleLocation"
              placeholder="Please select on the map"
              disabled={true}
              value={
                latLng
                  ? `lat: ${latLng?.lat}, lng: ${latLng?.lng}`
                  : "Please select on the map"
              }
            />
            {displayOpenMapButton && (
              <button
                type="button"
                className="absolute right-4 top-[0.6rem] rounded-lg border bg-primary px-2 py-1"
                onClick={handleOpenMobileMap}
              >
                <FaMapMarkedAlt className="text-white" />
              </button>
            )}
          </div>
          <ErrorMessage
            name="googleLocation"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Categories */}
        <div>
          <label htmlFor="categories">Select categories * (max 3)</label>

          <div className="mt-2 flex flex-wrap gap-3">
            {categories.map((category) => {
              const selected =
                formik.values.categories &&
                formik.values.categories.includes(
                  category.id as ActivityCategories,
                );

              return (
                <Button
                  key={category.id}
                  type="button"
                  className={`${
                    selected &&
                    "bg-primary text-white hover:bg-primary/90 hover:text-white"
                  } border text-sm dark:border-gray-600`}
                  variant="ghost"
                  onClick={() => {
                    if (selected) {
                      formik.setFieldValue(
                        "categories",
                        formik.values.categories &&
                          formik.values.categories.filter(
                            (c) => c !== category.id,
                          ),
                      );
                    } else {
                      // Add category (max 3)
                      if (
                        formik.values.categories &&
                        formik.values.categories.length < 3
                      ) {
                        formik.setFieldValue("categories", [
                          ...(formik.values.categories &&
                            formik.values.categories),
                          category.id,
                        ]);
                      }
                    }
                  }}
                >
                  {category.name}
                </Button>
              );
            })}
          </div>

          <ErrorMessage
            name="categories"
            component="div"
            className="text-sm text-red-500"
          />
        </div>

        {/* Link */}
        <div>
          <label htmlFor="link">Link</label>
          <Field
            className="dark:border-gray-600"
            as={Input}
            id="link"
            name="link"
            placeholder="Optional URL"
            type="url"
          />
        </div>

        {/* Target Audience */}
        <div>
          <label htmlFor="targetAudience">Target Audience</label>
          <Field
            className="dark:border-gray-600"
            as={Input}
            id="targetAudience"
            name="targetAudience"
            placeholder="e.g., Adults, Students"
          />
        </div>

        {/* Max Attendees */}
        <div>
          <label htmlFor="maxAttendees">Max Attendees</label>
          <Field
            className="dark:border-gray-600"
            as={Input}
            id="maxAttendees"
            name="maxAttendees"
            type="number"
            min={1}
          />
        </div>

        {/* Image */}
        <div>
          <label htmlFor="image">Image</label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            className="dark:border-gray-600"
          />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              width={100}
              height={100}
              className="mt-2 h-32 w-32 rounded-md object-cover"
              priority={false}
            />
          )}
        </div>

        {/* Recurring Activity */}
        <div>
          <label className="text-sm font-medium">Recurring Activity</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurringActivity"
              checked={isRecurring}
              onChange={handleRecurringToggle}
            />
            <label htmlFor="recurringActivity" className="text-sm">
              Is this activity recurring?
            </label>
          </div>
          {isRecurring && (
            <div className="mt-2">
              <RecurringDatePicker
                selectedDates={recurringDays}
                onChange={setRecurringDays}
                placeholder="Select recurring days"
              />
              {recurringDays.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected dates:
                  </p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {recurringDays.map((date, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-primary/10 px-2 py-1 text-xs dark:bg-primary/20"
                      >
                        {date}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={formik.isSubmitting}
        className="h-12 w-full"
      >
        {formik.isSubmitting ? "Submitting..." : "Create Activity"}
      </Button>
    </Form>
  );
};

export default CreateActivityForm;
