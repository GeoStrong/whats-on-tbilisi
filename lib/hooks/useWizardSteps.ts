import { useTranslation } from "react-i18next";
import { WizardStep } from "@/components/create-activity/wizard/types";

/**
 * Custom hook that returns wizard steps with translated titles and descriptions
 * Cannot be directly replaced with WIZARD_STEPS constant because this uses react-i18next
 * which requires React hooks context to access translations
 */
export const useWizardSteps = (): WizardStep[] => {
  const { t } = useTranslation(["create-activity"]);

  return [
    {
      id: 1,
      title: t("create-activity:steps.1.title"),
      description: t("create-activity:steps.1.description"),
    },
    {
      id: 2,
      title: t("create-activity:steps.2.title"),
      description: t("create-activity:steps.2.description"),
    },
    {
      id: 3,
      title: t("create-activity:steps.3.title"),
      description: t("create-activity:steps.3.description"),
    },
  ];
};
