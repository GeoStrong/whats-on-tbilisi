import { View, Text } from "react-native";

export default function CreateActivityScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-xl font-semibold text-foreground">Create Activity</Text>
      <Text className="mt-2 text-sm text-muted-foreground">
        Form UI to be migrated from web
      </Text>
    </View>
  );
}
