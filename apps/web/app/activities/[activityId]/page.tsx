import React from "react";
import Activity from "@/components/activity/activity";
import { getActivities } from "@/lib/functions/supabaseFunctions";
import { ActivityEntity } from "@/lib/types";

interface ActivityPageProps {
  params: Promise<{ activityId: string }>;
}

const ActivityPage: React.FC<ActivityPageProps> = async ({ params }) => {
  const { activityId } = await params;

  const activities = (await getActivities()) as ActivityEntity[];

  const activeActivity = activities.find(
    (activity) => activity.id === activityId,
  );

  if (!activeActivity) {
    return (
      <div>
        <h3 className="text-center text-2xl font-bold">Activity not found</h3>
      </div>
    );
  }

  return (
    <>
      <Activity activity={activeActivity} activityId={activityId} />
    </>
  );
};
export default ActivityPage;
