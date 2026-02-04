"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * Default query client configuration
 * Provides sensible defaults for caching, stale time, and retry logic
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes - cache garbage collection (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Refetch on mount if data is stale
      refetchOnReconnect: true, // Refetch on reconnect
    },
  },
});




