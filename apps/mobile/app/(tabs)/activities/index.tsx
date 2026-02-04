import { View, Text } from "react-native";
import { useActivities } from "@whatson/shared/hooks/useActivities";
import { useRouter } from "expo-router";
import { ActivityCard, ActivityList, SectionHeader } from "@whatson/ui";

export default function ActivitiesScreen() {
  const { data = [], isLoading } = useActivities({ limit: 20 });
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Loading activities...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <SectionHeader title="Activities" className="mb-4" />
      <ActivityList
        activities={data}
        isLoading={isLoading}
        emptyText="No activities found."
        renderCard={(activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            imageUrl={
              typeof activity.image === "string" ? activity.image : undefined
            }
            onPress={() => router.push(`/(stack)/activities/${activity.id}`)}
          />
        )}
      />
    </View>
  );
}
