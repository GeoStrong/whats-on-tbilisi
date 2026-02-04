import React from "react";
import ActivityHeader from "./activityHeader";
import { ActivityEntity } from "@/lib/types";
import ActivityBody from "./activityBody";
import ActivityFooter from "./activityFooter";
import { getCategoriesByActivityId } from "@/lib/functions/supabaseFunctions";

const Activity: React.FC<{
  activity: ActivityEntity;
  activityId: string;
}> = async ({ activity, activityId }) => {
  const categories = await getCategoriesByActivityId(activityId);

  return (
    <>
      <ActivityHeader categories={categories} activity={activity} />
      <ActivityBody categories={categories} activity={activity} />
      <ActivityFooter categories={categories} activityId={activityId} />
    </>
  );
};
export default Activity;
