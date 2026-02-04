import { getActivities } from "../functions/supabaseFunctions";
import { ActivityEntity, Poi } from "../types";

const activities = (await getActivities()) as ActivityEntity[];

export const locations: Poi[] = activities
  .filter((activity) => activity.googleLocation !== undefined)
  .map((activity) => {
    return {
      key: `activity-${activity.id}`,
      location: activity.googleLocation!,
    };
  });
