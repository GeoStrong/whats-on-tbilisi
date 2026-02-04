"use client";

import React from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useDispatch } from "react-redux";
import { useEffectOnce } from "react-use";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { NewActivityEntity, ActivityEntity } from "@/lib/types";
import { mapActions } from "@whatson/shared/store";
import { authActions } from "@/lib/store/authSlice";
import useGetUserProfile from "@/lib/hooks/useGetUserProfile";
import useWizardForm from "@/lib/hooks/useWizardForm";
import { handleUploadFile, isFile } from "@/lib/functions/helperFunctions";
import {
  postNewActivity,
  postNewActivityCategories,
} from "@/lib/functions/supabaseFunctions";
import { useInvalidateActivities } from "@/lib/hooks/useActivities";
import { useCreateFeedPost } from "@/lib/hooks/useFeedPosts";

import WizardStepIndicator from "./WizardStepIndicator";
import WizardStep1 from "./WizardStep1";
import WizardStep2 from "./WizardStep2";
import WizardStep3 from "./WizardStep3";
import WizardSkeleton from "./WizardSkeleton";
import { WIZARD_STEPS } from "./types";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

interface CreateActivityWizardProps {
  mapKey: string;
}

const CreateActivityWizard: React.FC<CreateActivityWizardProps> = ({
  mapKey,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useGetUserProfile();
  const { invalidateAll: invalidateAllActivities } = useInvalidateActivities();
  const createPostMutation = useCreateFeedPost(user!);

  const {
    formState,
    currentStep,
    completedSteps,
    errors,
    isSubmitting,
    imagePreview,
    setImagePreview,
    updateFormState,
    goToStep,
    goNext,
    goBack,
    validateAll,
    resetForm,
    setIsSubmitting,
  } = useWizardForm();

  // Reset map state on mount
  useEffectOnce(() => {
    dispatch(mapActions.setLatLng(null));
    // Floating is now controlled by the map dialog in WizardStep2
    dispatch(mapActions.setIsFloatingEnabled(false));
  });

  const handleSubmit = async () => {
    const isValid = await validateAll();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create an activity");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image if provided
      let imageUrl: string | null = null;
      if (formState.image && isFile(formState.image)) {
        imageUrl = await handleUploadFile("activities", formState.image, user);
      }

      // Create activity object
      const newActivity: NewActivityEntity = {
        user_id: user.id,
        title: formState.title,
        description: formState.description,
        date: formState.date,
        time: formState.time,
        endTime: formState.endTime || null,
        endDate: formState.endDate || null,
        recurringDays: formState.recurringDays || null,
        location: formState.location,
        link: formState.link || null,
        status: "active",
        targetAudience: formState.targetAudience || null,
        maxAttendees: formState.maxAttendees || null,
        image: imageUrl,
        googleLocation: formState.googleLocation,
        likes: 0,
        dislikes: 0,
      };

      // Post activity to database
      const activity = (await postNewActivity(newActivity)) as ActivityEntity[];

      // Post categories
      await postNewActivityCategories(activity[0].id, formState.categories);

      // Post to feed if enabled
      if (formState.postToFeed) {
        try {
          await createPostMutation.mutateAsync({
            activityId: activity[0].id,
            comment: formState.feedComment || null,
          });
        } catch (error: unknown) {
          // Ignore unique-constraint errors (already posted)
          const err = error as { code?: string };
          if (err?.code !== "23505") {
            console.error("Error creating feed post:", error);
          }
        }
      }

      // Invalidate caches
      invalidateAllActivities();

      // Show success message
      toast.success("Activity created successfully! 🎉");

      // Reset form and redirect
      resetForm();
      router.push("/");
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error(
        "There was an error creating your activity. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === WIZARD_STEPS.length) {
      await handleSubmit();
    } else {
      await goNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WizardStep1
            formState={formState}
            updateFormState={updateFormState}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            errors={errors}
          />
        );
      case 2:
        return (
          <WizardStep2
            formState={formState}
            updateFormState={updateFormState}
            errors={errors}
            mapKey={mapKey}
          />
        );
      case 3:
        return (
          <WizardStep3
            formState={formState}
            updateFormState={updateFormState}
            imagePreview={imagePreview}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <APIProvider apiKey={mapKey} libraries={["places"]}>
        <WizardSkeleton />
      </APIProvider>
    );
  }

  // Not authenticated state
  if (!isAuthenticated || !user) {
    return (
      <APIProvider apiKey={mapKey} libraries={["places"]}>
        <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-sm dark:bg-gray-800">
          <p className="text-center text-xl">
            Please sign up or log in to your account to create an activity
          </p>
          <Button
            className="border"
            variant="ghost"
            onClick={() => dispatch(authActions.setAuthDialogOpen(true))}
          >
            Sign in
          </Button>
        </div>
      </APIProvider>
    );
  }

  return (
    <APIProvider apiKey={mapKey} libraries={["places"]}>
      <div className="w-full rounded-xl border bg-white shadow-lg dark:bg-gray-800">
        {/* Step Indicator */}
        <div className="border-b px-4 dark:border-gray-700">
          <WizardStepIndicator
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
          />
        </div>

        {/* Step Content */}
        <div className="p-4 md:p-6">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between border-t p-4 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1 || isSubmitting}
            className="gap-2"
          >
            <FaArrowLeft className="h-3 w-3" />
            Back
          </Button>

          <div className="hidden items-center gap-2 text-sm text-gray-500 md:flex">
            Step {currentStep} of {WIZARD_STEPS.length}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 md:hidden">
            {currentStep}/{WIZARD_STEPS.length}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="gap-2"
          >
            {currentStep === WIZARD_STEPS.length ? (
              <>
                <FaCheck className="h-3 w-3" />
                {isSubmitting ? "Creating..." : "Create Activity"}
              </>
            ) : (
              <>
                Next
                <FaArrowRight className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </div>
    </APIProvider>
  );
};

export default CreateActivityWizard;
