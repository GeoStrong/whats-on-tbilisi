import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../components/auth/AuthProvider";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError(null);
      await signUp(email, password, name);
      Alert.alert(
        "Account Created",
        "Please check your email to verify your account.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(stack)/auth/login"),
          },
        ]
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      Alert.alert("Signup Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="mb-10">
            <Text className="text-3xl font-bold text-gray-900 text-center">
              Create Account
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Sign up to get started
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
                editable={!isLoading}
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
            </View>

            {error && (
              <Text className="text-red-500 text-sm mt-2">{error}</Text>
            )}

            <TouchableOpacity
              className={`w-full py-4 rounded-lg mt-6 ${
                isLoading ? "bg-purple-400" : "bg-purple-600"
              }`}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="mt-8 flex-row justify-center">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(stack)/auth/login")}>
              <Text className="text-purple-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
