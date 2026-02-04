import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-2xl font-semibold text-foreground">WhatsOnTbilisi</Text>
      <Text className="mt-2 text-sm text-muted-foreground">
        Mobile app scaffolded in the monorepo
      </Text>
      <Link href="/(tabs)/activities" asChild>
        <Pressable className="mt-6 rounded-lg bg-primary px-4 py-2">
          <Text className="text-primary-foreground">Browse Activities</Text>
        </Pressable>
      </Link>
    </View>
  );
}
