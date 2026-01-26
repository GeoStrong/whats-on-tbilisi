import { ActivityCategories, ImageType } from "@/lib/types";

export interface WizardFormState {
  // Step 1: Hero image, title, description, categories
  image: ImageType;
  title: string;
  description: string;
  categories: ActivityCategories[];

  // Step 2: Location, date/time, additional details
  location: string;
  googleLocation: google.maps.LatLngLiteral | null;
  date: Date | string | null;
  time: string;
  endTime: string;
  targetAudience: string | null;
  link: string;
  maxAttendees: number | null;

  // Step 3: Feed post options
  postToFeed: boolean;
  feedComment: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: "Basic Info",
    description: "Hero image, title, description & categories",
  },
  {
    id: 2,
    title: "Details",
    description: "Location, date, time & additional info",
  },
  {
    id: 3,
    title: "Finalize",
    description: "Review and post to your feed",
  },
];

export const initialWizardState: WizardFormState = {
  image: null,
  title: "",
  description: "",
  categories: [],
  location: "",
  googleLocation: null,
  date: null,
  time: "",
  endTime: "",
  targetAudience: null,
  link: "",
  maxAttendees: null,
  postToFeed: true,
  feedComment: "",
};
