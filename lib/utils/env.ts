const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
} as const;

const optionalEnvVars = {
  NEXT_PUBLIC_R2_DEV_URL: process.env.NEXT_PUBLIC_R2_DEV_URL,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
} as const;

export function validateEnv(): void {
  const missing: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please check your .env file and ensure all required variables are set.",
    );
  }
}

export const env = {
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  siteUrl: requiredEnvVars.NEXT_PUBLIC_SITE_URL!,
  r2: {
    endpoint: requiredEnvVars.R2_ENDPOINT!,
    accessKeyId: requiredEnvVars.R2_ACCESS_KEY_ID!,
    secretAccessKey: requiredEnvVars.R2_SECRET_ACCESS_KEY!,
    bucket: requiredEnvVars.R2_BUCKET_NAME!,
  },
  r2DevUrl: optionalEnvVars.NEXT_PUBLIC_R2_DEV_URL,
  googleMapsApiKey: optionalEnvVars.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
} as const;

if (typeof window === "undefined" && process.env.NODE_ENV !== "test") {
  try {
    validateEnv();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Environment validation warning:", error);
    } else {
      throw error;
    }
  }
}
