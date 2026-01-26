"use client";

import React, { useMemo } from "react";
import { WizardFormState } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { categories } from "@/lib/data/categories";
import { ActivityCategories } from "@/lib/types";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUsers,
  FaCheck,
  FaRss,
} from "react-icons/fa";

interface WizardStep3Props {
  formState: WizardFormState;
  updateFormState: (updates: Partial<WizardFormState>) => void;
  imagePreview: string | null;
  isSubmitting: boolean;
}

const WizardStep3: React.FC<WizardStep3Props> = ({
  formState,
  updateFormState,
  imagePreview,
  isSubmitting,
}) => {
  const selectedCategories = useMemo(() => {
    return categories.filter((cat) =>
      formState.categories?.includes(cat.id as ActivityCategories),
    );
  }, [formState.categories]);

  const formattedDate = useMemo(() => {
    if (!formState.date) return "Not set";
    return new Date(formState.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [formState.date]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Activity Preview Card */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800">
        {/* Hero Image Preview */}
        {imagePreview && (
          <div className="relative h-[180px] w-full">
            <Image
              src={imagePreview}
              alt="Activity preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white">
                {formState.title || "Untitled Activity"}
              </h2>
            </div>
          </div>
        )}

        {!imagePreview && (
          <div className="flex h-[100px] items-center justify-center bg-gray-100 dark:bg-gray-700">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
                {formState.title || "Untitled Activity"}
              </h2>
              <p className="text-sm text-gray-500">No hero image</p>
            </div>
          </div>
        )}

        {/* Activity Details */}
        <div className="p-4">
          {/* Categories */}
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedCategories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
            {formState.description || "No description provided"}
          </p>

          {/* Details Grid */}
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaCalendarAlt className="text-primary" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FaClock className="text-primary" />
              <span>
                {formState.time || "Time not set"}
                {formState.endTime && ` - ${formState.endTime}`}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 md:col-span-2">
              <FaMapMarkerAlt className="text-primary" />
              <span className="line-clamp-1">
                {formState.location || "Location not set"}
              </span>
            </div>
            {formState.maxAttendees && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FaUsers className="text-primary" />
                <span>Max {formState.maxAttendees} participants</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Checklist */}
      <div className="rounded-lg border bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
          <FaCheck /> Ready to publish
        </h3>
        <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
          <li className="flex items-center gap-2">
            <FaCheck className="h-3 w-3" />
            Title and description added
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="h-3 w-3" />
            {selectedCategories.length} categor
            {selectedCategories.length === 1 ? "y" : "ies"} selected
          </li>
          <li className="flex items-center gap-2">
            <FaCheck className="h-3 w-3" />
            Date, time and location set
          </li>
          {imagePreview && (
            <li className="flex items-center gap-2">
              <FaCheck className="h-3 w-3" />
              Hero image uploaded
            </li>
          )}
        </ul>
      </div>

      {/* Post to Feed Section */}
      <div className="rounded-lg border p-4 dark:border-gray-600">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaRss className="text-primary" />
            <span className="font-medium">Post to your Feed</span>
          </div>
          <Switch
            checked={formState.postToFeed}
            onCheckedChange={(checked) =>
              updateFormState({ postToFeed: checked })
            }
          />
        </div>

        {formState.postToFeed && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Share this activity with your followers! Add an optional comment:
            </p>
            <Textarea
              value={formState.feedComment}
              onChange={(e) => updateFormState({ feedComment: e.target.value })}
              placeholder="Excited to host this event! Hope to see you there..."
              className="min-h-[80px] dark:border-gray-600"
            />
          </div>
        )}
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-primary">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Creating your activity...</span>
        </div>
      )}
    </div>
  );
};

export default WizardStep3;
