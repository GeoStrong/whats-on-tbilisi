import { env } from "../env";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "supabase_access_token";

/**
 * Get stored auth token for native
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Store auth token for native
 */
export const setStoredToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

/**
 * Remove stored auth token
 */
export const removeStoredToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

/**
 * Wrapper around fetch for React Native.
 * Uses the full API base URL and includes auth token.
 */
export const apiFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  const baseUrl = env.apiBaseUrl;
  
  if (!baseUrl) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL in your environment."
    );
  }

  const fullUrl = `${baseUrl}${url}`;
  const token = await getStoredToken();

  const headers: HeadersInit = {
    ...(options?.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return fetch(fullUrl, {
    ...options,
    headers,
  });
};
