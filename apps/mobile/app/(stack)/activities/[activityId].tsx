import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useActivity } from "@whatson/shared/hooks/useActivities";
import { ActivityCard, SectionHeader } from "@whatson/ui";

export default function ActivityDetailScreen() {
  const { activityId } = useLocalSearchParams<{ activityId: string }>();
  const { data, isLoading } = useActivity(activityId);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Loading...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">Activity not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <SectionHeader title="Activity Details" className="mb-4" />
      <ActivityCard
        activity={data}
        imageUrl={typeof data.image === "string" ? data.image : undefined}
      />
      <Text className="mt-4 text-base text-foreground">{data.description}</Text>
    </View>
  );
}
