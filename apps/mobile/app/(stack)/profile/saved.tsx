import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../components/auth/AuthProvider";
import { fetchSavedActivities } from "@whatson/shared/data/profile";
import type { ActivityEntity } from "@whatson/shared/types";

export default function SavedActivitiesScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSavedActivities(user.id);
        setActivities(data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-sm text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-xl font-semibold text-foreground">
          Sign in to view saved activities
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          Please sign in to continue
        </Text>
        <TouchableOpacity
          className="mt-6 rounded-lg bg-primary px-4 py-2"
          onPress={() => router.push("/(stack)/auth/login")}
        >
          <Text className="text-primary-foreground">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Text className="text-2xl font-semibold text-foreground">
        Saved Activities
      </Text>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#7c4dff" />
        </View>
      ) : activities.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-muted-foreground">
            You haven&apos;t saved any activities yet.
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-4"
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-3 rounded-lg border border-border bg-card p-4"
              onPress={() => router.push(`/(stack)/activities/${item.id}`)}
            >
              <Text className="text-base font-semibold text-foreground">
                {item.title}
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                {item.location}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
