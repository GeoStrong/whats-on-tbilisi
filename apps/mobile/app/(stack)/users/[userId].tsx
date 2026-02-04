import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@whatson/shared/auth";

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#7c4dff" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-lg font-semibold text-gray-900 mt-4">
          User not found
        </Text>
        <TouchableOpacity
          className="mt-6 px-6 py-3 bg-purple-600 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: user.name || "User Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView className="flex-1 bg-gray-50">
        {/* Header Section */}
        <View className="bg-white px-6 py-8 items-center border-b border-gray-200">
          {user.avatar_path ? (
            <Image
              source={{ uri: user.avatar_path }}
              className="w-28 h-28 rounded-full"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-purple-100 items-center justify-center">
              <Text className="text-purple-600 text-4xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <Text className="text-2xl font-bold text-gray-900 mt-4">
            {user.name}
          </Text>
          {user.additionalInfo && (
            <Text className="text-gray-600 text-center mt-2 px-4">
              {user.additionalInfo}
            </Text>
          )}
        </View>

        {/* User Activities Section - Placeholder */}
        <View className="mt-6 bg-white px-6 py-4">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Activities
          </Text>
          <View className="items-center py-8">
            <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No activities yet</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
