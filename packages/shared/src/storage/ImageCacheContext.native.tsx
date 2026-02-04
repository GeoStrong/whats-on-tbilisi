import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  ) => Promise<string | null>;
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
  ) => Promise<void>;
  clearCache: () => Promise<void>;
}

const ImageCacheContext = createContext<ImageCacheContextValue | null>(null);

const CACHE_KEY_PREFIX = "whatson_image_cache_";
const DEFAULT_TTL = 55 * 60 * 1000;

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

export const ImageCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getCachedUrl: ImageCacheContextValue["getCachedUrl"] = async (
    imageLocation,
    options,
  ) => {
    try {
      const cacheKey = createCacheKey(imageLocation, options);
      const cached = await AsyncStorage.getItem(cacheKey);
      if (!cached) return null;
      const entry = JSON.parse(cached) as ImageCacheEntry;
      const now = Date.now();
      if (entry.expiresAt <= now) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }
      return entry.url;
    } catch {
      return null;
    }
  };

  const setCachedUrl: ImageCacheContextValue["setCachedUrl"] = async (
    imageLocation,
    url,
    options,
    ttl = DEFAULT_TTL,
  ) => {
    try {
      const cacheKey = createCacheKey(imageLocation, options);
      const entry: ImageCacheEntry = {
        url,
        expiresAt: Date.now() + ttl,
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      return;
    }
  };

  const clearCache = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const imageKeys = keys.filter((k) => k.startsWith(CACHE_KEY_PREFIX));
      if (imageKeys.length) {
        await AsyncStorage.multiRemove(imageKeys);
      }
    } catch {
      return;
    }
  };

  return (
    <ImageCacheContext.Provider value={{ getCachedUrl, setCachedUrl, clearCache }}>
      {children}
    </ImageCacheContext.Provider>
  );
};

export const useImageCache = (): ImageCacheContextValue => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    return {
      getCachedUrl: async () => null,
      setCachedUrl: async () => {},
      clearCache: async () => {},
    };
  }
  return context;
};
