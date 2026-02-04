"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ImageType } from "../types";

interface ImageCacheEntry {
  url: string;
  expiresAt: number;
}

interface ImageCacheContextValue {
  getCachedUrl: (
    imageLocation: ImageType,
    options?: {
      quality?: number;
      format?: "webp" | "jpg" | "png";
      width?: number;
      height?: number;
    },
  ) => string | null;
  setCachedUrl: (
    imageLocation: ImageType,
    url: string,
    options?: {
      quality?: number;
      format?: "webp" | "jpg" | "png";
      width?: number;
      height?: number;
    },
    ttl?: number,
  ) => void;
  clearCache: () => void;
}

const ImageCacheContext = createContext<ImageCacheContextValue | null>(null);

const CACHE_KEY_PREFIX = "whatson_image_cache_";
const DEFAULT_TTL = 55 * 60 * 1000; // 55 minutes (signed URLs expire in 1 hour)

/**
 * Creates a cache key from image location and options
 */
const createCacheKey = (
  imageLocation: ImageType,
  options?: {
    quality?: number;
    format?: "webp" | "jpg" | "png";
    width?: number;
    height?: number;
  },
): string => {
  const image = typeof imageLocation === "string" ? imageLocation : "";
  const opts = options || {};
  return `${CACHE_KEY_PREFIX}${image}::w${opts.width ?? ""}::h${
    opts.height ?? ""
  }::q${opts.quality ?? 50}::f${opts.format ?? "webp"}`;
};

/**
 * Image cache provider using browser localStorage
 * Persists image URLs across page refreshes and browser sessions
 */
export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Clean up expired entries on mount
    cleanupExpiredEntries();
  }, []);

  const cleanupExpiredEntries = () => {
    if (typeof window === "undefined") return;

    try {
      const now = Date.now();
      const keysToDelete: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_KEY_PREFIX)) {
          try {
            const entry = JSON.parse(
              localStorage.getItem(key) || "{}",
            ) as ImageCacheEntry;
            if (entry.expiresAt <= now) {
              keysToDelete.push(key);
            }
          } catch {
            // Invalid entry, delete it
            keysToDelete.push(key);
          }
        }
      }

      keysToDelete.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error cleaning up image cache:", error);
    }
  };

  const getCachedUrl = (
    imageLocation: ImageType,
    options?: {
      quality?: number;
      format?: "webp" | "jpg" | "png";
      width?: number;
      height?: number;
    },
  ): string | null => {
    if (!isClient || typeof window === "undefined") return null;

    try {
      const cacheKey = createCacheKey(imageLocation, options);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const entry = JSON.parse(cached) as ImageCacheEntry;
      const now = Date.now();

      if (entry.expiresAt <= now) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return entry.url;
    } catch (error) {
      console.error("Error reading image cache:", error);
      return null;
    }
  };

  const setCachedUrl = (
    imageLocation: ImageType,
    url: string,
    options?: {
      quality?: number;
      format?: "webp" | "jpg" | "png";
      width?: number;
      height?: number;
    },
    ttl: number = DEFAULT_TTL,
  ): void => {
    if (!isClient || typeof window === "undefined") return;

    try {
      const cacheKey = createCacheKey(imageLocation, options);
      const entry: ImageCacheEntry = {
        url,
        expiresAt: Date.now() + ttl,
      };

      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      // localStorage might be full or unavailable
      console.error("Error setting image cache:", error);
      // Try to clean up and retry once
      try {
        cleanupExpiredEntries();
        const cacheKey = createCacheKey(imageLocation, options);
        const entry: ImageCacheEntry = {
          url,
          expiresAt: Date.now() + ttl,
        };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (retryError) {
        console.error("Error retrying image cache set:", retryError);
      }
    }
  };

  const clearCache = (): void => {
    if (!isClient || typeof window === "undefined") return;

    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(CACHE_KEY_PREFIX)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Error clearing image cache:", error);
    }
  };

  return (
    <ImageCacheContext.Provider
      value={{ getCachedUrl, setCachedUrl, clearCache }}
    >
      {children}
    </ImageCacheContext.Provider>
  );
};

/**
 * Hook to access the image cache context
 */
export const useImageCache = (): ImageCacheContextValue => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    // Return a no-op implementation if context is not available
    return {
      getCachedUrl: () => null,
      setCachedUrl: () => {},
      clearCache: () => {},
    };
  }
  return context;
};




