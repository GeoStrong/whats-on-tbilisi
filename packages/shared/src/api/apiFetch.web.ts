import { env } from "../env";

/**
 * Wrapper around fetch for web platform.
 * Uses relative URLs since the API is on the same origin.
 */
export const apiFetch = async (
  url: string,
  options?: RequestInit
): Promise<Response> => {
  // On web, use relative URLs (same origin)
  const baseUrl = env.apiBaseUrl || "";
  const fullUrl = baseUrl ? `${baseUrl}${url}` : url;

  return fetch(fullUrl, {
    ...options,
    credentials: "include",
  });
};

export const getSupabaseClient = async () => {
  const { createBrowserClient } = await import("@supabase/ssr");
  return createBrowserClient(env.supabase.url, env.supabase.anonKey);
};
