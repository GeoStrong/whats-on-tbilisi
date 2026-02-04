import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/auth/AuthProvider";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(tabs)");
          } catch (_error) {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Ionicons name="person-circle-outline" size={80} color="#9CA3AF" />
        <Text className="text-xl font-semibold text-gray-900 mt-4">
          Sign in to view your profile
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Create an account or sign in to access your profile, saved activities,
          and more.
        </Text>
        <TouchableOpacity
          className="bg-purple-600 px-8 py-3 rounded-lg mt-6"
          onPress={() => router.push("/(stack)/auth/login")}
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="bg-white px-6 py-8 items-center border-b border-gray-200">
        {user.avatar_path ? (
          <Image
            source={{ uri: user.avatar_path }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-purple-100 items-center justify-center">
            <Text className="text-purple-600 text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}
        <Text className="text-xl font-semibold text-gray-900 mt-4">
          {user.name}
        </Text>
        <Text className="text-gray-500 mt-1">{user.email}</Text>
        {user.additionalInfo && (
          <Text className="text-gray-600 text-center mt-2 px-4">
            {user.additionalInfo}
          </Text>
        )}
      </View>

      {/* Menu Items */}
      <View className="mt-6 bg-white">
        <MenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push("/(stack)/profile/edit")}
        />
        <MenuItem
          icon="calendar-outline"
          label="My Activities"
          onPress={() => router.push("/(stack)/profile/activities")}
        />
        <MenuItem
          icon="bookmark-outline"
          label="Saved Activities"
          onPress={() => router.push("/(stack)/profile/saved")}
        />
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push("/(stack)/profile/settings")}
        />
      </View>

      {/* Sign Out Button */}
      <View className="mt-6 bg-white">
        <TouchableOpacity
          className="flex-row items-center px-6 py-4"
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="text-red-500 font-medium ml-4">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <Ionicons name={icon} size={24} color="#6B7280" />
        <Text className="text-gray-900 font-medium ml-4">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
}
