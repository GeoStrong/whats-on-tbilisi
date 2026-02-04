import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../components/auth/AuthProvider";
import { handleUploadUserInformation } from "@whatson/shared/data/profile";

export default function EditProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.additionalInfo || "");
    }
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
          Sign in to edit your profile
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

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      await handleUploadUserInformation(user, name, phone, bio);
      await refreshUser();
      Alert.alert("Profile updated", "Your changes have been saved.");
      router.back();
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background px-6 pt-6">
      <Text className="text-2xl font-semibold text-foreground">
        Edit Profile
      </Text>

      <View className="mt-6">
        <Text className="mb-2 text-sm text-muted-foreground">Name</Text>
        <TextInput
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground"
          placeholder="Your name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm text-muted-foreground">Phone</Text>
        <TextInput
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground"
          placeholder="Phone number"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View className="mt-4">
        <Text className="mb-2 text-sm text-muted-foreground">Bio</Text>
        <TextInput
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground"
          placeholder="Tell us about yourself"
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
        />
      </View>

      <TouchableOpacity
        className="mt-6 rounded-lg bg-primary px-4 py-3"
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center font-semibold text-primary-foreground">
            Save Changes
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
