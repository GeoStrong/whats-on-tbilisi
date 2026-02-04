import { useState, useCallback } from "react";
import {
  WizardFormState,
  initialWizardState,
  WIZARD_STEPS,
} from "@/components/create-activity/wizard/types";
import * as Yup from "yup";

// Validation schemas for each step
const step1Schema = Yup.object({
  image: Yup.mixed().required("Hero image is required"),
  title: Yup.string()
    .required("Title is required")
    .max(50, "Title is too long"),
  description: Yup.string()
    .required("Description is required")
    .max(300, "Description is too long"),
  categories: Yup.array()
    .min(1, "At least one category is required")
    .max(3, "Maximum 3 categories allowed"),
});

const step2Schema = Yup.object({
  location: Yup.string().required("Location is required"),
  googleLocation: Yup.object().required("Please select a location on the map"),
  date: Yup.date()
    .transform((value, originalValue) => {
      if (!originalValue) return value;
      return new Date(originalValue);
    })
    .typeError("Invalid date")
    .required("Date is required")
    .min(new Date().setHours(0, 0, 0, 0), "Date cannot be in the past"),
  time: Yup.string().required("Time is required"),
  endTime: Yup.string().required("End time is required"),
});

// Full schema for final submission
const fullSchema = Yup.object({
  image: Yup.mixed().required("Hero image is required"),
  title: Yup.string()
    .required("Title is required")
    .max(50, "Title is too long"),
  description: Yup.string()
    .required("Description is required")
    .max(300, "Description is too long"),
  categories: Yup.array()
    .min(1, "At least one category is required")
    .max(3, "Maximum 3 categories allowed"),
  location: Yup.string().required("Location is required"),
  googleLocation: Yup.object().required("Please select a location on the map"),
  date: Yup.date()
    .transform((value, originalValue) => {
      if (!originalValue) return value;
      return new Date(originalValue);
    })
    .typeError("Invalid date")
    .required("Date is required")
    .min(new Date().setHours(0, 0, 0, 0), "Date cannot be in the past"),
  time: Yup.string().required("Time is required"),
  endTime: Yup.string().required("End time is required"),
});

const getSchemaForStep = (step: number) => {
  switch (step) {
    case 1:
      return step1Schema;
    case 2:
      return step2Schema;
    default:
      return Yup.object({});
  }
};

interface UseWizardFormReturn {
  formState: WizardFormState;
  currentStep: number;
  completedSteps: number[];
  errors: Record<string, string>;
  isSubmitting: boolean;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  updateFormState: (updates: Partial<WizardFormState>) => void;
  goToStep: (step: number) => void;
  goNext: () => Promise<boolean>;
  goBack: () => void;
  validateCurrentStep: () => Promise<boolean>;
  validateAll: () => Promise<boolean>;
  resetForm: () => void;
  setIsSubmitting: (value: boolean) => void;
}

const useWizardForm = (): UseWizardFormReturn => {
  const [formState, setFormState] =
    useState<WizardFormState>(initialWizardState);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const updateFormState = useCallback((updates: Partial<WizardFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  }, []);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const schema = getSchemaForStep(currentStep);
    try {
      await schema.validate(formState, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [currentStep, formState]);

  const validateAll = useCallback(async (): Promise<boolean> => {
    try {
      await fullSchema.validate(formState, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formState]);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  const goNext = useCallback(async (): Promise<boolean> => {
    const isValid = await validateCurrentStep();
    if (!isValid) return false;

    // Mark current step as completed
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep];
      }
      return prev;
    });

    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
    return true;
  }, [currentStep, validateCurrentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const resetForm = useCallback(() => {
    setFormState(initialWizardState);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrors({});
    setIsSubmitting(false);
    setImagePreview(null);
  }, []);

  return {
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
    validateCurrentStep,
    validateAll,
    resetForm,
    setIsSubmitting,
  };
};

export default useWizardForm;
