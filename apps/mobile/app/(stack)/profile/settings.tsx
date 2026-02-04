import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../components/auth/AuthProvider";

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, signOut } = useAuth();

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
          Sign in to access settings
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

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(tabs)");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <Text className="text-2xl font-semibold text-foreground">Settings</Text>

      <View className="mt-6 rounded-lg border border-border bg-card p-4">
        <Text className="text-sm text-muted-foreground">Account</Text>
        <Text className="mt-2 text-base text-foreground">{user?.email}</Text>
      </View>

      <TouchableOpacity
        className="mt-6 rounded-lg border border-red-500 px-4 py-3"
        onPress={handleSignOut}
      >
        <Text className="text-center font-semibold text-red-500">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
