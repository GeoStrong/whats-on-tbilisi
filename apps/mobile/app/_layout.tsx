import "./global.css";
import { Stack } from "expo-router";
import { QueryProvider } from "@whatson/shared/react-query/QueryProvider";
import { ImageCacheProvider } from "@whatson/shared/storage/ImageCacheContext";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "../components/auth/AuthProvider";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../lib/store/store";

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <QueryProvider>
          <ImageCacheProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }} />
          </ImageCacheProvider>
        </QueryProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
