"use client";

import React from "react";
import { WIZARD_STEPS } from "./types";
import { FaCheck } from "react-icons/fa";

interface WizardStepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  completedSteps: number[];
}

const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <div className="w-full py-4">
      {/* Desktop view */}
      <div className="hidden md:flex md:items-center md:justify-center">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable =
            isCompleted || step.id <= Math.max(...completedSteps, currentStep);

          return (
            <React.Fragment key={step.id}>
              <div
                className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-primary bg-primary text-white"
                      : isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700"
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isCurrent || isCompleted
                        ? "text-primary"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="hidden text-xs text-gray-400 lg:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 lg:w-24 ${
                    completedSteps.includes(step.id)
                      ? "bg-primary"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile view - compact */}
      <div className="flex items-center justify-center gap-2 md:hidden">
        {WIZARD_STEPS.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                isCompleted
                  ? "border-primary bg-primary text-white"
                  : isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700"
              }`}
            >
              {isCompleted ? (
                <FaCheck className="h-3 w-3" />
              ) : (
                <span className="text-xs font-semibold">{step.id}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-sm font-medium text-primary md:hidden">
        {WIZARD_STEPS.find((s) => s.id === currentStep)?.title}
      </p>
    </div>
  );
};

export default WizardStepIndicator;
