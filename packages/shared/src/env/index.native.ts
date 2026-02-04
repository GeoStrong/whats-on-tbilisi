import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra || {}) as Record<string, string>;

export const env = {
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL || extra.EXPO_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  },
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || extra.EXPO_PUBLIC_API_BASE_URL || "",
  r2: {
    endpoint: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucket: "",
  },
  r2DevUrl: process.env.EXPO_PUBLIC_R2_DEV_URL || extra.EXPO_PUBLIC_R2_DEV_URL,
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || extra.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
} as const;
