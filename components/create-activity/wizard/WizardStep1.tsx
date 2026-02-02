"use client";

import React from "react";
import { WizardFormState } from "./types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ActivityCategories } from "@/lib/types";
import { categories } from "@/lib/data/categories";
import HeroImageUpload from "./HeroImageUpload";
import { FaPencilAlt, FaAlignLeft, FaTags } from "react-icons/fa";

interface WizardStep1Props {
  formState: WizardFormState;
  updateFormState: (updates: Partial<WizardFormState>) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  errors: Record<string, string>;
}

const WizardStep1: React.FC<WizardStep1Props> = ({
  formState,
  updateFormState,
  imagePreview,
  setImagePreview,
  errors,
}) => {
  const handleCategoryToggle = (categoryId: ActivityCategories) => {
    const currentCategories = formState.categories || [];
    const isSelected = currentCategories.includes(categoryId);

    if (isSelected) {
      updateFormState({
        categories: currentCategories.filter((c) => c !== categoryId),
      });
    } else {
      if (currentCategories.length < 3) {
        updateFormState({
          categories: [...currentCategories, categoryId],
        });
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Hero Image Upload */}
      <div>
        <HeroImageUpload
          value={formState.image}
          onChange={(file) => updateFormState({ image: file })}
          previewUrl={imagePreview}
          onPreviewChange={setImagePreview}
        />
        {errors.image && (
          <p className="mt-2 text-sm text-red-500">{errors.image}</p>
        )}
      </div>

      {/* Title and Description - side by side on desktop */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-title"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaPencilAlt className="text-primary" />
            Activity Title *
          </label>
          <Input
            id="wizard-title"
            name="title"
            value={formState.title}
            onChange={(e) => updateFormState({ title: e.target.value })}
            placeholder="Give your activity a catchy name"
            className="dark:border-gray-600"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="wizard-description"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <FaAlignLeft className="text-primary" />
            Description *
          </label>
          <Textarea
            id="wizard-description"
            name="description"
            value={formState.description}
            onChange={(e) => updateFormState({ description: e.target.value })}
            placeholder="Tell potential participants what to expect. Keep it fun and informative!"
            className="min-h-[100px] dark:border-gray-600"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <FaTags className="text-primary" />
          Category * (Select up to 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const selected = formState.categories?.includes(
              category.id as ActivityCategories,
            );

            return (
              <Button
                key={category.id}
                type="button"
                variant="ghost"
                className={`border text-sm transition-all dark:border-gray-600 ${
                  selected
                    ? "border-primary bg-primary text-white hover:bg-primary/90 hover:text-white"
                    : "hover:border-primary hover:bg-primary/5 hover:text-black dark:hover:bg-primary dark:hover:text-white"
                }`}
                onClick={() =>
                  handleCategoryToggle(category.id as ActivityCategories)
                }
              >
                {category.name}
              </Button>
            );
          })}
        </div>
        {errors.categories && (
          <p className="text-sm text-red-500">{errors.categories}</p>
        )}
      </div>
    </div>
  );
};

export default WizardStep1;
