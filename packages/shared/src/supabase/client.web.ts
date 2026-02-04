import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";

let supabaseClient: SupabaseClient | null = null;

/**
 * Get or create a Supabase client for web platform.
 * Uses browser client with cookie-based auth.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(env.supabase.url, env.supabase.anonKey);
  }
  return supabaseClient;
};
